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

const IMAGE_PATH = path.join(__dirname, "../../assets/baguette-coin-logo.jpg");
const IMAGE_CONTENT_TYPE = "image/jpeg";

const umi = createUmi("https://api.devnet.solana.com");

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));
// devnet node: paid in devnet SOL, and uploads expire after a few days
umi.use(irysUploader({ address: "https://devnet.irys.xyz" }));

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
      name: "Baguette Coin",
      symbol: "BAC",
      description: "A very French token.",
      image: imageUri,
    });

    console.log("metadata uri:", metadataUri);
    console.log("\npaste the metadata uri into spl_metadata.ts");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
