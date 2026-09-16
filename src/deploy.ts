// Run with: npm run deploy
import { webcrypto as crypto } from 'node:crypto';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NetworkId, setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { VotingAPI } from './voting-api.js';
import type { VotingProviders } from './common-types.js';

const PROOF_SERVER_URL = process.env.PROOF_SERVER_URL ?? 'http://localhost:6300';
const INDEXER_URL = process.env.INDEXER_URL ?? 'https://indexer.testnet.midnight.network/api/v1/graphql';
const INDEXER_WS_URL = process.env.INDEXER_WS_URL ?? 'wss://indexer.testnet.midnight.network/api/v1/graphql/ws';

function randomSecretKey(): Uint8Array {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return bytes;
}

async function buildProviders(): Promise<VotingProviders> {
  setNetworkId(NetworkId.TestNet);
    return {
    privateStateProvider: levelPrivateStateProvider({ privateStateStoreName: 'voting-private-state' }),
    publicDataProvider: indexerPublicDataProvider(INDEXER_URL, INDEXER_WS_URL),
    proofProvider: httpClientProofProvider(PROOF_SERVER_URL),
  } as VotingProviders;
}

async function main() {
  const providers = await buildProviders();
  const secretKey = randomSecretKey();

  console.log('Deploying voting contract…');
  const api = await VotingAPI.deploy(providers, secretKey);

  console.log('Registering voter…');
  await api.register();

  console.log('Casting vote…');
  await api.castVote(true);

  const tally = await api.getTally();
  console.log(`Tally — yes: ${tally.yes}, no: ${tally.no}`);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
