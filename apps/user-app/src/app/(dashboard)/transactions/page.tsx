"use client";

import { useState, useEffect } from "react";
import { getTransactions } from "@/src/lib/actions/getTransactions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(amount / 100);
}

type Transaction = {
  id: string;
  type: "P2P" | "OnRamp";
  amount: number;
  date: Date;
  details: string;
  status: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { p2pTransfers, onRampTransactions } = await getTransactions();
        const allTransactions: Transaction[] = [
          ...p2pTransfers.map((t: any, index: any) => ({
            id: `${t.id}-${index}`, // Add prefix and index to ensure unique keys
            type: "P2P" as const,
            amount: t.amount,
            date: new Date(t.timestamp),
            details:
              t.fromUserId === t.toUserId
                ? "Self Transfer"
                : `${t.fromUser.name} → ${t.toUser.name}`,
            status: "Completed",
          })),
          ...onRampTransactions.map((t: any, index: any) => ({
            id: `${t.id}-${index}`,
            type: "OnRamp" as const,
            amount: t.amount,
            date: new Date(t.startTime),
            details: t.provider,
            status: t.status,
          })),
        ].sort((a, b) => b.date.getTime() - a.date.getTime());

        setTransactions(allTransactions);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch transactions. Please try again later.");
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(
    (t) =>
      (filter === "all" || t.type === filter) &&
      (t.details.toLowerCase().includes(search.toLowerCase()) ||
        t.status.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-[#6a51a6]">
        Transactions
      </h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            Your Transactions
          </CardTitle>
          <CardDescription>
            A list of all your P2P transfers and on-ramp transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <Label htmlFor="search" className="mb-1 block">
                Search
              </Label>
              <Input
                id="search"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-auto">
              <Label htmlFor="filter" className="mb-1 block">
                Filter
              </Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger id="filter" className="w-full">
                  <SelectValue placeholder="Filter transactions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="P2P">P2P Transfers</SelectItem>
                  <SelectItem value="OnRamp">On-Ramp Transactions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, index: any) => (
                      <TableRow key={`skeleton-${index}`}>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20" />
                        </TableCell>
                      </TableRow>
                    ))
                  : filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>
                          {formatAmount(transaction.amount)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {formatDate(transaction.date)}
                        </TableCell>
                        <TableCell>{transaction.details}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.status.toLowerCase() === "completed"
                                ? "default"
                                : transaction.status.toLowerCase() === "success"
                                  ? "success"
                                  : "secondary"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
          {!loading && filteredTransactions.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No transactions found.
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
