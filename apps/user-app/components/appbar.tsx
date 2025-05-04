"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Wallet, ChevronDown } from "lucide-react";

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
        className={`sticky top-0 z-50 w-full transition-all duration-300 px-4 md:px-8 ${
          isScrolled
            ? "py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm"
            : "py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-wallet-purple to-wallet-blue rounded-md opacity-20 blur-sm"></div>
              <Wallet size={28} className="relative text-wallet-purple" />
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="font-bold text-xl"
            >
              NimbleWallet
            </motion.span>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            <NavItem label="Features" href="#features" />
            <NavItem label="How it works" href="#how-it-works" hasDropdown />
            <NavItem label="Security" href="#security" />
            <NavItem label="FAQ" href="#faq" />
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-sm hover:text-wallet-purple hover:bg-wallet-purple/5"
              >
                Log in
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-wallet-purple hover:bg-wallet-dark-purple text-white rounded-xl">
                Get Started
              </Button>
            </Link>
          </div>

          <button
            className="lg:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-wallet-purple/5 text-wallet-purple"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-white dark:bg-gray-900"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-full flex flex-col">
              <div className="py-6 px-4 md:px-8 flex items-center justify-between border-b">
                <div className="flex items-center gap-2">
                  <Wallet size={28} className="text-wallet-purple" />
                  <span className="font-bold text-xl">NimbleWallet</span>
                </div>
                <button
                  className="flex items-center justify-center h-10 w-10 rounded-xl bg-wallet-purple/5 text-wallet-purple"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-auto py-8 px-4 md:px-8">
                <div className="space-y-6">
                  <MobileNavItem
                    label="Features"
                    href="#features"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavItem
                    label="How it works"
                    href="#how-it-works"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavItem
                    label="Security"
                    href="#security"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavItem
                    label="FAQ"
                    href="#faq"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </div>
              </div>

              <div className="py-6 px-4 md:px-8 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/login"
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="w-full border-wallet-purple text-wallet-purple hover:bg-wallet-purple/5"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link
                    href="/login"
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-wallet-purple hover:bg-wallet-dark-purple text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const NavItem: React.FC<{
  label: string;
  href: string;
  hasDropdown?: boolean;
}> = ({ label, href, hasDropdown = false }) => {
  return (
    <a
      href={href}
      className="relative px-4 py-2 rounded-xl text-gray-600 hover:text-wallet-purple hover:bg-wallet-purple/5 transition-colors group"
    >
      <span className="flex items-center gap-1">
        {label}
        {hasDropdown && (
          <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-wallet-purple transition-colors" />
        )}
      </span>

      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-wallet-purple group-hover:w-[calc(100%-16px)] transition-all duration-300"></span>
    </a>
  );
};

const MobileNavItem: React.FC<{
  label: string;
  href: string;
  onClick: () => void;
}> = ({ label, href, onClick }) => {
  return (
    <a
      href={href}
      className="block px-2 py-4 text-xl font-medium border-b border-gray-100 dark:border-gray-800"
      onClick={onClick}
    >
      {label}
    </a>
  );
};

export default Navbar;
