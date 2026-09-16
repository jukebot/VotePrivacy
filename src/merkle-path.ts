import type { Ledger } from '../contracts/managed/voting/contract/index.js';

export function fetchMerklePathForLeaf(ledger: Ledger, leafIndex: number): unknown {
  return ledger.eligibilityTree.findPathForLeaf(leafIndex);
}


