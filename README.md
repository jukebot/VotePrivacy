# VotePrivacy
Vote Privacy is a privacy centered system that utilizes identity commitment, not physical identity. During registration, a voter's eligibility (residency, registration status, "hasn't voted yet") gets hashed into a commitment that's added to a Merkle tree on the public ledger. The underlying personal data stays off-chain, and the citizen proves their address is within the required area and that they're registered to vote without disclosing personally identifiable information.
The voter's device holds the private "witness" — their secret key, their actual vote choice, proof of tree membership. Midnight's architecture keeps this separation between public on-chain state and private local state at the protocol level, so the data never leaves the user's device — only the generated proof is submitted to the chain. Midnight utilizes zk-SNARKs for the proof itself, a class of proofs designed for compact size and efficient verification, so the on-chain verifier can check "this voter is eligible and this vote is valid" without seeing any of the private inputs.

TypeScript + Compact scaffold for the Merkle-vote circuit — the
`castVote` contract that proves eligibility via an on-chain Merkle tree
without revealing which vote belongs to which vote with the relevant
Midnight SDK packages.

## What's real 

1. The `deploy.ts` CLI does not include the wallet and zk-config providers.

## Project layout

```
VotePrivacy/
├── contracts/
│   └── voting.compact          # the circuit: register + castVote
├── src/
│   ├── common-types.ts         # VoterPrivateState shape
│   ├── witnesses.ts            # witness callbacks (voterSecretKey, merklePath, voteChoice)
│   ├── merkle-path.ts          
│   ├── voting-api.ts           
│   └── deploy.ts               
├── package.json
└── tsconfig.json
```

## Setup

1. Install the Compact compiler.
2. `npm install`
3. `npm run compile` — compiles `contracts/voting.compact` into
   `contracts/managed/voting/`, which `common-types.ts` and `witnesses.ts`
   import from. Nothing else will type-check until this has run once.
4. `npm run start-proof-server` — starts the local proof server in Docker.
5. `npm run deploy` — deploys the contract, registers a voter, casts a vote,
   and prints the tally.

## The circuit

`contracts/voting.compact` keeps the tree itself on-chain
(`eligibilityTree: MerkleTree<32, Bytes<32>>`), so the contract never trusts
a client-submitted root — only a client-submitted leaf (at registration) and
a client-submitted path (at voting), both checked against whatever root the
tree already has. 

