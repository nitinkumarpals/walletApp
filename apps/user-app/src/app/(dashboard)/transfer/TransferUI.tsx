"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import AddMoney from "@/components/AddMoneyCard";
import { BalanceCard } from "@/components/BalanceCard";
import OnRampTransactions from "../../../../components/OnRampTransaction";
import { getBalance } from "./action";

export default function TransferUI() {
  const [reload, setReload] = React.useState<boolean>(false);
  const refresh = () => setReload(!reload);
  const [balance, setBalance] = React.useState({
    amount: 0,
    locked: 0,
  });

  useEffect(() => {
    getBalance().then((res: any) => {
      if (res && typeof res.amount !== 'undefined') {
        setBalance(res);
      }
    });
  }, [reload]);

  return (
    <>
      <div className="mb-10">
        <div className="label-mono mb-3">// top up</div>
        <h1 className="mono text-4xl md:text-5xl tracking-tight leading-[0.95]">transfer.</h1>
        <p className="text-muted-foreground mt-3 mono text-sm">
          add money from card, bank, or upi in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3"
        >
          <AddMoney refresh={refresh} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.08 } }}
          className="lg:col-span-2"
        >
          <BalanceCard amount={balance.amount} locked={balance.locked} />
        </motion.div>
      </div>

      <div className="mt-6">
        <OnRampTransactions reload={reload} />
      </div>
    </>
  );
}
