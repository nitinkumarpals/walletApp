"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "../../../../packages/ui/src/appbar";
export default function Home() {
  // const balance = useBalance();
  const session = useSession();
  return (
    <div>
      <Appbar onSignin={signIn} onSignout={signOut} user={session.data?.user}/>
      <div className="text-3xl text-pink-300 text-3xl text-center bg-black h-screen">
        Hello from User App
        <br />
        <div className="text-2xl text-emerald-300  font-sans">
        {session.status === "authenticated" ? JSON.stringify(session.data.user, null, 2) : "Not logged in"}
        </div>
      </div>
    </div>
  );
}
