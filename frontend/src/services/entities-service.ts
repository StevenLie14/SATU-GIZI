import { env } from "@/config/env";
import { mockEntities } from "@/mocks/geo-entities";
import type { GeoEntity } from "@/types";

/**
 * Entities data access. Offline-first: returns local fixtures so the map and
 * detail pages work without a backend. When online it tries the API and falls
 * back to fixtures on any error.
 */
export async function getEntities(): Promise<GeoEntity[]> {
  if (!env.offlineMode) {
    try {
      const res = await fetch(`${env.apiUrl}/api/entities`);
      if (res.ok) return (await res.json()) as GeoEntity[];
    } catch {
      /* fall through to fixtures */
    }
  }
  return mockEntities;
}

export async function getEntity(id: string): Promise<GeoEntity | null> {
  if (!env.offlineMode) {
    try {
      const res = await fetch(`${env.apiUrl}/api/entities/${id}`);
      if (res.ok) return (await res.json()) as GeoEntity;
    } catch {
      /* fall through */
    }
  }
  return mockEntities.find((e) => e.id === id) ?? null;
}

export async function createEntity(entity: GeoEntity): Promise<GeoEntity> {
  if (!env.offlineMode) {
    try {
      const res = await fetch(`${env.apiUrl}/api/entities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entity),
      });
      if (res.ok) return (await res.json()) as GeoEntity;
    } catch {
      /* fall through */
    }
  }
  // Offline: echo back with an id so the UI can append it locally.
  return { ...entity, id: entity.id || `local-${Date.now()}` };
}
