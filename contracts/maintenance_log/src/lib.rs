#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Bytes, Env, String, Symbol};

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct MaintenanceEntry {
    pub technician: Address,
    pub date: u64,
    pub entry_type: Symbol, // e.g. "INSPECTION", "REPAIR", "CLEANING"
    pub notes: String,
    pub ipfs_photo_hash: Bytes,
}

const AUTHORIZED_OWNER_KEY: Symbol = symbol_short!("OWNER");
const LOG_COUNT_KEY: Symbol = symbol_short!("LCNT");

#[contract]
pub struct MaintenanceLog;

#[contractimpl]
impl MaintenanceLog {
    // Only initialized with authorized owner (can be updated via transfer in later logic, 
    // for simplicity assuming the authorized owner is set and can be updated by the asset contract).
    pub fn init(env: Env, owner: Address) {
        if env.storage().persistent().has(&AUTHORIZED_OWNER_KEY) {
            panic!("already initialized");
        }
        env.storage().persistent().set(&AUTHORIZED_OWNER_KEY, &owner);
        env.storage().persistent().set(&LOG_COUNT_KEY, &0u32);
    }

    pub fn set_owner(env: Env, old_owner: Address, new_owner: Address) {
        old_owner.require_auth();
        let current_owner: Address = env.storage().persistent().get(&AUTHORIZED_OWNER_KEY).unwrap();
        if current_owner != old_owner {
            panic!("not current owner");
        }
        env.storage().persistent().set(&AUTHORIZED_OWNER_KEY, &new_owner);
    }

    pub fn add_log(
        env: Env,
        technician: Address,
        entry_type: Symbol,
        notes: String,
        ipfs_photo_hash: Bytes,
    ) {
        let owner: Address = env.storage().persistent().get(&AUTHORIZED_OWNER_KEY).unwrap();
        // The owner could be the technician themselves if they are installer/customer, 
        // or the owner can authorize the technician. For now, requiring owner auth.
        owner.require_auth();

        let count: u32 = env.storage().persistent().get(&LOG_COUNT_KEY).unwrap_or(0);

        let entry = MaintenanceEntry {
            technician,
            date: env.ledger().timestamp(),
            entry_type,
            notes,
            ipfs_photo_hash,
        };

        env.storage().persistent().set(&(LOG_COUNT_KEY, count), &entry);
        env.storage().persistent().set(&LOG_COUNT_KEY, &(count + 1));
    }

    pub fn get_log_count(env: Env) -> u32 {
        env.storage().persistent().get(&LOG_COUNT_KEY).unwrap_or(0)
    }

    pub fn get_log_entry(env: Env, index: u32) -> MaintenanceEntry {
        let key = (LOG_COUNT_KEY, index);
        env.storage().persistent().get(&key).unwrap()
    }
}

mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_maintenance() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, MaintenanceLog);
        let client = MaintenanceLogClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        client.init(&owner);

        let technician = Address::generate(&env);
        client.add_log(
            &technician,
            &Symbol::new(&env, "REPAIR"),
            &String::from_str(&env, "Fixed switch"),
            &Bytes::new(&env),
        );

        assert_eq!(client.get_log_count(), 1);
        let log = client.get_log_entry(&0);
        assert_eq!(log.entry_type, Symbol::new(&env, "REPAIR"));
    }
}
