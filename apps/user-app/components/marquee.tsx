"use client";
import React from "react";

const ITEMS = [
  "USD", "EUR", "GBP", "INR", "JPY", "SGD", "AED", "CAD", "AUD", "BRL",
  "ACH", "SEPA", "SWIFT", "UPI", "FedNow", "Wire",
  "Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay",
];

const Marquee: React.FC = () => {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="border-y border-border bg-surface/40 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-4">
        {row.map((it, i) => (
          <div key={i} className="flex items-center gap-3 px-6 label-mono">
            <span className="h-1 w-1 rounded-full bg-lime" />
            <span className="text-foreground/70">{it}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;