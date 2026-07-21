"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ITEMS = [
  ["how do i add money?", "Cards, bank transfers, or local networks like UPI, PIX, iDEAL. Card top-ups clear instantly; bank rails settle same-day on major networks."],
  ["what are the fees?", "Wallet-to-wallet transfers are free. External payouts are 1% (capped at $5). FX runs at mid-market + 0.12% spread."],
  ["how fast are transfers?", "Nimble-to-Nimble is instant. External rails clear as fast as the network allows — FedNow and UPI are near real-time."],
  ["is my money safe?", "Funds are held with regulated custody partners. Access uses passkeys or biometrics with hardware-backed 2FA."],
  ["which currencies?", "40+ currencies for hold and send, including USD, EUR, GBP, INR, JPY, SGD, AED, BRL."],
  ["can i withdraw?", "Anytime, to any linked bank. Withdrawals inherit the underlying rail's speed."],
];

const FAQ: React.FC = () => {
  return (
    <section id="faq" className="px-4 md:px-8 py-24 md:py-32 border-b border-border">
      <div className="max-w-5xl mx-auto">
        <div className="label-mono mb-4">{"// questions"}</div>
        <h2 className="mono text-4xl md:text-6xl leading-[0.95] tracking-tight mb-14">the fine print.</h2>

        <Accordion type="single" collapsible className="w-full border-t border-border">
          {ITEMS.map(([q, a], i) => (
            <AccordionItem key={q} value={`i-${i}`} className="border-b border-border">
              <AccordionTrigger className="hover:no-underline py-6 [&>svg]:text-muted-foreground">
                <div className="flex items-center gap-6 text-left">
                  <span className="label-mono w-10">[{String(i + 1).padStart(2, "0")}]</span>
                  <span className="mono text-lg md:text-xl text-foreground">{q}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-16 pr-6 pb-6 text-muted-foreground text-base">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;