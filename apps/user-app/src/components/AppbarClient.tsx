"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@/components/appbar";
import { useRouter } from "next/navigation";

export function AppbarClient() {
    const session = useSession();
    const router = useRouter();

    const handleSignin = () => signIn();
    
    const handleSignup = () => signIn(); // make it signup

    const handleSignout = async () => {
        await signOut();
        router.push("/api/auth/signin");
    };

    return (
        <Appbar  
          onSignin={handleSignin}
          onSignup={handleSignup}
          onSignout={handleSignout}
          user={session.data?.user}
        />
    );
}