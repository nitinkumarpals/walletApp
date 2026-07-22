"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const Hero: React.FC = () => {
  const wrap = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const bg = useTransform([sx, sy], ([x, y]) =>
    `radial-gradient(500px circle at ${x}px ${y}px, hsl(var(--lime) / 0.18), transparent 60%)`
  );

  const onMove = (e: React.MouseEvent) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <section
      ref={wrap}
      onMouseMove={onMove}
      className="relative overflow-hidden border-b border-border"
    >
      <motion.div aria-hidden style={{ background: bg }} className="absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 dotgrid opacity-60" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-3 label-mono mb-8">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime animate-ticker" />
              <span>{"// v2.6 · sept 2026"}</span>
            </div>

            <h1 className="mono font-medium text-foreground text-[44px] sm:text-6xl lg:text-[88px] leading-[0.95] tracking-tight">
              move money at the<br />
              <span className="gradient-text">speed of thought.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground">
              Nimble is a wallet built for 2026. Send across borders, receive on any rail, top up
              from cards, banks, or UPI — all in one dark, tight, mono-fine surface.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/login" className="btn-lime">
                open account <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a href="#features" className="btn-ghost">see the product</a>
            </div>

            <div className="mt-10 flex items-center gap-3 border border-border rounded-full px-4 py-2 w-fit bg-surface/60 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-lime opacity-70 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
              </span>
              <span className="mono text-[12px] text-foreground/80">
                <span className="num">2,481</span> transfers in last 60s
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="tile p-6 md:p-8">
              <div className="flex items-center justify-between">
                <span className="label-mono">{"// wallet"}</span>
                <span className="label-mono">USD · primary</span>
              </div>
              <div className="mt-8">
                <div className="label-mono">available</div>
                <div className="num text-5xl md:text-6xl mt-2 text-foreground">$48,204.<span className="text-muted-foreground">72</span></div>
                <div className="mt-2 label-mono flex items-center gap-2">
                  <span className="text-lime">▲ 12.7%</span>
                  <span>this month</span>
                </div>
              </div>
              <div className="mt-8 h-px bg-border" />
              <div className="mt-6 space-y-3">
                <Row t="Salary · Nova Labs" a="+$8,400.00" pos />
                <Row t="FX · USD → EUR" a="−€1,200.00" />
                <Row t="Card · Figma" a="−$15.00" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-6 -left-4 md:-left-10 tile px-4 py-3 flex items-center gap-3"
            >
              <span className="h-2 w-2 rounded-full bg-lime" />
              <span className="mono text-[12px] text-foreground/80">payment received · <span className="num">+$3,659.00</span></span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="absolute -top-4 -right-2 md:-right-6 tile px-4 py-3 mono text-[12px] text-foreground/80"
            >
              FX spread · <span className="num text-lime">0.12%</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Row: React.FC<{ t: string; a: string; pos?: boolean }> = ({ t, a, pos }) => (
  <div className="flex items-center justify-between mono text-[13px]">
    <span className="text-muted-foreground">{t}</span>
    <span className={pos ? "text-lime num" : "text-foreground num"}>{a}</span>
  </div>
);

export default Hero;
