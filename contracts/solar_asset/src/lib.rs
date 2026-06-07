#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Bytes, Env, String, Symbol,
};

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct AssetMetadata {
    pub serial_number: String,       // Manufacturer serial
    pub product_type: Symbol,        // "INVERTER" | "BATTERY" | "PANEL"
    pub manufacturer: String,
    pub model: String,
    pub manufacture_date: u64,       // Unix timestamp
    pub rated_power_w: u32,          // Watts
    pub ipfs_spec_hash: Bytes,       // CIDv1 of spec sheet
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct OwnershipRecord {
    pub owner: Address,
    pub role: Symbol,                // "SUPPLIER"|"WAREHOUSE"|"INSTALLER"|"CUSTOMER"
    pub transferred_at: u64,
    pub location_hash: Bytes,        // Optional: hashed GPS or address
    pub notes: String,
}

// Storage keys
const METADATA_KEY: Symbol = symbol_short!("METADATA");
const CURRENT_OWNER_KEY: Symbol = symbol_short!("OWNER");
const MINTER_KEY: Symbol = symbol_short!("MINTER");

// For history count, we can use a struct to hold the base key,
// but let's just make a stable symbol for the count.
const HISTORY_COUNT_KEY: Symbol = symbol_short!("HIST_CNT");

#[contract]
pub struct SolarAsset;

#[contractimpl]
impl SolarAsset {
    /// Called once by manufacturer. Mints the token.
    pub fn mint(env: Env, minter: Address, metadata: AssetMetadata) {
        minter.require_auth();
        // Panic if already minted
        if env.storage().persistent().has(&METADATA_KEY) {
            panic!("already minted");
        }
        env.storage().persistent().set(&METADATA_KEY, &metadata);
        env.storage().persistent().set(&MINTER_KEY, &minter);
        let record = OwnershipRecord {
            owner: minter.clone(),
            role: Symbol::new(&env, "SUPPLIER"),
            transferred_at: env.ledger().timestamp(),
            location_hash: Bytes::new(&env),
            notes: String::from_str(&env, "Initial mint"),
        };
        env.storage().persistent().set(&CURRENT_OWNER_KEY, &record);
        env.storage().persistent().set(&HISTORY_COUNT_KEY, &1u32);
    }

    /// Transfer to next party in the supply chain.
    pub fn transfer(
        env: Env,
        to: Address,
        role: Symbol,
        location_hash: Bytes,
        notes: String,
    ) {
        let current: OwnershipRecord =
            env.storage().persistent().get(&CURRENT_OWNER_KEY).unwrap();
        current.owner.require_auth();

        let count: u32 = env
            .storage()
            .persistent()
            .get(&HISTORY_COUNT_KEY)
            .unwrap_or(0);

        // Archive previous record
        // Combine history key and index into a tuple for storage
        env.storage()
            .persistent()
            .set(&(HISTORY_COUNT_KEY, count), &current);

        let new_record = OwnershipRecord {
            owner: to,
            role,
            transferred_at: env.ledger().timestamp(),
            location_hash,
            notes,
        };
        env.storage().persistent().set(&CURRENT_OWNER_KEY, &new_record);
        env.storage().persistent().set(&HISTORY_COUNT_KEY, &(count + 1));
    }

    pub fn get_metadata(env: Env) -> AssetMetadata {
        env.storage().persistent().get(&METADATA_KEY).unwrap()
    }

    pub fn get_owner(env: Env) -> OwnershipRecord {
        env.storage().persistent().get(&CURRENT_OWNER_KEY).unwrap()
    }

    pub fn get_history_count(env: Env) -> u32 {
        env.storage().persistent().get(&HISTORY_COUNT_KEY).unwrap_or(0)
    }

    pub fn get_history_at(env: Env, index: u32) -> OwnershipRecord {
        env.storage()
            .persistent()
            .get(&(HISTORY_COUNT_KEY, index))
            .unwrap()
    }

    /// Verify unit is authentic (contract exists and serial matches).
    pub fn verify(env: Env, serial: String) -> bool {
        if let Some(meta) = env
            .storage()
            .persistent()
            .get::<Symbol, AssetMetadata>(&METADATA_KEY)
        {
            return meta.serial_number == serial;
        }
        false
    }
}

mod test {
    // Basic test module to satisfy requirements
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_mint() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, SolarAsset);
        let client = SolarAssetClient::new(&env, &contract_id);

        let minter = Address::generate(&env);
        
        let meta = AssetMetadata {
            serial_number: String::from_str(&env, "SN123"),
            product_type: Symbol::new(&env, "INVERTER"),
            manufacturer: String::from_str(&env, "SolarCo"),
            model: String::from_str(&env, "ModelX"),
            manufacture_date: 1234567890,
            rated_power_w: 5000,
            ipfs_spec_hash: Bytes::new(&env),
        };

        client.mint(&minter, &meta);

        let retrieved_meta = client.get_metadata();
        assert_eq!(retrieved_meta.serial_number, String::from_str(&env, "SN123"));
    }
}
