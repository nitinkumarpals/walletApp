"use client";
import React from "react";
import { CreditCard, Landmark, Globe2, ArrowUpRight } from "lucide-react";

const RAILS = [
  {
    id: "01",
    icon: CreditCard,
    title: "cards",
    desc: "Top up with Visa, Mastercard, Amex. Instant, 3-D Secure, tokenized.",
    tags: ["Visa", "MC", "Amex", "Apple Pay"],
  },
  {
    id: "02",
    icon: Landmark,
    title: "bank transfer",
    desc: "ACH · SEPA · Faster Payments · SWIFT. Same-day settlement on major rails.",
    tags: ["ACH", "SEPA", "FedNow", "Wire"],
  },
  {
    id: "03",
    icon: Globe2,
    title: "internet banking",
    desc: "UPI in India, PIX in Brazil, iDEAL in NL. 40+ local bank flows built in.",
    tags: ["UPI", "PIX", "iDEAL", "PayNow"],
  },
];

const PaymentMethods: React.FC = () => {
  return (
    <section id="add" className="px-4 md:px-8 py-24 md:py-32 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="label-mono mb-4">// add money</div>
            <h2 className="mono text-4xl md:text-6xl leading-[0.95] tracking-tight max-w-2xl">
              three rails.<br />zero friction.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Fund your wallet from a card, a bank, or any local payment network. We handle the
            reconciliation so your balance updates the moment the money moves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {RAILS.map((r) => (
            <div key={r.id} className="tile p-7 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-lime">
                  <r.icon className="h-4 w-4" />
                </div>
                <span className="label-mono">[{r.id}]</span>
              </div>
              <h3 className="mono text-2xl text-foreground mb-3">{r.title}</h3>
              <p className="text-muted-foreground mb-8">{r.desc}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {r.tags.map((t) => (
                  <span key={t} className="label-mono border border-border rounded-full px-2.5 py-1 text-foreground/80">{t}</span>
                ))}
              </div>
              <a href="#" className="mono text-sm text-lime inline-flex items-center gap-1 mt-auto">
                learn more <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentMethods;