import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquarePlus, Smile, Soup, Sparkles, ThumbsUp } from "lucide-react";
import {
  PageHeader,
  Card,
  Badge,
  Button,
  Tabs,
  Modal,
  Field,
  TextInput,
  TextArea,
  Select,
  SectionTitle,
  Progress,
  useToast,
} from "@/components/ui";
import { useRole } from "@/context/role-context";
import { reviews as seed, type Review } from "@/mocks/mbg-data";
import { createReview, getReviews } from "@/services/reviews-service";

function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={i < n ? "fill-current" : "text-gray-200"} />
      ))}
    </div>
  );
}

export default function Ulasan() {
  const { role } = useRole();
  const { toast } = useToast();
  const [list, setList] = useState<Review[]>(seed);
  useEffect(() => {
    getReviews().then((rows) => rows.length && setList(rows));
  }, []);
  const [tab, setTab] = useState("all");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ sekolah: "", penilai: "", rating: "5", komentar: "" });

  const avg = (list.reduce((a, r) => a + r.rating, 0) / list.length).toFixed(1);
  const dims = [
    { label: "Rasa", icon: Soup, value: (list.reduce((a, r) => a + r.rasa, 0) / list.length) },
    { label: "Porsi", icon: ThumbsUp, value: (list.reduce((a, r) => a + r.porsi, 0) / list.length) },
    { label: "Kebersihan", icon: Sparkles, value: (list.reduce((a, r) => a + r.kebersihan, 0) / list.length) },
  ];
  const dist = [5, 4, 3, 2, 1].map((s) => ({ s, count: list.filter((r) => r.rating === s).length }));

  const filtered = list.filter((r) => tab === "all" || r.tag.toLowerCase() === tab);

  const save = () => {
    if (!form.sekolah || !form.komentar) {
      toast("Sekolah dan komentar wajib diisi.", "error");
      return;
    }
    const rating = +form.rating;
    const review: Review = {
      id: `r${Date.now()}`,
      sekolah: form.sekolah,
      penilai: form.penilai || "Anonim",
      rating,
      rasa: rating,
      porsi: rating,
      kebersihan: rating,
      komentar: form.komentar,
      tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      tag: rating >= 4 ? "Positif" : rating === 3 ? "Netral" : "Keluhan",
    };
    const { id: localId, ...payload } = review;
    createReview(payload).then((saved) => {
      if (saved) setList((prev) => prev.map((x) => (x.id === localId ? { ...x, id: saved.id } : x)));
    });
    setList((prev) => [review, ...prev]);
    setAdding(false);
    setForm({ sekolah: "", penilai: "", rating: "5", komentar: "" });
    toast("Ulasan terkirim. Terima kasih atas masukannya!");
  };

  return (
    <div>
      <PageHeader
        title="Ulasan"
        subtitle="Umpan balik kualitas makanan & layanan dari sekolah penerima manfaat"
        icon={Star}
        actions={(role === "sekolah" || role === "pemerintah") && <Button icon={MessageSquarePlus} onClick={() => setAdding(true)}>Tulis Ulasan</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <SectionTitle>Rating Keseluruhan</SectionTitle>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-5xl font-bold text-dark-900">{avg}</p>
              <Stars n={Math.round(+avg)} size={16} />
              <p className="text-xs text-gray-400 mt-1">{list.length} ulasan</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {dist.map((d) => (
                <div key={d.s} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-3">{d.s}</span>
                  <Star size={11} className="text-amber-400 fill-current" />
                  <div className="flex-1"><Progress value={list.length ? (d.count / list.length) * 100 : 0} color="amber" /></div>
                  <span className="text-xs text-gray-400 w-5 text-right">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {dims.map((d) => (
          <Card key={d.label} className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <span className="p-2.5 bg-brand-50 text-brand-600 rounded-xl"><d.icon size={20} /></span>
              <span className="font-semibold text-gray-600">{d.label}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-dark-900">{d.value.toFixed(1)}</span>
              <Stars n={Math.round(d.value)} />
            </div>
            <Progress value={(d.value / 5) * 100} color="brand" />
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-5">
        <Tabs
          tabs={[
            { id: "all", label: "Semua", count: list.length },
            { id: "positif", label: "Positif", count: list.filter((r) => r.tag === "Positif").length },
            { id: "netral", label: "Netral", count: list.filter((r) => r.tag === "Netral").length },
            { id: "keluhan", label: "Keluhan", count: list.filter((r) => r.tag === "Keluhan").length },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="h-full">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-dark-900">{r.sekolah}</h3>
                  <p className="text-xs text-gray-400">{r.penilai} · {r.tanggal}</p>
                </div>
                <Badge color={r.tag === "Positif" ? "green" : r.tag === "Keluhan" ? "red" : "gray"}>{r.tag}</Badge>
              </div>
              <Stars n={r.rating} size={16} />
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">"{r.komentar}"</p>
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-50">
                {[{ l: "Rasa", v: r.rasa }, { l: "Porsi", v: r.porsi }, { l: "Bersih", v: r.kebersihan }].map((x) => (
                  <div key={x.l} className="text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">{x.l}</p>
                    <p className="text-sm font-bold text-dark-900 flex items-center justify-center gap-0.5">{x.v} <Star size={11} className="text-amber-400 fill-current" /></p>
                  </div>
                ))}
              </div>
              {role !== "sekolah" && (
                <Button size="sm" variant="ghost" className="mt-3 w-full" icon={Smile} onClick={() => toast(`Balasan ke ${r.sekolah} terkirim.`)}>Tanggapi</Button>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Tulis Ulasan"
        subtitle="Bagikan penilaian Anda terhadap layanan MBG hari ini"
        footer={<><Button variant="outline" onClick={() => setAdding(false)}>Batal</Button><Button onClick={save}>Kirim Ulasan</Button></>}
      >
        <div className="space-y-4">
          <Field label="Sekolah" required><TextInput value={form.sekolah} onChange={(v) => setForm({ ...form, sekolah: v })} placeholder="cth. SDN Menteng 01" /></Field>
          <Field label="Nama Penilai"><TextInput value={form.penilai} onChange={(v) => setForm({ ...form, penilai: v })} placeholder="cth. Ibu Ratna (Guru)" /></Field>
          <Field label="Rating">
            <Select value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} Bintang` }))} />
          </Field>
          <Field label="Komentar" required><TextArea value={form.komentar} onChange={(v) => setForm({ ...form, komentar: v })} placeholder="Bagaimana rasa, porsi, dan kebersihan makanan hari ini?" rows={4} /></Field>
        </div>
      </Modal>
    </div>
  );
}
