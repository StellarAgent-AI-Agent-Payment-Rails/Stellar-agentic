#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, BytesN, Env, Map, Vec,
};

#[contracttype]
#[derive(Clone, Debug)]
pub struct AgentInfo {
    /// The agent's Stellar address.
    pub address: Address,
    /// Hash commitment for the off-chain IPFS/metadata document.
    pub metadata_hash: BytesN<32>,
    /// Owner who controls this agent.
    pub owner: Address,
    /// Whether this agent is currently active.
    pub active: bool,
    /// Ledger number when the agent was created.
    pub created_at: u32,
    /// Total operations this agent has performed.
    pub total_ops: u64,
}

#[contracttype]
pub enum Event {
    AgentCreated,
    AgentMetadataUpdated,
    AgentDeactivated,
    AgentReactivated,
}

#[contract]
pub struct AgentWalletFactory;

#[contractimpl]
impl AgentWalletFactory {
    /// Initialize the factory with an admin address.
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&symbol_short!("admin")) {
            panic!("already initialized");
        }

        env.storage()
            .instance()
            .set(&symbol_short!("admin"), &admin);
        env.storage().instance().set(&symbol_short!("count"), &0u64);

        let agents: Map<u64, AgentInfo> = Map::new(&env);
        env.storage()
            .instance()
            .set(&symbol_short!("agents"), &agents);

        let owner_index: Map<Address, Vec<u64>> = Map::new(&env);
        env.storage()
            .instance()
            .set(&symbol_short!("ownerids"), &owner_index);
    }

    /// Create a new agent wallet.
    ///
    /// The contract stores only a 32-byte metadata hash on-chain. Off-chain
    /// clients resolve the IPFS CID or JSON document, hash the canonical
    /// content, and call `verify_agent_metadata` to prove it matches.
    pub fn create_agent(
        env: Env,
        owner: Address,
        agent_address: Address,
        metadata_hash: BytesN<32>,
    ) -> u64 {
        owner.require_auth();

        let agent_id = Self::next_id(&env);
        let agent = AgentInfo {
            address: agent_address.clone(),
            metadata_hash: metadata_hash.clone(),
            owner: owner.clone(),
            active: true,
            created_at: env.ledger().sequence(),
            total_ops: 0,
        };

        Self::save_agent(&env, agent_id, agent);
        Self::append_owner_agent_id(&env, owner.clone(), agent_id);

        env.events().publish(
            (symbol_short!("factory"), symbol_short!("created")),
            (agent_id, agent_address, owner, metadata_hash),
        );

        agent_id
    }

    /// Update the hash commitment for an agent's off-chain metadata.
    pub fn update_agent_metadata(
        env: Env,
        owner: Address,
        agent_id: u64,
        metadata_hash: BytesN<32>,
    ) {
        owner.require_auth();

        let mut agent = Self::load_agent(&env, agent_id);
        if agent.owner != owner {
            panic!("not the agent owner");
        }

        agent.metadata_hash = metadata_hash.clone();
        Self::save_agent(&env, agent_id, agent);

        env.events().publish(
            (symbol_short!("factory"), symbol_short!("metadata")),
            (agent_id, owner, metadata_hash),
        );
    }

    /// Deactivate an agent. Only the owner can deactivate their agent.
    pub fn deactivate_agent(env: Env, owner: Address, agent_id: u64) {
        owner.require_auth();

        let mut agent = Self::load_agent(&env, agent_id);
        if agent.owner != owner {
            panic!("not the agent owner");
        }

        agent.active = false;
        Self::save_agent(&env, agent_id, agent);

        env.events().publish(
            (symbol_short!("factory"), symbol_short!("deactiv")),
            (agent_id, owner),
        );
    }

    /// Reactivate a previously deactivated agent.
    pub fn reactivate_agent(env: Env, owner: Address, agent_id: u64) {
        owner.require_auth();

        let mut agent = Self::load_agent(&env, agent_id);
        if agent.owner != owner {
            panic!("not the agent owner");
        }

        agent.active = true;
        Self::save_agent(&env, agent_id, agent);

        env.events().publish(
            (symbol_short!("factory"), symbol_short!("reactiv")),
            (agent_id, owner),
        );
    }

    /// Increment the operation counter for an agent.
    pub fn record_operation(env: Env, agent_id: u64) {
        let mut agent = Self::load_agent(&env, agent_id);
        agent.total_ops += 1;
        Self::save_agent(&env, agent_id, agent);
    }

    /// Get agent info by ID.
    pub fn get_agent(env: Env, agent_id: u64) -> AgentInfo {
        Self::load_agent(&env, agent_id)
    }

    /// Get all agent records owned by a specific address.
    pub fn get_agents_by_owner(env: Env, owner: Address) -> Vec<AgentInfo> {
        let agents = Self::load_agents(&env);
        let ids = Self::get_agent_ids_by_owner(env.clone(), owner);
        let mut result = Vec::new(&env);

        for agent_id in ids.iter() {
            if let Some(agent) = agents.get(agent_id) {
                result.push_back(agent);
            }
        }

        result
    }

    /// Get indexed agent IDs for an owner without scanning the full registry.
    pub fn get_agent_ids_by_owner(env: Env, owner: Address) -> Vec<u64> {
        Self::load_owner_index(&env)
            .get(owner)
            .unwrap_or(Vec::new(&env))
    }

    /// Verify that an off-chain metadata document resolves to the stored hash.
    pub fn verify_agent_metadata(env: Env, agent_id: u64, metadata_hash: BytesN<32>) -> bool {
        Self::load_agent(&env, agent_id).metadata_hash == metadata_hash
    }

    /// Total number of agents ever created.
    pub fn total_agents(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&symbol_short!("count"))
            .unwrap_or(0)
    }

    /// Check if a specific address is a registered active agent.
    pub fn is_active_agent(env: Env, address: Address) -> bool {
        let agents = Self::load_agents(&env);
        let count = Self::total_agents(env);

        for i in 1..=count {
            if let Some(agent) = agents.get(i) {
                if agent.address == address && agent.active {
                    return true;
                }
            }
        }

        false
    }

    /// Get the contract admin.
    pub fn admin(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&symbol_short!("admin"))
            .unwrap()
    }

    fn next_id(env: &Env) -> u64 {
        let count: u64 = env
            .storage()
            .instance()
            .get(&symbol_short!("count"))
            .unwrap_or(0);
        let next = count + 1;
        env.storage().instance().set(&symbol_short!("count"), &next);
        next
    }

    fn load_agents(env: &Env) -> Map<u64, AgentInfo> {
        env.storage()
            .instance()
            .get(&symbol_short!("agents"))
            .unwrap_or(Map::new(env))
    }

    fn load_agent(env: &Env, agent_id: u64) -> AgentInfo {
        Self::load_agents(env)
            .get(agent_id)
            .expect("agent not found")
    }

    fn save_agent(env: &Env, agent_id: u64, agent: AgentInfo) {
        let mut agents = Self::load_agents(env);
        agents.set(agent_id, agent);
        env.storage()
            .instance()
            .set(&symbol_short!("agents"), &agents);
    }

    fn load_owner_index(env: &Env) -> Map<Address, Vec<u64>> {
        env.storage()
            .instance()
            .get(&symbol_short!("ownerids"))
            .unwrap_or(Map::new(env))
    }

    fn append_owner_agent_id(env: &Env, owner: Address, agent_id: u64) {
        let mut owner_index = Self::load_owner_index(env);
        let mut ids = owner_index.get(owner.clone()).unwrap_or(Vec::new(env));
        ids.push_back(agent_id);
        owner_index.set(owner, ids);
        env.storage()
            .instance()
            .set(&symbol_short!("ownerids"), &owner_index);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::Env;

    fn setup() -> (Env, AgentWalletFactoryClient<'static>) {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(AgentWalletFactory, ());
        let client = AgentWalletFactoryClient::new(&env, &contract_id);
        (env, client)
    }

    fn hash(env: &Env, byte: u8) -> BytesN<32> {
        BytesN::from_array(env, &[byte; 32])
    }

    #[test]
    fn test_initialize() {
        let (env, client) = setup();
        let admin = Address::generate(&env);
        client.initialize(&admin);
        assert_eq!(client.admin(), admin);
        assert_eq!(client.total_agents(), 0);
    }

    #[test]
    fn test_create_agent_with_metadata_hash() {
        let (env, client) = setup();
        let admin = Address::generate(&env);
        let owner = Address::generate(&env);
        let agent_addr = Address::generate(&env);
        let metadata_hash = hash(&env, 7);

        client.initialize(&admin);

        let agent_id = client.create_agent(&owner, &agent_addr, &metadata_hash);

        assert_eq!(agent_id, 1);
        assert_eq!(client.total_agents(), 1);

        let agent = client.get_agent(&1);
        assert_eq!(agent.owner, owner);
        assert_eq!(agent.address, agent_addr);
        assert_eq!(agent.metadata_hash, metadata_hash);
        assert!(agent.active);
        assert_eq!(agent.total_ops, 0);
        assert!(client.verify_agent_metadata(&agent_id, &metadata_hash));
        assert!(!client.verify_agent_metadata(&agent_id, &hash(&env, 8)));
    }

    #[test]
    fn test_update_agent_metadata() {
        let (env, client) = setup();
        let admin = Address::generate(&env);
        let owner = Address::generate(&env);

        client.initialize(&admin);
        let agent_id = client.create_agent(&owner, &Address::generate(&env), &hash(&env, 1));

        let new_hash = hash(&env, 2);
        client.update_agent_metadata(&owner, &agent_id, &new_hash);

        assert_eq!(client.get_agent(&agent_id).metadata_hash, new_hash);
        assert!(client.verify_agent_metadata(&agent_id, &new_hash));
    }

    #[test]
    fn test_deactivate_reactivate() {
        let (env, client) = setup();
        let admin = Address::generate(&env);
        let owner = Address::generate(&env);
        let agent_addr = Address::generate(&env);

        client.initialize(&admin);
        let agent_id = client.create_agent(&owner, &agent_addr, &hash(&env, 1));

        client.deactivate_agent(&owner, &agent_id);
        assert!(!client.get_agent(&agent_id).active);

        client.reactivate_agent(&owner, &agent_id);
        assert!(client.get_agent(&agent_id).active);
    }

    #[test]
    fn test_get_agents_by_owner_uses_owner_index() {
        let (env, client) = setup();
        let admin = Address::generate(&env);
        let owner = Address::generate(&env);
        let other_owner = Address::generate(&env);

        client.initialize(&admin);

        let first = client.create_agent(&owner, &Address::generate(&env), &hash(&env, 1));
        let second = client.create_agent(&owner, &Address::generate(&env), &hash(&env, 2));
        client.create_agent(&other_owner, &Address::generate(&env), &hash(&env, 3));

        let ids = client.get_agent_ids_by_owner(&owner);
        assert_eq!(ids.len(), 2);
        assert_eq!(ids.get(0).unwrap(), first);
        assert_eq!(ids.get(1).unwrap(), second);

        let agents = client.get_agents_by_owner(&owner);
        assert_eq!(agents.len(), 2);
        assert_eq!(agents.get(0).unwrap().metadata_hash, hash(&env, 1));
        assert_eq!(agents.get(1).unwrap().metadata_hash, hash(&env, 2));
    }

    #[test]
    #[should_panic(expected = "not the agent owner")]
    fn test_deactivate_wrong_owner_panics() {
        let (env, client) = setup();
        let admin = Address::generate(&env);
        let owner = Address::generate(&env);
        let attacker = Address::generate(&env);

        client.initialize(&admin);
        let agent_id = client.create_agent(&owner, &Address::generate(&env), &hash(&env, 1));

        client.deactivate_agent(&attacker, &agent_id);
    }

    #[test]
    #[should_panic(expected = "not the agent owner")]
    fn test_update_metadata_wrong_owner_panics() {
        let (env, client) = setup();
        let admin = Address::generate(&env);
        let owner = Address::generate(&env);
        let attacker = Address::generate(&env);

        client.initialize(&admin);
        let agent_id = client.create_agent(&owner, &Address::generate(&env), &hash(&env, 1));

        client.update_agent_metadata(&attacker, &agent_id, &hash(&env, 2));
    }
}
