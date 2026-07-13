import { expect } from "chai";
import { ethers } from "hardhat";

const id = (s: string) => ethers.keccak256(ethers.toUtf8Bytes(s));

describe("PermitRegistry", () => {
  it("issues a valid permit and records inspection", async () => {
    const reg = await (await ethers.getContractFactory("PermitRegistry")).deploy();
    await reg.waitForDeployment();
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
    await led.waitForDeployment();
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
    await rfq.waitForDeployment();
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

describe("VendorCredentialRegistry", () => {
  it("manages vendor credentials, certificates, and BGN approval under role control", async () => {
    const [admin, supplier, inspector, regulator, unauthorized] = await ethers.getSigners();

    const reg = await (await ethers.getContractFactory("VendorCredentialRegistry")).deploy();
    await reg.waitForDeployment();

    // Grant roles to specific signers
    await reg.grantRole(await reg.SUPPLIER(), supplier.address);
    await reg.grantRole(await reg.INSPECTOR(), inspector.address);
    await reg.grantRole(await reg.REGULATOR(), regulator.address);

    const vendorId = id("VENDOR-1");
    const npwpHash = id("NPWP-12345");
    const nibHash = id("NIB-67890");

    // 1. registerVendor (requires SUPPLIER role)
    await expect(
      reg.connect(unauthorized).registerVendor(vendorId, npwpHash, nibHash, true)
    ).to.be.revertedWithCustomError(reg, "MissingRole");

    await reg.connect(supplier).registerVendor(vendorId, npwpHash, nibHash, true);
    const v = await reg.getVendor(vendorId);
    expect(v.isUMKM).to.equal(true);
    expect(v.bgnApproved).to.equal(false);

    // 2. setBGNApproval (requires REGULATOR role)
    await expect(
      reg.connect(unauthorized).setBGNApproval(vendorId, true)
    ).to.be.revertedWithCustomError(reg, "MissingRole");

    await reg.connect(regulator).setBGNApproval(vendorId, true);
    const vApproved = await reg.getVendor(vendorId);
    expect(vApproved.bgnApproved).to.equal(true);

    // 3. addCertificate (requires INSPECTOR role)
    const docHash = id("CERT-DOC-1");
    const validUntil = (await time()) + 86_400 * 30; // 30 days valid

    await expect(
      reg.connect(unauthorized).addCertificate(vendorId, "HALAL", docHash, validUntil)
    ).to.be.revertedWithCustomError(reg, "MissingRole");

    await reg.connect(inspector).addCertificate(vendorId, "HALAL", docHash, validUntil);
    expect(await reg.certificateCount(vendorId)).to.equal(1n);
    const cert = await reg.getCertificate(vendorId, 0);
    expect(cert.certType).to.equal("HALAL");
    expect(cert.docHash).to.equal(docHash);
  });
});

async function time(): Promise<number> {
  const block = await ethers.provider.getBlock("latest");
  return block!.timestamp;
}

