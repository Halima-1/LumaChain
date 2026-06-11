# LumaChain — Architecture & Documentation

## What is LumaChain?

**LumaChain** is a decentralized Web3 supply chain management platform built for the solar energy industry. It provides immutable, end-to-end traceability for solar assets — panels, inverters, and batteries — from manufacturing through installation, warranty claims, and ongoing maintenance.

By leveraging the **Stellar/Soroban** smart contract network, LumaChain ensures that every event in a solar asset's lifecycle is permanently recorded on-chain, eliminating information silos, preventing fraud, and enabling transparent verification by any stakeholder.

### Core Value Propositions

| Pillar              | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| **Traceability**    | Every custody transfer, service event, and warranty claim is immutable.    |
| **Verification**    | Any party can authenticate an asset by its serial number on-chain.         |
| **Transparency**    | Full history of ownership, maintenance, and warranty status is public.     |
| **Decentralization**| No single entity controls the data — trust is enforced by the network.     |

---

## Architecture Diagram

```
                                    ┌─────────────────────────────────┐
                                    │          Stellar Testnet         │
                                    │     (Soroban Smart Contracts)    │
                                    └────────────────┬────────────────┘
                                                     │
                    ┌────────────────────────────────┬┼┬────────────────────────────────┐
                    │                                │││                                │
              ┌─────▼─────┐                   ┌──────▼▼▼─────┐                  ┌──────▼──────┐
              │  solar_asset│                  │   registry   │                  │  warranty   │
              │             │                  │              │                  │             │
              │  • Mint     │                  │  • Register  │                  │  • Init     │
              │  • Transfer │                  │  • Lookup    │                  │  • File     │
              │  • Verify   │                  │  • Inventory │                  │  • Resolve  │
              │  • History  │                  │              │                  │             │
              └──────┬──────┘                  └──────┬──────┘                  └──────┬──────┘
                     │                                │                                │
                     └────────────────────────────────┼────────────────────────────────┘
                                                      │
                                              ┌───────▼───────┐
                                              │maintenance_log│
                                              │               │
                                              │  • Log Entry  │
                                              │  • Handoff    │
                                              └───────┬───────┘
                                                      │
                                                      │  Soroban RPC
                                                      │
                                              ┌───────▼───────┐
                                              │   @lumachain  │
                                              │     /sdk      │
                                              │               │
                                              │ Stellar SDK   │
                                              │ Freighter API │
                                              │ QR Encode/Scan│
                                              └───────┬───────┘
                                                      │
                                                      │  TypeScript API
                                                      │
                                              ┌───────▼───────┐
                                              │  @lumachain   │
                                              │    /api       │
                                              │               │
                                              │  Hono + Zod   │
                                              │  REST Gateway │
                                              │  Port 3001    │
                                              └───────┬───────┘
                                                      │
                                                      │  REST (JSON)
                                                      │  /api/assets
                                                      │  /api/registry
                                                      │  /api/warranty
                                                      │  /api/maintenance
                                                      │
                                              ┌───────▼───────┐
                                              │     /web      │
                                              │               │
                                              │  React + Vite │
                                              │  Framer Motion│
                                              │  Lucide Icons │
                                              │  Router v7    │
                                              │               │
                                              │  Pages:       │
                                              │  • Landing    │
                                              │  • Dashboard  │
                                              └───────┬───────┘
                                                      │
                                                      │  Docker
                                                      │  Compose
                                                      │
                                              ┌───────▼───────┐
                                              │   Container   │
                                              │   Orchestration│
                                              └───────┴───────┘


  ── Supply Chain Flow (On-Chain) ──────────────────────────────────────────────

  MANUFACTURER ──► SUPPLIER ──► WAREHOUSE ──► INSTALLER ──► CUSTOMER
       │              │             │              │             │
       │  mint        │  transfer   │  transfer    │  transfer  │  own
       │  asset       │  custody    │  custody     │  custody   │  asset
       │              │             │              │             │
       │              │             │              │             │
       └──────────────┴─────────────┴──────────────┴─────────────┘
                        Immutable on-chain history
                        recorded per asset NFT


  ── Warranty & Maintenance Lifecycle ─────────────────────────────────────────

  WARRANTY                             MAINTENANCE
  ┌──────────┐                         ┌──────────┐
  │ Init     │── expiry timestamp      │ Log      │── append-only
  │ File     │── OPEN + evidence       │ Inspect  │── technician entry
  │ Review   │── UNDER_REVIEW          │ Repair   │── service record
  │ Approve  │── APPROVED / REJECTED   │ Clean    │── preventive care
  └──────────┘                         └──────────┘
```

---

## System Components

### 1. Smart Contracts (`/contracts`)

Four modular Rust/Soroban contracts with isolated state and separation of concerns:

| Contract            | Purpose                                          | Key Operations               |
|---------------------|--------------------------------------------------|------------------------------|
| `solar_asset`       | Digital twin (NFT) for a physical solar component| Mint, Transfer, Verify, History |
| `registry`          | Central directory: serial numbers → contract IDs | Register, Lookup, Inventory  |
| `warranty`          | Manufacturer warranty lifecycle                  | Init, File Claim, Resolve     |
| `maintenance_log`   | Append-only immutable service history            | Log Entry, Ownership Handoff  |

**Deployed on Stellar Testnet:**

| Contract          | Address                                                             |
|-------------------|---------------------------------------------------------------------|
| Solar Asset       | `CBXEQXUCHYLTW2EKTHDY6WICCK4QGPDOPUPIIMKNU3QIR4LE6TXPUUMH`         |
| Registry          | `CBM33RV7SS5Z3LZT4Y7A772YYFZFMHTZMCCBZTPRIPWO6YIBJQ3HCKZO`         |
| Warranty          | `CCYDY6EU4RFGG5XQFMS63CY6PVJ3QQH3A6PWMC3HQ3WQXJMRDTWGTYTR`         |
| Maintenance Log   | `CCOKH2CPGCK4I7SZBOEA37MI2FVSCV2RMZVF2TEJPKR5EB62FA5CLWEV`         |

### 2. TypeScript SDK (`/sdk` — `@lumachain/sdk`)

Client library for interacting with the Stellar network and the deployed contracts.

- **`client.ts`** — Soroban RPC client initialization and transaction submission
- **`contracts/solarAsset.ts`** — Solar asset contract bindings
- **`contracts/registry.ts`** — Registry contract bindings
- **`contracts/warranty.ts`** — Warranty contract bindings
- **`contracts/maintenanceLog.ts`** — Maintenance log contract bindings
- **`qr.ts`** — QR code generation and scanning (via `@zxing/library` + `qrcode`)

**Dependencies:** `@stellar/stellar-sdk`, `@stellar/freighter-api`, `qrcode`, `@zxing/library`

### 3. REST API Gateway (`/api` — `@lumachain/api`)

Node.js/Hono server bridging Web2 applications with the Stellar network.

| Route Prefix         | Handler            | Description                        |
|----------------------|--------------------|------------------------------------|
| `/api/assets`        | `assetsRouter`     | Mint, transfer, verify assets      |
| `/api/registry`      | `registryRouter`   | Register and query assets          |
| `/api/warranty`      | `warrantyRouter`   | File and resolve warranty claims   |
| `/api/maintenance`   | `maintenanceRouter`| Log and query maintenance entries  |

**Middleware:** Logger, CORS, Pretty JSON, Zod validation
**Dependencies:** `hono`, `@hono/node-server`, `@lumachain/sdk`, `dotenv`, `zod`

### 4. Web Frontend (`/web`)

React SPA providing the user interface for asset management, verification, and dashboards.

- **Landing Page** — Public-facing overview and onboarding
- **Dashboard** — Asset inventory, warranty status, maintenance history

**Dependencies:** React 19, Vite 8, Framer Motion, Lucide React, React Router v7

### 5. Deployment (`/scripts` + `docker-compose.yml`)

- **`scripts/deploy.sh`** — Compiles all contracts and deploys to Stellar Testnet sequentially, generating `.contract-ids.env`
- **`docker-compose.yml`** — Container orchestration for the API service (port 3001)

---

## Data Flow

```
  User Action (Web UI)
       │
       ▼
  REST API (Hono) ─── Zod validation ───► SDK method call
       │                                      │
       │                                      ▼
       │                              Soroban RPC ───► Stellar Testnet
       │                                      │
       │                                      ▼
       │                              Smart Contract execution
       │                                      │
       │                                      ▼
       │                              On-chain state change
       │                                      │
       ▼                                      ▼
  JSON Response ◄────────────────── Transaction result
```

---

## Technology Stack

| Layer           | Technology                                       |
|-----------------|--------------------------------------------------|
| Smart Contracts | Rust, Soroban SDK v25                            |
| Blockchain      | Stellar Network (Testnet)                        |
| SDK             | TypeScript, @stellar/stellar-sdk v12, Freighter   |
| API             | Node.js, Hono v4, Zod v3                         |
| Frontend        | React 19, Vite 8, Framer Motion, Lucide, Router v7|
| Containerization| Docker Compose v3.8                              |
| Monorepo        | pnpm workspaces                                  |

---

## Getting Started

1. **Prerequisites:** [Stellar CLI](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup), Rust (`target: wasm32v1-none`), Node.js, pnpm
2. **Deploy contracts:** `bash scripts/deploy.sh`
3. **Configure environment:** Copy `.contract-ids.env` values to `api/.env` and `web/.env`
4. **Install dependencies:** `pnpm install`
5. **Run API:** `pnpm --filter api dev`
6. **Run Web:** `pnpm --filter web dev`
7. **Run tests:** `pnpm test`