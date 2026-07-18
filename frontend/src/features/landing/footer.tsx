"use client";
import React from "react";

const COLS: { header: string; links: string[] }[] = [
  { header: "product", links: ["features", "add money", "cards", "fx", "security"] },
  { header: "company", links: ["about", "careers", "press", "blog"] },
  { header: "legal", links: ["privacy", "terms", "acceptable use", "cookies"] },
];

const Footer: React.FC = () => {
  return (
    <footer className="px-4 md:px-8 py-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="mono text-lg text-foreground">nimble<span className="text-lime">/</span></div>
            <p className="mt-4 text-muted-foreground max-w-xs text-sm">
              A wallet built for how money actually moves in 2026.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 label-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-lime animate-ticker" />
              all systems operational
            </div>
          </div>
          {COLS.map((c) => (
            <div key={c.header}>
              <div className="label-mono mb-4">{c.header}</div>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="mono text-sm text-foreground/80 hover:text-lime transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="label-mono">© {new Date().getFullYear()} nimble labs · not a bank · funds held with regulated partners</div>
          <div className="flex items-center gap-4 label-mono">
            <a href="#" className="hover:text-lime">x</a>
            <a href="#" className="hover:text-lime">github</a>
            <a href="#" className="hover:text-lime">linkedin</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;