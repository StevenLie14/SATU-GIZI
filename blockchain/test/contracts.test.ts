import { expect } from "chai";
import { ethers } from "hardhat";

const id = (s: string) => ethers.keccak256(ethers.toUtf8Bytes(s));

describe("PermitRegistry", () => {
  it("issues a valid permit and records inspection", async () => {
    const reg = await (await ethers.getContractFactory("PermitRegistry")).deploy();
    const entity = id("SPPG-SENEN");
    const validUntil = (await time()) + 86_400 * 365;

    await reg.issuePermit(entity, "SLHS/2026/JKT/0112", 0, validUntil);
    expect(await reg.isValid(entity)).to.equal(true);

    await reg.recordInspection(entity, 92, "ipfs://report1");
    expect(await reg.inspectionCount(entity)).to.equal(1n);

    await reg.revokePermit(entity, "failed re-audit");
    expect(await reg.isValid(entity)).to.equal(false);
  });
});

describe("RedistributionLedger", () => {
  it("runs the propose → confirm → deliver lifecycle", async () => {
    const led = await (await ethers.getContractFactory("RedistributionLedger")).deploy();
    await led.proposeTransfer("Bandung", "Jakarta Selatan", "Sayuran", 2500);
    await led.confirmTransfer(0);
    await led.markDelivered(0, id("proof-doc"));
    const t = await led.getTransfer(0);
    expect(t.status).to.equal(2); // Delivered
  });
});

describe("ProcurementRFQ", () => {
  it("matches quotes, awards and aggregates reputation", async () => {
    const rfq = await (await ethers.getContractFactory("ProcurementRFQ")).deploy();
    const buyer = id("SPPG-SENEN");
    const supA = id("CV Berkah Lauk");
    await rfq.createRFQ(buyer, "Daging Ayam", 500, 0);
    await rfq.submitQuote(0, supA, 38000, 1);
    await rfq.awardQuote(0, supA);
    await rfq.rateSupplier(supA, 5, "ipfs://review");
    expect(await rfq.averageRating(supA)).to.equal(500n); // 5.00 * 100
    const r = await rfq.getRFQ(0);
    expect(r.status).to.equal(1); // Awarded
  });
});

async function time(): Promise<number> {
  const block = await ethers.provider.getBlock("latest");
  return block!.timestamp;
}
