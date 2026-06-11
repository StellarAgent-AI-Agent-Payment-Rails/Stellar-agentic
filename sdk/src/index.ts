import {
  Keypair,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  Operation,
  Asset,
  Horizon,
  SorobanRpc,
  Contract,
  nativeToScVal,
  scValToNative,
  xdr,
} from '@stellar/stellar-sdk';

import type {
  StellarAgentConfig,
  Network,
  NetworkConfig,
  OpenChannelParams,
  PayForAPIParams,
  RequestWorkParams,
  RateLimitConfig,
  AgentInfo,
  ChannelInfo,
  JobInfo,
  TxResult,
  ContractAddresses,
} from './types/index.js';

import { NETWORK_CONFIGS } from './types/index.js';

// ─── Default Testnet Contract Addresses ──────────────────────────────────────
// TODO: Update these after deploying contracts to testnet

const DEFAULT_CONTRACTS: Record<Network, ContractAddresses> = {
  testnet: {
    agentWalletFactory: 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    paymentChannel: 'CBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
    escrow: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    rateLimiter: 'CDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
  },
  mainnet: {
    agentWalletFactory: '',
    paymentChannel: '',
    escrow: '',
    rateLimiter: '',
  },
  local: {
    agentWalletFactory: '',
    paymentChannel: '',
    escrow: '',
    rateLimiter: '',
  },
};

// ─── StellarAgent ─────────────────────────────────────────────────────────────

/**
 * Main SDK class for AI Agent payment operations on Stellar.
 *
 * @example
 * ```typescript
 * const agent = await StellarAgent.create({
 *   network: 'testnet',
 *   spendLimit: { amount: '10', asset: 'USDC', period: 'hourly' },
 * });
 *
 * await agent.payForAPI({
 *   endpoint: 'https://api.example.com/inference',
 *   amount: '0.001',
 *   asset: 'USDC',
 * });
 * ```
 */
export class StellarAgent {
  private keypair: Keypair;
  private networkConfig: NetworkConfig;
  private contracts: ContractAddresses;
  private horizon: Horizon.Server;
  private rpcServer: SorobanRpc.Server;
  private activeChannelId?: bigint;

  private constructor(
    keypair: Keypair,
    networkConfig: NetworkConfig,
    contracts: ContractAddresses,
  ) {
    this.keypair = keypair;
    this.networkConfig = networkConfig;
    this.contracts = contracts;
    this.horizon = new Horizon.Server(networkConfig.horizonUrl);
    this.rpcServer = new SorobanRpc.Server(networkConfig.rpcUrl);
  }

  // ── Factory Methods ──────────────────────────────────────────────────────

  /**
   * Create a new StellarAgent instance.
   * If no secretKey is provided, generates a fresh keypair.
   */
  static async create(config: StellarAgentConfig): Promise<StellarAgent> {
    const keypair = config.secretKey
      ? Keypair.fromSecret(config.secretKey)
      : Keypair.random();

    const networkConfig = NETWORK_CONFIGS[config.network];
    const contracts = {
      ...DEFAULT_CONTRACTS[config.network],
      ...config.contracts,
    };

    const agent = new StellarAgent(keypair, networkConfig, contracts);

    // If testnet and fresh keypair, fund from friendbot
    if (config.network === 'testnet' && !config.secretKey) {
      await agent.fundFromFriendbot();
    }

    return agent;
  }

  /**
   * Restore an agent from an existing secret key.
   */
  static async fromSecret(
    secretKey: string,
    network: Network = 'testnet',
  ): Promise<StellarAgent> {
    return StellarAgent.create({ network, secretKey });
  }

  // ── Identity ─────────────────────────────────────────────────────────────

  /** The agent's Stellar public address */
  get address(): string {
    return this.keypair.publicKey();
  }

  /** The agent's secret key — keep this safe! */
  get secretKey(): string {
    return this.keypair.secret();
  }

  // ── Payment Channel ──────────────────────────────────────────────────────

  /**
   * Open a payment channel for this agent.
   * Deposits tokens and sets a per-period spend limit.
   *
   * @returns The channel ID
   */
  async openChannel(params: OpenChannelParams): Promise<bigint> {
    // TODO: Invoke AgentWalletFactory.create_agent + PaymentChannel.open_channel
    // via Soroban contract invocation
    console.log('Opening channel with params:', params);
    throw new Error('Not yet implemented — contract addresses needed. See CONTRIBUTING.md');
  }

  /**
   * Pay for an API call. Deducts from the active payment channel.
   * Respects on-chain spend limits automatically.
   *
   * @example
   * ```typescript
   * await agent.payForAPI({
   *   endpoint: 'https://api.openai.com/v1/chat',
   *   amount: '0.001',
   *   asset: 'USDC',
   * });
   * ```
   */
  async payForAPI(params: PayForAPIParams): Promise<TxResult> {
    if (!this.activeChannelId) {
      throw new Error('No active payment channel. Call openChannel() first.');
    }

    // TODO: Invoke PaymentChannel.pay via Soroban
    console.log('Paying for API:', params);
    throw new Error('Not yet implemented — see contracts/payment_channel/src/lib.rs');
  }

  // ── Agent-to-Agent Escrow ────────────────────────────────────────────────

  /**
   * Create an escrow job delegating work to another agent.
   * Locks payment until the work is delivered and released.
   *
   * @example
   * ```typescript
   * const job = await agent.requestWork({
   *   workerAgent: 'G...WORKER_ADDRESS',
   *   task: 'Summarize this document: ipfs://Qm...',
   *   escrowAmount: '0.05',
   *   asset: 'USDC',
   * });
   * ```
   */
  async requestWork(params: RequestWorkParams): Promise<bigint> {
    // TODO: Invoke Escrow.create_job via Soroban
    console.log('Requesting work:', params);
    throw new Error('Not yet implemented — see contracts/escrow/src/lib.rs');
  }

  /**
   * Accept an open escrow job as a worker agent
   */
  async acceptJob(jobId: bigint): Promise<TxResult> {
    // TODO: Invoke Escrow.accept_job
    throw new Error('Not yet implemented');
  }

  /**
   * Submit work result for an escrow job
   */
  async submitResult(jobId: bigint, result: string): Promise<TxResult> {
    // TODO: Invoke Escrow.submit_result
    throw new Error('Not yet implemented');
  }

  /**
   * Release escrow payment to the worker after work is complete
   */
  async releasePayment(jobId: bigint): Promise<TxResult> {
    // TODO: Invoke Escrow.release
    throw new Error('Not yet implemented');
  }

  // ── Rate Limits ──────────────────────────────────────────────────────────

  /**
   * Configure rate limits for this agent on-chain.
   * Protects against runaway spending.
   */
  async setRateLimits(config: RateLimitConfig): Promise<TxResult> {
    // TODO: Invoke RateLimiter.set_limits
    throw new Error('Not yet implemented');
  }

  /**
   * Check if a payment would be blocked by rate limits (read-only)
   */
  async checkRateLimit(amount: string): Promise<boolean> {
    // TODO: Invoke RateLimiter.check (read-only call)
    throw new Error('Not yet implemented');
  }

  // ── Queries ──────────────────────────────────────────────────────────────

  /**
   * Get current XLM balance
   */
  async getBalance(): Promise<string> {
    try {
      const account = await this.horizon.loadAccount(this.address);
      const xlmBalance = account.balances.find(
        (b) => b.asset_type === 'native',
      );
      return xlmBalance?.balance ?? '0';
    } catch {
      return '0';
    }
  }

  /**
   * Get spend report for the current period.
   * Uses `simulateTransaction` to read channel state from the PaymentChannel contract.
   */
  async getSpendReport(): Promise<{
    spentThisPeriod: string;
    remainingThisPeriod: string;
    totalLifetime: string;
  }> {
    if (!this.activeChannelId) {
      throw new Error('No active payment channel. Call openChannel() first.');
    }

    const contract = new Contract(this.contracts.paymentChannel);
    const account = await this.rpcServer.getAccount(this.address);

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: this.networkConfig.networkPassphrase,
    })
      .addOperation(
        contract.call(
          'get_channel',
          nativeToScVal(this.activeChannelId, { type: 'u64' }),
        ),
      )
      .setTimeout(30)
      .build();

    const simResult = await this.rpcServer.simulateTransaction(tx);

    if (SorobanRpc.Api.isSimulationError(simResult)) {
      throw new Error(`Contract simulation failed: ${simResult.error}`);
    }

    const successResult = simResult as SorobanRpc.Api.SimulateTransactionSuccessResponse;
    const returnVal = successResult.result?.retval;
    if (!returnVal) {
      throw new Error('No return value from contract simulation');
    }

    const channel = scValToNative(returnVal) as {
      spent_this_period: bigint;
      limit_per_period: bigint;
      total_spent: bigint;
    };

    const spent = channel.spent_this_period;
    const remaining = channel.limit_per_period - spent;

    return {
      spentThisPeriod: spent.toString(),
      remainingThisPeriod: remaining.toString(),
      totalLifetime: channel.total_spent.toString(),
    };
  }

  /**
   * Get info about a job.
   * Uses `simulateTransaction` to read job state from the Escrow contract.
   */
  async getJob(jobId: bigint): Promise<JobInfo> {
    const contract = new Contract(this.contracts.escrow);
    const account = await this.rpcServer.getAccount(this.address);

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: this.networkConfig.networkPassphrase,
    })
      .addOperation(
        contract.call(
          'get_job',
          nativeToScVal(jobId, { type: 'u64' }),
        ),
      )
      .setTimeout(30)
      .build();

    const simResult = await this.rpcServer.simulateTransaction(tx);

    if (SorobanRpc.Api.isSimulationError(simResult)) {
      throw new Error(`Contract simulation failed: ${simResult.error}`);
    }

    const successResult = simResult as SorobanRpc.Api.SimulateTransactionSuccessResponse;
    const returnVal = successResult.result?.retval;
    if (!returnVal) {
      throw new Error('No return value from contract simulation');
    }

    const job = scValToNative(returnVal) as {
      requester: string;
      worker: string | null;
      arbiter: string | null;
      token: string;
      amount: bigint;
      task_description: string;
      result: string | null;
      deadline_ledger: number;
      status: { tag: string };
      created_at: number;
    };

    const statusMap: Record<string, JobInfo['status']> = {
      Open: 'open',
      InProgress: 'in_progress',
      PendingRelease: 'pending_release',
      Completed: 'completed',
      Refunded: 'refunded',
      Disputed: 'disputed',
    };

    return {
      id: jobId,
      requester: job.requester,
      worker: job.worker ?? null,
      arbiter: job.arbiter ?? null,
      token: job.token,
      amount: job.amount,
      taskDescription: job.task_description,
      result: job.result ?? null,
      deadlineLedger: job.deadline_ledger,
      status: statusMap[job.status.tag] ?? 'open',
      createdAt: job.created_at,
    };
  }

  // ── Internals ────────────────────────────────────────────────────────────

  private async fundFromFriendbot(): Promise<void> {
    try {
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${this.address}`,
      );
      if (!response.ok) {
        console.warn('Friendbot funding failed — account may already exist');
      }
    } catch {
      console.warn('Could not reach friendbot');
    }
  }
}
