import { env } from "@/config/env";
import { getCookie } from "@/lib/session";

/**
 * Thin fetch wrapper shared by all domain services.
 *
 * - Attaches the JWT from the "token" cookie (all /api/* routes are guarded).
 * - Unwraps the backend's pagination envelope ({ data, meta }).
 * - Throws ApiError with the backend's (Indonesian) message on failure.
 *
 * Domain services combine this with `listOrFallback`/`tryApi` so every page
 * keeps working offline: when offlineMode is on or a request fails, the mock
 * fixtures are returned instead.
 */

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getCookie("token");
  const res = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = Array.isArray(body.message) ? body.message.join(", ") : body.message;
    throw new ApiError(msg || `Permintaan gagal (${res.status})`, res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const apiGet = <T>(path: string) => request<T>(path);
export const apiPost = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) });
export const apiPatch = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "PATCH", body: body === undefined ? undefined : JSON.stringify(body) });
export const apiDelete = <T>(path: string) => request<T>(path, { method: "DELETE" });

interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

/** GET a paginated list endpoint and return just the rows. */
export async function apiList<T>(path: string, limit = 100): Promise<T[]> {
  const sep = path.includes("?") ? "&" : "?";
  const res = await apiGet<Paginated<T> | T[]>(`${path}${sep}limit=${limit}`);
  return Array.isArray(res) ? res : res.data;
}

/**
 * Offline-first list helper: hit the API (mapped to the UI type), fall back to
 * the mock fixtures when offline or on any error.
 */
export async function listOrFallback<TApi, T>(
  path: string,
  map: (row: TApi) => T,
  fallback: T[],
): Promise<T[]> {
  if (!env.offlineMode) {
    try {
      const rows = await apiList<TApi>(path);
      return rows.map(map);
    } catch {
      /* fall through to fixtures */
    }
  }
  return fallback;
}

/**
 * Run an API call when online; swallow failures so UI flows keep working
 * offline (the caller has already updated local state optimistically).
 */
export async function tryApi<T>(fn: () => Promise<T>): Promise<T | null> {
  if (env.offlineMode) return null;
  try {
    return await fn();
  } catch {
    return null;
  }
}

/* ---------- shared enum ↔ label mappers ---------------------------- */

/** "MENUNGGU" → "Menunggu", "DAGING AYAM" → "Daging ayam" */
export const titleCase = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
