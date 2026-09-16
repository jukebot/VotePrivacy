import type { MidnightProviders, FoundContract, DeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { Contract, Witnesses } from '../contracts/managed/voting/contract/index.js';


export type VoterPrivateState = {
  readonly secretKey: Uint8Array;
  readonly leafIndex: number | null;
  readonly hasVoted: boolean;
};

export const createVoterPrivateState = (secretKey: Uint8Array): VoterPrivateState => ({
  secretKey,
  leafIndex: null,
  hasVoted: false,
});

export type VotingContract = Contract<VoterPrivateState, Witnesses<VoterPrivateState>>;
export type VotingProviders = MidnightProviders<VotingContract>;
export type DeployedVotingContract = FoundContract<VotingContract> | DeployedContract<VotingContract>;

export const PRIVATE_STATE_KEY = 'votingPrivateState';
