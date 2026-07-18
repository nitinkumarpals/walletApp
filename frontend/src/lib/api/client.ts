import { API_BASE_URL, API_PATHS } from "./config";
import type {
  BalanceResponse,
  DepositOrderResponse,
  Recipient,
  StatementResponse,
} from "./types";

/**
 * Browser-side fetch wrapper: sends the auth cookie, encodes JSON, and turns a
 * non-2xx response into an Error carrying the backend's ProblemDetail message.
 */
export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.detail ?? body.message ?? body.error ?? message;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(message);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export type SignUpPayload = {
  name: string;
  email: string;
  password: string;
  number?: string;
};

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ success: boolean; message: string }>(API_PATHS.login, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  signUp: (data: SignUpPayload) =>
    apiRequest<{ success: boolean; message: string }>(API_PATHS.signUp, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  logout: () => apiRequest<void>(API_PATHS.logout, { method: "POST" }),
  googleLoginUrl: () => `${API_BASE_URL}${API_PATHS.googleLogin}`,
};

export type RazorpayCapturePayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export const depositApi = {
  /** Amount is in minor units (paise). */
  createOrder: (amount: number) =>
    apiRequest<DepositOrderResponse>(API_PATHS.depositOrder, {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
  capture: (payload: RazorpayCapturePayload) =>
    apiRequest<{ message: string }>(API_PATHS.razorpayWebhook, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  fail: (token: string) =>
    apiRequest<{ success: boolean; updated: boolean }>(API_PATHS.depositFail, {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
};

export const transferApi = {
  /** Amount is in minor units (paise). */
  send: (email: string, amount: number) =>
    apiRequest<{ success: boolean; message: string }>(API_PATHS.transfer, {
      method: "POST",
      body: JSON.stringify({ email, amount }),
    }),
};

export const walletApi = {
  balance: () => apiRequest<BalanceResponse>(API_PATHS.balance),
  recipients: () => apiRequest<Recipient[]>(API_PATHS.p2pRecipients),
  statement: () => apiRequest<StatementResponse>(API_PATHS.statement),
};
