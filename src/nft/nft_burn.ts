import { existsSync, readFileSync } from "fs";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  displayAmount,
  signerIdentity,
  subtractAmounts,
} from "@metaplex-foundation/umi";
import { burn, fetchAsset, mplCore } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { OWNER_WALLET_PATH } from "./config";
import { COMMITMENT, RPC_URL } from "../config";
import { requireAsset } from "./state";

const umi = createUmi(RPC_URL, COMMITMENT);

if (!existsSync(OWNER_WALLET_PATH)) {
  console.error(`no keypair at ${OWNER_WALLET_PATH} — the owner has to sign`);
  process.exit(1);
}

const wallet = JSON.parse(readFileSync(OWNER_WALLET_PATH, "utf-8"));
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));
umi.use(mplCore());

(async () => {
  try {
    const asset = await fetchAsset(umi, requireAsset());

    console.log(`asset : ${asset.publicKey} (${asset.name})`);
    console.log(`owner : ${asset.owner}`);

    // Only the owner (or a burn delegate) may burn the asset.
    if (asset.owner !== signer.publicKey) {
      console.error(
        `wallet ${signer.publicKey} does not own this asset (owner is ${asset.owner})`,
      );
      process.exit(1);
    }

    // Core closes the asset account to the payer, and umi defaults the payer to
    // the identity, so the rent lands back in the owner's wallet.
    const before = await umi.rpc.getBalance(signer.publicKey);
    const tx = await burn(umi, { asset }).sendAndConfirm(umi);
    const signature = base58.deserialize(tx.signature)[0];
    const after = await umi.rpc.getBalance(signer.publicKey);

    console.log(`signature: ${signature}`);
    // Net of the transaction fee. Around 0.0009 SOL stays in the account on
    // purpose, to mark it burned and keep the address from being reused.
    console.log(`reclaimed: ${displayAmount(subtractAmounts(after, before))}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
