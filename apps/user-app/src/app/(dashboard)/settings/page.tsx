import React from "react";
import BentoTile from "@/components/bento-tile";
import { Shield, Key, Zap, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { getServerSession } from "@/src/lib/getServerSession";
import { cookies } from "next/headers";

function inr(amount: number) {
  return (amount / 100).toLocaleString("en-IN", { style: "currency", currency: "INR" });
}

export default async function SettingsPage() {
  const session = await getServerSession();
  const token = cookies().get("Authentication")?.value;
  
  let onrampHistory: any[] = [];
  try {
    const res = await fetch("http://localhost:3001/onramp/history", {
      headers: { Cookie: `Authentication=${token}` },
    });
    if (res.ok) {
      onrampHistory = await res.json();
    }
  } catch (error) {}

  return (
    <>
      <div className="mb-10">
        <div className="label-mono mb-3">// system</div>
        <h1 className="mono text-4xl md:text-5xl tracking-tight leading-[0.95]">settings.</h1>
        <p className="text-muted-foreground mt-3 mono text-sm max-w-lg">
          manage your identity, security, and linked systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <BentoTile label="[01] identity" className="h-full">
          <div className="flex flex-col gap-5 mt-2">
            <div>
              <label className="label-mono mb-1.5 block">name</label>
              <div className="h-11 px-4 rounded-lg bg-surface-2 border border-border flex items-center mono text-sm text-foreground">
                {session?.user?.name || "User"}
              </div>
            </div>
            <div>
              <label className="label-mono mb-1.5 block">email</label>
              <div className="h-11 px-4 rounded-lg bg-surface-2 border border-border flex items-center mono text-sm text-foreground">
                {session?.user?.email || "No email"}
              </div>
            </div>
            <div>
              <label className="label-mono mb-1.5 block">nimble id</label>
              <div className="h-11 px-4 rounded-lg bg-surface-2 border border-border flex items-center mono text-sm text-foreground">
                usr_{session?.user?.id?.toString().padStart(8, "0")}
              </div>
            </div>
          </div>
        </BentoTile>

        <BentoTile label="[02] security" className="h-full">
          <div className="flex flex-col gap-4 mt-2">
            <div className="p-4 rounded-lg border border-border bg-surface-2 flex items-start gap-4">
              <Shield className="h-5 w-5 text-lime shrink-0 mt-0.5" />
              <div>
                <div className="mono text-sm text-foreground">nimble/vault active</div>
                <div className="label-mono mt-1">all transfers use atomic db transactions (AES-256 at rest).</div>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-surface-2 flex items-start gap-4">
              <Key className="h-5 w-5 text-lime shrink-0 mt-0.5" />
              <div>
                <div className="mono text-sm text-foreground">session active · jwt-authenticated</div>
                <div className="label-mono mt-1">your session is valid and bound to this device.</div>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-surface-2 flex items-start gap-4">
              <Zap className="h-5 w-5 text-lime shrink-0 mt-0.5" />
              <div>
                <div className="mono text-sm text-foreground">razorpay webhook · hmac-sha256</div>
                <div className="label-mono mt-1">all payments verified via signature before crediting.</div>
              </div>
            </div>
          </div>
        </BentoTile>

        <BentoTile label="[03] payment history" className="h-full">
          <div className="mt-2 divide-y divide-border">
            {onrampHistory.length === 0 ? (
              <div className="py-8 text-center mono text-sm text-muted-foreground">
                no payment history yet
              </div>
            ) : (
              onrampHistory.map((item: any) => (
                <div key={item.provider} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-surface-2 border border-border flex items-center justify-center mono text-xs text-foreground">
                      {item.provider.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="mono text-sm text-foreground">{item.provider}</div>
                      <div className="label-mono">
                        {item.successCount} successful · {inr(item.totalAmount)} topped up
                      </div>
                    </div>
                  </div>
                  {item.successCount > 0 ? (
                    <CheckCircle2 className="h-4 w-4 text-lime" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              ))
            )}
          </div>
        </BentoTile>

        <BentoTile label="[04] danger zone" className="h-full border-destructive/20 bg-destructive/5">
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="mono text-sm text-foreground mt-2">Delete Account</div>
              <p className="label-mono mt-2 text-destructive/80">
                permanently delete your account, balances, and all associated data. this action cannot be undone.
              </p>
            </div>
            <button className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-destructive/40 bg-transparent text-destructive hover:bg-destructive hover:text-background transition-colors mono text-sm group">
              <Trash2 className="h-4 w-4 group-hover:text-background" /> delete everything
            </button>
          </div>
        </BentoTile>
      </div>
    </>
  );
}
