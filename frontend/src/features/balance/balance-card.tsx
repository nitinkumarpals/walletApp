"use client";

import React from "react";
import BentoTile from "@/components/bento-tile";
import { Wallet } from "lucide-react";

function inr(amount: number) {
  return amount.toLocaleString("en-IN", { style: "currency", currency: "INR" });
}

export const BalanceCard = ({ amount, locked }: { amount: number; locked: number }) => {
  return (
    <BentoTile label="[02] balance" className="h-full">
      <div className="flex items-center gap-2 mt-1">
        <Wallet className="h-4 w-4 text-lime" />
        <span className="mono text-sm text-foreground">available</span>
      </div>
      <div className="num text-4xl text-foreground mt-2">{inr(amount / 100)}</div>

      <div className="mt-6 h-1.5 rounded-full bg-surface-2 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-lime to-ion" style={{ width: "100%" }} />
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="label-mono">on hold</span>
          <span className="num text-sm text-foreground">{inr(locked / 100)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="label-mono">total balance</span>
          <span className="num text-lg text-lime">{inr((locked + amount) / 100)}</span>
        </div>
      </div>
    </BentoTile>
  );
};
