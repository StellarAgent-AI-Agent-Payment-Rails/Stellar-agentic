import { describe, expect, it } from 'vitest';

import {
  addCommitment,
  createOfflineAgentState,
  listCommitments,
  mergeOfflineStates,
  removeCommitment,
  updateCommitmentStatus,
  type OfflineAgentState,
} from './offline-state.js';

function cloneState(state: OfflineAgentState, nodeId: string): OfflineAgentState {
  return {
    nodeId,
    clock: state.clock,
    commitments: structuredClone(state.commitments),
    tombstones: structuredClone(state.tombstones),
  };
}

describe('offline agent state CRDTs', () => {
  it('merges offline commitments from multiple agents deterministically', () => {
    const edge = createOfflineAgentState('edge');
    const mobile = createOfflineAgentState('mobile');

    addCommitment(edge, {
      id: 'pay:1',
      fromAgent: 'GALICE',
      toAgent: 'GBOB',
      amount: '1.25',
      asset: 'USDC',
      memo: 'edge inference',
    });
    addCommitment(mobile, {
      id: 'pay:2',
      fromAgent: 'GALICE',
      toAgent: 'GCAROL',
      amount: '0.5',
      asset: 'USDC',
      memo: 'mobile inference',
    });

    const left = mergeOfflineStates(edge, mobile);
    const right = mergeOfflineStates(mobile, edge);

    expect(listCommitments(left).map((commitment) => commitment.id)).toEqual([
      'pay:1',
      'pay:2',
    ]);
    expect(left).toEqual(right);
  });

  it('uses the latest Lamport timestamp for the same commitment id', () => {
    const base = createOfflineAgentState('base');
    addCommitment(base, {
      id: 'pay:1',
      fromAgent: 'GALICE',
      toAgent: 'GBOB',
      amount: '1',
      asset: 'USDC',
    });

    const replicaA = cloneState(base, 'replica-a');
    const replicaB = cloneState(base, 'replica-b');

    updateCommitmentStatus(replicaA, 'pay:1', 'submitted', 'hash-a');
    updateCommitmentStatus(replicaB, 'pay:1', 'settled', 'hash-b');

    const merged = mergeOfflineStates(replicaA, replicaB);

    expect(merged.commitments['pay:1']).toMatchObject({
      status: 'settled',
      transactionHash: 'hash-b',
    });
  });

  it('uses status precedence when concurrent updates have identical timestamps', () => {
    const submitted = createOfflineAgentState('a');
    const settled = createOfflineAgentState('b');

    submitted.clock = 1;
    submitted.commitments['pay:1'] = {
      id: 'pay:1',
      fromAgent: 'GALICE',
      toAgent: 'GBOB',
      amount: '1',
      asset: 'USDC',
      status: 'submitted',
      updatedAt: { counter: 2, nodeId: 'same' },
    };

    settled.clock = 1;
    settled.commitments['pay:1'] = {
      id: 'pay:1',
      fromAgent: 'GALICE',
      toAgent: 'GBOB',
      amount: '1',
      asset: 'USDC',
      status: 'settled',
      updatedAt: { counter: 2, nodeId: 'same' },
      transactionHash: 'hash-settled',
    };

    const merged = mergeOfflineStates(submitted, settled);

    expect(merged.commitments['pay:1']).toMatchObject({
      status: 'settled',
      transactionHash: 'hash-settled',
    });
  });

  it('preserves deletes with newer tombstones', () => {
    const base = createOfflineAgentState('base');
    addCommitment(base, {
      id: 'pay:1',
      fromAgent: 'GALICE',
      toAgent: 'GBOB',
      amount: '1',
      asset: 'USDC',
    });

    const staleReplica = cloneState(base, 'stale');
    const deletingReplica = cloneState(base, 'deleter');

    removeCommitment(deletingReplica, 'pay:1');

    const merged = mergeOfflineStates(staleReplica, deletingReplica);

    expect(merged.commitments['pay:1']).toBeUndefined();
    expect(merged.tombstones['pay:1']).toEqual({ counter: 2, nodeId: 'deleter' });
  });
});
