#!/usr/bin/env bash
# scripts/deploy.sh — Build and deploy all LumaChain Soroban contracts to Testnet
#
# Prerequisites:
#   - stellar CLI installed  (https://developers.stellar.org/docs/tools/developer-tools)
#   - Funded testnet keypair at ~/.config/stellar/identity/<IDENTITY>.toml
#   - Rust + cargo installed with wasm32 target
#
# Usage:
#   IDENTITY=alice bash scripts/deploy.sh

set -euo pipefail

IDENTITY="${IDENTITY:-deployer}"
NETWORK="testnet"
RPC_URL="https://soroban-testnet.stellar.org"
NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

CONTRACTS_DIR="$(dirname "$0")/../contracts"
OUTPUT_FILE="$(dirname "$0")/../.contract-ids.env"

log() { echo "▶  $*"; }

# ─── Build all contracts ───────────────────────────────────────────────────────
log "Building contracts..."
(
  cd "$CONTRACTS_DIR"
  cargo build --release --target wasm32-unknown-unknown
)

# ─── Helper: deploy one contract and return its contract ID ───────────────────
deploy_contract() {
  local name="$1"
  local wasm_path="$CONTRACTS_DIR/target/wasm32-unknown-unknown/release/${name}.wasm"

  log "Deploying $name..."
  stellar contract deploy \
    --wasm "$wasm_path" \
    --source "$IDENTITY" \
    --network "$NETWORK" \
    --rpc-url "$RPC_URL" \
    --network-passphrase "$NETWORK_PASSPHRASE"
}

# ─── Deploy ───────────────────────────────────────────────────────────────────
SOLAR_ASSET_ID=$(deploy_contract "solar_asset")
REGISTRY_ID=$(deploy_contract "registry")
WARRANTY_ID=$(deploy_contract "warranty")
MAINTENANCE_ID=$(deploy_contract "maintenance_log")

# ─── Write .contract-ids.env ──────────────────────────────────────────────────
cat > "$OUTPUT_FILE" <<EOF
SOLAR_ASSET_CONTRACT_ID=$SOLAR_ASSET_ID
REGISTRY_CONTRACT_ID=$REGISTRY_ID
WARRANTY_CONTRACT_ID=$WARRANTY_ID
MAINTENANCE_CONTRACT_ID=$MAINTENANCE_ID
EOF

log "Deployment complete. Contract IDs written to $OUTPUT_FILE"
log ""
log "  SOLAR_ASSET_CONTRACT_ID = $SOLAR_ASSET_ID"
log "  REGISTRY_CONTRACT_ID    = $REGISTRY_ID"
log "  WARRANTY_CONTRACT_ID    = $WARRANTY_ID"
log "  MAINTENANCE_CONTRACT_ID = $MAINTENANCE_ID"
log ""
log "Copy these into api/.env and web/.env.local to connect the stack."
