# MBG Chain — Smart Contracts

Solidity contracts (Hardhat) that anchor the MBG Chain platform's trust layer.
Each contract maps directly to one of the three problem-definition features.

| Contract | Feature it solves |
|---|---|
| `VendorCredentialRegistry.sol` | **Perizinan & Pengawasan Vendor MBG (BGN)** — anchors NPWP/NIB hashes & certificate documents, BGN approval, and UMKM flag for tamper-proof verification. |
| `PermitRegistry.sol` | **Perizinan & Pengawasan Vendor MBG** — immutable permit issuance, certification, inspection scores & revocations with verifiable timestamps. |
| `RedistributionLedger.sol` | **Matching Demand-Supply Antarwilayah** — traceable inter-regional stock transfers (propose → confirm → deliver + proof hash). |
| `ProcurementRFQ.sol` | **B2B Matchmaking Bahan Baku** — on-chain RFQ/quote/award flow and tamper-proof supplier reputation. |
| `access/MBGRoles.sol` | Shared role-based access control (REGULATOR / INSPECTOR / OPERATOR / SUPPLIER) mirroring the app's stakeholders. |

## Quick start

```bash
cd blockchain
npm install
npm run compile          # solc 0.8.24
npm test                 # run the lifecycle tests

# local chain + deploy
npm run node             # terminal 1: hardhat node (chainId 31337)
npm run deploy:local     # terminal 2: deploys & writes deployments/localhost.json
```

Deployed addresses are written to `deployments/<network>.json`. Copy them into
`frontend/src/lib/blockchain/abis.ts` (`CONTRACT_ADDRESSES`) and set the frontend
env to go live:

```env
# frontend/.env
VITE_OFFLINE_MODE=false
VITE_CHAIN_ID=31337
VITE_CHAIN_NAME="MBG Chain Localhost"
```

When `VITE_OFFLINE_MODE=true` (default) the frontend runs a deterministic
simulation of these contracts so the whole app is explorable without a node.

## Design notes
- Custom errors (gas-efficient) instead of revert strings.
- No external dependencies in the contracts themselves — `MBGRoles` provides a
  minimal AccessControl so each contract compiles standalone.
- Off-chain artefacts (inspection reports, delivery proofs, reviews) are stored
  by IPFS CID / hash; only the hash lives on-chain.
