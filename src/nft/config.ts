import path from "path";

// These keys are copied verbatim into the off-chain JSON.
export const NFT = {
  name: "Baguette Radioactive",
  description: "A very French NFT.",
};

// Traits, as read by wallets and marketplaces. Core can alternatively store
// these on-chain through the Attributes plugin.
export const ATTRIBUTES = [
  { trait_type: "Crust", value: "Extra Crispy" },
  { trait_type: "Radioactivity", value: "Dangerous" },
  { trait_type: "Origin", value: "Paris" },
];

// For `pnpm nft:update` usage.
export const NFT_UPDATE = {
  name: "Baguette Grillée",
  description: "A very French NFT, toasted with style.",
};

export const ATTRIBUTES_UPDATE = [
  { trait_type: "Crust", value: "Burnt" },
  { trait_type: "Radioactivity", value: "Contained" },
  { trait_type: "Origin", value: "Paris" },
];

// The kind of media this asset is: image, video, audio, vr, or html.
const CATEGORY = "image";

export const IMAGE_PATH = path.join(__dirname, "../../assets/nft.jpg");
export const IMAGE_CONTENT_TYPE = "image/jpeg";

type Fields = { name: string; description: string };
type Attribute = { trait_type: string; value: string };

// For `nft:metadata` and `nft:update` usage.
export function buildMetadataJson(
  fields: Fields,
  attributes: Attribute[],
  imageUri: string,
) {
  return {
    ...fields,
    image: imageUri,
    category: CATEGORY,
    attributes,
    properties: {
      files: [{ uri: imageUri, type: IMAGE_CONTENT_TYPE }],
      category: CATEGORY,
    },
  };
}

// Who nft_transfer.ts sends tokens to
export const RECIPIENT = "DthmPeWWnHBeK9aJheug5LAGUbecoMVU7NMKeMzVrASB";

// For `nft:transfer` usage. Act as owner to burn the NFT.
export const OWNER_WALLET_PATH = path.join(
  __dirname,
  "../../devnet-wallet-2.json",
);