import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { scoreSupplierMatch } from '../common/utils/match-score';

export type AiSeverity = 'info' | 'success' | 'warning' | 'critical';
export interface AiInsight {
  id: string;
  module: string;
  title: string;
  detail: string;
  severity: AiSeverity;
  confidence: number;
  actionPath?: string;
}

const GUIDE: { keywords: string[]; answer: string }[] = [
  { keywords: ['daftar', 'mendaftar', 'registrasi', 'jadi vendor'], answer: 'Pendaftaran vendor: buat akun → lengkapi NPWP & NIB → unggah sertifikasi → ajukan verifikasi BGN. Pantau di menu Verifikasi Vendor (BGN).' },
  { keywords: ['dokumen', 'syarat', 'persyaratan'], answer: 'Dokumen wajib: NPWP, NIB/Izin Usaha (OSS), SLHS, Sertifikat Halal (BPJPH), dan HACCP/ISO 22000.' },
  { keywords: ['verifikasi', 'bgn', 'badan gizi', 'status'], answer: 'Verifikasi BGN: dokumen divalidasi (DJP, OSS, BPJPH) → skor keamanan pangan → persetujuan BGN → kredensial di-anchor ke blockchain.' },
  { keywords: ['blockchain', 'keaslian', 'sertifikat blockchain', 'on-chain'], answer: 'Sertifikat disimpan sebagai hash di blockchain (VendorCredentialRegistry) untuk menjamin keaslian & transparansi.' },
  { keywords: ['supply', 'demand', 'antarwilayah', 'redistribusi', 'surplus', 'defisit'], answer: 'Matching supply-demand antarwilayah memasangkan surplus & defisit wilayah dengan rekomendasi redistribusi otomatis.' },
  { keywords: ['b2b', 'umkm', 'produsen lokal', 'rfq', 'matchmaking'], answer: 'B2B matchmaking menghubungkan produsen lokal, UMKM & vendor MBG via RFQ dengan peringkat penawaran berbasis AI.' },
  { keywords: ['gizi', 'nutrisi', 'menu', 'akg'], answer: 'Rencana menu dianalisis AI terhadap AKG per jenjang & usia (energi, protein, lemak, karbohidrat, serat) dengan rekomendasi perbaikan.' },
];

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  /** Generate cross-domain insights from live data, ordered by relevance to role. */
  async generateInsights(role = 'pemerintah'): Promise<AiInsight[]> {
    const out: AiInsight[] = [];

    const stock = await this.prisma.stockItem.findMany({ where: { NOT: { status: 'AMAN' } } });
    stock.forEach((s, i) =>
      out.push({
        id: `stock-${i}`,
        module: 'Rantai Pasok',
        title: `Stok ${s.status.toLowerCase()}: ${s.nama}`,
        detail: `Tersisa ${s.jumlah} ${s.satuan} di ${s.gudang}. Segera buat pengadaan.`,
        severity: s.status === 'KRITIS' ? 'critical' : 'warning',
        confidence: 92,
        actionPath: '/app/rantai-pasok/procurement',
      }),
    );

    const kitchens = await this.prisma.kitchen.findMany({ include: { checklist: true } });
    kitchens.forEach((k, i) => {
      const done = k.checklist.filter((c) => c.done).length;
      const pct = k.checklist.length ? Math.round((done / k.checklist.length) * 100) : 100;
      if (k.izinStatus !== 'BERLAKU' || pct < 100) {
        out.push({
          id: `compliance-${i}`,
          module: 'Perizinan',
          title: `Kepatuhan ${k.name} perlu perhatian`,
          detail: `Status izin: ${k.izinStatus}. Checklist ${pct}%.`,
          severity: k.izinStatus === 'KADALUARSA' ? 'critical' : 'warning',
          confidence: 95,
          actionPath: '/app/manajemen-data/dapur-sppg',
        });
      }
    });

    const deficits = await this.prisma.regionBalance.findMany({ where: { surplus: { lt: 0 } } });
    const surplus = await this.prisma.regionBalance.findFirst({
      where: { surplus: { gt: 0 } },
      orderBy: { surplus: 'desc' },
    });
    if (deficits.length && surplus) {
      out.push({
        id: 'redistribute',
        module: 'Antarwilayah',
        title: `Defisit ${deficits[0].komoditas} di ${deficits[0].region}`,
        detail: `Redistribusi dari ${surplus.region} (surplus ${surplus.surplus} kg) direkomendasikan.`,
        severity: 'warning',
        confidence: 90,
        actionPath: '/app/rantai-pasok/analitik',
      });
    }

    const complaints = await this.prisma.review.count({ where: { tag: 'Keluhan' } });
    out.push(
      complaints
        ? {
            id: 'sentiment',
            module: 'Kualitas',
            title: `${complaints} keluhan terdeteksi dari ulasan`,
            detail: 'Analisis sentimen menyarankan tindak lanjut QC.',
            severity: 'warning',
            confidence: 79,
            actionPath: '/app/laporan/ulasan',
          }
        : {
            id: 'sentiment-ok',
            module: 'Kualitas',
            title: 'Sentimen ulasan positif',
            detail: 'Tidak ada keluhan signifikan; kepuasan stabil di atas target.',
            severity: 'success',
            confidence: 86,
          },
    );

    const priority: Record<string, string> = {
      pemerintah: 'Perizinan',
      sppg: 'Rantai Pasok',
      mitra: 'Antarwilayah',
      sekolah: 'Kualitas',
    };
    const sev = { critical: 0, warning: 1, info: 2, success: 3 };
    return out.sort((a, b) => {
      const ap = a.module === priority[role] ? -1 : 0;
      const bp = b.module === priority[role] ? -1 : 0;
      return ap !== bp ? ap - bp : sev[a.severity] - sev[b.severity];
    });
  }

  async summary(role = 'pemerintah') {
    const insights = await this.generateInsights(role);
    const crit = insights.filter((i) => i.severity === 'critical').length;
    const warn = insights.filter((i) => i.severity === 'warning').length;
    const text = crit
      ? `${crit} isu kritis & ${warn} peringatan memerlukan tindakan.`
      : warn
        ? `${warn} peringatan terpantau; operasional sehat dengan peluang optimasi.`
        : 'Seluruh indikator dalam kondisi baik.';
    return { summary: text, critical: crit, warning: warn, total: insights.length };
  }

  /** Procedure-guidance assistant (keyword matcher, offline). */
  ask(question: string) {
    const q = (question ?? '').toLowerCase();
    let best: { answer: string; score: number } | null = null;
    for (const e of GUIDE) {
      const score = e.keywords.reduce((acc, k) => (q.includes(k) ? acc + k.length : acc), 0);
      if (score > 0 && (!best || score > best.score)) best = { answer: e.answer, score };
    }
    return {
      answer:
        best?.answer ??
        'Saya memandu prosedur perizinan vendor, verifikasi BGN, sertifikat blockchain, matching supply-demand & B2B, serta analisis gizi AI. Silakan tanyakan salah satu topik tersebut.',
    };
  }

  /** AI supplier matching for a commodity. */
  async supplierMatch(komoditas: string) {
    const suppliers = await this.prisma.supplier.findMany({ where: { komoditas: { has: komoditas } } });
    return suppliers
      .map((s) => {
        const { score, reasons } = scoreSupplierMatch({
          priceIndex: s.hargaIndex,
          distanceKm: 20,
          rating: s.rating,
          leadTimeDays: parseInt(s.leadTime ?? '1', 10) || 1,
        });
        return { supplier: s.nama, lokasi: s.lokasi, skor: score, alasan: reasons.join(' · ') };
      })
      .sort((a, b) => b.skor - a.skor);
  }
}
