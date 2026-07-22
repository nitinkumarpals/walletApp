"use client";
import React from "react";
import { ShieldCheck } from "lucide-react";

const SPECS: [string, string][] = [
  ["encryption", "AES-256 · TLS 1.3"],
  ["compliance", "SOC 2 · PCI-DSS L1"],
  ["auth", "passkeys · biometric · 2FA"],
  ["custody", "segregated · FDIC partners"],
  ["monitoring", "24/7 anomaly + fraud"],
  ["audit", "quarterly · Big-4 signed"],
];

const Security: React.FC = () => {
  return (
    <section id="security" className="px-4 md:px-8 py-24 md:py-32 border-b border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="label-mono mb-4">{"// trust surface"}</div>
          <h2 className="mono text-4xl md:text-6xl leading-[0.95] tracking-tight">
            encrypted<br />end-to-end.<br />
            <span className="text-muted-foreground">audited quarterly.</span>
          </h2>
          <p className="mt-8 text-muted-foreground max-w-md">
            Your money is held with regulated custody partners. Your data never leaves the
            perimeter unencrypted. Every access is logged and reviewed.
          </p>
          <div className="mt-10 inline-flex items-center gap-3 border border-border rounded-full px-4 py-2">
            <ShieldCheck className="h-4 w-4 text-lime" />
            <span className="mono text-[12px] text-foreground/80">status · <span className="text-lime">all systems operational</span></span>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="tile p-2">
            <ul>
              {SPECS.map(([k, v], i) => (
                <li
                  key={k}
                  className={`flex items-center justify-between px-6 py-5 mono ${
                    i !== SPECS.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className="label-mono">{k}</span>
                  <span className="text-foreground text-sm">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;