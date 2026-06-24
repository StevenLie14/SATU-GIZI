export type ChainStatus = "confirmed" | "pending";

export interface OnChainRecord {
  txHash: string;
  blockNumber: number;
  timestamp: string;
  contract: string;
  method: string;
  actor: string;
  status: ChainStatus;
  summary: string;
  /** arbitrary decoded event payload for display */
  data: Record<string, string | number>;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  chainName: string;
  simulated: boolean;
}

export type ContractKey = "permitRegistry" | "redistributionLedger" | "procurementRFQ";
