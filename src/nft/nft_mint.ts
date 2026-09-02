import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../../devnet-wallet.json";
import {
  createSignerFromKeypair,
  generateSigner,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { create, mplCore } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { COMMITMENT, RPC_URL } from "../config";
import { NFT } from "./config";
import { requireMetadataUri, writeState } from "./state";

const umi = createUmi(RPC_URL, COMMITMENT);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));
umi.use(mplCore());

(async () => {
  try {
    const asset = generateSigner(umi);

    const tx = await create(umi, {
        asset,
        name: NFT.name,
        uri: requireMetadataUri()
    }).sendAndConfirm(umi);

    const signature = base58.deserialize(tx.signature)[0];

    console.log(`signature ${signature} , asset : ${asset.publicKey}`);

    // the asset address is what nft:update, nft:transfer, and nft:burn act on
    writeState({ asset: asset.publicKey });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();