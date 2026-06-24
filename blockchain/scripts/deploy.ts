import { ethers, network } from "hardhat";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Deploys the three MBG Chain contracts and writes their addresses to
 * deployments/<network>.json so the frontend (src/lib/blockchain/abis.ts)
 * can be pointed at them.
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with: ${deployer.address} on ${network.name}`);

  const permitRegistry = await (await ethers.getContractFactory("PermitRegistry")).deploy();
  await permitRegistry.waitForDeployment();

  const redistributionLedger = await (await ethers.getContractFactory("RedistributionLedger")).deploy();
  await redistributionLedger.waitForDeployment();

  const procurementRFQ = await (await ethers.getContractFactory("ProcurementRFQ")).deploy();
  await procurementRFQ.waitForDeployment();

  const vendorCredentialRegistry = await (await ethers.getContractFactory("VendorCredentialRegistry")).deploy();
  await vendorCredentialRegistry.waitForDeployment();

  const addresses = {
    network: network.name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    permitRegistry: await permitRegistry.getAddress(),
    redistributionLedger: await redistributionLedger.getAddress(),
    procurementRFQ: await procurementRFQ.getAddress(),
    vendorCredentialRegistry: await vendorCredentialRegistry.getAddress(),
  };

  console.log("Deployed addresses:\n", addresses);

  const dir = join(__dirname, "..", "deployments");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${network.name}.json`), JSON.stringify(addresses, null, 2));
  console.log(`Saved → deployments/${network.name}.json`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
