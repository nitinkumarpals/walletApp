# NimbleWallet — Architecture

One repo, two apps: a **Next.js frontend** (Bun) and a **Spring Boot backend** (Java 25 / Maven), joined by the OpenAPI contract in `docs/openapi.json`.

```
frontend/   Next.js App Router, Bun, feature-first (src/features/*)
backend/    Spring Boot 3.5 modular monolith (Spring Modulith)
docs/       ARCHITECTURE.md · openapi.json
```

The backend is a Spring Boot **3.5.16** modular monolith on **Java 25**, built with **Maven** (wrapper), talking to **Supabase Postgres**. Razorpay is the sole funding rail. The frontend is a client of the backend over HTTP (httpOnly `Authentication` cookie); its typed API client lives in `frontend/src/lib/api/`.

> Boot **4.x** is the current Initializr default, but `springdoc-openapi` has no Boot 4 build yet — since the OpenAPI/Swagger contract is core, we pin the latest **Boot 3.5.x** line (fully supported ecosystem) on Java 25.

## Modules (Spring Modulith)

Package root `com.nimblewallet.wallet`. Each sub-package is a module; boundaries are enforced by `ModularityTests`. Cross-module references are **by id (Long)**, never JPA relations.

| Module | Responsibility |
|---|---|
| `shared` (OPEN) | `AuthenticatedUser` principal, `BusinessException`, `GlobalExceptionHandler` (RFC-7807), `WalletProperties`, OpenAPI config |
| `authentication` | signup/login (BCrypt), JWT cookie filter, Spring Security, Google OAuth2 |
| `user` | `AppUser` aggregate, lookups, `/user/me` |
| `ledger` | **sole writer of balances**; `credit`/`transfer` with pessimistic lock; `/balance` |
| `payment` | Razorpay anti-corruption layer: order creation + signature verification |
| `deposit` | Razorpay "add money": order + idempotent capture → ledger credit; `/deposit/*`, `/webhooks/razorpay` |
| `transfer` | peer-to-peer transfers via ledger; `/transfer/send` |
| `activity` | read/reporting: statement, counts, recipients, 30-day analytics; `/activity/*` |

Money is stored as **minor units (paise), `BIGINT`**. Deposit status: `PENDING | COMPLETED | FAILED`.

## Key invariants
- **One balance writer**: both deposit-capture and p2p route money through `LedgerService`.
- **Server-authoritative deposits**: capture credits the amount/user from the stored `DepositOrder`, never the webhook body; capture is idempotent (`PENDING→COMPLETED` conditional claim).
- **Real HTTP semantics**: `GlobalExceptionHandler` returns proper 4xx `ProblemDetail` (e.g. insufficient funds → 422), not the old "200 with an error message".
- **Server-side validation** via Jakarta Bean Validation on request records.

## Schema (Flyway, Postgres schema `wallet`)
`app_user`, `wallet_balance`, `deposit_order`, `peer_transfer`. Migrations in `backend/src/main/resources/db/migration`. Hibernate is `ddl-auto: validate` — Flyway owns the schema. New users start at **₹0** (no signup bonus).

## Frontend

Next.js App Router, **Bun** as package manager + task runner (Next runs on the Node runtime). Feature-first layout:

```
frontend/src/
  app/                 routes (dashboard group) + providers
  features/            auth · balance · deposit · landing
  components/          shared: ui/* (shadcn), bento-tile, status-pill
  lib/api/             config · client (browser) · server · types  (the API layer)
```

- **Routes:** `/dashboard`, `/activity`, `/add-money`, `/send`, `/settings`, `/cards`, `/login`.
- **Auth:** cookie-based session; `getServerSession` (server) + `AuthProvider`/`useAuth` (client) both hit `/user/me`.
- **API access:** `serverApi` (server components, forwards the cookie) and `authApi`/`depositApi`/`transferApi`/`walletApi` (browser). Base URL from `NEXT_PUBLIC_API_BASE_URL`. No secrets in the frontend.

## Running locally (this machine)
```bash
# backend  (needs JDK 25)
cd backend && ./mvnw spring-boot:run        # :8080  (Swagger at /swagger-ui.html, contract at /v3/api-docs)

# frontend (Bun)
cd frontend && bun install && bun dev        # :3000
```

### Environment gotchas (important)
- **TLS interception**: this network re-signs TLS, so the JVM must trust the Windows cert store. `backend/.mvn/jvm.config` sets `-Djavax.net.ssl.trustStoreType=Windows-ROOT` (gitignored, machine-specific). For `spring-boot:run` the forked app JVM also needs it (Razorpay HTTPS): pass `-Dspring-boot.run.jvmArguments=-Djavax.net.ssl.trustStoreType=Windows-ROOT`.
- **Supabase**: the direct host `db.<ref>.supabase.co` is IPv6-only; on IPv4 use the **Session pooler** `aws-1-ap-south-1.pooler.supabase.com:5432`, user `postgres.<ref>` (configured in `application-local.yml`).

## Secrets
- Backend real secrets live only in `backend/src/main/resources/application-local.yml` (**gitignored**, Spring profile `local`). Committed template: `application-local.yml.example`. `application.yml` has only `${ENV:default}` placeholders. For prod, supply values as env vars with `SPRING_PROFILES_ACTIVE=prod`.
- Frontend: `.env.local` (**gitignored**) holds only `NEXT_PUBLIC_*` (the API URL + Razorpay *public* key id). Committed template: `.env.example`. No secrets ever live in the frontend.

## CI
`.github/workflows/`:
- **`frontend.yml`** — Bun: `bun install --frozen-lockfile` → `bun run lint` → `bun run build` (path-filtered to `frontend/**`).
- **`backend.yml`** — JDK 25 (Temurin) + `./mvnw -B clean verify` (runs the Modulith boundary test; no DB/secrets needed; path-filtered to `backend/**`).

## Follow-ups / manual actions
- **Google OAuth:** register `http://localhost:8080/login/oauth2/code/google` in the Google Cloud console (the frontend `/auth/google` button bridges to Spring's initiation URI).
- **Rotate** the Supabase password + Google client secret (shared in plaintext during setup).
- **Deployment:** no deploy workflow yet — pick hosts (e.g. Vercel for the frontend, a JVM container for the backend) and wire up.
- If any old secret (e.g. the former `cookie.txt`/`.env.test`) was ever committed and **pushed**, purge git history (`git filter-repo`) and rotate.
