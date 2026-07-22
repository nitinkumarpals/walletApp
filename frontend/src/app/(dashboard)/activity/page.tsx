"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import StatusPill from "@/components/status-pill";
import { cn } from "@/lib/utils";
import { walletApi } from "@/lib/api/client";

function inr(amount: number) {
  return amount.toLocaleString("en-IN", { style: "currency", currency: "INR" });
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date).toLowerCase();
}

type Transaction = {
  id: string;
  type: "Transfer" | "Deposit";
  amount: number;
  date: Date;
  details: string;
  status: string;
  direction: "in" | "out";
};

const FILTERS = ["all", "transfer", "deposit"] as const;
type Filter = typeof FILTERS[number];

export default function ActivityPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { transfers, deposits } = await walletApi.statement();

        const allTransactions: Transaction[] = [
          ...transfers.map((t, index) => ({
            id: `${t.id}-${index}-transfer`,
            type: "Transfer" as const,
            amount: t.amountMinor / 100,
            date: new Date(t.createdAt),
            details:
              t.direction === "OUT"
                ? `sent to ${t.counterpartyName || t.counterpartyEmail}`
                : `received from ${t.counterpartyName || t.counterpartyEmail}`,
            status: "completed",
            direction: (t.direction === "OUT" ? "out" : "in") as "in" | "out",
          })),
          ...deposits.map((t, index) => ({
            id: `${t.orderToken}-${index}-deposit`,
            type: "Deposit" as const,
            amount: t.amountMinor / 100,
            date: new Date(t.createdAt),
            details: `added via ${t.paymentMethod || "Razorpay"}`,
            status: t.status.toLowerCase(),
            direction: "in" as const,
          })),
        ].sort((a, b) => b.date.getTime() - a.date.getTime());

        setTransactions(allTransactions);
      } catch (err) {
        console.error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  const filtered = transactions.filter((t) => {
    const matchQ =
      search.length === 0 ||
      t.details.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase());
    const matchF = filter === "all" || t.type.toLowerCase() === filter;
    return matchQ && matchF;
  });

  return (
    <>
      <div className="mb-10">
        <div className="label-mono mb-3">{"// ledger"}</div>
        <h1 className="mono text-4xl md:text-5xl tracking-tight leading-[0.95]">transactions.</h1>
        <p className="text-muted-foreground mt-3 mono text-sm">
          every transfer and deposit, in one stream.
        </p>
      </div>

      <div className="tile p-0 overflow-hidden">
        <div className="p-5 md:p-6 border-b border-border flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search txns…"
              className="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-2 border border-border mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime/60 transition-colors"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTERS.map((x) => (
              <button
                key={x}
                onClick={() => setFilter(x)}
                className={cn(
                  "mono text-[12px] px-3 py-1.5 rounded-full border transition-colors",
                  filter === x
                    ? "bg-lime text-background border-lime"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                [ {x} ]
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 label-mono border-b border-border bg-surface/50">
          <div className="col-span-2">type</div>
          <div className="col-span-3">amount</div>
          <div className="col-span-3">date</div>
          <div className="col-span-2">details</div>
          <div className="col-span-2 text-right">status</div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-lime" />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
            className="divide-y divide-border"
          >
            {filtered.length === 0 ? (
              <div className="p-10 text-center">
                <div className="label-mono">{"// no transactions match"}</div>
              </div>
            ) : (
              filtered.map((t) => (
                <motion.div
                  key={t.id}
                  variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                  className="grid grid-cols-2 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-surface-2/60 transition-colors items-center"
                >
                  <div className="md:col-span-2 flex items-center gap-2 mono text-sm text-foreground">
                    {t.direction === "in" ? (
                      <TrendingDown className="h-3.5 w-3.5 text-lime rotate-180" />
                    ) : (
                      <TrendingUp className="h-3.5 w-3.5 text-destructive rotate-180" />
                    )}
                    {t.type}
                  </div>
                  <div className={cn("md:col-span-3 num text-sm", t.direction === "in" ? "text-lime" : "text-foreground")}>
                    {t.direction === "in" ? "+" : "−"}{inr(t.amount)}
                  </div>
                  <div className="md:col-span-3 mono text-xs text-muted-foreground">{formatDate(t.date)}</div>
                  <div className="md:col-span-2 mono text-xs text-foreground truncate">{t.details}</div>
                  <div className="md:col-span-2 md:text-right flex md:justify-end">
                    <StatusPill status={t.status} />
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </>
  );
}
