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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    currency: "USD",
  }).format(amount / 100);
}

type Transaction = {
  id: number;
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
          ...p2pTransfers.map((t) => ({
            id: t.id,
            type: "P2P" as const,
            amount: t.amount,
            date: new Date(t.timestamp),
            details:
              t.fromUserId === t.toUserId
                ? "Self Transfer"
                : `${t.fromUser.name} → ${t.toUser.name}`, // Display usernames
            status: "Completed",
          })),
          ...onRampTransactions.map((t) => ({
            id: t.id,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading transactions...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Transactions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Transactions</CardTitle>
          <CardDescription>
            A list of all your P2P transfers and on-ramp transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="filter">Filter</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger id="filter">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={`${transaction.type}-${transaction.id}`}>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{formatAmount(transaction.amount)}</TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.details}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status.toLowerCase() === "completed"
                          ? "default"
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
          {filteredTransactions.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No transactions found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
