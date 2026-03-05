import { type GeoEntity } from "../types";

export const mockEntities: GeoEntity[] = [
  // Vendor Data
  {
    id: "v1",
    name: "PT Maju Tani Pangan",
    type: "vendor",
    lat: -6.21,
    lng: 106.83,
    address: "Jl. Tebet Timur Dalam, Jakarta Selatan",
    status: "active",
    rating: 4.8,
    commodities: ["Beras", "Sayuran Segar", "Bumbu Dapur"],
  },
  {
    id: "v2",
    name: "CV Berkah Lauk",
    type: "vendor",
    lat: -6.19,
    lng: 106.84,
    address: "Pasar Senen Blok III, Jakarta Pusat",
    status: "active",
    rating: 4.6,
    commodities: ["Daging Sapi", "Daging Ayam", "Telur"],
  },
  {
    id: "v3",
    name: "Koperasi Tani Nusantara",
    type: "vendor",
    lat: -6.92,
    lng: 107.6,
    address: "Jl. Pasir Kaliki, Bandung",
    status: "active",
    rating: 4.9,
    commodities: ["Buah-buahan", "Sayuran Organik", "Susu Sapi"],
  },
];
