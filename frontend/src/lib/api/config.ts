/**
 * Central API configuration. The backend base URL comes from the environment
 * so the app is not hardcoded to a single host.
 */
export const CLIENT_API_BASE = "/api/backend";
export const SERVER_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

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
