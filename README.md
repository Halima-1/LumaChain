# LumaChain ☀️

**LumaChain** is a decentralized Web3 supply chain management platform specifically tailored for the solar energy industry. Built natively on the **Stellar/Soroban** smart contract network, it provides immutable, end-to-end traceability for solar assets (panels, inverters, batteries) from manufacturing through installation, warranty, and maintenance.

## 📖 Architecture & Smart Contract Logic

The core logic is divided into four modular Rust-based Soroban smart contracts. This architecture ensures separation of concerns, upgradeability, and isolated state management.

### 1. Solar Asset (`solar_asset`)
Acts as a digital twin (NFT-like) for a physical solar component. 
- **Minting**: Called by the manufacturer to initialize an asset with static metadata (`serial_number`, `product_type`, `manufacturer`, `model`, `rated_power_w`, and an IPFS CID for specifications).
- **Supply Chain Transfers**: Facilitates transferring custody between roles (`SUPPLIER` -> `WAREHOUSE` -> `INSTALLER` -> `CUSTOMER`).
- **History Tracking**: Automatically maintains a chronological, immutable ledger of all previous owners and transfer timestamps.
- **Verification**: Allows external parties to verify an asset's authenticity via its serial number.

### 2. Supply Chain Registry (`registry`)
A central directory mapping physical serial numbers and owners to their respective on-chain smart contracts.
- **Registration**: An admin registers a newly minted asset, mapping its `serial_number` directly to its deployed `contract_id`.
- **Querying**: Provides highly efficient reverse lookups (`get_asset_by_serial`) and owner inventory queries (`get_assets_by_owner`).

### 3. Warranty Claims (`warranty`)
Manages the lifecycle of manufacturer warranties tied to specific assets.
- **Initialization**: Sets an absolute expiry timestamp (Unix epoch).
- **Filing Claims**: Submitting a claim records the submitter, description, and an IPFS hash of photo evidence. Claims are automatically marked as `OPEN` and date-stamped.
- **Resolution**: The manufacturer or authorized minter can update claim statuses (e.g., `APPROVED`, `REJECTED`, `UNDER_REVIEW`).

### 4. Maintenance Log (`maintenance_log`)
An append-only immutable ledger tracking the service history of a deployed solar asset.
- **Logging**: Authorized owners can add entries detailing technician IDs, service types (e.g., `INSPECTION`, `REPAIR`, `CLEANING`), notes, and IPFS photographic proofs.
- **Ownership Handoff**: Integrates with the main asset contract to hand off authorization when the physical asset changes hands.

---

## 🚀 Deployed Contracts (Stellar Testnet)

These contracts are fully compiled, verified, and live on the Soroban Testnet:

*   **Solar Asset Contract**: `CBXEQXUCHYLTW2EKTHDY6WICCK4QGPDOPUPIIMKNU3QIR4LE6TXPUUMH`
*   **Registry Contract**: `CBM33RV7SS5Z3LZT4Y7A772YYFZFMHTZMCCBZTPRIPWO6YIBJQ3HCKZO`
*   **Warranty Contract**: `CCYDY6EU4RFGG5XQFMS63CY6PVJ3QQH3A6PWMC3HQ3WQXJMRDTWGTYTR`
*   **Maintenance Log Contract**: `CCOKH2CPGCK4I7SZBOEA37MI2FVSCV2RMZVF2TEJPKR5EB62FA5CLWEV`

*Note: You can view these contracts and their transaction history on [Stellar Expert](https://stellar.expert/).*

---

## 🛠️ Project Structure & Getting Started

### Stack Components
- `/contracts`: Core Rust/Soroban smart contracts.
- `/sdk`: TypeScript SDK for interacting with the blockchain.
- `/api`: Node.js/Hono REST API Gateway bridging Web2 applications with the Stellar network.

### Building & Deploying Locally
1. **Prerequisites**: Ensure you have the [Stellar CLI](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup) and Rust (`target: wasm32v1-none`) installed.
2. **Compile and Deploy**: Run the deployment script to compile all contracts and sequentially deploy them to the Testnet.
   ```bash
   bash scripts/deploy.sh
   ```
3. **Environment**: The deployment script automatically generates a `.contract-ids.env` file in the root directory. Copy these variables to your API and Web frontend `.env` files to connect the stack.
