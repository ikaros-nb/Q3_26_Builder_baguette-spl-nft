import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const STATE_PATH = path.join(__dirname, "../../nft-state.json");

type State = {
  imageUri?: string;
  metadataUri?: string;
  asset?: string;
};

export function readState(): State {
  return existsSync(STATE_PATH)
    ? JSON.parse(readFileSync(STATE_PATH, "utf8"))
    : {};
}

export function writeState(patch: State) {
  const next = { ...readState(), ...patch };
  writeFileSync(STATE_PATH, JSON.stringify(next, null, 2) + "\n");
  console.log(`state written to ${path.basename(STATE_PATH)}`);
}

// A missing prerequisite is a usage error, not a crash, so report it without a
// stack trace and leave the catch blocks in the scripts for on-chain failures.
function required(value: string | undefined, hint: string): string {
  if (!value) {
    console.error(hint);
    process.exit(1);
  }
  return value;
}

export function requireImageUri(): string {
  return required(
    process.env.IMAGE_URI ?? readState().imageUri,
    "no image uri in state — run `pnpm nft:image` first",
  );
}

export function requireMetadataUri(): string {
  return required(
    process.env.METADATA_URI ?? readState().metadataUri,
    "no metadata uri in state — run `pnpm nft:metadata` first",
  );
}

export function requireAsset(): string {
  return required(
    process.env.ASSET ?? readState().asset,
    "no asset in state — run `pnpm nft:mint` first",
  );
}
