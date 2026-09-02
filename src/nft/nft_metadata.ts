import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import wallet from "../../devnet-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { COMMITMENT, IRYS_ADDRESS, RPC_URL } from "../config";
import { ATTRIBUTES, buildMetadataJson, NFT } from "./config";
import { requireImageUri, writeState } from "./state";

const umi = createUmi(RPC_URL, COMMITMENT);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));
umi.use(irysUploader({ address: IRYS_ADDRESS }));

(async () => {
  try {
    const metadataUri = await umi.uploader.uploadJson(
        buildMetadataJson(NFT, ATTRIBUTES, requireImageUri())
    );

    console.log("metadata uri:", metadataUri);

    writeState({ metadataUri });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
