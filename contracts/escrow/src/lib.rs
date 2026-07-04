#![no_std]

//! # Escrow Contract
//! Enables agent-to-agent job delegation with trustless payment.

use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Bytes, Env, Map};

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum JobStatus { Open, InProgress, PendingRelease, Completed, Refunded, Disputed }

#[contracttype]
#[derive(Clone, Debug)]
pub struct Job {
    pub requester: Address,
    pub worker: Option<Address>,
    pub arbiter: Option<Address>,
    pub token: Address,
    pub amount: i128,
    pub task_description: Bytes,
    pub result: Option<Bytes>,
    pub deadline_ledger: u32,
    pub status: JobStatus,
    pub created_at: u32,
}

#[contract]
pub struct Escrow;

#[contractimpl]
impl Escrow {
    pub fn create_job(env: Env, requester: Address, token: Address, amount: i128, task_description: Bytes, deadline_ledger: u32, arbiter: Option<Address>) -> u64 {
        requester.require_auth();
        
        // --- Sentinel Guard ---
        Self::validate_sentinel_guard(&amount)?; 
        
        if deadline_ledger <= env.ledger().sequence() { panic!("deadline must be in the future"); }
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&requester, &env.current_contract_address(), &amount);
        let job_id = Self::next_id(&env);
        let job = Job { requester: requester.clone(), worker: None, arbiter, token, amount, task_description, result: None, deadline_ledger, status: JobStatus::Open, created_at: env.ledger().sequence() };
        Self::save_job(&env, job_id, job);
        env.events().publish((soroban_sdk::symbol_short!("escrow"), soroban_sdk::symbol_short!("created")), (job_id, requester, amount));
        job_id
    }

    pub fn accept_job(env: Env, worker: Address, job_id: u64) {
        worker.require_auth();
        let mut job = Self::load_job(&env, job_id);
        if job.status != JobStatus::Open { panic!("job is not open"); }
        if env.ledger().sequence() >= job.deadline_ledger { panic!("job has expired"); }
        job.worker = Some(worker.clone());
        job.status = JobStatus::InProgress;
        Self::save_job(&env, job_id, job);
    }

    pub fn submit_result(env: Env, worker: Address, job_id: u64, result: Bytes) {
        worker.require_auth();
        let mut job = Self::load_job(&env, job_id);
        if job.status != JobStatus::InProgress { panic!("job not in progress"); }
        let assigned_worker = job.worker.as_ref().expect("no worker assigned");
        if *assigned_worker != worker { panic!("not the assigned worker"); }
        job.result = Some(result);
        job.status = JobStatus::PendingRelease;
        Self::save_job(&env, job_id, job);
    }

    pub fn release(env: Env, releaser: Address, job_id: u64) {
        releaser.require_auth();
        let mut job = Self::load_job(&env, job_id);
        if job.status != JobStatus::PendingRelease && job.status != JobStatus::Disputed { panic!("job not pending release"); }
        let is_requester = job.requester == releaser;
        let is_arbiter = job.arbiter.as_ref().map(|a| *a == releaser).unwrap_or(false);
        if !is_requester && !is_arbiter { panic!("not authorized"); }
        let worker = job.worker.clone().expect("no worker");
        let token_client = token::Client::new(&env, &job.token);
        token_client.transfer(&env.current_contract_address(), &worker, &job.amount);
        job.status = JobStatus::Completed;
        Self::save_job(&env, job_id, job.clone());
    }

    pub fn refund(env: Env, requester: Address, job_id: u64) {
        requester.require_auth();
        let mut job = Self::load_job(&env, job_id);
        if job.requester != requester { panic!("not requester"); }
        let refundable = job.status == JobStatus::Open || job.status == JobStatus::InProgress || job.status == JobStatus::PendingRelease;
        if !refundable { panic!("cannot refund"); }
        if env.ledger().sequence() < job.deadline_ledger && job.status != JobStatus::Open { panic!("deadline not reached"); }
        let token_client = token::Client::new(&env, &job.token);
        token_client.transfer(&env.current_contract_address(), &requester, &job.amount);
        job.status = JobStatus::Refunded;
        Self::save_job(&env, job_id, job.clone());
    }

    pub fn dispute(env: Env, requester: Address, job_id: u64) {
        requester.require_auth();
        let mut job = Self::load_job(&env, job_id);
        if job.requester != requester { panic!("not requester"); }
        if job.arbiter.is_none() { panic!("no arbiter"); }
        if job.status != JobStatus::PendingRelease { panic!("can only dispute pending"); }
        job.status = JobStatus::Disputed;
        Self::save_job(&env, job_id, job);
    }

    pub fn get_job(env: Env, job_id: u64) -> Job { Self::load_job(&env, job_id) }
    pub fn job_count(env: Env) -> u64 { env.storage().instance().get(&soroban_sdk::symbol_short!("count")).unwrap_or(0) }

    // --- Internals ---
    fn validate_sentinel_guard(amount: &i128) -> Result<(), u32> {
        if *amount <= 0 { panic!("amount must be positive"); }
        Ok(())
    }
    fn next_id(env: &Env) -> u64 {
        let count: u64 = env.storage().instance().get(&soroban_sdk::symbol_short!("count")).unwrap_or(0);
        let next = count + 1;
        env.storage().instance().set(&soroban_sdk::symbol_short!("count"), &next);
        next
    }
    fn load_job(env: &Env, job_id: u64) -> Job {
        let jobs: Map<u64, Job> = env.storage().instance().get(&soroban_sdk::symbol_short!("jobs")).unwrap_or(Map::new(env));
        jobs.get(job_id).expect("job not found")
    }
    fn save_job(env: &Env, job_id: u64, job: Job) {
        let mut jobs: Map<u64, Job> = env.storage().instance().get(&soroban_sdk::symbol_short!("jobs")).unwrap_or(Map::new(env));
        jobs.set(job_id, job);
        env.storage().instance().set(&soroban_sdk::symbol_short!("jobs"), &jobs);
    }
}
