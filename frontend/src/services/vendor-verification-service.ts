import { env } from "@/config/env";
import { vendorVerifications as mockData } from "@/mocks/vendor-verification";
import type { VendorVerification, VerifStatus } from "@/mocks/vendor-verification";
import { getSessionToken } from "@/lib/session";

const getHeaders = () => {
  const token = getSessionToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

function mapBackendToUi(v: any): VendorVerification {
  let uiStatus: VerifStatus = "Proses";
  if (v.status === "TERVERIFIKASI" || v.status === "Terverifikasi") uiStatus = "Terverifikasi";
  else if (v.status === "DOKUMEN_KURANG" || v.status === "Dokumen Kurang") uiStatus = "Dokumen Kurang";
  else if (v.status === "DITOLAK" || v.status === "Ditolak") uiStatus = "Ditolak";

  return {
    id: v.id,
    nama: v.nama,
    jenisUsaha: v.jenisUsaha,
    lokasi: v.lokasi,
    pic: v.pic || "",
    kontak: v.kontak || "",
    npwp: v.npwp,
    nib: v.nib,
    isUMKM: !!v.isUMKM,
    bgnApproved: !!v.bgnApproved,
    status: uiStatus,
    foodSafetyScore: v.foodSafetyScore ?? 0,
    certificates: (v.certificates || []).map((c: any) => ({
      type: c.type,
      nomor: c.nomor || "",
      validUntil: c.validUntil || "",
      status: c.status || "Proses",
      docHash: c.docHash || undefined,
    })),
    compliance: (v.compliance || []).map((c: any) => ({
      label: c.label,
      done: !!c.done,
    })),
  };
}

export async function getVendors(): Promise<VendorVerification[]> {
  if (!env.offlineMode) {
    try {
      const res = await fetch(`${env.apiUrl}/api/vendor-verification`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        return list.map(mapBackendToUi);
      }
    } catch (err) {
      console.error("Failed to fetch vendors", err);
    }
  }
  return mockData;
}

export async function getVendor(id: string): Promise<VendorVerification | null> {
  if (!env.offlineMode) {
    try {
      const res = await fetch(`${env.apiUrl}/api/vendor-verification/${id}`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return mapBackendToUi(data);
      }
    } catch (err) {
      console.error("Failed to fetch vendor", err);
    }
  }
  return mockData.find((v) => v.id === id) || null;
}

export async function approveVendor(id: string): Promise<VendorVerification> {
  if (!env.offlineMode) {
    const res = await fetch(`${env.apiUrl}/api/vendor-verification/${id}/approve`, {
      method: "PATCH",
      headers: getHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      return mapBackendToUi(data);
    } else {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to approve vendor");
    }
  }
  const found = mockData.find((v) => v.id === id);
  if (!found) throw new Error("Vendor not found");
  found.bgnApproved = true;
  found.status = "Terverifikasi";
  return found;
}

export async function addCertificate(
  id: string,
  cert: { type: string; nomor: string; validUntil: string; status: string }
): Promise<any> {
  if (!env.offlineMode) {
    const res = await fetch(`${env.apiUrl}/api/vendor-verification/${id}/certificates`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(cert),
    });
    if (res.ok) {
      return await res.json();
    } else {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to add certificate");
    }
  }
  return { ...cert, docHash: "0x" + Math.random().toString(16).slice(2, 18) };
}
