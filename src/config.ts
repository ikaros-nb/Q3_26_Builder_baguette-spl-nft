// Cluster-level configuration, shared by the SPL and NFT scripts.

export const RPC_URL =
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

export const RPC_WS_URL =
  process.env.SOLANA_RPC_WS_URL ?? "wss://api.devnet.solana.com";

// devnet node: paid in devnet SOL, and uploads expire after a few days
export const IRYS_ADDRESS =
  process.env.IRYS_ADDRESS ?? "https://devnet.irys.xyz";
