"use client";
import AddMoney from "@/components/AddMoneyCard";
import { BalanceCard } from "@/components/BalanceCard";
import React, { useEffect } from "react";
import OnRampTransactions from "../../../../components/OnRampTransaction";
import { getBalance } from "./action";

export default function TransferUI() {
  const [reload, setReload] = React.useState<Boolean>(false);
  const refresh = () => setReload(!reload);
  const [balance, setBalance] = React.useState({
    amount: 0,
    locked: 0,
  });
  useEffect(() => {
    getBalance().then((res: any) => {
      setBalance(res);
    });
  }, [reload]);
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 text-[#6a51a6]">Transfer</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddMoney refresh={refresh} />
        <BalanceCard amount={balance.amount} locked={balance.locked} />
      </div>

      <div className="mt-6">
        <OnRampTransactions reload={reload} />
      </div>
    </div>
  );
}
