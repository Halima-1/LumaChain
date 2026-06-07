#![no_std]

use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, String, Symbol, Vec, Map};

#[contract]
pub struct SupplyChainRegistry;

const ADMIN_KEY: Symbol = symbol_short!("ADMIN");
// SERIAL_TO_ASSET: String -> Address
const SERIAL_TO_ASSET_KEY: Symbol = symbol_short!("S2A");
// OWNER_TO_ASSETS: Address -> Vec<Address>
const OWNER_TO_ASSETS_KEY: Symbol = symbol_short!("O2A");

#[contractimpl]
impl SupplyChainRegistry {
    pub fn init(env: Env, admin: Address) {
        if env.storage().persistent().has(&ADMIN_KEY) {
            panic!("already initialized");
        }
        env.storage().persistent().set(&ADMIN_KEY, &admin);
    }

    pub fn register_asset(
        env: Env,
        contract_id: Address,
        serial: String,
        product_type: Symbol,
        owner: Address, // initially the manufacturer
    ) {
        let admin: Address = env.storage().persistent().get(&ADMIN_KEY).unwrap();
        admin.require_auth();

        // Register serial -> contract_id
        // For simplicity, we just store it at the contract level directly,
        // though typically Map is used. Here storing as individual keys.
        let serial_key = (SERIAL_TO_ASSET_KEY, serial.clone());
        if env.storage().persistent().has(&serial_key) {
            panic!("serial already registered");
        }
        env.storage().persistent().set(&serial_key, &contract_id);

        // Update owner -> assets
        let owner_key = (OWNER_TO_ASSETS_KEY, owner.clone());
        let mut owner_assets: Vec<Address> = env
            .storage()
            .persistent()
            .get(&owner_key)
            .unwrap_or(Vec::new(&env));
        owner_assets.push_back(contract_id);
        env.storage().persistent().set(&owner_key, &owner_assets);
    }

    pub fn get_assets_by_owner(env: Env, owner: Address) -> Vec<Address> {
        let owner_key = (OWNER_TO_ASSETS_KEY, owner);
        env.storage().persistent().get(&owner_key).unwrap_or(Vec::new(&env))
    }

    pub fn get_asset_by_serial(env: Env, serial: String) -> Address {
        let serial_key = (SERIAL_TO_ASSET_KEY, serial);
        env.storage().persistent().get(&serial_key).unwrap()
    }
}

mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_registry() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, SupplyChainRegistry);
        let client = SupplyChainRegistryClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.init(&admin);

        let asset_id = Address::generate(&env);
        let owner = Address::generate(&env);
        
        client.register_asset(&asset_id, &String::from_str(&env, "SN123"), &Symbol::new(&env, "INVERTER"), &owner);

        let fetched_asset = client.get_asset_by_serial(&String::from_str(&env, "SN123"));
        assert_eq!(fetched_asset, asset_id);

        let assets = client.get_assets_by_owner(&owner);
        assert_eq!(assets.len(), 1);
        assert_eq!(assets.get(0).unwrap(), asset_id);
    }
}
