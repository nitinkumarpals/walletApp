"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden py-20 md:py-32 px-4 md:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(108,92,231,0.3),rgba(255,255,255,0))]"></div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-[40%] top-0 h-[1000px] w-[1000px] rounded-full bg-wallet-purple opacity-5 blur-3xl"></div>
        <div className="absolute right-[30%] top-[40%] h-[800px] w-[800px] rounded-full bg-wallet-blue opacity-5 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="md:w-1/2 space-y-8"
          >
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-wallet-purple/10 text-wallet-purple text-sm font-semibold mb-6 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wallet-purple opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-wallet-purple"></span>
                </span>
                New Feature: Instant Cross-Border Payments
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold !leading-tight">
              Banking for the{" "}
              <span className="gradient-text">digital world</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg">
              Send, receive, and manage your money with unprecedented ease and
              security. No borders, no limits, just seamless financial freedom.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/login">
              <Button
                size="lg"
                className="bg-wallet-purple hover:bg-wallet-dark-purple text-white rounded-xl px-8 h-14 text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-wallet-purple text-wallet-purple hover:bg-wallet-light-purple rounded-xl px-8 h-14 text-lg"
                onClick={() =>
                  window.open(
                    "https://github.com/nitinkumarpals/walletApp",
                    "_blank"
                  )
                }
              >
                See How It Works
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 pt-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-wallet-green/10 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-wallet-green" />
                </div>
                <span className="text-sm text-gray-600">
                  Bank-level Security
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-wallet-blue/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-wallet-blue" />
                </div>
                <span className="text-sm text-gray-600">Instant Transfers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-wallet-purple/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-wallet-purple" />
                </div>
                <span className="text-sm text-gray-600">Global Coverage</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="md:w-1/2 relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-wallet-purple via-wallet-blue to-wallet-pink rounded-3xl opacity-30 blur-xl"></div>
            <div className="relative bg-white dark:bg-gray-900 p-2 md:p-4 rounded-3xl shadow-2xl">
              <div className="aspect-[5/3] overflow-hidden rounded-2xl">
                <Image
                  src="/images/coin.jpg"
                  alt="Digital Wallet Interface"
                  width={1200}
                  height={720}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              <div className="absolute -bottom-10 -right-10 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-xl animate-float">
                <div className="flex items-center gap-4 p-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-wallet-purple to-wallet-blue rounded-xl flex items-center justify-center text-white">
                    <CheckIcon />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Completed</p>
                    <p className="font-bold text-lg">$3,659.00</p>
                  </div>
                </div>
              </div>

              <div
                className="absolute -top-10 -left-10 bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-xl animate-float"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex items-center gap-3 p-1">
                  <div className="h-8 w-8 bg-wallet-green/20 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-wallet-green" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">+12.7%</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-24 flex justify-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
            <StatsCard number="10M+" label="Active Users" />
            <StatsCard number="100+" label="Countries" />
            <StatsCard number="$50B+" label="Transactions" />
            <StatsCard number="99.99%" label="Uptime" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StatsCard: React.FC<{number: string; label: string}> = ({ number, label }) => {
  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-bold mb-1 gradient-text">{number}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  );
};

export default Hero;