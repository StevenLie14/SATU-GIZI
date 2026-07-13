// Polls the deployer address on Amoy until it has a balance, then exits 0.
// Used once during first deployment; safe to delete afterwards.
require("dotenv").config();
const { JsonRpcProvider, Wallet, formatEther } = require("ethers");

const provider = new JsonRpcProvider(process.env.AMOY_RPC_URL ?? "https://rpc-amoy.polygon.technology");
const address = new Wallet(process.env.DEPLOYER_KEY).address;
const deadline = Date.now() + 30 * 60 * 1000;
// Minimum balance (in POL) before we consider the wallet funded; default any nonzero.
const minPol = parseFloat(process.argv[2] ?? "0");

(async function poll() {
  const { parseEther } = require("ethers");
  const threshold = minPol > 0 ? parseEther(String(minPol)) : 0n;
  while (Date.now() < deadline) {
    try {
      const bal = await provider.getBalance(address);
      if (bal > threshold) {
        console.log(`FUNDED: ${formatEther(bal)} POL at ${address}`);
        process.exit(0);
      }
      console.log(`waiting... balance 0 at ${address}`);
    } catch (e) {
      console.log(`rpc error: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 20000));
  }
  console.error("TIMEOUT: no funds after 30 minutes");
  process.exit(1);
})();
