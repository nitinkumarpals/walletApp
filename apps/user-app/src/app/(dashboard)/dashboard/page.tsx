import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBalance } from "../transfer/page";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  RotateCcwIcon,
  TrendingUpIcon,
} from "lucide-react";
async function balanceFunction() {
  const balance = await getBalance();
  return balance.amount / 100;
}
export default function DashboardContent() {
  const balance = balanceFunction();
  return (
    <div
      className="p-4 ml-36 sm:p-6 md:p-8 min-h-screen"
      style={{ backgroundColor: "#EBE6E6" }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Welcome back, User!
      </h2>

      {/* Balance and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{balance}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 sm:gap-4">
            <Button className="flex-1" asChild>
              <Link href="/p2p">
                <ArrowUpIcon className="mr-2 h-4 w-4" /> Send Money
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/transfer">
                <ArrowDownIcon className="mr-2 h-4 w-4" /> Add Money
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="mb-6 sm:mb-8">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span className="flex items-center">
                <ArrowUpIcon className="mr-2 h-4 w-4 text-red-500" />
                Sent to John
              </span>
              <span className="text-red-500">-₹50.00</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="flex items-center">
                <ArrowDownIcon className="mr-2 h-4 w-4 text-green-500" />
                Received from Sarah
              </span>
              <span className="text-green-500">+₹100.00</span>
            </li>
            
          </ul>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Received
            </CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹5,678</div>
            <p className="text-xs text-muted-foreground">
              +10.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">P2P Transfers</CardTitle>
            <RotateCcwIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Goal</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">60%</div>
            <p className="text-xs text-muted-foreground">+5% to goal</p>
          </CardContent>
        </Card>
      </div>

      {/* Promotions or Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Tips & Promotions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Save more by referring friends! Get ₹50 for each successful
            referral.
          </p>
          <Button className="mt-4" variant="outline">
            Refer a Friend
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
