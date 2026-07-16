// Data lokasi nyata dari OpenStreetMap (Overpass API, diambil Jul 2026).
// Sumber: https://www.openstreetmap.org — lisensi ODbL.
// Digenerate oleh script scratchpad (fetch-osm.js + gen-seed-data.js); jangan edit manual.

export interface RealSchool {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  jenjang: string;
  students: number;
  capacity: number;
  /** dapur dalam radius aturan; null = di luar radius semua dapur */
  kitchen: 'senen' | 'tebet' | null;
}

export interface RealSupplier {
  nama: string;
  komoditas: string[];
  lokasi: string;
  latitude: number;
  longitude: number;
  hargaIndex: number;
  leadTime: string;
  rating: number;
}

export const REAL_SCHOOLS: RealSchool[] = [
  {
    name: "SMP Negeri 115 Jakarta",
    latitude: -6.225146,
    longitude: 106.854271,
    address: "Jakarta Selatan",
    jenjang: "SMP",
    students: 210,
    capacity: 210,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri 07",
    latitude: -6.225085,
    longitude: 106.853402,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 640,
    capacity: 640,
    kitchen: "tebet"
  },
  {
    name: "SD YBPK",
    latitude: -6.193501,
    longitude: 106.842795,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 410,
    capacity: 410,
    kitchen: "senen"
  },
  {
    name: "SD Negeri 01 Cikini",
    latitude: -6.194021,
    longitude: 106.842251,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 450,
    capacity: 450,
    kitchen: "senen"
  },
  {
    name: "SMK Negeri 34 Jakarta",
    latitude: -6.190202,
    longitude: 106.847946,
    address: "Jakarta Pusat",
    jenjang: "SMA",
    students: 640,
    capacity: 640,
    kitchen: "senen"
  },
  {
    name: "SD Negeri Manggarai Selatan 03 Pagi",
    latitude: -6.223064,
    longitude: 106.851981,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 400,
    capacity: 400,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri 02,03 dan 04 Cikini",
    latitude: -6.194422,
    longitude: 106.842286,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 460,
    capacity: 460,
    kitchen: "senen"
  },
  {
    name: "Komplek SD Negeri Bukit Duri 01,09,10,11",
    latitude: -6.222557,
    longitude: 106.858593,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 310,
    capacity: 310,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri 015",
    latitude: -6.228384,
    longitude: 106.858017,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 430,
    capacity: 430,
    kitchen: "tebet"
  },
  {
    name: "SMA-SMK 17 Agustus 1945",
    latitude: -6.224682,
    longitude: 106.850342,
    address: "Jakarta Selatan",
    jenjang: "SMA",
    students: 330,
    capacity: 330,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Bukit Duri 05 dan 07 Pagi",
    latitude: -6.220385,
    longitude: 106.853959,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 370,
    capacity: 370,
    kitchen: "tebet"
  },
  {
    name: "SMK As Syafi'iyah",
    latitude: -6.220396,
    longitude: 106.853436,
    address: "Jakarta Selatan",
    jenjang: "SMA",
    students: 460,
    capacity: 460,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Kramat 08/09",
    latitude: -6.187656,
    longitude: 106.847226,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 180,
    capacity: 180,
    kitchen: "senen"
  },
  {
    name: "SD Negeri Tebet Barat 05 Pagi",
    latitude: -6.224742,
    longitude: 106.849872,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 220,
    capacity: 220,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Bukit Duri 03 dan 04 Pagi",
    latitude: -6.219899,
    longitude: 106.853774,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 160,
    capacity: 160,
    kitchen: "tebet"
  },
  {
    name: "SMP Negeri 1 Jakarta",
    latitude: -6.192567,
    longitude: 106.839463,
    address: "Jakarta Pusat",
    jenjang: "SMP",
    students: 280,
    capacity: 280,
    kitchen: "senen"
  },
  {
    name: "SD Negeri 01/02",
    latitude: -6.194902,
    longitude: 106.840196,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 420,
    capacity: 420,
    kitchen: "senen"
  },
  {
    name: "SDS Trisula Perwari I",
    latitude: -6.19331,
    longitude: 106.850491,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 470,
    capacity: 470,
    kitchen: "senen"
  },
  {
    name: "SD-SMP-SMA As Syafi'iyah 01",
    latitude: -6.220534,
    longitude: 106.851022,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 450,
    capacity: 450,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Kebon Baru 5 Pagi / 6 Petang",
    latitude: -6.228012,
    longitude: 106.860359,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 610,
    capacity: 610,
    kitchen: "tebet"
  },
  {
    name: "SD Muhammadiyah 16",
    latitude: -6.220696,
    longitude: 106.859405,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 240,
    capacity: 240,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Pegangsaan 01",
    latitude: -6.197816,
    longitude: 106.842297,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 370,
    capacity: 370,
    kitchen: "senen"
  },
  {
    name: "SMA 1 PSKD",
    latitude: -6.197718,
    longitude: 106.848056,
    address: "Jakarta Pusat",
    jenjang: "SMA",
    students: 630,
    capacity: 630,
    kitchen: "senen"
  },
  {
    name: "SMPK Penabur",
    latitude: -6.19803,
    longitude: 106.847489,
    address: "Jakarta Pusat",
    jenjang: "SMP",
    students: 470,
    capacity: 470,
    kitchen: "senen"
  },
  {
    name: "SMK Negeri 32 Jakarta",
    latitude: -6.229104,
    longitude: 106.849647,
    address: "Jakarta Selatan",
    jenjang: "SMA",
    students: 520,
    capacity: 520,
    kitchen: "tebet"
  },
  {
    name: "SMK Krisanti",
    latitude: -6.223548,
    longitude: 106.862147,
    address: "Jakarta Selatan",
    jenjang: "SMA",
    students: 340,
    capacity: 340,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Kwitang 01/02",
    latitude: -6.185018,
    longitude: 106.842999,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 300,
    capacity: 300,
    kitchen: "senen"
  },
  {
    name: "SD Negeri 03/04 Gondangdia",
    latitude: -6.195541,
    longitude: 106.838514,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 290,
    capacity: 290,
    kitchen: "senen"
  },
  {
    name: "SD Negeri Gondangdia 05 Pagi",
    latitude: -6.195216,
    longitude: 106.838338,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 370,
    capacity: 370,
    kitchen: "senen"
  },
  {
    name: "SMP Negeri 33 Jakarta",
    latitude: -6.218117,
    longitude: 106.851573,
    address: "Jakarta Pusat",
    jenjang: "SMP",
    students: 580,
    capacity: 580,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Kebon Baru 7 Pagi",
    latitude: -6.231843,
    longitude: 106.858805,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 430,
    capacity: 430,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Kebon Baru 10 Pagi",
    latitude: -6.231828,
    longitude: 106.85902,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 490,
    capacity: 490,
    kitchen: "tebet"
  },
  {
    name: "SD Muhammadiyah 52",
    latitude: -6.222901,
    longitude: 106.862684,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 600,
    capacity: 600,
    kitchen: "tebet"
  },
  {
    name: "SMP Muhammadiyah 16",
    latitude: -6.187998,
    longitude: 106.851898,
    address: "Jakarta Pusat",
    jenjang: "SMP",
    students: 540,
    capacity: 540,
    kitchen: "senen"
  },
  {
    name: "SMK Muhammadiyah 10",
    latitude: -6.188076,
    longitude: 106.851963,
    address: "Jakarta Pusat",
    jenjang: "SMA",
    students: 530,
    capacity: 530,
    kitchen: "senen"
  },
  {
    name: "SD Negeri Paseban 01, 02, dan 03",
    latitude: -6.189158,
    longitude: 106.852548,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 190,
    capacity: 190,
    kitchen: "senen"
  },
  {
    name: "SD Negeri Paseban 05",
    latitude: -6.189378,
    longitude: 106.852663,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 200,
    capacity: 200,
    kitchen: "senen"
  },
  {
    name: "SMA Negeri 68 Jakarta",
    latitude: -6.197718,
    longitude: 106.850834,
    address: "Jakarta Pusat",
    jenjang: "SMA",
    students: 620,
    capacity: 620,
    kitchen: "senen"
  },
  {
    name: "SD Negeri Tebet Timur 01 dan 03 Pagi",
    latitude: -6.233307,
    longitude: 106.854813,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 630,
    capacity: 630,
    kitchen: "tebet"
  },
  {
    name: "SMA Negeri 8 Jakarta",
    latitude: -6.217716,
    longitude: 106.859208,
    address: "Jakarta Pusat",
    jenjang: "SMA",
    students: 560,
    capacity: 560,
    kitchen: "tebet"
  },
  {
    name: "SD dan SMP Perguruan Rakyat 2",
    latitude: -6.220515,
    longitude: 106.8623,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 560,
    capacity: 560,
    kitchen: "tebet"
  },
  {
    name: "SD Nurul Falah",
    latitude: -6.187435,
    longitude: 106.8523,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 520,
    capacity: 520,
    kitchen: "senen"
  },
  {
    name: "SMP Islam As Syafi'iyah 02",
    latitude: -6.218849,
    longitude: 106.848975,
    address: "Jakarta Pusat",
    jenjang: "SMP",
    students: 630,
    capacity: 630,
    kitchen: "tebet"
  },
  {
    name: "SMP Negeri 265 Jakarta",
    latitude: -6.232548,
    longitude: 106.859207,
    address: "Jalan Asem Baris Raya",
    jenjang: "SMP",
    students: 460,
    capacity: 460,
    kitchen: "tebet"
  },
  {
    name: "SD Al Wasliyah",
    latitude: -6.216663,
    longitude: 106.857686,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 550,
    capacity: 550,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Manggarai 09,11,13,15,17,19 Pagi",
    latitude: -6.21623,
    longitude: 106.855075,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 590,
    capacity: 590,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Menteng 03",
    latitude: -6.19756,
    longitude: 106.838057,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 310,
    capacity: 310,
    kitchen: "senen"
  },
  {
    name: "SMPN 280 Jakarta",
    latitude: -6.197563,
    longitude: 106.838057,
    address: "Jalan Cilacap",
    jenjang: "SMP",
    students: 160,
    capacity: 160,
    kitchen: "senen"
  },
  {
    name: "SDN 03 MENTENG",
    latitude: -6.197701,
    longitude: 106.837746,
    address: "Jalan Cilacap",
    jenjang: "SD",
    students: 160,
    capacity: 160,
    kitchen: "senen"
  },
  {
    name: "SMP Negeri 280",
    latitude: -6.197709,
    longitude: 106.837748,
    address: "Jakarta Pusat",
    jenjang: "SMP",
    students: 320,
    capacity: 320,
    kitchen: "senen"
  },
  {
    name: "SMP Negeri 8 Jakarta",
    latitude: -6.20157,
    longitude: 106.843128,
    address: "Jakarta Pusat",
    jenjang: "SMP",
    students: 380,
    capacity: 380,
    kitchen: "senen"
  },
  {
    name: "MI MTS Madrasah Tarbiatul Mutaallimin",
    latitude: -6.234033,
    longitude: 106.850252,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 620,
    capacity: 620,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Paseban 07",
    latitude: -6.193441,
    longitude: 106.855192,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 260,
    capacity: 260,
    kitchen: "senen"
  },
  {
    name: "SD Negeri Paseban 09/10-11",
    latitude: -6.193822,
    longitude: 106.855157,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 250,
    capacity: 250,
    kitchen: "senen"
  },
  {
    name: "SD Negeri Paseban 15,17,18 dan 19",
    latitude: -6.1963,
    longitude: 106.854408,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 450,
    capacity: 450,
    kitchen: "senen"
  },
  {
    name: "SMA Negeri 37 Jakarta",
    latitude: -6.234686,
    longitude: 106.858813,
    address: "Jalan H, Kebon Baru",
    jenjang: "SMA",
    students: 640,
    capacity: 640,
    kitchen: "tebet"
  },
  {
    name: "SMK Kesatuan",
    latitude: -6.210472,
    longitude: 106.852855,
    address: "Jakarta Pusat",
    jenjang: "SMA",
    students: 540,
    capacity: 540,
    kitchen: "tebet"
  },
  {
    name: "SMP SMA SMK Dewi Sartika",
    latitude: -6.230497,
    longitude: 106.872464,
    address: "Jakarta Timur",
    jenjang: "SMP",
    students: 190,
    capacity: 190,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Harapan Mulia 03 Pagi-04 Petang",
    latitude: -6.173136,
    longitude: 106.856091,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 280,
    capacity: 280,
    kitchen: "senen"
  },
  {
    name: "SMK Jakarta Timur 1",
    latitude: -6.242056,
    longitude: 106.873152,
    address: "Jakarta Timur",
    jenjang: "SMA",
    students: 400,
    capacity: 400,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Setiabudi 01 Pagi",
    latitude: -6.208904,
    longitude: 106.823497,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 180,
    capacity: 180,
    kitchen: "senen"
  },
  {
    name: "MI Nurul Hidayah",
    latitude: -6.249912,
    longitude: 106.838173,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 570,
    capacity: 570,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Mampang Prapatan 02 Pagi",
    latitude: -6.244659,
    longitude: 106.82873,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 250,
    capacity: 250,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Pasar Baru 05 Pagi",
    latitude: -6.158161,
    longitude: 106.834254,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 410,
    capacity: 410,
    kitchen: "senen"
  },
  {
    name: "SD Negeri Cideng 04, 09, 10, 13 Pagi",
    latitude: -6.177137,
    longitude: 106.809805,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 180,
    capacity: 180,
    kitchen: "senen"
  },
  {
    name: "SD Negeri Kebon Kosong 07,11 Pagi",
    latitude: -6.154048,
    longitude: 106.858009,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 310,
    capacity: 310,
    kitchen: "senen"
  },
  {
    name: "SMP Muhammadiyah 29",
    latitude: -6.188351,
    longitude: 106.886528,
    address: "Jakarta Timur",
    jenjang: "SMP",
    students: 540,
    capacity: 540,
    kitchen: "senen"
  },
  {
    name: "SD Negeri Maphar 01 Pagi",
    latitude: -6.156693,
    longitude: 106.819504,
    address: "Jakarta Pusat",
    jenjang: "SD",
    students: 490,
    capacity: 490,
    kitchen: "senen"
  },
  {
    name: "SD Negeri Gunung Sahari Utara 01 Pagi",
    latitude: -6.145627,
    longitude: 106.84005,
    address: "Jakarta Utara",
    jenjang: "SD",
    students: 250,
    capacity: 250,
    kitchen: "senen"
  },
  {
    name: "SD Negeri Mangga Dua Selatan 05 Pagi",
    latitude: -6.146018,
    longitude: 106.827315,
    address: "Jakarta Utara",
    jenjang: "SD",
    students: 630,
    capacity: 630,
    kitchen: "senen"
  },
  {
    name: "SD Negeri Pejaten Barat 10 Pagi",
    latitude: -6.273375,
    longitude: 106.836435,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 510,
    capacity: 510,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Jatinegara 03 Pagi, 05 Pagi",
    latitude: -6.203883,
    longitude: 106.905828,
    address: "Jakarta Timur",
    jenjang: "SD",
    students: 260,
    capacity: 260,
    kitchen: "tebet"
  },
  {
    name: "SD Muhammadiyah 09 Plus",
    latitude: -6.241456,
    longitude: 106.911342,
    address: "Jakarta Timur",
    jenjang: "SD",
    students: 440,
    capacity: 440,
    kitchen: "tebet"
  },
  {
    name: "SDN Palmerah 21 dan 22 Pagi",
    latitude: -6.203477,
    longitude: 106.784761,
    address: "Jakarta Barat",
    jenjang: "SD",
    students: 580,
    capacity: 580,
    kitchen: "senen"
  },
  {
    name: "SD Negeri Jatipadang 05",
    latitude: -6.285285,
    longitude: 106.834766,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 290,
    capacity: 290,
    kitchen: "tebet"
  },
  {
    name: "Uswatun Hasanah Pinang Ranti SMP, SMK, SMA",
    latitude: -6.285399,
    longitude: 106.882008,
    address: "Jakarta Timur",
    jenjang: "SMP",
    students: 300,
    capacity: 300,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Tengah 08 Pagi",
    latitude: -6.293384,
    longitude: 106.86218,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 370,
    capacity: 370,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Duri Kepa 03",
    latitude: -6.174367,
    longitude: 106.774848,
    address: "Jakarta Barat",
    jenjang: "SD",
    students: 260,
    capacity: 260,
    kitchen: "senen"
  },
  {
    name: "SD Islam Ak Azhar 2",
    latitude: -6.296955,
    longitude: 106.834874,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 480,
    capacity: 480,
    kitchen: "tebet"
  },
  {
    name: "SD-SLTP-SMU Galatia 2",
    latitude: -6.155757,
    longitude: 106.775749,
    address: "Jakarta Barat",
    jenjang: "SD",
    students: 260,
    capacity: 260,
    kitchen: null
  },
  {
    name: "SD Negeri Kelapa Dua 05 Pagi",
    latitude: -6.207899,
    longitude: 106.765582,
    address: "Jakarta Barat",
    jenjang: "SD",
    students: 220,
    capacity: 220,
    kitchen: null
  },
  {
    name: "SMK Negeri 28 Jakarta",
    latitude: -6.284306,
    longitude: 106.794488,
    address: "Jakarta Barat",
    jenjang: "SMA",
    students: 280,
    capacity: 280,
    kitchen: "tebet"
  },
  {
    name: "SD Negeri Srengseng 05 Pagi, 06 Pagi, 08 Petang",
    latitude: -6.202726,
    longitude: 106.756911,
    address: "Jakarta Barat",
    jenjang: "SD",
    students: 640,
    capacity: 640,
    kitchen: null
  },
  {
    name: "SD Manba'ul Hikmah",
    latitude: -6.147473,
    longitude: 106.924909,
    address: "Jakarta Utara",
    jenjang: "SD",
    students: 210,
    capacity: 210,
    kitchen: null
  },
  {
    name: "SD Negeri Cilandak Barat 08",
    latitude: -6.302376,
    longitude: 106.800284,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 340,
    capacity: 340,
    kitchen: null
  },
  {
    name: "MI Al Wathoniyah 51",
    latitude: -6.204967,
    longitude: 106.952819,
    address: "Jakarta Timur",
    jenjang: "SD",
    students: 460,
    capacity: 460,
    kitchen: null
  },
  {
    name: "SMA Negeri 88 Jakarta",
    latitude: -6.327967,
    longitude: 106.847075,
    address: "Jakarta Selatan",
    jenjang: "SMA",
    students: 460,
    capacity: 460,
    kitchen: null
  },
  {
    name: "SMK Bina Nusa Mandiri",
    latitude: -6.3282,
    longitude: 106.880608,
    address: "Jakarta Timur",
    jenjang: "SMA",
    students: 500,
    capacity: 500,
    kitchen: null
  },
  {
    name: "SMP PGRI 38 Jakarta, SMK PGRI 40 Jakarta, SMK PGRI 6 Jakarta",
    latitude: -6.1982,
    longitude: 106.962838,
    address: "Jakarta Timur",
    jenjang: "SMP",
    students: 640,
    capacity: 640,
    kitchen: null
  },
  {
    name: "SDN Pangkalan Jati 1",
    latitude: -6.323379,
    longitude: 106.796041,
    address: "Jakarta Barat",
    jenjang: "SD",
    students: 190,
    capacity: 190,
    kitchen: null
  },
  {
    name: "SMP Islam 3 Al-Azhar Bintaro",
    latitude: -6.26606,
    longitude: 106.742252,
    address: "Jakarta Barat",
    jenjang: "SMP",
    students: 180,
    capacity: 180,
    kitchen: null
  },
  {
    name: "MTS Negeri 4 Jakarta",
    latitude: -6.345079,
    longitude: 106.826779,
    address: "Jakarta Selatan",
    jenjang: "SMP",
    students: 260,
    capacity: 260,
    kitchen: null
  },
  {
    name: "SMK Otomindo-SMA Chartar Buana",
    latitude: -6.349738,
    longitude: 106.887754,
    address: "Jakarta Timur",
    jenjang: "SMA",
    students: 350,
    capacity: 350,
    kitchen: null
  },
  {
    name: "MTSN 41 Al-Azhar Asy Syarif Indonesia",
    latitude: -6.352192,
    longitude: 106.813455,
    address: "Jakarta Selatan",
    jenjang: "SMP",
    students: 430,
    capacity: 430,
    kitchen: null
  },
  {
    name: "SD Negeri 13 & 14 Pagi Pegadungan",
    latitude: -6.144267,
    longitude: 106.713702,
    address: "Jakarta Utara",
    jenjang: "SD",
    students: 360,
    capacity: 360,
    kitchen: null
  },
  {
    name: "SD - SMP - SMK Cahaya Prima",
    latitude: -6.124474,
    longitude: 106.716602,
    address: "Jakarta Utara",
    jenjang: "SD",
    students: 520,
    capacity: 520,
    kitchen: null
  },
  {
    name: "SMA Daar El-salam",
    latitude: -6.3136,
    longitude: 106.9759,
    address: "Jakarta Timur",
    jenjang: "SMA",
    students: 230,
    capacity: 230,
    kitchen: null
  },
  {
    name: "SD Negeri Pegadungan 12 Pagi",
    latitude: -6.141269,
    longitude: 106.696387,
    address: "Jakarta Utara",
    jenjang: "SD",
    students: 440,
    capacity: 440,
    kitchen: null
  },
  {
    name: "SD Negeri Tanah Baru 03/04",
    latitude: -6.379714,
    longitude: 106.805004,
    address: "Jakarta Selatan",
    jenjang: "SD",
    students: 250,
    capacity: 250,
    kitchen: null
  },
  {
    name: "SMA Negeri 22 Bekasi",
    latitude: -6.336407,
    longitude: 106.991502,
    address: "Jakarta Timur",
    jenjang: "SMA",
    students: 150,
    capacity: 150,
    kitchen: null
  }
];

export const REAL_SUPPLIERS: RealSupplier[] = [
  {
    nama: "Pasar Cideng Thomas",
    komoditas: [
      "Sayuran",
      "Tomat"
    ],
    lokasi: "Jakarta Pusat",
    latitude: -6.179838,
    longitude: 106.813373,
    hargaIndex: 104,
    leadTime: "1 hari",
    rating: 4.4
  },
  {
    nama: "Pasar Paseban",
    komoditas: [
      "Beras",
      "Sayuran"
    ],
    lokasi: "Jakarta Pusat",
    latitude: -6.192136,
    longitude: 106.848665,
    hargaIndex: 96,
    leadTime: "1 hari",
    rating: 4.3
  },
  {
    nama: "Pasar Kombongan",
    komoditas: [
      "Daging Ayam",
      "Telur"
    ],
    lokasi: "Jakarta Pusat",
    latitude: -6.161224,
    longitude: 106.840969,
    hargaIndex: 105,
    leadTime: "1 hari",
    rating: 4.8
  },
  {
    nama: "Pasar Cempaka Sari III (Bedeng)",
    komoditas: [
      "Buah",
      "Sayuran"
    ],
    lokasi: "Jakarta Pusat",
    latitude: -6.169544,
    longitude: 106.857495,
    hargaIndex: 101,
    leadTime: "1 hari",
    rating: 4.8
  },
  {
    nama: "Pasar Jaya Pasar Jambul Baru",
    komoditas: [
      "Ikan",
      "Telur"
    ],
    lokasi: "Jakarta Selatan",
    latitude: -6.256714,
    longitude: 106.865404,
    hargaIndex: 96,
    leadTime: "1 hari",
    rating: 4.8
  },
  {
    nama: "Pasar Santa",
    komoditas: [
      "Sayuran",
      "Cabai"
    ],
    lokasi: "Jakarta Selatan",
    latitude: -6.239905,
    longitude: 106.812106,
    hargaIndex: 93,
    leadTime: "1 hari",
    rating: 4.3
  },
  {
    nama: "Pasar Karet Pedurenan",
    komoditas: [
      "Beras",
      "Telur"
    ],
    lokasi: "Jakarta Selatan",
    latitude: -6.221025,
    longitude: 106.819957,
    hargaIndex: 100,
    leadTime: "1 hari",
    rating: 4.7
  },
  {
    nama: "Pasar Perumnas Klender",
    komoditas: [
      "Buah",
      "Susu"
    ],
    lokasi: "Jakarta Timur",
    latitude: -6.221646,
    longitude: 106.931501,
    hargaIndex: 99,
    leadTime: "1 hari",
    rating: 4.9
  },
  {
    nama: "Pasar Jaya Ciplak",
    komoditas: [
      "Sayuran",
      "Tomat"
    ],
    lokasi: "Jakarta Timur",
    latitude: -6.236133,
    longitude: 106.880986,
    hargaIndex: 104,
    leadTime: "1 hari",
    rating: 4.4
  },
  {
    nama: "Pasar Raya Enjo",
    komoditas: [
      "Beras",
      "Sayuran"
    ],
    lokasi: "Jakarta Timur",
    latitude: -6.211926,
    longitude: 106.875605,
    hargaIndex: 106,
    leadTime: "1 hari",
    rating: 4.9
  },
  {
    nama: "Pasar Pengampuan",
    komoditas: [
      "Daging Ayam",
      "Telur"
    ],
    lokasi: "Jakarta Barat",
    latitude: -6.199153,
    longitude: 106.76118,
    hargaIndex: 104,
    leadTime: "1 hari",
    rating: 4.5
  },
  {
    nama: "Pasar Jembatan Besi",
    komoditas: [
      "Buah",
      "Sayuran"
    ],
    lokasi: "Jakarta Barat",
    latitude: -6.150391,
    longitude: 106.797168,
    hargaIndex: 102,
    leadTime: "1 hari",
    rating: 4.9
  },
  {
    nama: "Pasar Tanah Merah",
    komoditas: [
      "Ikan",
      "Telur"
    ],
    lokasi: "Jakarta Utara",
    latitude: -6.129905,
    longitude: 106.794173,
    hargaIndex: 96,
    leadTime: "1 hari",
    rating: 4.5
  },
  {
    nama: "Pasar Jembatan Merah",
    komoditas: [
      "Sayuran",
      "Cabai"
    ],
    lokasi: "Jakarta Utara",
    latitude: -6.148837,
    longitude: 106.825673,
    hargaIndex: 93,
    leadTime: "1 hari",
    rating: 4.9
  },
  {
    nama: "Pasar Ciluar",
    komoditas: [
      "Beras",
      "Telur"
    ],
    lokasi: "Bogor",
    latitude: -6.544487,
    longitude: 106.827225,
    hargaIndex: 100,
    leadTime: "1 hari",
    rating: 4.4
  },
  {
    nama: "Pasar Balekambang",
    komoditas: [
      "Buah",
      "Susu"
    ],
    lokasi: "Bogor",
    latitude: -6.621836,
    longitude: 106.80883,
    hargaIndex: 101,
    leadTime: "1 hari",
    rating: 4.3
  },
  {
    nama: "Pasar Cijeruk",
    komoditas: [
      "Sayuran",
      "Tomat"
    ],
    lokasi: "Bogor",
    latitude: -6.686857,
    longitude: 106.790007,
    hargaIndex: 108,
    leadTime: "1 hari",
    rating: 4.6
  },
  {
    nama: "Pasar Tradisional Simpang Dago",
    komoditas: [
      "Beras",
      "Sayuran"
    ],
    lokasi: "Bandung",
    latitude: -6.88475,
    longitude: 107.613958,
    hargaIndex: 104,
    leadTime: "2 hari",
    rating: 4.3
  },
  {
    nama: "Pasar Sarijadi",
    komoditas: [
      "Daging Ayam",
      "Telur"
    ],
    lokasi: "Bandung",
    latitude: -6.88401,
    longitude: 107.57498,
    hargaIndex: 93,
    leadTime: "2 hari",
    rating: 4.8
  },
  {
    nama: "Pasar Andir",
    komoditas: [
      "Buah",
      "Sayuran"
    ],
    lokasi: "Bandung",
    latitude: -6.919134,
    longitude: 107.590695,
    hargaIndex: 107,
    leadTime: "2 hari",
    rating: 4.7
  }
];
