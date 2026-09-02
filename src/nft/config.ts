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

// The kind of media this asset is: image, video, audio, vr, or html.
export const CATEGORY = "image";

export const IMAGE_PATH = path.join(__dirname, "../../assets/nft.jpg");
export const IMAGE_CONTENT_TYPE = "image/jpeg";
