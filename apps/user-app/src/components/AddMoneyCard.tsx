"use client";

import { useEffect, useState } from "react";
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
import { razorpayAction } from "../lib/actions/rajorpayAction";
import createOnrampTransaction from "../lib/actions/createOnrampTransaction";
import axios from "axios";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();

  const [redirectUrl, setRedirectUrl] = useState(
    SUPPORTED_BANKS[0]?.redirectUrl
  );
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("");
  const { toast } = useToast();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const loadRazorpay = () => {
      if (document.getElementById("razorpay-script")) return; // Avoid loading the script multiple times
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => {
        toast({
          title: "Razorpay SDK Failed to Load",
          description: "Please check your internet connection.",
          variant: "destructive",
        });
      };
      document.body.appendChild(script);
    };
    loadRazorpay();
  }, [toast]);

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
    if (!razorpayLoaded) {
      toast({
        title: "Razorpay Not Loaded",
        description: "Please wait while we load the payment gateway.",
        variant: "destructive",
      });
      return;
    }
    try {
      const order = await razorpayAction(Number(amount) * 100);
      const options = {
        key: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay key ID
        amount: Number(amount) * 100, // Amount in paise
        currency: "INR",
        name: "Your Business Name",
        description: "Add Money Transaction",
        image: "https://example.com/your_logo", // Optional logo URL
        order_id: order.order?.id, // Replace with order ID from your server
        handler: (response: any) => {
          toast({
            title: "Payment Successful",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });
          console.log("Payment successful:", response); // Handle success response
          createOnrampTransaction(
            Number(amount) * 100,
            "Processing",
            provider,
            response.razorpay_signature
          ).then((result) => {
            console.log("Onramp transaction created:", result);
            axios
              .post("/api/webhook", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user_identifier: session?.user?.id,
                amount,
              })
              .then((response) => {
                console.log(response);
              })
              .catch((error) => {
                console.error(error);
              });
          });
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", (response: any) => {
        toast({
          title: "Payment Failed",
          description: response.error.description,
          variant: "destructive",
        });
        console.error(response.error); // Handle failure response
        createOnrampTransaction(
          Number(amount) * 100,
          "Failure",
          provider,
          response.razorpay_signature
        ).then((result) => {
          console.log("Onramp transaction failed:", result);
        });
      });

      razorpay.open();
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
