"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, ArrowUpRight, Loader2 } from "lucide-react";
import BentoTile from "@/components/bento-tile";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { transferApi, walletApi } from "@/lib/api/client";

const CHIPS = [100, 500, 1000, 5000];



export default function SendPage() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [fxData, setFxData] = useState<any[]>([
    { pair: "USD/INR", value: "...", dir: "▲" },
    { pair: "EUR/INR", value: "...", dir: "▼" },
    { pair: "GBP/INR", value: "...", dir: "▲" },
  ]);
  const { toast } = useToast();

  React.useEffect(() => {
    walletApi.recipients()
      .then(setRecipients)
      .catch(err => console.error(err));

    axios.get("https://api.exchangerate-api.com/v4/latest/USD")
      .then(res => {
        const rates = res.data.rates;
        const usdInr = rates.INR;
        const eurInr = rates.INR / rates.EUR;
        const gbpInr = rates.INR / rates.GBP;
        setFxData([
          { pair: "USD/INR", value: usdInr.toFixed(2), dir: "▲" },
          { pair: "EUR/INR", value: eurInr.toFixed(2), dir: "▼" },
          { pair: "GBP/INR", value: gbpInr.toFixed(2), dir: "▲" },
        ]);
      })
      .catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !amount) return;

    setIsLoading(true);
    try {
      const result = await transferApi.send(email, Math.floor(Number(amount) * 100));
      toast({ title: "Success", description: result.message });
      setEmail("");
      setAmount("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send money. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-10">
        <div className="label-mono mb-3">{"// send"}</div>
        <h1 className="mono text-4xl md:text-5xl tracking-tight leading-[0.95]">send money.</h1>
        <p className="text-muted-foreground mt-3 mono text-sm">
          move money to any nimble handle. instant. no spread.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3"
        >
          <BentoTile label="[01] send money">
            <p className="mono text-sm text-muted-foreground mt-1 mb-6">
              transfer funds securely to another user.
            </p>

            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="label-mono">recipient email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@example.com"
                  className="mt-2 w-full h-11 px-4 rounded-lg bg-surface-2 border border-border mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime/60"
                  required
                />
              </div>

              <div>
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
                <div className="mt-3 flex flex-wrap gap-2">
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
                <div className="label-mono mt-3">
                  enter the amount you want to send
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setEmail(""); setAmount(""); }}
                  className="btn-ghost"
                >
                  cancel
                </button>
                <button type="submit" disabled={isLoading} className="btn-lime flex-1 justify-center">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> processing</>
                  ) : (
                    <><Send className="mr-2 h-4 w-4" /> send</>
                  )}
                </button>
              </div>

              <div className="label-mono pt-2">
                secured · nimble/vault · aes-256
              </div>
            </form>
          </BentoTile>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.08 } }}
          className="lg:col-span-2 space-y-5"
        >
          <BentoTile label="[02] recent recipients">
            <div className="mt-2 divide-y divide-border">
              {recipients.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground mono text-sm">
                  no recent transfers
                </div>
              ) : (
                recipients.map((r) => (
                  <button
                    key={r.email}
                    onClick={() => setEmail(r.email)}
                    type="button"
                    className="w-full flex items-center justify-between py-3 group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-surface-2 border border-border flex items-center justify-center mono text-xs text-foreground">
                        {r.initials}
                      </div>
                      <div>
                        <div className="mono text-sm text-foreground">{r.name}</div>
                        <div className="label-mono">{r.email}</div>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-lime" />
                  </button>
                ))
              )}
            </div>
          </BentoTile>

          <BentoTile label="[03] fx · live">
            <div className="mt-2 space-y-4">
              {fxData.map((r) => (
                <div key={r.pair} className="flex items-center justify-between mono text-sm">
                  <span className="text-muted-foreground">{r.pair}</span>
                  <span className="flex items-center gap-2 num text-foreground">
                    <span className={r.dir === "▲" ? "text-lime" : "text-destructive"}>{r.dir}</span>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 label-mono flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-lime animate-ticker" />
              streaming · 12ms
            </div>
          </BentoTile>
        </motion.div>
      </div>
    </>
  );
}
