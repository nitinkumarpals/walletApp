"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Send, CreditCard, BarChart3 } from "lucide-react";
import BentoTile from "@/components/bento-tile";

const Features: React.FC = () => {
  return (
    <section id="features" className="px-4 md:px-8 py-24 md:py-32 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="label-mono mb-4">{"// the surface"}</div>
            <h2 className="mono text-4xl md:text-6xl leading-[0.95] tracking-tight max-w-2xl">
              one wallet.<br />every rail.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Balance, send, receive, cards, FX, analytics — arranged like a control room, not a
            brochure. Every tile is a live surface.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5 auto-rows-[minmax(200px,auto)]"
        >
          {/* Balance — big */}
          <Tile span="md:col-span-4">
            <BentoTile label="[01] balance" title="all currencies" className="h-full">
              <div className="num text-4xl md:text-5xl text-foreground">$48,204.<span className="text-muted-foreground">72</span></div>
              <Spark className="mt-6" />
              <div className="mt-6 grid grid-cols-3 gap-3">
                <Chip k="USD" v="34,120.10" />
                <Chip k="EUR" v="9,842.30" />
                <Chip k="INR" v="3,88,441" />
              </div>
            </BentoTile>
          </Tile>

          {/* Send */}
          <Tile span="md:col-span-2">
            <BentoTile label="[02] send" className="h-full">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-surface-2 border border-border flex items-center justify-center mono text-xs">MK</div>
                <div>
                  <div className="text-sm text-foreground">Mira Kaur</div>
                  <div className="label-mono">nimble/mira</div>
                </div>
              </div>
              <div className="mt-6 num text-3xl text-foreground">$1,200.00</div>
              <button className="mt-6 btn-lime w-full justify-center">
                <Send className="h-4 w-4" /> send now
              </button>
            </BentoTile>
          </Tile>

          {/* FX — tall */}
          <Tile span="md:col-span-2 md:row-span-2">
            <BentoTile label="[03] fx · live" className="h-full">
              <div className="space-y-4">
                {[
                  ["EUR/USD", "1.0842", "▲"],
                  ["GBP/USD", "1.2764", "▲"],
                  ["USD/JPY", "152.31", "▼"],
                  ["USD/INR", "83.12", "▲"],
                  ["USD/SGD", "1.336", "▼"],
                  ["BTC/USD", "68,412", "▲"],
                ].map(([p, v, d]) => (
                  <div key={p} className="flex items-center justify-between mono text-sm">
                    <span className="text-muted-foreground">{p}</span>
                    <span className="flex items-center gap-2 num text-foreground">
                      <span className={d === "▲" ? "text-lime" : "text-destructive"}>{d}</span>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 label-mono flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime animate-ticker" />
                streaming · 12ms
              </div>
            </BentoTile>
          </Tile>

          {/* Cards */}
          <Tile span="md:col-span-2">
            <BentoTile label="[04] virtual cards" className="h-full">
              <div className="relative h-32 mt-1">
                <div className="absolute inset-x-6 top-6 h-24 rounded-xl bg-gradient-to-br from-ion to-ion/40 border border-border shadow-lg rotate-[-4deg]" />
                <div className="absolute inset-x-4 top-2 h-24 rounded-xl bg-gradient-to-br from-lime/80 to-lime/30 border border-border shadow-lg rotate-[3deg] flex flex-col justify-between p-3">
                  <div className="mono text-[10px] text-background/80">NIMBLE · virtual</div>
                  <div className="num text-[13px] text-background">•••• 4242</div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="label-mono">4 active</span>
                <a className="mono text-xs text-lime inline-flex items-center gap-1">manage <ArrowUpRight className="h-3 w-3" /></a>
              </div>
            </BentoTile>
          </Tile>

          {/* Analytics */}
          <Tile span="md:col-span-4">
            <BentoTile label="[05] analytics" title="last 30 days" className="h-full">
              <Bars />
              <div className="mt-6 grid grid-cols-3 gap-4 label-mono">
                <div><span className="text-lime num text-base">$12,410</span><div>inflow</div></div>
                <div><span className="text-foreground num text-base">$8,201</span><div>outflow</div></div>
                <div><span className="text-foreground num text-base">$4,209</span><div>net</div></div>
              </div>
            </BentoTile>
          </Tile>

          {/* Insight */}
          <Tile span="md:col-span-3">
            <BentoTile label="[06] insight" className="h-full">
              <div className="mono text-lg text-foreground leading-tight">
                You spent <span className="text-lime">32% less</span> on cross-border FX vs. last quarter.
              </div>
              <div className="mt-4 label-mono flex items-center gap-2"><BarChart3 className="h-3.5 w-3.5 text-lime" /> ai · nimble.brain</div>
            </BentoTile>
          </Tile>

          {/* Cards CTA */}
          <Tile span="md:col-span-3">
            <BentoTile label="[07] issue" className="h-full">
              <div className="mono text-lg text-foreground leading-tight">
                Spin up a single-use card for any subscription in 2 seconds.
              </div>
              <div className="mt-6 flex gap-2">
                <a href="#add" className="btn-lime"><CreditCard className="h-4 w-4" /> issue card</a>
                <a href="#features" className="btn-ghost">learn more</a>
              </div>
            </BentoTile>
          </Tile>
        </motion.div>
      </div>
    </section>
  );
};

const Tile: React.FC<{ span?: string; children: React.ReactNode }> = ({ span, children }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
    className={span}
  >
    {children}
  </motion.div>
);

const Chip: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div className="border border-border rounded-lg p-3 bg-surface-2/60">
    <div className="label-mono">{k}</div>
    <div className="num text-sm text-foreground mt-1">{v}</div>
  </div>
);

const Spark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 40" className={`w-full h-10 ${className || ""}`} preserveAspectRatio="none">
    <polyline
      fill="none"
      stroke="hsl(var(--lime))"
      strokeWidth="1.5"
      points="0,30 15,22 30,26 45,14 60,18 75,10 90,20 105,8 120,16 135,6 150,12 165,4 180,10 200,2"
    />
  </svg>
);

const Bars: React.FC = () => {
  const heights = [30, 55, 40, 70, 45, 90, 60, 78, 52, 88, 66, 95];
  return (
    <div className="flex items-end gap-1.5 h-24 mt-2">
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-gradient-to-t from-ion/40 to-lime"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
};

export default Features;
