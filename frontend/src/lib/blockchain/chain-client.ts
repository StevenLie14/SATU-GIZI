import { env } from "@/config/env";
import { kitchens, suppliers, redistRecommendations, purchaseOrders } from "@/mocks/mbg-data";
import { vendorVerifications } from "@/mocks/vendor-verification";
import type { OnChainRecord, WalletState } from "./types";

/* ------------------------------------------------------------------ */
/* Deterministic pseudo hash (FNV-1a → 32-byte hex)                    */
/* ------------------------------------------------------------------ */
function pseudoHash(seed: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  let hex = "";
  let x = h >>> 0;
  for (let i = 0; i < 64; i++) {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    x >>>= 0;
    hex += (x & 0xf).toString(16);
  }
  return "0x" + hex.slice(0, 64);
}

export function bytes32Id(label: string): string {
  return pseudoHash("id:" + label).slice(0, 18) + "…";
}

const BASE_BLOCK = 19_482_000;

/* ------------------------------------------------------------------ */
/* Wallet                                                              */
/* ------------------------------------------------------------------ */
export async function connectWallet(): Promise<WalletState> {
  const eth = (window as unknown as { ethereum?: { request: (a: { method: string }) => Promise<string[]> } }).ethereum;
  if (eth?.request) {
    try {
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      if (accounts?.length) {
        return { connected: true, address: accounts[0], chainName: env.chainName, simulated: false };
      }
    } catch {
      /* user rejected — fall back to simulation */
    }
  }
  // Simulated wallet so the demo always works without MetaMask.
  return {
    connected: true,
    address: "0x" + pseudoHash("wallet:demo").slice(2, 42),
    chainName: env.chainName + " (Simulasi)",
    simulated: true,
  };
}

/* ------------------------------------------------------------------ */
/* Read on-chain audit trail (simulated from domain data)              */
/* ------------------------------------------------------------------ */
export function getAuditTrail(): OnChainRecord[] {
  const records: OnChainRecord[] = [];
  let block = BASE_BLOCK;
  const ts = (offset: number) =>
    new Date(Date.now() - offset * 3600_000).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Permit registry events
  kitchens.forEach((k, i) => {
    records.push({
      txHash: pseudoHash("permit:" + k.id),
      blockNumber: block++,
      timestamp: ts(i * 5 + 2),
      contract: "PermitRegistry",
      method: k.izinStatus === "Berlaku" ? "issuePermit" : "recordInspection",
      actor: "Dinas Kesehatan",
      status: "confirmed",
      summary: `${k.izinStatus === "Berlaku" ? "Izin diterbitkan" : "Inspeksi tercatat"} untuk ${k.nama}`,
      data: {
        entityId: bytes32Id(k.id),
        permitNo: k.izinNomor,
        skor: k.skorPengawasan,
        status: k.izinStatus,
      },
    });
  });

  // Redistribution ledger events
  redistRecommendations.forEach((r, i) => {
    records.push({
      txHash: pseudoHash("redis:" + r.from + r.to + i),
      blockNumber: block++,
      timestamp: ts(i * 4 + 1),
      contract: "RedistributionLedger",
      method: "proposeTransfer",
      actor: "Koordinator Wilayah",
      status: i === 0 ? "confirmed" : "pending",
      summary: `Transfer ${r.komoditas} ${r.from} → ${r.to}`,
      data: { jumlah: `${r.jumlah} ${r.satuan}`, jarak: r.jarak, hemat: r.hemat },
    });
  });

  // Vendor credential / certificate anchoring events
  vendorVerifications.filter((v) => v.bgnApproved).forEach((v, i) => {
    records.push({
      txHash: pseudoHash("cred:" + v.id),
      blockNumber: block++,
      timestamp: ts(i * 6 + 3),
      contract: "VendorCredentialRegistry",
      method: "setBGNApproval",
      actor: "Badan Gizi Nasional",
      status: "confirmed",
      summary: `Vendor terverifikasi BGN: ${v.nama}`,
      data: { npwp: v.npwp, nib: v.nib, sertifikat: v.certificates.length, umkm: v.isUMKM ? "Ya" : "Tidak" },
    });
  });

  // Procurement RFQ / PO events
  purchaseOrders.slice(0, 3).forEach((po, i) => {
    records.push({
      txHash: pseudoHash("po:" + po.id),
      blockNumber: block++,
      timestamp: ts(i * 3),
      contract: "ProcurementRFQ",
      method: po.status === "Diterima" ? "awardQuote" : "submitQuote",
      actor: po.supplier,
      status: po.status === "Draft" ? "pending" : "confirmed",
      summary: `${po.kode} — ${po.komoditas} (${po.qty} ${po.satuan})`,
      data: { supplier: po.supplier, nilai: po.nilai, status: po.status },
    });
  });

  return records.sort((a, b) => b.blockNumber - a.blockNumber);
}

/** Verify a document/record hash exists on-chain (always true in simulation). */
export function verifyHash(seed: string): { verified: boolean; txHash: string; block: number } {
  return { verified: true, txHash: pseudoHash("doc:" + seed), block: BASE_BLOCK + (seed.length % 500) };
}

/** Anchor a new record on-chain (simulated write). */
export function anchorRecord(contract: string, method: string, summary: string): OnChainRecord {
  return {
    txHash: pseudoHash(contract + method + summary + Date.now()),
    blockNumber: BASE_BLOCK + 900 + Math.floor(Math.random() * 50),
    timestamp: new Date().toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
    contract,
    method,
    actor: "Anda",
    status: "confirmed",
    summary,
    data: {},
  };
}

/** Supplier reputation aggregated from on-chain ratings (simulated). */
export function getSupplierReputation() {
  return suppliers.map((s) => ({
    supplier: s.nama,
    onChainRating: s.rating,
    fulfilledOrders: 40 + (s.nama.length % 30),
    txHash: pseudoHash("rep:" + s.id),
  }));
}
