import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { login as loginService, register as registerService, type AuthUser, type LoginPayload, type RegisterPayload } from "@/services/auth-service";
import { useRole } from "@/context/role-context";
import { getCookie, setCookie, eraseCookie } from "@/lib/session";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setRole } = useRole();
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = getCookie("mbg_auth_user");
      return raw ? (JSON.parse(decodeURIComponent(raw)) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  // Ensure role context stays synchronized when initializing user from cookie
  useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);

  const persist = (u: AuthUser) => {
    setUser(u);
    setRole(u.role);
    setCookie("token", u.token, 7);
    setCookie("mbg_auth_user", encodeURIComponent(JSON.stringify(u)), 7);
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
    eraseCookie("token");
    eraseCookie("mbg_auth_user");
    eraseCookie("mbg_role");
  };

  return (
    <AuthCtx.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
