import { cookies } from "next/headers";

import { API_PATHS } from "./config";

// Server Components run outside the browser, so they can't use the relative
// same-origin proxy path (/api/backend) — call the backend directly instead.
const SERVER_API_BASE = process.env.BACKEND_URL ?? "http://localhost:8080";
import type {
  AnalyticsResponse,
  BalanceResponse,
  DepositHistoryEntry,
  MeResponse,
  StatementResponse,
} from "./types";

/**
 * Server-component fetch: forwards the httpOnly {@code Authentication} cookie to
 * the backend and never caches. Returns null on any failure so pages degrade
 * gracefully.
 */
async function serverRequest<T>(path: string): Promise<T | null> {
  const token = cookies().get("Authentication")?.value;
  try {
    const res = await fetch(`${SERVER_API_BASE}${path}`, {
      headers: token ? { Cookie: `Authentication=${token}` } : {},
      cache: "no-store",
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
}

export const serverApi = {
  me: () => serverRequest<MeResponse>(API_PATHS.me),
  balance: () => serverRequest<BalanceResponse>(API_PATHS.balance),
  statement: () => serverRequest<StatementResponse>(API_PATHS.statement),
  analytics: () => serverRequest<AnalyticsResponse>(API_PATHS.analytics),
  depositHistory: () => serverRequest<DepositHistoryEntry[]>(API_PATHS.depositHistory),
  async transferCount(): Promise<number> {
    const token = cookies().get("Authentication")?.value;
    try {
      const res = await fetch(`${SERVER_API_BASE}${API_PATHS.transferCount}`, {
        headers: token ? { Cookie: `Authentication=${token}` } : {},
        cache: "no-store",
      });
      if (!res.ok) return 0;
      return Number(await res.text());
    } catch {
      return 0;
    }
  },
};
