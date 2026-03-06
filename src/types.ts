export type EntityType = "school" | "kitchen" | "vendor";

export interface GeoEntity {
  id: string;
  name: string;
  type: EntityType;
  lat: number;
  lng: number;
  address: string;
  capacity?: number;
  status: "active" | "pending" | "inactive";
  rating?: number;
  contact?: string;
  commodities?: string[];
  auditScore?: number;
}

export interface AddEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entity: GeoEntity) => void;
  initialLocation?: { lat: number; lng: number } | null;
}
