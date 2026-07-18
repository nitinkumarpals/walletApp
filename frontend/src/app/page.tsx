export const dynamic = 'force-dynamic';
import { getServerSession } from "@/features/auth/server-session";
import { redirect } from 'next/navigation'
import Hero from "@/features/landing/hero";
import Features from "@/features/landing/features";
import PaymentMethods from "@/features/landing/payment-methods";
import Security from "@/features/landing/security";
import FAQ from "@/features/landing/faq";
import CTA from "@/features/landing/cta";
import Footer from "@/features/landing/footer";
import Navbar from "@/features/landing/navbar";
import Marquee from "@/features/landing/marquee";
import Metrics from "@/features/landing/metrics";

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Features />
        <PaymentMethods />
        <Security />
        <Metrics />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
export default async function Page() {
  const session = await getServerSession();
  if (session?.user) {
    redirect('/dashboard')
  } else {
    return <LandingPage />
  }
}