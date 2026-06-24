import { createContext, useContext, useState, type ReactNode } from "react";
import { login as loginService, register as registerService, type AuthUser, type LoginPayload, type RegisterPayload } from "@/services/auth-service";
import { useRole } from "@/context/role-context";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => void;
}

const AuthCtx = createContext<AuthState>({
  user: null,
  isAuthenticated: false,
  login: async () => ({}) as AuthUser,
  register: async () => ({}) as AuthUser,
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthCtx);
}

const STORAGE_KEY = "mbg_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setRole } = useRole();
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const persist = (u: AuthUser) => {
    setUser(u);
    setRole(u.role);
    localStorage.setItem("token", u.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const login = async (payload: LoginPayload) => {
    const u = await loginService(payload);
    persist(u);
    return u;
  };
  const register = async (payload: RegisterPayload) => {
    const u = await registerService(payload);
    persist(u);
    return u;
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthCtx.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
