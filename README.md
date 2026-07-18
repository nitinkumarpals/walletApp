# 💳 NimbleWallet

A digital wallet where you can **add money**, **send it to friends**, and **track every rupee** — built as a modern full-stack app.

> 🇮🇳 New users start at **₹0**. No fake signup bonus — you fund your wallet for real via Razorpay.

---

## ✨ What it does

| Feature | Description |
|---|---|
| 🔐 **Auth** | Sign up / log in with email + password, or one-click **Google login** |
| 💰 **Add Money** | Top up your wallet via **Razorpay** — the only funding rail, and it's server-verified so nobody can fake a deposit |
| 🔁 **Send Money (P2P)** | Transfer money to another user instantly and safely (no double-spending, no race conditions) |
| 📊 **Activity** | See your full statement, recent people you've paid, and a 30-day spending summary |

---

## 🧱 Tech Stack

```
🖥️  Frontend   →  Next.js (App Router) + Bun
⚙️  Backend    →  Spring Boot 3.5 (Java 25) — modular monolith
🗄️  Database   →  PostgreSQL (hosted on Supabase)
💳  Payments   →  Razorpay
```

### Why these choices?
- **Spring Boot Modulith** → one deployable app, but internally split into clean modules (like mini-services) so the code stays organized as it grows.
- **Bun** → faster installs and a faster dev server than plain npm/yarn.
- **Server-authoritative money** → the backend — never the browser — decides how much you get credited. This closes the door on a whole class of payment fraud.

---

## 📂 Project Structure

```
walletApp/
├── frontend/              🖥️  Next.js app
│   └── src/
│       ├── app/           routes: dashboard, send, add-money, activity, settings, login
│       ├── features/      feature modules: auth · balance · deposit · landing
│       ├── components/    shared UI (buttons, cards, etc. — shadcn/ui based)
│       └── lib/api/       typed client that talks to the backend
│
├── backend/               ⚙️  Spring Boot app
│   └── src/main/java/com/nimblewallet/wallet/
│       ├── authentication/  signup, login, JWT cookie, Google OAuth
│       ├── user/            user profile & lookups
│       ├── ledger/          💰 the ONE place that ever changes your balance
│       ├── payment/         talks to Razorpay (order + signature check)
│       ├── deposit/         "add money" flow → credits the ledger
│       ├── transfer/        peer-to-peer transfers → moves money via the ledger
│       ├── activity/        read-only reports: statement, recipients, analytics
│       └── shared/          common error handling, security config, etc.
│
└── docs/
    ├── ARCHITECTURE.md    deep-dive into how it's all wired together
    └── openapi.json       the API contract (also viewable at /swagger-ui.html)
```

**🔑 Golden rule:** every rupee that moves — whether it's a deposit or a transfer — passes through the **`ledger`** module. There's exactly one place in the whole codebase that changes a balance, which makes the money safe and easy to audit.

---

## 🚀 Running it yourself

### 1️⃣ Start the backend
Needs **JDK 25** — uses the bundled Maven wrapper, no separate install needed.

```bash
cd backend
./mvnw spring-boot:run
```
✅ Runs at → `http://localhost:8080`
📖 API docs (Swagger UI) → `http://localhost:8080/swagger-ui.html`

> Real secrets (DB password, Razorpay keys, Google OAuth) go in `backend/src/main/resources/application-local.yml` — this file is gitignored. Copy `application-local.yml.example` to get started.

### 2️⃣ Start the frontend
Needs **[Bun](https://bun.sh)** installed.

```bash
cd frontend
bun install
bun dev
```
✅ Runs at → `http://localhost:3000`

> Create `frontend/.env.local` with:
> ```
> NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
> NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
> ```

### 3️⃣ Open it up
Go to **http://localhost:3000** in your browser. Sign up, add money, send some to a friend, and check your activity feed. 🎉

---

## ⚠️ Local setup gotchas

- 🔒 **Corporate network / antivirus doing TLS inspection?** The JVM needs to trust your Windows certificate store, or HTTPS calls (like to Razorpay) will fail. See `docs/ARCHITECTURE.md` for the exact JVM flag.
- 🌐 **Supabase connection refusing to connect?** The direct database host is IPv6-only. If you're on IPv4, use the **Session pooler** connection string instead (details in `application-local.yml.example`).

---

## 🔒 Secrets — what goes where

| Where | What lives there | Committed to git? |
|---|---|---|
| `backend/.../application-local.yml` | DB password, JWT secret, Razorpay secret key, Google OAuth secret | ❌ No (gitignored) |
| `backend/.../application-local.yml.example` | Template with blank/placeholder values | ✅ Yes |
| `frontend/.env.local` | API base URL, Razorpay **public** key only | ❌ No (gitignored) |
| `frontend/.env.example` | Template | ✅ Yes |

**No secret keys are ever stored in the frontend** — only the public Razorpay key, which is safe to expose.

---

## 🧪 CI

Every push runs automated checks via GitHub Actions:
- **`frontend.yml`** → install → lint → build (Bun)
- **`backend.yml`** → compile + run tests, including a check that verifies the module boundaries aren't violated (Spring Modulith)

---

## 📚 Want the deep-dive?

Check out [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for:
- Full module responsibilities
- Database schema
- Key money-safety invariants
- Deployment notes & follow-ups

---

Built with ☕, 🧠, and a healthy respect for not losing anyone's money.
