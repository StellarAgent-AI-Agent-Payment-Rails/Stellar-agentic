export type OfflineCommitmentStatus =
  | 'draft'
  | 'pending'
  | 'submitted'
  | 'settled'
  | 'failed'
  | 'cancelled';

export interface LamportTimestamp {
  counter: number;
  nodeId: string;
}

export interface OfflinePaymentCommitment {
  id: string;
  fromAgent: string;
  toAgent: string;
  amount: string;
  asset: string;
  status: OfflineCommitmentStatus;
  updatedAt: LamportTimestamp;
  memo?: string;
  transactionHash?: string;
}

export interface OfflineAgentState {
  nodeId: string;
  clock: number;
  commitments: Record<string, OfflinePaymentCommitment>;
  tombstones: Record<string, LamportTimestamp>;
}

export interface CommitmentInput {
  id: string;
  fromAgent: string;
  toAgent: string;
  amount: string;
  asset: string;
  memo?: string;
}

const STATUS_RANK: Record<OfflineCommitmentStatus, number> = {
  draft: 0,
  pending: 1,
  submitted: 2,
  failed: 3,
  cancelled: 4,
  settled: 5,
};

export function createOfflineAgentState(nodeId: string): OfflineAgentState {
  if (!nodeId) {
    throw new Error('nodeId is required');
  }

  return {
    nodeId,
    clock: 0,
    commitments: {},
    tombstones: {},
  };
}

export function tick(state: OfflineAgentState): LamportTimestamp {
  const next = state.clock + 1;
  state.clock = next;
  return { counter: next, nodeId: state.nodeId };
}

export function compareTimestamp(a: LamportTimestamp, b: LamportTimestamp): number {
  if (a.counter !== b.counter) {
    return a.counter - b.counter;
  }
  return a.nodeId.localeCompare(b.nodeId);
}

export function addCommitment(
  state: OfflineAgentState,
  input: CommitmentInput,
): OfflinePaymentCommitment {
  if (!input.id) {
    throw new Error('commitment id is required');
  }
  if (state.commitments[input.id]) {
    throw new Error(`commitment already exists: ${input.id}`);
  }

  const commitment: OfflinePaymentCommitment = {
    ...input,
    status: 'pending',
    updatedAt: tick(state),
  };

  state.commitments[input.id] = commitment;
  delete state.tombstones[input.id];
  return commitment;
}

export function updateCommitmentStatus(
  state: OfflineAgentState,
  id: string,
  status: OfflineCommitmentStatus,
  transactionHash?: string,
): OfflinePaymentCommitment {
  const existing = state.commitments[id];
  if (!existing) {
    throw new Error(`commitment not found: ${id}`);
  }

  const updated: OfflinePaymentCommitment = {
    ...existing,
    status,
    transactionHash: transactionHash ?? existing.transactionHash,
    updatedAt: tick(state),
  };

  state.commitments[id] = updated;
  return updated;
}

export function removeCommitment(state: OfflineAgentState, id: string): void {
  const timestamp = tick(state);
  delete state.commitments[id];
  state.tombstones[id] = timestamp;
}

export function mergeOfflineStates(...states: OfflineAgentState[]): OfflineAgentState {
  if (!states.length) {
    throw new Error('at least one state is required');
  }

  const nodeId = states.map((state) => state.nodeId).sort()[0];
  const merged = createOfflineAgentState(nodeId);

  for (const state of states) {
    merged.clock = Math.max(merged.clock, state.clock);

    for (const [id, timestamp] of Object.entries(state.tombstones)) {
      const existing = merged.tombstones[id];
      if (!existing || compareTimestamp(timestamp, existing) > 0) {
        merged.tombstones[id] = timestamp;
      }
    }
  }

  for (const state of states) {
    for (const commitment of Object.values(state.commitments)) {
      const tombstone = merged.tombstones[commitment.id];
      if (tombstone && compareTimestamp(tombstone, commitment.updatedAt) >= 0) {
        continue;
      }

      const existing = merged.commitments[commitment.id];
      if (!existing || shouldReplaceCommitment(existing, commitment)) {
        merged.commitments[commitment.id] = commitment;
      }
    }
  }

  return merged;
}

export function listCommitments(state: OfflineAgentState): OfflinePaymentCommitment[] {
  return Object.values(state.commitments).sort((a, b) => {
    const time = compareTimestamp(a.updatedAt, b.updatedAt);
    if (time !== 0) {
      return time;
    }
    return a.id.localeCompare(b.id);
  });
}

function shouldReplaceCommitment(
  existing: OfflinePaymentCommitment,
  candidate: OfflinePaymentCommitment,
): boolean {
  const time = compareTimestamp(candidate.updatedAt, existing.updatedAt);
  if (time !== 0) {
    return time > 0;
  }

  const status = STATUS_RANK[candidate.status] - STATUS_RANK[existing.status];
  if (status !== 0) {
    return status > 0;
  }

  return candidate.id.localeCompare(existing.id) > 0;
}
