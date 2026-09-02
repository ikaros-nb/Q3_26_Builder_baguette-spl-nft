import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { fetchAsset, mplCore, update } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";
import wallet from "../../devnet-wallet.json";
import { COMMITMENT, IRYS_ADDRESS, RPC_URL } from "../config";
import { ATTRIBUTES_UPDATE, buildMetadataJson, NFT_UPDATE } from "./config";
import { requireAsset, requireImageUri, writeState } from "./state";

const umi = createUmi(RPC_URL, COMMITMENT);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));
umi.use(mplCore());
umi.use(irysUploader({ address: IRYS_ADDRESS }));

(async () => {
  try {
    // written by nft_mint.ts
    const asset = await fetchAsset(umi, requireAsset());

    console.log(`asset  : ${asset.publicKey}`);
    console.log(`before : ${asset.name} — ${asset.uri}`);

    // Can be `Address`, `Collection` or `None`.
    const { updateAuthority } = asset;
    const authority = updateAuthority.type === "Address" ? updateAuthority.address : null;

    if (authority !== signer.publicKey) {
      console.error(
        `wallet ${signer.publicKey} is not the update authority (${
          authority ?? updateAuthority.type
        })`,
      );
      process.exit(1);
    }

    // Only the name and the uri live on-chain, so changing the metadata means
    // uploading a new JSON and repointing the uri at it.
    const metadataUri = await umi.uploader.uploadJson(
      buildMetadataJson(NFT_UPDATE, ATTRIBUTES_UPDATE, requireImageUri()),
    );

    const tx = await update(umi, {
      asset,
      name: NFT_UPDATE.name,
      uri: metadataUri,
    }).sendAndConfirm(umi);

    const signature = base58.deserialize(tx.signature)[0];

    console.log(`after  : ${NFT_UPDATE.name} — ${metadataUri}`);
    console.log(`signature ${signature}`);

    writeState({ metadataUri });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
