#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Bytes, Env, String, Symbol};

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct ClaimRecord {
    pub submitter: Address,
    pub serial_number: String,
    pub description: String,
    pub ipfs_photo_hash: Bytes,
    pub status: Symbol, // "OPEN", "UNDER_REVIEW", "APPROVED", "REJECTED"
    pub filed_at: u64,
    pub resolved_at: u64,
}

const MINTER_KEY: Symbol = symbol_short!("MINTER");
const EXPIRY_KEY: Symbol = symbol_short!("EXPIRY");
const CLAIMS_COUNT_KEY: Symbol = symbol_short!("CCNT");

#[contract]
pub struct WarrantyClaims;

#[contractimpl]
impl WarrantyClaims {
    pub fn init(env: Env, minter: Address, expiry: u64) {
        if env.storage().persistent().has(&MINTER_KEY) {
            panic!("already initialized");
        }
        env.storage().persistent().set(&MINTER_KEY, &minter);
        env.storage().persistent().set(&EXPIRY_KEY, &expiry);
        env.storage().persistent().set(&CLAIMS_COUNT_KEY, &0u32);
    }

    pub fn file_claim(
        env: Env,
        submitter: Address,
        serial_number: String,
        description: String,
        ipfs_photo_hash: Bytes,
    ) {
        submitter.require_auth();

        let expiry: u64 = env.storage().persistent().get(&EXPIRY_KEY).unwrap();
        if env.ledger().timestamp() > expiry {
            panic!("warranty expired");
        }

        let count: u32 = env.storage().persistent().get(&CLAIMS_COUNT_KEY).unwrap();
        
        let claim = ClaimRecord {
            submitter,
            serial_number,
            description,
            ipfs_photo_hash,
            status: Symbol::new(&env, "OPEN"),
            filed_at: env.ledger().timestamp(),
            resolved_at: 0,
        };

        env.storage().persistent().set(&(CLAIMS_COUNT_KEY, count), &claim);
        env.storage().persistent().set(&CLAIMS_COUNT_KEY, &(count + 1));
    }

    pub fn resolve_claim(env: Env, claim_index: u32, status: Symbol) {
        let minter: Address = env.storage().persistent().get(&MINTER_KEY).unwrap();
        minter.require_auth();

        let claim_key = (CLAIMS_COUNT_KEY, claim_index);
        let mut claim: ClaimRecord = env.storage().persistent().get(&claim_key).expect("claim not found");
        
        claim.status = status;
        claim.resolved_at = env.ledger().timestamp();

        env.storage().persistent().set(&claim_key, &claim);
    }

    pub fn get_claim(env: Env, claim_index: u32) -> ClaimRecord {
        let claim_key = (CLAIMS_COUNT_KEY, claim_index);
        env.storage().persistent().get(&claim_key).unwrap()
    }

    pub fn get_claims_count(env: Env) -> u32 {
        env.storage().persistent().get(&CLAIMS_COUNT_KEY).unwrap_or(0)
    }
}

mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_warranty() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, WarrantyClaims);
        let client = WarrantyClaimsClient::new(&env, &contract_id);

        let minter = Address::generate(&env);
        // Expiry far in the future
        client.init(&minter, &u64::MAX);

        let submitter = Address::generate(&env);
        client.file_claim(
            &submitter,
            &String::from_str(&env, "SN-12345"),
            &String::from_str(&env, "Broken part"),
            &Bytes::new(&env),
        );

        let claim = client.get_claim(&0);
        assert_eq!(claim.status, Symbol::new(&env, "OPEN"));

        client.resolve_claim(&0, &Symbol::new(&env, "APPROVED"));

        let updated_claim = client.get_claim(&0);
        assert_eq!(updated_claim.status, Symbol::new(&env, "APPROVED"));
    }
}
