"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import BentoTile from "@/components/bento-tile";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/src/lib/auth-context";

// @ts-ignore
enum OnRampStatus {
  Success = "Success",
  Failure = "Failure",
  Processing = "Processing",
}

const CHIPS = [500, 1000, 5000, 10000];
const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || "http://localhost:8787";

export default function AddMoney({ refresh }: { refresh: () => void }) {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const loadRazorpay = () => {
      if (document.getElementById("razorpay-script")) {
        setRazorpayLoaded(true);
        return;
      }
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
  }, []);

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
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
    
    setIsLoading(true);
    const paisaAmount = Number(amount) * 100;
    try {
      const { data: orderRes } = await axios.post("http://localhost:3001/onramp/razorpay", { amount: paisaAmount }, { withCredentials: true });
      const order = orderRes.order;

      await axios.post("http://localhost:3001/onramp/create", {
        amount: paisaAmount,
        status: OnRampStatus.Processing,
        provider: "Razorpay",
        token: order.id
      }, { withCredentials: true });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paisaAmount,
        currency: "INR",
        name: "NimbleWallet",
        description: "Add Money to Wallet",
        order_id: order?.id,
        handler: async (response: any) => {
          try {
            const res = await axios.post(`${WEBHOOK_URL}/webhook`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              user_identifier: String(user?.id),
              amount: paisaAmount.toString(),
            });
            if (res.status === 200) {
              toast({
                title: "Payment Successful",
                description: `₹${amount} added to your wallet.`,
              });
              refresh();
              setAmount("");
            } else {
              toast({ title: "Payment Verification Failed", description: "Please contact support.", variant: "destructive" });
            }
          } catch (error) {
            toast({ title: "Payment Verification Failed", description: "Signature mismatch or server error.", variant: "destructive" });
          }
        },
        theme: { color: "#C7FF3D" },
        modal: { backdropclose: false },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", (response: any) => {
        toast({
          title: "Payment Failed",
          description: response.error.description,
          variant: "destructive",
        });
        axios.post("http://localhost:3001/onramp/create", {
          amount: paisaAmount,
          status: OnRampStatus.Failure,
          provider: "Razorpay",
          token: response.error.metadata.payment_id
        }, { withCredentials: true });
      });

      razorpay.open();
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "An error occurred while processing your request.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BentoTile label="[01] add money">
      <form onSubmit={handleAddMoney} className="mt-2">

        <label className="label-mono">amount</label>
        <div className="mt-2 flex items-center rounded-lg border border-border bg-surface-2 focus-within:border-lime/60 transition-colors">
          <span className="px-4 num text-2xl text-muted-foreground">₹</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            required
            className="flex-1 bg-transparent num text-2xl text-foreground py-4 pr-4 focus:outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {CHIPS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setAmount(String(c))}
              className="mono text-[12px] px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-lime hover:border-lime/60"
            >
              ₹{c.toLocaleString("en-IN")}
            </button>
          ))}
        </div>

        <button type="submit" disabled={isLoading} className="btn-lime w-full justify-center mt-8 disabled:opacity-50">
          {isLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> processing</>
          ) : (
            <>add money <ArrowRight className="h-4 w-4 ml-2" /></>
          )}
        </button>

        <div className="label-mono mt-5">
          powered by razorpay · instant · fee 0.00%
        </div>
      </form>
    </BentoTile>
  );
}
