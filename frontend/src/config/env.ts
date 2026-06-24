/**
 * Centralised runtime configuration.
 *
 * `OFFLINE_MODE` lets the whole app run without a backend: auth is mocked and
 * data comes from local fixtures. Set VITE_OFFLINE_MODE="false" once a backend
 * is available to switch back to live API calls.
 */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  offlineMode: (import.meta.env.VITE_OFFLINE_MODE ?? "true") !== "false",
  chainName: import.meta.env.VITE_CHAIN_NAME ?? "MBG Chain Testnet",
  chainId: Number(import.meta.env.VITE_CHAIN_ID ?? 31337),
  contractsBaseUrl: import.meta.env.VITE_CONTRACTS_URL ?? "",
} as const;
