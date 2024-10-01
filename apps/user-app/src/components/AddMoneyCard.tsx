"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CreditCard, ArrowRight } from "lucide-react";
import createOnrampTransaction from "../lib/actions/createOnrampTransaction";

const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/",
  },
  {
    name: "Kotak Mahindra Bank",
    redirectUrl: "https://netbanking.kotak.com/knb2/",
  },
];

export default function AddMoney() {
  const [redirectUrl, setRedirectUrl] = useState(
    SUPPORTED_BANKS[0]?.redirectUrl
  );
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("");
  const { toast } = useToast();

  const handleAddMoney = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (!provider) {
      toast({
        title: "Bank Not Selected",
        description: "Please select a bank to proceed.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createOnrampTransaction(Number(amount) * 100, provider);
      toast({
        title: "Transaction Initiated",
        description: "Redirecting to your bank...",
      });
      window.location.href = redirectUrl || "";
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "An error occurred while processing your request.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add Money</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bank">Bank</Label>
          <Select
            onValueChange={(value) => {
              const selectedBank = SUPPORTED_BANKS.find(
                (x) => x.name === value
              );
              setRedirectUrl(selectedBank?.redirectUrl || "");
              setProvider(selectedBank?.name || "");
            }}
          >
            <SelectTrigger id="bank">
              <SelectValue placeholder="Select your bank" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_BANKS.map((bank) => (
                <SelectItem key={bank.name} value={bank.name}>
                  {bank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddMoney} className="w-full">
          Add Money
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
