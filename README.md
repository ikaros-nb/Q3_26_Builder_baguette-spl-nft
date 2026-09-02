# Baguette – SPL Token & MPL Core NFT

Solana learning project built as part of the [Turbin3](https://turbin3.org/) Q3 2026 Builders cohort.
Everything below runs on **devnet**.

## Token information

| Item | Value |
|---|---|
| Cluster | devnet |
| Name | Baguette |
| Symbol | BGT |
| Mint | [797yUNcCkRPSX3vDSjsSyR9tkp74rDJbAJk5rFbY2CDi](https://explorer.solana.com/address/797yUNcCkRPSX3vDSjsSyR9tkp74rDJbAJk5rFbY2CDi?cluster=devnet) |
| Metadata account | [6kj583GVGtAKy2k3RMZPfAxHw7bymBhjev3vfonqhfvL](https://explorer.solana.com/address/6kj583GVGtAKy2k3RMZPfAxHw7bymBhjev3vfonqhfvL?cluster=devnet) |
| Mint & update authority | [BvNwpwwQmEZyJdGwT6kpHXKTqHzBUteh9qfhQ7AnGNqE](https://explorer.solana.com/address/BvNwpwwQmEZyJdGwT6kpHXKTqHzBUteh9qfhQ7AnGNqE?cluster=devnet) |
| Freeze authority | none |
| Decimals | `6` |
| Supply | `1 BGT` (1,000,000 base units) |

### Balances after the run

| Holder | Associated token account | Balance |
|---|---|---|
| Creator [BvNw…GNqE](https://explorer.solana.com/address/BvNwpwwQmEZyJdGwT6kpHXKTqHzBUteh9qfhQ7AnGNqE?cluster=devnet) | [2eKJV9csdB2iDwtveLeLcWpPYzrHxhN4Z3sJYKBwNKeT](https://explorer.solana.com/address/2eKJV9csdB2iDwtveLeLcWpPYzrHxhN4Z3sJYKBwNKeT?cluster=devnet) | `0.999 BGT` |
| Recipient [Dthm…rASB](https://explorer.solana.com/address/DthmPeWWnHBeK9aJheug5LAGUbecoMVU7NMKeMzVrASB?cluster=devnet) | [FSG6ranZPqRyhWKXHwCEB1hC5uv8MDCKihwnUYrSc1jm](https://explorer.solana.com/address/FSG6ranZPqRyhWKXHwCEB1hC5uv8MDCKihwnUYrSc1jm?cluster=devnet) | `0.001 BGT` |

## Transactions

| Step | Script | Link |
|---|---|---|
| 1. Mint account creation | `spl:init` | [2JP8B…oCVyj](https://explorer.solana.com/tx/2JP8BAEJVp43ubad5ekNN5GzAfYUeoksqoX7KZem8BsEQGYK3pnCooS3XEjLgvJTkHWi4zqao5ocgU3KuYLoCVyj?cluster=devnet) |
| 2. Image and metadata upload | `spl:image` | [image](https://gateway.irys.xyz/49AWQ4vaq2YZfGoxg6vA6UWVtGMPiPeFvfpWRoZ2vtuM) · [metadata JSON](https://gateway.irys.xyz/CmCuBaNS9rU4Wz32NCJD17hxigRWudn22etCQTCNcpi9) |
| 3. Metadata account creation | `spl:metadata` | [269hs…KTfZkv](https://explorer.solana.com/tx/269hsZi7K8NXiSUKwpzUTktHGFuPA7aZnJQR8BaAGUACDapPm3G981ZD9Bw6QP6iJCyRZzT6wbDgP2fJLrKTfZkv?cluster=devnet) |
| 4. Mint 1 BGT | `spl:mint` | [2ExUs…5compM](https://explorer.solana.com/tx/2ExUsBKam212NtLUF4Ay84USY9csgoq54sdzNFXm4fjAaeMDZbRF51SotZ8qvy3SJGMUdgLu1VdFnZdkdN5compM?cluster=devnet) |
| 5. Transfer 0.001 BGT | `spl:transfer` | [3dhkp…1VDG2M](https://explorer.solana.com/tx/3dhkphZgjUwv2ToonNoyd41WEKnCkicXAjzWeMrXxLfhm91AjxfrRagwXzb4PkEUR9ZcmCaB6GLoq7P5jy1VDG2M?cluster=devnet) |

Uploads live on the Irys **devnet** node, which is paid in devnet SOL and expires after a few days.
The transactions themselves are permanent.

## Test run

The five SPL scripts, end to end, via `pnpm spl:test`:

![All SPL scripts passing](assets/screenshots/spl-test.png)

---

## Setup

### 1. Add your wallet

Place your devnet wallet keypair file at the project root:

```
root/
└── devnet-wallet.json
```

It should be a JSON array of numbers, e.g. `[174, 23, ...]`. The file is gitignored.

### 2. Install dependencies

```bash
pnpm install
```

### 3. Add your image

Place your image in the `assets` folder:

```
root/
└── assets/token-logo.jpg
```

### 4. Make it yours

Edit [`src/spl/config.ts`](src/spl/config.ts) — token name, symbol, decimals, image path,
amounts, and the transfer recipient all live there.

Cluster endpoints are in [`src/config.ts`](src/config.ts) and default to devnet. Override them
with the `SOLANA_RPC_URL`, `SOLANA_RPC_WS_URL`, and `IRYS_ADDRESS` environment variables rather
than editing the file.

## SPL Token

| Script | Command | What it does |
|---|---|---|
| `spl_init.ts` | `pnpm spl:init` | Creates a new mint account |
| `spl_image.ts` | `pnpm spl:image` | Uploads your image and the metadata JSON to Irys |
| `spl_metadata.ts` | `pnpm spl:metadata` | Attaches a name, symbol, and URI to the mint |
| `spl_mint.ts` | `pnpm spl:mint` | Creates your associated token account and mints tokens into it |
| `spl_transfer.ts` | `pnpm spl:transfer` | Sends tokens to another wallet, i.e. from ATA to ATA |

Run them in order, or run the whole sequence at once:

```bash
pnpm spl:test
```

`spl:test` starts with `spl:init`, so **it creates a brand-new mint every time**. The addresses
above belong to one specific run.

### Configuration vs. state

What you decide lives in the config files; what the scripts produce lives in `spl-state.json`.
`spl:init` writes the mint address there, `spl:image` writes the two Irys URIs, and the remaining
scripts read them back — so no address ever has to be pasted from one script into the next. The
file is gitignored, and running a script out of order prints a readable `no mint in state` error
instead of failing on-chain. An environment variable takes precedence when you need it, e.g.
`MINT=797yUNc… pnpm spl:mint`.

---

## NFT

Uses **mpl-core** via UMI. Images and metadata are stored on Irys.

| Script | Command | What it does |
|---|---|---|
| `nft_image.ts` | `pnpm nft:image` | Uploads your image to Irys, logs the image URI |
| `nft_metadata.ts` | `pnpm nft:metadata` | Builds the metadata JSON and uploads it, logs the metadata URI |
| `nft_mint.ts` | `pnpm nft:mint` | Mints the NFT on-chain using the metadata URI |

Run them in order. Paste the URI logged by each step into the next script before running it.
