"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDownIcon, ArrowUpIcon, ClockIcon } from "lucide-react";
import { getTransactions } from "../src/lib/actions/getTransactions";

/* eslint-disable */
enum TransactionStatus {
  Success = "success",
  Failure = "failed",
  Processing = "pending",
}
/* eslint-enable */
interface Transaction {
  timestamp: Date;
  amount: number;
  status: TransactionStatus;
  provider: string;
  type: "onRamp";
}

export default function RecentTransactions({ reload }: { reload: Boolean }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const result = await getTransactions();
        const combinedTransactions: Transaction[] =
          result.onRampTransactions.map((t: any) => ({
            timestamp: new Date(t.startTime),
            amount: t.amount,
            status:
              t.status === "Success"
                ? TransactionStatus.Success
                : t.status === "Failure"
                  ? TransactionStatus.Failure
                  : TransactionStatus.Processing,
            provider: t.provider,
            type: "onRamp" as const,
          }));

        combinedTransactions.sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );
        setTransactions(combinedTransactions.slice(0, 5)); // Get only the 5 most recent transactions
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    }

    fetchTransactions();
  }, [reload]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.Success:
        return <ArrowDownIcon className="h-4 w-4 text-green-500" />;
      case TransactionStatus.Failure:
        return <ArrowUpIcon className="h-4 w-4 text-red-500" />;
      case TransactionStatus.Processing:
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.Success:
        return <Badge variant="default">Success</Badge>;
      case TransactionStatus.Failure:
        return <Badge variant="destructive">Failed</Badge>;
      case TransactionStatus.Processing:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl font-bold">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No recent transactions
          </div>
        ) : (
          <ScrollArea className="h-[300px] sm:h-[250px]">
            <div className="space-y-4">
              {transactions.map((t, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center mb-2 sm:mb-0">
                    <div className="text-sm font-medium mr-4">{t.provider}</div>
                    <div className="text-xs text-gray-500">
                      {t.timestamp.toLocaleDateString()}{" "}
                      {t.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                    <div className="font-semibold text-green-600 mr-4">
                      {formatCurrency(t.amount)}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(t.status)}
                      {getStatusBadge(t.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
