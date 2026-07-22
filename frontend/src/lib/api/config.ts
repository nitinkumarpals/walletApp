/**
 * Central API configuration. The backend base URL comes from the environment
 * so the app is not hardcoded to a single host.
 */
/**
 * For client-side fetch calls, we proxy through Next.js (/api) to avoid cross-domain cookie issues.
 */
export const API_BASE_URL = "/api";

/**
 * For server-side fetch calls (which run in Node), we bypass the proxy and hit the backend directly.
 */
export const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

/** All backend routes in one place (Spring backend). */
export const API_PATHS = {
  // auth
  login: "/auth/login",
  signUp: "/auth/sign-up",
  logout: "/auth/logout",
  googleLogin: "/auth/google",
  me: "/user/me",
  // ledger
  balance: "/balance",
  // deposit (Razorpay "add money")
  depositOrder: "/deposit/order",
  depositFail: "/deposit/fail",
  depositHistory: "/deposit/history",
  razorpayWebhook: "/webhooks/razorpay",
  // transfer
  transfer: "/transfer/send",
  // activity / reporting
  statement: "/activity",
  transferCount: "/activity/transfer-count",
  recipients: "/activity/recipients",
  analytics: "/activity/analytics",
} as const;
