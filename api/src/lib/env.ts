/**
 * Typed environment config for LumaLedger API.
 * Required vars must be set in .env (or process.env) before the server starts.
 */

function require(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  network: optional("STELLAR_NETWORK", "testnet") as "testnet" | "mainnet",

  // Contract addresses (required in production, optional during dev)
  solarAssetContractId: optional("SOLAR_ASSET_CONTRACT_ID", ""),
  registryContractId: optional("REGISTRY_CONTRACT_ID", ""),
  warrantyContractId: optional("WARRANTY_CONTRACT_ID", ""),
  maintenanceContractId: optional("MAINTENANCE_CONTRACT_ID", ""),

  port: Number(optional("PORT", "3001")),
  corsOrigin: optional("CORS_ORIGIN", "*"),
} as const;
