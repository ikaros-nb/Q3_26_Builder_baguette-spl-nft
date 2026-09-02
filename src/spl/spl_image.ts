import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";
import path from "path";
import wallet from "../../devnet-wallet.json";
import { IRYS_ADDRESS, RPC_URL } from "../config";
import { IMAGE_CONTENT_TYPE, IMAGE_PATH, TOKEN } from "./config";
import { writeState } from "./state";

const umi = createUmi(RPC_URL);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));
umi.use(irysUploader({ address: IRYS_ADDRESS }));

(async () => {
  try {
    // 1. upload the image, so we know where the JSON should point
    const buffer = await readFile(IMAGE_PATH);
    const file = createGenericFile(buffer, path.basename(IMAGE_PATH), {
      contentType: IMAGE_CONTENT_TYPE,
    });

    const [imageUri] = await umi.uploader.upload([file]);
    console.log("image uri:", imageUri);

    // 2. upload the off-chain metadata that DataV2Args.uri points at
    const metadataUri = await umi.uploader.uploadJson({
      ...TOKEN,
      image: imageUri,
    });

    console.log("metadata uri:", metadataUri);

    writeState({ imageUri, metadataUri });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
