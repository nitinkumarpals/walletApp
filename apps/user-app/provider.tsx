"use client"
import { RecoilRoot } from "recoil";
import { AuthProvider } from "./src/lib/auth-context";

export const Providers = ({children}: {children: React.ReactNode}) => {
    return <RecoilRoot>
        <AuthProvider>
            {children}
        </AuthProvider>
    </RecoilRoot>
}