import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui";
import { RoleProvider } from "@/context/role-context";
import { AuthProvider } from "@/context/auth-context";

/** Global provider composition (toast → role → auth). */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <RoleProvider>
        <AuthProvider>{children}</AuthProvider>
      </RoleProvider>
    </ToastProvider>
  );
}
