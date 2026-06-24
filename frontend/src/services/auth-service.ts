import { env } from "@/config/env";
import type { Role } from "@/context/role-context";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
export interface RegisterPayload {
  businessName: string;
  email: string;
  phone?: string;
  password: string;
  commodities?: string;
}

/** Infer a demo role from the email, so different logins land in different views. */
function inferRole(email: string): Role {
  const e = email.toLowerCase();
  if (e.includes("pemerintah") || e.includes("gov")) return "pemerintah";
  if (e.includes("sekolah") || e.includes("school")) return "sekolah";
  if (e.includes("mitra") || e.includes("vendor") || e.includes("supplier")) return "mitra";
  if (e.includes("sppg") || e.includes("dapur") || e.includes("kitchen")) return "sppg";
  return "pemerintah";
}

const mockToken = () => `mbg.mock.${Math.random().toString(36).slice(2)}.${Date.now()}`;

/**
 * Mock authentication — always succeeds so the app is fully explorable offline.
 * When a real backend is wired (env.offlineMode = false) it falls back to it
 * but never blocks the user if the request fails.
 */
export async function login(payload: LoginPayload): Promise<AuthUser> {
  const role = inferRole(payload.email || "demo@pemerintah.id");
  const user: AuthUser = {
    id: "u-demo",
    name: payload.email ? payload.email.split("@")[0] : "Demo User",
    email: payload.email || "demo@mbgchain.id",
    role,
    token: mockToken(),
  };

  if (!env.offlineMode) {
    try {
      const res = await fetch(`${env.apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        return { ...user, token: data.access_token ?? user.token };
      }
    } catch {
      /* ignore — fall back to mock so the user is never blocked */
    }
  }
  return user;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  return login({ email: payload.email || "mitra@vendor.id", password: payload.password });
}
