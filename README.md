# Baguette Coin – SPL Token

SPL Token learning project built as part of the [Turbin3](https://turbin3.org/) Q3 2026 Builders cohort.

## Mint information

| Item | Value |
|---|---|
| Cluster | devnet |
| Name | Baguette Coin |
| Symbol | BAC |
| Mint | [7kebpcinzpQVjuAxifmWnTFQ64i6rWnptfbQRZZNs2SA](https://explorer.solana.com/address/7kebpcinzpQVjuAxifmWnTFQ64i6rWnptfbQRZZNs2SA?cluster=devnet) |
| Authority | [BvNwpwwQmEZyJdGwT6kpHXKTqHzBUteh9qfhQ7AnGNqE](https://explorer.solana.com/address/BvNwpwwQmEZyJdGwT6kpHXKTqHzBUteh9qfhQ7AnGNqE?cluster=devnet) |
| Decimals | `6` |
| Minted supply | `3 BAC` (3,000,000 base units) |

## Transactions

| Step             | Transaction URL  |
|------------------|------------------|
| 1. Mint account creation | [4mkn3…2CN7B](https://explorer.solana.com/tx/4mkn3v9o7CJc5ZHBhWRQ4KvaSFbE9h14XBfDiHnAnZeH1RRtxCLHnh1oWPksQ6ZH7cMMnntPyphmqZNi63L2CN7B?cluster=devnet) |
| 2. Image and metadata upload | [metadata uri](https://gateway.irys.xyz/4HWJVVuRT64Z96mG3LLiaKCotoTWzcfCzkGhphjNnXLo) |
| 3. Metadata account creation | [2dPwd…bCGE8](https://explorer.solana.com/tx/2dPwdWnXXs3Uxp2PAzxPVsmjA3KhQcKwZBv5JGap5S3kqmPdcaFLFMhhySGmdsTQY1zh9SMhnAuSXyEPsTSbCGE8?cluster=devnet) |
| 4. Mint supply | [5uMfg…qqVdB](https://explorer.solana.com/tx/5uMfgDKePSqcX6G6Vhy5UwaAXm3n8Gbke57GvXfN8rPZ5wPgr19yGx4aMz3FQHMMBU7wyn5tzdhaxZkNNdtqqVdB?cluster=devnet) |
| 5. Transfer tokens | [5cryr…RKDaM](https://explorer.solana.com/tx/5cryragXsa8k6h2yUwvD9q8u9gFhXQ3hzJio154kU5vSxpi93T5KfTmSNYtR8TC9u2FWZADyApu1VQQB41hRKDaM?cluster=devnet) |

---

## Setup

### 1. Add your wallet

Place your devnet wallet keypair file at the project root:

```
root/
└── devnet-wallet.json
```

It should be a JSON array of numbers, e.g. `[174, 23, ...]`.

### 2. Install dependencies

```bash
pnpm install
```

### 3. Add your image

Place your image in the `assets` folder.

```
root/
└── assets/baguette-coin-logo.jpg
```

If you use a different filename, update `IMAGE_PATH` in `src/spl/spl_image.ts`.

---

> Before running the scripts, go through these docs:
> - [Solana token docs](https://solana.com/docs/tokens) — mint accounts, token accounts, and ATAs
> - [Solana Kit](https://www.solanakit.com/) — the JS SDK used for building and sending transactions
> - [Metaplex Token Metadata](https://www.metaplex.com/docs/smart-contracts/token-metadata) — attaching metadata to SPL tokens
> - [Metaplex Core](https://www.metaplex.com/docs/smart-contracts/core) — the NFT standard used in the NFT scripts

## SPL Token

Uses **@solana/kit** and **@solana-program/token** for transactions, and **mpl-token-metadata** via UMI for on-chain metadata.

| Script | Command | What it does |
|---|---|---|
| `spl_init.ts` | `pnpm spl:init` | Creates a new mint account |
| `spl_image.ts` | `pnpm spl:image` | Uploads your image and the metadata JSON to Irys, logs both URIs |
| `spl_metadata.ts` | `pnpm spl:metadata` | Attaches a name, symbol, and URI to the mint |
| `spl_mint.ts` | `pnpm spl:mint` | Creates your associated token account and mints tokens into it |
| `spl_transfer.ts` | `pnpm spl:transfer` | Sends tokens to another wallet, i.e. from ATA to ATA |

Run them in order. Each script logs the addresses/signatures you'll need to paste into the next one.

---

## NFT

Uses **@solana/kit** and **mpl-core** via UMI. Images and metadata are stored on Irys (decentralized storage).

| Script | Command | What it does |
|---|---|---|
| `nft_image.ts` | `pnpm nft:image` | Uploads your image to Irys, logs the image URI |
| `nft_metadata.ts` | `pnpm nft:metadata` | Builds the metadata JSON and uploads it, logs the metadata URI |
| `nft_mint.ts` | `pnpm nft:mint` | Mints the NFT on-chain using the metadata URI |

Run them in order. Paste the URI logged by each step into the next script before running it.
