"use client";
import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const CTA: React.FC = () => {
  return (
    <section className="px-4 md:px-8 py-28 md:py-40 border-b border-border relative overflow-hidden">
      <div className="absolute inset-0 -z-10 dotgrid opacity-50" />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[400px] blur-3xl -z-10 bg-[radial-gradient(ellipse_at_center,hsl(var(--lime)/0.15),transparent_60%)]" />
      <div className="max-w-7xl mx-auto text-center">
        <div className="label-mono mb-6">{"// ready?"}</div>
        <h2 className="mono text-5xl md:text-7xl lg:text-[112px] leading-[0.92] tracking-tight">
          your money,<br />
          <span className="gradient-text">unbound.</span>
        </h2>
        <p className="mt-8 text-muted-foreground max-w-xl mx-auto">
          Open a Nimble account in under two minutes. No fees to start, no card required.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/login" className="btn-lime">
            create free account <ArrowUpRight className="h-4 w-4" />
          </Link>
          <a href="#features" className="btn-ghost">tour the product</a>
        </div>
      </div>
    </section>
  );
};

export default CTA;