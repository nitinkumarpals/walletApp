import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react/dist/iconify.js";
import {  WalletIcon } from "lucide-react";

interface BalanceCardProps {
  amount: number;
  locked: number;
}

export const BalanceCard = ({ amount, locked }: BalanceCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value / 100);
  };

  const totalBalance = amount + locked;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <WalletIcon className="mr-2 h-6 w-6" />
          Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {/* <UnlockIcon className="mr-2 h-4 w-4" /> */}
              <Icon icon={"mingcute:bank-fill"} className="mr-2 h-4 w-4" />
              Available Balance
            </div>
            <div className="text-lg font-semibold">
              {formatCurrency(amount)}
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${(amount / totalBalance) * 100}%` }}
            />
          </div>
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Balance
            </div>
            <div className="text-xl font-bold">
              {formatCurrency(totalBalance)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
