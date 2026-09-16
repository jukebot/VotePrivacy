import { type WitnessContext } from '@midnight-ntwrk/compact-runtime';
import { type Ledger } from '../contracts/managed/voting/contract/index.js';
import { type VoterPrivateState } from './common-types.js';
import { fetchMerklePathForLeaf } from './merkle-path.js';

export const witnesses = {
  voterSecretKey: (
    context: WitnessContext<Ledger, VoterPrivateState>
  ): [VoterPrivateState, Uint8Array] => {
    return [context.privateState, context.privateState.secretKey];
  },
  merklePath: (
    context: WitnessContext<Ledger, VoterPrivateState>
  ): [VoterPrivateState, unknown] => {
    if (context.privateState.leafIndex === null) {
      throw new Error('No leaf index in private state — register before voting.');
    }
    const path = fetchMerklePathForLeaf(context.ledger, context.privateState.leafIndex);
    return [context.privateState, path];
  },

  voteChoice: (
    context: WitnessContext<Ledger, VoterPrivateState>,
    choice: boolean
  ): [VoterPrivateState, boolean] => {
    return [{ ...context.privateState, hasVoted: true }, choice];
  },
};
