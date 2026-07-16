"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

const LINKS = [
  { label: "product", href: "#features" },
  { label: "add money", href: "#add" },
  { label: "security", href: "#security" },
  { label: "faq", href: "#faq" },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all ${
          scrolled ? "border-b border-border bg-background/70 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-16">
          <Link href="/" className="flex items-center gap-2 mono text-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-lime animate-ticker" />
            <span className="text-base font-medium">nimble<span className="text-lime">/</span></span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="mono text-[13px] text-muted-foreground hover:text-foreground px-3 py-2 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Link href="/login" className="mono text-[13px] text-muted-foreground hover:text-foreground px-3 py-2">
              [ log in ]
            </Link>
            <Link href="/login" className="btn-lime mono text-[13px]">
              open account <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-border text-foreground"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background"
          >
            <div className="flex items-center justify-between px-4 h-16 border-b border-border">
              <span className="mono text-foreground">nimble<span className="text-lime">/</span></span>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-border text-foreground"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-4 py-8 space-y-1">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block mono text-3xl py-4 border-b border-border"
                >
                  {l.label}
                </a>
              ))}
              <div className="pt-8 flex flex-col gap-3">
                <Link href="/login" onClick={() => setOpen(false)} className="btn-ghost justify-center">log in</Link>
                <Link href="/login" onClick={() => setOpen(false)} className="btn-lime justify-center">open account →</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
