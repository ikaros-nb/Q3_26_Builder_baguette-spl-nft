import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

// What the scripts produce at runtime, as opposed to config.ts, which holds
// what you decide up front. Each script writes what the next one needs, so the
// whole sequence runs end to end without pasting an address between files.

const STATE_PATH = path.join(__dirname, "../../spl-state.json");

type State = {
  mint?: string;
  imageUri?: string;
  metadataUri?: string;
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

export function requireMint(): string {
  return required(
    process.env.MINT ?? readState().mint,
    "no mint in state — run `pnpm spl:init` first",
  );
}

export function requireMetadataUri(): string {
  return required(
    process.env.METADATA_URI ?? readState().metadataUri,
    "no metadata uri in state — run `pnpm spl:image` first",
  );
}
