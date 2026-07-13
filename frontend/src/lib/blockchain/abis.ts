/**
 * Human-readable ABI fragments for the MBG Chain Solidity contracts
 * (see /blockchain/contracts). These are consumed by ethers.js when a live
 * RPC + deployed addresses are configured; otherwise the app runs in
 * deterministic simulation mode.
 */
export const PERMIT_REGISTRY_ABI = [
  "event PermitIssued(bytes32 indexed entityId, string permitNo, uint8 permitType, uint64 validUntil, address issuer)",
  "event InspectionRecorded(bytes32 indexed entityId, uint16 score, string ipfsReport, address inspector)",
  "event PermitRevoked(bytes32 indexed entityId, string reason)",
  "function issuePermit(bytes32 entityId, string permitNo, uint8 permitType, uint64 validUntil) external",
  "function recordInspection(bytes32 entityId, uint16 score, string ipfsReport) external",
  "function getPermit(bytes32 entityId) external view returns (string permitNo, uint8 permitType, uint64 validUntil, bool revoked)",
  "function isValid(bytes32 entityId) external view returns (bool)",
] as const;

export const REDISTRIBUTION_LEDGER_ABI = [
  "event TransferProposed(uint256 indexed id, string fromRegion, string toRegion, string commodity, uint256 qty)",
  "event TransferConfirmed(uint256 indexed id, address confirmedBy)",
  "event TransferDelivered(uint256 indexed id, bytes32 proofHash)",
  "function proposeTransfer(string fromRegion, string toRegion, string commodity, uint256 qty) external returns (uint256)",
  "function confirmTransfer(uint256 id) external",
  "function markDelivered(uint256 id, bytes32 proofHash) external",
] as const;

export const VENDOR_CREDENTIAL_REGISTRY_ABI = [
  "event VendorRegistered(bytes32 indexed vendorId, bytes32 npwpHash, bytes32 nibHash, bool isUMKM)",
  "event CertificateAdded(bytes32 indexed vendorId, string certType, bytes32 docHash, uint64 validUntil)",
  "event BGNApprovalSet(bytes32 indexed vendorId, bool approved, address by)",
  "function registerVendor(bytes32 vendorId, bytes32 npwpHash, bytes32 nibHash, bool isUMKM) external",
  "function addCertificate(bytes32 vendorId, string certType, bytes32 docHash, uint64 validUntil) external",
  "function setBGNApproval(bytes32 vendorId, bool approved) external",
  "function isVerified(bytes32 vendorId) external view returns (bool)",
  "function verifyCertificate(bytes32 vendorId, bytes32 docHash) external view returns (bool)",
] as const;

export const PROCUREMENT_RFQ_ABI = [
  "event RFQCreated(uint256 indexed rfqId, bytes32 buyer, string commodity, uint256 qty, uint64 deadline)",
  "event QuoteSubmitted(uint256 indexed rfqId, bytes32 supplier, uint256 unitPrice, uint16 leadTimeDays)",
  "event QuoteAwarded(uint256 indexed rfqId, bytes32 supplier, uint256 unitPrice)",
  "event SupplierRated(bytes32 indexed supplier, uint8 score, string ipfsReview)",
  "function createRFQ(string commodity, uint256 qty, uint64 deadline) external returns (uint256)",
  "function submitQuote(uint256 rfqId, uint256 unitPrice, uint16 leadTimeDays) external",
  "function awardQuote(uint256 rfqId, bytes32 supplier) external",
] as const;

/** Deployed addresses per chainId (filled after `hardhat deploy`). */
export const CONTRACT_ADDRESSES: Record<number, Record<string, string>> = {
  31337: {
    permitRegistry: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    redistributionLedger: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    procurementRFQ: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    vendorCredentialRegistry: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  },
  // Polygon Amoy testnet — see blockchain/deployments/amoy.json.
  // procurementRFQ & vendorCredentialRegistry menyusul (menunggu jatah faucet).
  80002: {
    permitRegistry: "0xB6eD0Af69Cd1039e10b19504349DC1F83CB2D256",
    redistributionLedger: "0xF064c1abb40a51b45d9A3cEaF40578db2Da9F68a",
    procurementRFQ: "",
    vendorCredentialRegistry: "",
  },
};
