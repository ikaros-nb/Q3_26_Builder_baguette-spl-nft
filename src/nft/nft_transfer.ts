import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { fetchAsset, mplCore, transfer } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";
import wallet from "../../devnet-wallet.json";
import { RECIPIENT } from "./config";
import { RPC_URL } from "../config";
import { requireAsset, writeState } from "./state";

const umi = createUmi(RPC_URL);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));
umi.use(mplCore());

(async () => {
  try {
    const asset = await fetchAsset(umi, requireAsset());

    console.log(`asset : ${asset.publicKey}`);
    console.log(`owner : ${asset.owner} → ${RECIPIENT}`);

    // Only the owner (or a transfer delegate) may move the asset.
    if (asset.owner !== signer.publicKey) {
      console.error(
        `wallet ${signer.publicKey} does not own this asset (owner is ${asset.owner})`,
      );
      process.exit(1);
    }

    const tx = await transfer(umi, {
      asset,
      newOwner: publicKey(RECIPIENT),
    }).sendAndConfirm(umi);

    const signature = base58.deserialize(tx.signature)[0];

    console.log(`signature ${signature}`);

    writeState({ owner: RECIPIENT });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
