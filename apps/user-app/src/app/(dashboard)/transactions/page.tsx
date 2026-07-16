"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import StatusPill from "@/components/status-pill";
import { cn } from "@/src/lib/utils";
import axios from "axios";
import { useAuth } from "@/src/lib/auth-context";

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
  type: "P2P" | "OnRamp" | "Transfer";
  amount: number;
  date: Date;
  details: string;
  status: string;
  direction: "in" | "out";
};

const FILTERS = ["all", "onramp", "p2p", "transfer"] as const;
type Filter = typeof FILTERS[number];

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { data } = await axios.get("http://localhost:3001/transactions", { withCredentials: true });
        const { p2pTransfers, onRampTransactions } = data;
        
        const allTransactions: Transaction[] = [
          ...p2pTransfers.map((t: any, index: any) => {
            const isOut = t.fromUserId === Number(user?.id);
            return {
              id: `${t.id}-${index}-p2p`,
              type: "P2P" as const,
              amount: t.amount / 100,
              date: new Date(t.timestamp),
              details: isOut ? `sent to ${t.toUser.name || t.toUser.email}` : `received from ${t.fromUser.name || t.fromUser.email}`,
              status: "completed",
              direction: isOut ? "out" : "in",
            };
          }),
          ...onRampTransactions.map((t: any, index: any) => ({
            id: `${t.id}-${index}-ramp`,
            type: "OnRamp" as const,
            amount: t.amount / 100,
            date: new Date(t.startTime),
            details: `added via ${t.provider}`,
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
        <div className="label-mono mb-3">// ledger</div>
        <h1 className="mono text-4xl md:text-5xl tracking-tight leading-[0.95]">transactions.</h1>
        <p className="text-muted-foreground mt-3 mono text-sm">
          every p2p transfer and on-ramp, in one stream.
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
                <div className="label-mono">// no transactions match</div>
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
