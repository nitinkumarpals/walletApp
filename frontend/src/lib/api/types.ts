/** Response types mirroring the Spring backend. All amounts are minor units (paise). */

export type SessionUser = {
  id: number;
  email: string;
  number: string | null;
  name?: string | null;
};

export type MeResponse = { user: SessionUser };

export type BalanceResponse = { amount: number; locked: number };

export type DepositOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

export type DepositHistoryEntry = {
  method: string;
  count: number;
  completedCount: number;
  totalAmountMinor: number;
  lastUsedAt: string;
};

export type StatementTransfer = {
  id: number;
  amountMinor: number;
  createdAt: string;
  direction: "IN" | "OUT";
  counterpartyName: string | null;
  counterpartyEmail: string | null;
};

export type StatementDeposit = {
  amountMinor: number;
  createdAt: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  paymentMethod: string | null;
  orderToken: string;
};

export type StatementResponse = {
  transfers: StatementTransfer[];
  deposits: StatementDeposit[];
};

export type AnalyticsDaily = {
  date: string;
  inflowMinor: number;
  outflowMinor: number;
};

export type AnalyticsResponse = {
  dailyTotals: AnalyticsDaily[];
  totalInMinor: number;
  totalOutMinor: number;
  netMinor: number;
};

export type Recipient = { name: string; email: string; initials: string };
