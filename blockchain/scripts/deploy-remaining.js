// Resumes the Amoy deployment: deploys only contracts whose address is still
// empty in deployments/amoy.json, using a gas price near the network minimum.
require("dotenv").config();
const { JsonRpcProvider, Wallet, ContractFactory, formatEther, parseUnits } = require("ethers");
const { readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const FILE = join(__dirname, "..", "deployments", "amoy.json");
const NAMES = {
  permitRegistry: "PermitRegistry",
  redistributionLedger: "RedistributionLedger",
  procurementRFQ: "ProcurementRFQ",
  vendorCredentialRegistry: "VendorCredentialRegistry",
};

(async () => {
  const provider = new JsonRpcProvider(process.env.AMOY_RPC_URL ?? "https://rpc-amoy.polygon.technology");
  const wallet = new Wallet(process.env.DEPLOYER_KEY, provider);
  const state = JSON.parse(readFileSync(FILE, "utf8"));
  console.log(`Deployer ${wallet.address}, balance ${formatEther(await provider.getBalance(wallet.address))} POL`);

  const overrides = {
    maxFeePerGas: parseUnits("26", "gwei"),
    maxPriorityFeePerGas: parseUnits("25.1", "gwei"),
  };

  for (const [key, name] of Object.entries(NAMES)) {
    if (state[key]) {
      console.log(`skip ${name} (already at ${state[key]})`);
      continue;
    }
    const art = require(`../artifacts/contracts/${name}.sol/${name}.json`);
    const factory = new ContractFactory(art.abi, art.bytecode, wallet);
    const contract = await factory.deploy(overrides);
    await contract.waitForDeployment();
    state[key] = await contract.getAddress();
    writeFileSync(FILE, JSON.stringify(state, null, 2));
    console.log(`deployed ${name} -> ${state[key]}`);
  }
  console.log("All contracts deployed:\n", JSON.stringify(state, null, 2));
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
