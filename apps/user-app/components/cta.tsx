"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CTA: React.FC = () => {
  return (
    <div className="py-20 px-4 md:px-8 bg-wallet-dark-purple text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to simplify your money management?
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Join thousands of users who are already enjoying the ease and security
          of NimbleWallet. Get started today for free—no credit card required.
        </p>
        <Link href="/login">
          <Button
            size="lg"
            className="bg-white text-wallet-dark-purple hover:bg-gray-100"
          >
            Create Free Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Stat number="10M+" label="Users" />
          <Stat number="99.99%" label="Uptime" />
          <Stat number="128-bit" label="Encryption" />
        </div>
      </div>
    </div>
  );
};

const Stat: React.FC<{ number: string; label: string }> = ({
  number,
  label,
}) => {
  return (
    <div>
      <p className="text-3xl font-bold mb-1">{number}</p>
      <p className="opacity-80">{label}</p>
    </div>
  );
};

export default CTA;