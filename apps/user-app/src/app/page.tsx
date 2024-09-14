"use client";
import { useSession } from "next-auth/react";
export default function Home() {
  // const balance = useBalance();
  const session = useSession();
  return (
    <div>
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
