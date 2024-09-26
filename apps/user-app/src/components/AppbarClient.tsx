"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@/components/appbar";
import { useRouter } from "next/navigation";

export function AppbarClient() {
  const session = useSession();
  const router = useRouter();

  const handleSignin = () => signIn();

  const handleSignout = async () => {
    await signOut({ callbackUrl: "/landing" });
    router.replace("/landing");
  };

  return (
    <Appbar
      onSignin={handleSignin}
      onSignout={handleSignout}
      user={session.data?.user}
    />
  );
}
