import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'
import { authOptions } from "./api/auth/[...nextauth]/options";
import Hero from "@/components/hero";
function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero/>
    </div>
  );
}
export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect('/dashboard')
  } else {
    return <LandingPage />
  }
}