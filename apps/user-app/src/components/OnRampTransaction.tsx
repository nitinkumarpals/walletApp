"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDownIcon, ArrowUpIcon, ClockIcon } from "lucide-react";
import { getTransactions } from "../lib/actions/getTransactions";
// eslint-disable-next-line no-unused-vars
enum TransactionStatus {
  // eslint-disable-next-line no-unused-vars
  Success = "success",
  // eslint-disable-next-line no-unused-vars
  Failure = "failed",
  // eslint-disable-next-line no-unused-vars
  Processing = "pending",
}

interface Transaction {
  timestamp: Date;
  amount: number;
  status: TransactionStatus;
  provider: string;
  type: "onRamp";
}

export default function RecentTransactions() {
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
                : t.status === "failed"
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
  }, []);

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
        <CardTitle className="text-xl font-bold">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No recent transactions
          </div>
        ) : (
          <ScrollArea className="h-[200px]">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="text-left font-medium p-2">Date & Time</th>
                  <th className="text-left font-medium p-2">Provider</th>
                  <th className="text-right font-medium p-2">Amount</th>
                  <th className="text-right font-medium p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="p-2 text-sm">
                      {t.timestamp.toLocaleString()}
                    </td>
                    <td className="p-2 text-sm">{t.provider}</td>
                    <td className="p-2 text-right font-semibold text-green-600">
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="p-2 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {getStatusIcon(t.status)}
                        {getStatusBadge(t.status)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
