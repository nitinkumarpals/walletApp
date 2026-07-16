export const dynamic = 'force-dynamic';
import { getServerSession } from "@/src/lib/getServerSession";
import { redirect } from 'next/navigation'
import Hero from "@/components/hero";
import Features from "@/components/features";
import PaymentMethods from "@/components/payment-methods";
import Security from "@/components/security";
import FAQ from "@/components/faq";
import CTA from "@/components/cta";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Marquee from "@/components/marquee";
import Metrics from "@/components/metrics";

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