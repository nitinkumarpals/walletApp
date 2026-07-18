"use client";

import { useState, useEffect } from "react";
import BentoTile from "@/components/bento-tile";
import StatusPill from "@/components/status-pill";
import { walletApi } from "@/lib/api/client";
import { Loader2 } from "lucide-react";

/* eslint-disable */
enum TransactionStatus {
  Success = "success",
  Failure = "failed",
  Processing = "pending",
}
/* eslint-enable */
interface Transaction {
  id: string;
  timestamp: Date;
  amount: number;
  status: TransactionStatus;
  provider: string;
  type: "onRamp";
}

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

export default function DepositHistory({ reload }: { reload: boolean }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { deposits } = await walletApi.statement();
        const combinedTransactions: Transaction[] =
          deposits.map((t, idx: number) => ({
            id: `deposit-${idx}`,
            timestamp: new Date(t.createdAt),
            amount: t.amountMinor,
            status:
              t.status === "COMPLETED"
                ? TransactionStatus.Success
                : t.status === "FAILED"
                  ? TransactionStatus.Failure
                  : TransactionStatus.Processing,
            provider: t.paymentMethod ?? "Razorpay",
            type: "onRamp" as const,
          }));

        combinedTransactions.sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );
        setTransactions(combinedTransactions.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [reload]);

  return (
    <BentoTile label="[03] recent">
      <div className="mt-2 divide-y divide-border">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-lime" />
          </div>
        ) : transactions.length === 0 ? (
           <div className="py-8 text-center mono text-sm text-muted-foreground">
             no recent transactions.
           </div>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-3">
              <div>
                <div className="mono text-sm text-foreground">added via {t.provider}</div>
                <div className="label-mono">{t.type} · {formatDate(t.timestamp)}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="num text-sm text-lime">
                  +{inr(t.amount / 100)}
                </div>
                <StatusPill status={t.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </BentoTile>
  );
}
