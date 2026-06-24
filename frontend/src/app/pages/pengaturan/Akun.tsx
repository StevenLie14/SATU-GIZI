import { useState } from "react";
import { UserCog, Save, Shield, Building2, Mail, Phone, KeyRound, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  Card,
  Button,
  Field,
  TextInput,
  Select,
  Avatar,
  Badge,
  SectionTitle,
  useToast,
  cn,
} from "../../ui";
import { useRole, ROLES, type Role } from "../../roles";

export default function Akun() {
  const { role, setRole } = useRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    nama: "Admin MBG Chain",
    email: "admin@mbgchain.id",
    telepon: "0812-0000-0000",
    organisasi: ROLES[role].label,
    jabatan: "Administrator",
    bahasa: "id",
  });
  const [pw, setPw] = useState({ lama: "", baru: "", konfirmasi: "" });

  const saveProfile = () => toast("Profil akun berhasil disimpan.");
  const changePw = () => {
    if (!pw.baru || pw.baru !== pw.konfirmasi) {
      toast("Konfirmasi kata sandi tidak cocok.", "error");
      return;
    }
    setPw({ lama: "", baru: "", konfirmasi: "" });
    toast("Kata sandi berhasil diubah.");
  };

  return (
    <div>
      <PageHeader title="Akun" subtitle="Kelola profil, organisasi, peran akses, dan keamanan akun" icon={UserCog} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="lg:col-span-1 h-fit">
          <div className="flex flex-col items-center text-center py-4">
            <div className="scale-150 mb-6"><Avatar name={profile.nama} color="brand" /></div>
            <h3 className="font-bold text-dark-900 text-lg">{profile.nama}</h3>
            <p className="text-sm text-gray-400">{profile.jabatan}</p>
            <Badge color="brand" dot>{ROLES[role].label}</Badge>
            <div className="w-full mt-6 space-y-2 text-left">
              <div className="flex items-center gap-2 text-sm text-gray-600"><Mail size={15} className="text-gray-400" /> {profile.email}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600"><Phone size={15} className="text-gray-400" /> {profile.telepon}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600"><Building2 size={15} className="text-gray-400" /> {profile.organisasi}</div>
            </div>
            <Button variant="outline" icon={LogOut} className="w-full mt-6" onClick={() => navigate("/")}>Keluar</Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {/* Profile form */}
          <Card>
            <SectionTitle>Informasi Profil</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nama Lengkap"><TextInput value={profile.nama} onChange={(v) => setProfile({ ...profile, nama: v })} /></Field>
              <Field label="Jabatan"><TextInput value={profile.jabatan} onChange={(v) => setProfile({ ...profile, jabatan: v })} /></Field>
              <Field label="Email"><TextInput value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} /></Field>
              <Field label="Telepon"><TextInput value={profile.telepon} onChange={(v) => setProfile({ ...profile, telepon: v })} /></Field>
              <Field label="Organisasi"><TextInput value={profile.organisasi} onChange={(v) => setProfile({ ...profile, organisasi: v })} /></Field>
              <Field label="Bahasa"><Select value={profile.bahasa} onChange={(v) => setProfile({ ...profile, bahasa: v })} options={[{ value: "id", label: "Bahasa Indonesia" }, { value: "en", label: "English" }]} /></Field>
            </div>
            <div className="flex justify-end mt-5"><Button icon={Save} onClick={saveProfile}>Simpan Perubahan</Button></div>
          </Card>

          {/* Role / access */}
          <Card>
            <SectionTitle>Peran & Akses</SectionTitle>
            <p className="text-sm text-gray-500 mb-4">Peran menentukan menu dan aksi yang tersedia. Ubah untuk meninjau perspektif stakeholder lain.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(ROLES) as Role[]).map((r) => {
                const R = ROLES[r];
                const RIcon = R.icon;
                return (
                  <button key={r} onClick={() => { setRole(r); toast(`Peran diubah menjadi ${R.label}.`); }} className={cn("flex items-center gap-3 p-4 rounded-xl border text-left transition-colors cursor-pointer", role === r ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:bg-gray-50")}>
                    <span className={cn("p-2.5 rounded-xl", role === r ? "bg-brand-100 text-brand-600" : "bg-gray-100 text-gray-500")}><RIcon size={18} /></span>
                    <div className="flex-1">
                      <p className="font-semibold text-dark-900 text-sm">{R.label}</p>
                      <p className="text-xs text-gray-400">{R.desc}</p>
                    </div>
                    {role === r && <Shield size={16} className="text-brand-600" />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Security */}
          <Card>
            <SectionTitle>Keamanan</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Kata Sandi Lama"><TextInput type="password" value={pw.lama} onChange={(v) => setPw({ ...pw, lama: v })} placeholder="••••••••" /></Field>
              <Field label="Kata Sandi Baru"><TextInput type="password" value={pw.baru} onChange={(v) => setPw({ ...pw, baru: v })} placeholder="••••••••" /></Field>
              <Field label="Konfirmasi"><TextInput type="password" value={pw.konfirmasi} onChange={(v) => setPw({ ...pw, konfirmasi: v })} placeholder="••••••••" /></Field>
            </div>
            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-2 text-sm text-gray-500"><Shield size={15} className="text-emerald-500" /> Autentikasi 2 faktor aktif</div>
              <Button icon={KeyRound} onClick={changePw}>Ubah Kata Sandi</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
