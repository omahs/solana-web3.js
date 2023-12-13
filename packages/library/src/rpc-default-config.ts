import { createSolanaRpcApi } from '@solana/rpc-core';

import { SolanaJsonRpcIntegerOverflowError } from './rpc-integer-overflow-error';

const OPTIONS_OBJECT_POSITION_BY_METHOD: Record<string, number> = {
    getAccountInfo: 1,
    getBalance: 1,
    getBlock: 1,
    getBlockCommitment: 1,
    getBlockHeight: 0,
    getBlockProduction: 0,
    getBlocks: 2,
    getBlocksWithLimit: 2,
    getConfirmedBlock: 1,
    getConfirmedBlocks: 1,
    getConfirmedBlocksWithLimit: 2,
    getConfirmedSignaturesForAddress2: 1,
    getConfirmedTransaction: 1,
    getEpochInfo: 0,
    getFeeCalculatorForBlockhash: 1,
    getFeeForMessage: 1,
    getFees: 1,
    getInflationGovernor: 0,
    getInflationReward: 1,
    getLargestAccounts: 0,
    getLatestBlockhash: 0,
    getLeaderSchedule: 1,
    getMinimumBalanceForRentExemption: 1,
    getMultipleAccounts: 1,
    getProgramAccounts: 1,
    getRecentBlockhash: 1,
    getSignaturesForAddress: 1,
    getSlot: 0,
    getSlotLeader: 0,
    getStakeActivation: 1,
    getStakeMinimumDelegation: 0,
    getSupply: 0,
    getTokenAccountBalance: 1,
    getTokenAccountsByDelegate: 2,
    getTokenAccountsByOwner: 2,
    getTokenLargestAccounts: 1,
    getTokenSupply: 1,
    getTransaction: 1,
    getTransactionCount: 0,
    getVoteAccounts: 0,
    isBlockhashValid: 1,
    requestAirdrop: 2,
    sendTransaction: 1,
    simulateTransaction: 1,
};

function confirmationTransformer(node: unknown) {
    return node === undefined ? node : 'confirmed';
}

function getKeyPath(position: number, methodName: string) {
    const propertyName = methodName === 'sendTransaction' ? 'preflightCommitment' : 'commitment';
    return [position, propertyName];
}

export const DEFAULT_RPC_CONFIG: Partial<Parameters<typeof createSolanaRpcApi>[0]> = {
    getNodeTransformersForKeyPaths(methodName) {
        const position = OPTIONS_OBJECT_POSITION_BY_METHOD[methodName];
        if (position != null) {
            const keyPath = getKeyPath(position, methodName);
            return [[keyPath, confirmationTransformer]];
        }
    },
    onIntegerOverflow(methodName, keyPath, value) {
        throw new SolanaJsonRpcIntegerOverflowError(methodName, keyPath, value);
    },
};
