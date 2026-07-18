"use client"
import { AuthProvider } from "@/features/auth/auth-context";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return <AuthProvider>{children}</AuthProvider>;
}
