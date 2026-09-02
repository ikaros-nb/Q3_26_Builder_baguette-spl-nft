import path from "path";

// SPL Token Metadata

export const TOKEN = {
  name: "Baguette",
  symbol: "BGT",
  description: "A very French token.",
};

// Set once, at mint creation, and read back by every transferChecked call
export const DECIMALS = 6;

// SPL Token image
export const IMAGE_PATH = path.join(
  __dirname,
  "../../assets/token-logo.jpg",
);
export const IMAGE_CONTENT_TYPE = "image/jpeg";

// The token program counts in base units, so 1 token is 10^DECIMALS of them.
export function toBaseUnits(tokens: number): bigint {
  return BigInt(Math.round(tokens * 10 ** DECIMALS));
}

export const AMOUNT_TO_MINT = toBaseUnits(1);
export const AMOUNT_TO_TRANSFER = toBaseUnits(0.001);

// who spl_transfer.ts sends tokens to
export const RECIPIENT = "DthmPeWWnHBeK9aJheug5LAGUbecoMVU7NMKeMzVrASB";
