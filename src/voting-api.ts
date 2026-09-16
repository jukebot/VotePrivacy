import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import * as Voting from '../contracts/managed/voting/contract/index.js';
import { witnesses } from './witnesses.js';
import {
  createVoterPrivateState,
  PRIVATE_STATE_KEY,
  type VotingProviders,
  type DeployedVotingContract,
} from './common-types.js';

export class VotingAPI {
  private constructor(public readonly deployedContract: DeployedVotingContract) {}

  static async deploy(providers: VotingProviders, secretKey: Uint8Array): Promise<VotingAPI> {
    const deployed = await deployContract(providers, {
      privateStateId: PRIVATE_STATE_KEY,
      contract: new Voting.Contract(witnesses),
      initialPrivateState: createVoterPrivateState(secretKey),
    });
    return new VotingAPI(deployed);
  }

  static async join(providers: VotingProviders, contractAddress: string, secretKey: Uint8Array): Promise<VotingAPI> {
    const deployed = await findDeployedContract(providers, {
      contractAddress,
      contract: new Voting.Contract(witnesses),
      privateStateId: PRIVATE_STATE_KEY,
      initialPrivateState: createVoterPrivateState(secretKey),
    });
    return new VotingAPI(deployed);
  }

  // Commits this voter's leaf into the on-chain eligibility tree.
  async register(): Promise<void> {
    const txData = await this.deployedContract.callTx.register();
    console.log('Registered — vote committed. Tx:', txData.public.txHash);
  }
  async castVote(choice: boolean): Promise<void> {
    const txData = await this.deployedContract.callTx.castVote(choice);
    console.log('Vote submitted. Tx:', txData.public.txHash);
  }

  async getTally(): Promise<{ yes: bigint; no: bigint }> {
    const state = await this.deployedContract.callTx.ledgerState();
    return { yes: state.yesVotes, no: state.noVotes };
  }
}
