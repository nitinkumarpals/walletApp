"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300 px-4 md:px-8 border-b border-transparent",
          isScrolled ? "py-4 bg-background/60 backdrop-blur-xl border-border" : "py-6"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: Wordmark */}
          <Link href="/">
            <div className="flex items-center gap-1 font-mono text-xl tracking-tight text-fg hover:text-accent transition-colors">
              <span className="font-bold">nimble</span>
              <span className="text-accent">/</span>
            </div>
          </Link>

          {/* Center: Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavItem label="features" href="#features" />
            <NavItem label="pricing" href="#pricing" />
            <NavItem label="docs" href="#docs" />
          </div>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="font-mono text-sm tracking-tight text-muted hover:text-fg hover:bg-surface-2"
              >
                [ log in ]
              </Button>
            </Link>
            <Link href="/login">
              <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-mono text-sm tracking-tight px-6">
                connect <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden flex items-center justify-center h-10 w-10 text-fg"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-background"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="h-full flex flex-col">
              <div className="py-6 px-4 md:px-8 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-1 font-mono text-xl tracking-tight text-fg">
                  <span className="font-bold">nimble</span>
                  <span className="text-accent">/</span>
                </div>
                <button
                  className="flex items-center justify-center h-10 w-10 text-fg"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 py-8 px-4 md:px-8">
                <div className="space-y-6">
                  <MobileNavItem label="features" href="#features" onClick={() => setIsMobileMenuOpen(false)} />
                  <MobileNavItem label="pricing" href="#pricing" onClick={() => setIsMobileMenuOpen(false)} />
                  <MobileNavItem label="docs" href="#docs" onClick={() => setIsMobileMenuOpen(false)} />
                </div>
              </div>

              <div className="py-6 px-4 md:px-8 border-t border-border space-y-4">
                <Link href="/login" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full font-mono tracking-tight bg-surface border-border text-fg hover:bg-surface-2 hover:border-accent">
                    [ log in ]
                  </Button>
                </Link>
                <Link href="/login" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-mono tracking-tight">
                    connect <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const NavItem: React.FC<{ label: string; href: string }> = ({ label, href }) => {
  return (
    <a
      href={href}
      className="font-mono text-sm tracking-tight text-muted hover:text-accent transition-colors"
    >
      {label}
    </a>
  );
};

const MobileNavItem: React.FC<{ label: string; href: string; onClick: () => void }> = ({ label, href, onClick }) => {
  return (
    <a
      href={href}
      className="block text-2xl font-mono tracking-tight text-muted hover:text-accent border-b border-border/50 pb-4"
      onClick={onClick}
    >
      {label}
    </a>
  );
};

export default Navbar;
