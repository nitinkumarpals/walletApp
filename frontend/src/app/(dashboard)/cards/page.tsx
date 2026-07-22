import React from "react";
import BentoTile from "@/components/bento-tile";
import { CreditCard, ArrowRight } from "lucide-react";

export default function CardsPage() {
  return (
    <>
      <div className="mb-10">
        <div className="label-mono mb-3">{"// cards"}</div>
        <h1 className="mono text-4xl md:text-5xl tracking-tight leading-[0.95]">virtual cards.</h1>
        <p className="text-muted-foreground mt-3 mono text-sm max-w-lg">
          spin up single-use cards for subscriptions. coming soon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <BentoTile label="[01] issue card" className="h-full relative overflow-hidden group">
          <div className="absolute inset-0 bg-lime/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col h-full justify-between relative z-10">
            <div>
              <div className="relative h-40 mt-2 w-full max-w-sm mx-auto">
                <div className="absolute inset-x-6 top-6 h-32 rounded-xl bg-gradient-to-br from-ion to-ion/40 border border-border shadow-lg rotate-[-4deg]" />
                <div className="absolute inset-x-4 top-2 h-32 rounded-xl bg-gradient-to-br from-lime/80 to-lime/30 border border-border shadow-lg rotate-[3deg] flex flex-col justify-between p-4 backdrop-blur-md">
                  <div className="flex justify-between items-start">
                    <div className="mono text-[10px] text-background/80 uppercase tracking-widest">NIMBLE · virtual</div>
                    <CreditCard className="h-4 w-4 text-background/50" />
                  </div>
                  <div className="num text-lg text-background tracking-[0.2em]">•••• •••• •••• 4242</div>
                  <div className="flex justify-between items-end">
                    <div className="mono text-[10px] text-background/80">VALID THRU<br/>12/28</div>
                    <div className="mono text-xs text-background font-medium">VISA</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center space-y-4">
              <p className="mono text-sm text-foreground">
                We are currently rolling out the Cards beta to select users.
              </p>
              <button className="btn-lime w-full justify-center">
                join the waitlist <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </BentoTile>

        <div className="flex flex-col gap-4 md:gap-5">
          <BentoTile label="[02] features" className="flex-1">
            <ul className="space-y-4 mt-2">
              <li className="flex items-start gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-lime mt-1.5 shrink-0" />
                <div>
                  <div className="mono text-sm text-foreground">Single-use tokens</div>
                  <div className="label-mono mt-1">Cards auto-destruct after first charge.</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-lime mt-1.5 shrink-0" />
                <div>
                  <div className="mono text-sm text-foreground">Spend limits</div>
                  <div className="label-mono mt-1">Lock subscriptions to a maximum monthly amount.</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-lime mt-1.5 shrink-0" />
                <div>
                  <div className="mono text-sm text-foreground">Zero FX markup</div>
                  <div className="label-mono mt-1">Pay internationally at mid-market rates.</div>
                </div>
              </li>
            </ul>
          </BentoTile>
          
          <BentoTile label="[03] active cards" className="flex-1 opacity-50">
            <div className="flex items-center justify-center h-full min-h-[120px]">
              <div className="label-mono">locked · requires beta access</div>
            </div>
          </BentoTile>
        </div>
      </div>
    </>
  );
}
