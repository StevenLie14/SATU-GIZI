import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.school.deleteMany({});
  await prisma.kitchen.deleteMany({});
  await prisma.user.deleteMany({ where: { role: Role.VENDOR } });

  const vendors = [
    {
      email: 'vendor1@satugizi.com',
      password: hashedPassword,
      name: 'Maju Tani',
      role: Role.VENDOR,
      businessName: 'PT Maju Tani Pangan',
      phone: '021-1234567',
      commodities: 'Beras, Sayuran Segar, Bumbu Dapur',
      latitude: -6.21,
      longitude: 106.83,
      address: 'Jl. Tebet Timur Dalam, Jakarta Selatan',
      rating: 4.8,
      description: 'Pemasok bahan pangan pokok yang berfokus pada kualitas gabah dan sayuran organik langsung dari petani binaan di Jawa Barat.',
      auditScore: 85,
      status: 'active',
    },
    {
      email: 'vendor2@satugizi.com',
      password: hashedPassword,
      name: 'Berkah Lauk',
      role: Role.VENDOR,
      businessName: 'CV Berkah Lauk',
      phone: '021-7654321',
      commodities: 'Daging Sapi, Daging Ayam, Telur',
      latitude: -6.19,
      longitude: 106.84,
      address: 'Pasar Senen Blok III, Jakarta Pusat',
      rating: 4.6,
      description: 'Spesialis penyedia protein hewani segar yang telah bersertifikasi Halal dan melalui kontrol kualitas ketat dari dinas peternakan.',
      auditScore: 92,
      status: 'active',
    },
    {
      email: 'vendor3@satugizi.com',
      password: hashedPassword,
      name: 'Tani Nusantara',
      role: Role.VENDOR,
      businessName: 'Koperasi Tani Nusantara',
      phone: '022-9998887',
      commodities: 'Buah-buahan, Sayuran Organik, Susu Sapi',
      latitude: -6.92,
      longitude: 107.6,
      address: 'Jl. Pasir Kaliki, Bandung',
      rating: 4.9,
      description: 'Koperasi petani lokal yang menyediakan produk segar pegunungan dengan sistem bagi hasil yang adil bagi komunitas petani Bandung.',
      auditScore: 78,
      status: 'active',
    },
    {
      email: 'vendor4@satugizi.com',
      password: hashedPassword,
      name: 'Sayur Segar Ciawi',
      role: Role.VENDOR,
      businessName: 'Agen Sayur Segar Ciawi',
      phone: '0251-1112223',
      commodities: 'Sayuran Segar, Kentang, Tomat',
      latitude: -6.65,
      longitude: 106.85,
      address: 'Pasar Ciawi, Bogor',
      rating: 4.7,
      description: 'Pusat distribusi sayuran segar dari kawasan Puncak Bogor, menjamin kualitas \'farm-to-table\' dengan pengiriman harian.',
      auditScore: 88,
      status: 'active',
    },
    {
      email: 'vendor5@satugizi.com',
      password: hashedPassword,
      name: 'Sembako Makmur',
      role: Role.VENDOR,
      businessName: 'Toko Sembako Makmur',
      phone: '021-3334445',
      commodities: 'Beras, Minyak Goreng, Gula',
      latitude: -6.22,
      longitude: 106.81,
      address: 'Kebayoran Baru, Jakarta Selatan',
      rating: 4.5,
      description: 'Grosir sembako terpercaya di Jakarta Selatan yang telah melayani kebutuhan pangan pokok selama lebih dari 10 tahun.',
      auditScore: 90,
      status: 'active',
    },
    {
      email: 'vendor6@satugizi.com',
      password: hashedPassword,
      name: 'Daging Halal',
      role: Role.VENDOR,
      businessName: 'Distributor Daging Sapi Halal',
      phone: '021-6667778',
      commodities: 'Daging Sapi, Tulang Sapi',
      latitude: -6.15,
      longitude: 106.9,
      address: 'Kelapa Gading, Jakarta Utara',
      rating: 4.9,
      description: 'Distributor khusus daging sapi impor dan lokal dengan fasilitas cold storage modern untuk menjaga mata rantai pendingin.',
      auditScore: 95,
      status: 'active',
    },
    {
      email: 'vendor7@satugizi.com',
      password: hashedPassword,
      name: 'Sayur Kramat Jati',
      role: Role.VENDOR,
      businessName: 'Pusat Sayur Mayur Kramat Jati',
      phone: '021-8889990',
      commodities: 'Sayuran Segar, Cabai, Bawang',
      latitude: -6.27,
      longitude: 106.87,
      address: 'Pasar Induk Kramat Jati, Jakarta Timur',
      rating: 4.8,
      description: 'Hub utama sayur mayur di Jakarta Timur, mengumpulkan hasil bumi terbaik dari berbagai wilayah di Indonesia.',
      auditScore: 82,
      status: 'active',
    },
    {
      email: 'vendor8@satugizi.com',
      password: hashedPassword,
      name: 'Telur Berkah',
      role: Role.VENDOR,
      businessName: 'Agen Telur Berkah',
      phone: '021-5556667',
      commodities: 'Telur Ayam, Telur Bebek',
      latitude: -6.2,
      longitude: 106.78,
      address: 'Palmerah, Jakarta Barat',
      rating: 4.6,
      description: 'Pemasok telur terpercaya dengan pengawasan kualitas cangkang dan kebersihan produk yang ketat.',
      auditScore: 74,
      status: 'active',
    },
  ];

  for (const v of vendors) {
    await prisma.user.create({ data: v });
  }
  console.log(`Seeded ${vendors.length} vendors.`);

  // 2. Seed Schools
  const schools = [
    {
      name: 'SDN Menteng 01',
      latitude: -6.188,
      longitude: 106.832,
      address: 'Jl. Besuki No.4, Menteng, Jakarta Pusat',
      capacity: 450,
      status: 'active',
      phone: '021-5550001',
      description: 'Sekolah Dasar Negeri percontohan di Jakarta Pusat yang mengutamakan kesehatan dan gizi siswa melalui program makanan bergizi.',
    },
    {
      name: 'SMPN 1 Jakarta',
      latitude: -6.175,
      longitude: 106.82,
      address: 'Jl. Cikini Raya No.87, Jakarta Pusat',
      capacity: 800,
      status: 'active',
      phone: '021-5550002',
      description: 'Salah satu SMP tertua di Jakarta yang memiliki standar kantin gizi seimbang untuk menunjang tumbuh kembang remaja.',
    },
  ];

  for (const s of schools) {
    await prisma.school.create({ data: s });
  }
  console.log(`Seeded ${schools.length} schools.`);

  // 3. Seed Kitchens
  const kitchens = [
    {
      name: 'Dapur Pusat Senen',
      latitude: -6.192,
      longitude: 106.845,
      address: 'Pasar Senen Lantai 4, Jakarta Pusat',
      capacity: 2000,
      status: 'active',
      rating: 4.7,
      phone: '021-7890001',
      description: 'Pusat pengolahan makanan skala besar yang melayani distribusi ke 10 sekolah di wilayah Senen dan sekitarnya dengan standar higienis tinggi.',
    },
    {
      name: 'Dapur Sehat Tebet',
      latitude: -6.225,
      longitude: 106.855,
      address: 'Jl. Tebet Barat Dalam, Jakarta Selatan',
      capacity: 1500,
      status: 'active',
      rating: 4.5,
      phone: '021-7890002',
      description: 'Dapur pengolah yang berfokus pada menu makanan bergizi seimbang dengan pengawasan ahli gizi tersertifikasi.',
    },
  ];

  for (const k of kitchens) {
    await prisma.kitchen.create({ data: k });
  }
  console.log(`Seeded ${kitchens.length} kitchens.`);

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
