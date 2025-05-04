import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'
import { authOptions } from "./api/auth/[...nextauth]/options";
import Hero from "@/components/hero";
import Features from "@/components/features";
import PaymentMethods from "@/components/payment-methods";
import Security from "@/components/security";
import FAQ from "@/components/faq";
import CTA from "@/components/cta";
import Footer from "@/components/footer";
function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <PaymentMethods/>
      <Security/>
      <FAQ/>
      <CTA />
      <Footer />
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