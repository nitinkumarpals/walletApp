import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Send, Plus, CreditCard, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import BentoTile from "@/components/bento-tile";
import { getBalance } from "../transfer/page";
import { getServerSession } from "@/src/lib/getServerSession";
import { cookies } from "next/headers";

function inr(amount: number) {
  return amount.toLocaleString("en-IN", { style: "currency", currency: "INR" });
}

export default async function DashboardContent() {
  const balanceData = await getBalance();
  const balance = balanceData.amount / 100;
  
  const session = await getServerSession();
  const token = cookies().get('Authentication')?.value;
  let p2pTransferCount = 0;
  let analyticsData: any = { dailyTotals: [] };
  
  try {
    const res = await fetch("http://localhost:3001/transactions/p2p-count", {
      headers: { Cookie: `Authentication=${token}` }
    });
    if (res.ok) {
      const data = await res.text();
      p2pTransferCount = Number(data);
    }
    
    const analyticsRes = await fetch("http://localhost:3001/transactions/analytics", {
      headers: { Cookie: `Authentication=${token}` }
    });
    if (analyticsRes.ok) {
      analyticsData = await analyticsRes.json();
    }
  } catch (error) {}

  let transactionsData: any = { p2pTransfers: [], onRampTransactions: [] };
  try {
    const res = await fetch("http://localhost:3001/transactions", {
      headers: { Cookie: `Authentication=${token}` },
    });
    if (res.ok) {
      transactionsData = await res.json();
    }
  } catch (error) {}

  const userName = session?.user?.name || "user";
  const userId = session?.user?.id;
  const formattedBalance = inr(balance).split(".");

  let totalSpent = 0;
  let totalReceived = 0;

  const allTxns: any[] = [];

  transactionsData.p2pTransfers.forEach((t: any) => {
    const isOut = t.fromUserId === Number(userId);
    if (isOut) totalSpent += t.amount / 100;
    else totalReceived += t.amount / 100;
    
    allTxns.push({
      id: `p2p-${t.id}`,
      direction: isOut ? "out" : "in",
      details: isOut ? `Sent to ${t.toUser?.name || t.toUser?.email}` : `Received from ${t.fromUser?.name || t.fromUser?.email}`,
      type: "P2P",
      date: new Date(t.timestamp).toLocaleDateString(),
      amount: t.amount / 100,
      timestamp: new Date(t.timestamp).getTime(),
    });
  });

  transactionsData.onRampTransactions.forEach((t: any) => {
    if (t.status === "Success") {
      totalReceived += t.amount / 100;
      allTxns.push({
        id: `onramp-${t.id}`,
        direction: "in",
        details: `Top up via ${t.provider}`,
        type: "OnRamp",
        date: new Date(t.startTime).toLocaleDateString(),
        amount: t.amount / 100,
        timestamp: new Date(t.startTime).getTime(),
      });
    }
  });

  allTxns.sort((a, b) => b.timestamp - a.timestamp);
  const recent = allTxns.slice(0, 3);

  return (
    <>
      <div className="mb-10">
        <div className="label-mono mb-3">// overview</div>
        <h1 className="mono text-4xl md:text-5xl tracking-tight leading-[0.95]">
          welcome back, <span className="text-lime">{userName.toLowerCase()}</span>.
        </h1>
        <p className="text-muted-foreground mt-3 mono text-sm">
          here's what your money did today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5 auto-rows-[minmax(160px,auto)]">
        <div className="md:col-span-4">
          <BentoTile label="[01] balance" title="available" className="h-full">
            <div className="num text-5xl md:text-6xl text-foreground mt-2">
              {formattedBalance[0]}
              <span className="text-muted-foreground">.{formattedBalance[1] || "00"}</span>
            </div>
            <Spark 
              className="mt-6" 
              data={analyticsData?.dailyTotals?.length ? analyticsData.dailyTotals.map((d: any) => d.inflow + d.outflow) : undefined} 
            />
            <div className="mt-6 label-mono flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-lime" />
              <span className="text-lime">▲ active</span> all systems nominal
            </div>
          </BentoTile>
        </div>

        <div className="md:col-span-2">
          <BentoTile label="[02] quick" className="h-full">
            <div className="flex flex-col gap-2.5 mt-1">
              <Link href="/p2p" className="btn-lime justify-between w-full">
                <span className="flex items-center gap-2"><Send className="h-4 w-4" /> send money</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/transfer" className="btn-ghost justify-between w-full">
                <span className="flex items-center gap-2"><Plus className="h-4 w-4" /> add money</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/cards" className="btn-ghost justify-between w-full">
                <span className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> issue card</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </BentoTile>
        </div>

        <div className="md:col-span-6">
          <BentoTile label="[03] recent activity" title="last 7 days" className="h-full">
            <div className="mt-2 divide-y divide-border">
              {recent.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    {t.direction === "in" ? (
                      <TrendingDown className="h-4 w-4 text-lime rotate-180" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-destructive rotate-180" />
                    )}
                    <div>
                      <div className="mono text-sm text-foreground">{t.details}</div>
                      <div className="label-mono">{t.type} · {t.date}</div>
                    </div>
                  </div>
                  <div className={t.direction === "in" ? "num text-sm text-lime" : "num text-sm text-foreground"}>
                    {t.direction === "in" ? "+" : "−"}{inr(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          </BentoTile>
        </div>

        <StatCell label="total spent" value={inr(totalSpent)} delta="lifetime" dir="down" />
        <StatCell label="total received" value={inr(totalReceived)} delta="lifetime" dir="up" />
        <StatCell label="p2p transfers" value={String(p2pTransferCount)} delta="completed" dir="up" />
        <StatCell label="net flow" value={inr(totalReceived - totalSpent)} delta="30 days" dir={totalReceived >= totalSpent ? "up" : "down"} />

        <div className="md:col-span-6">
          <BentoTile label="[07] insight" className="h-full">
            <div className="mono text-lg text-foreground leading-tight max-w-3xl">
              {analyticsData?.totalIn > 0 || analyticsData?.totalOut > 0 ? (
                <>
                  In the last 30 days, you received{" "}
                  <span className="text-lime">{inr(analyticsData.totalIn)}</span>{" "}
                  and sent{" "}
                  <span className={analyticsData.totalOut > analyticsData.totalIn ? "text-destructive" : "text-foreground"}>{inr(analyticsData.totalOut)}</span>.{" "}
                  {analyticsData.net >= 0 ? (
                    <span className="text-lime">Net positive by {inr(analyticsData.net)}.</span>
                  ) : (
                    <span className="text-destructive">Net outflow of {inr(Math.abs(analyticsData.net))}.</span>
                  )}
                </>
              ) : (
                <>Make your first transaction to unlock insights. Your data will appear here.</>                
              )}
            </div>
            <div className="mt-4 label-mono flex items-center gap-2">
              <BarChart3 className="h-3.5 w-3.5 text-lime" /> ai · nimble.brain
            </div>
          </BentoTile>
        </div>
      </div>
    </>
  );
}

const StatCell: React.FC<{ label: string; value: string; delta: string; dir: "up" | "down" }> = ({ label, value, delta, dir }) => (
  <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
    <div className="tile p-6 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="label-mono">{label}</span>
        {dir === "up" ? (
          <TrendingUp className="h-3.5 w-3.5 text-lime" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-destructive" />
        )}
      </div>
      <div>
        <div className="num text-3xl text-foreground mt-6">{value}</div>
        <div className="label-mono mt-2">
          <span className={dir === "up" ? "text-lime" : "text-destructive"}>{delta}</span>
        </div>
      </div>
    </div>
  </div>
);

const Spark: React.FC<{ className?: string; data?: number[] }> = ({ className, data }) => {
  let points = "0,30 15,22 30,26 45,14 60,18 75,10 90,20 105,8 120,16 135,6 150,12 165,4 180,10 200,2";
  
  if (data && data.length > 0) {
    const max = Math.max(...data, 1); // Avoid division by zero
    const w = 200;
    const h = 40;
    const step = w / Math.max(data.length - 1, 1);
    
    points = data.map((val, i) => {
      const x = i * step;
      // Invert Y because 0 is at the top of the SVG
      const y = h - (val / max) * h;
      // Keep it within bounds (give 2px padding top/bottom so stroke isn't clipped)
      const boundedY = Math.max(2, Math.min(h - 2, y));
      return `${x.toFixed(1)},${boundedY.toFixed(1)}`;
    }).join(" ");
  }

  return (
    <svg viewBox="0 0 200 40" className={`w-full h-12 ${className || ""}`} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="hsl(var(--lime))"
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
};
