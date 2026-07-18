# NimbleWallet — Frontend

Next.js (App Router) frontend, using **Bun** as the package manager and runtime.

```bash
bun install
bun dev          # http://localhost:3000
bun run build
```

Copy `.env.example` → `.env.local` and set `NEXT_PUBLIC_API_BASE_URL` to the backend URL
(`http://localhost:8080` by default). Only `NEXT_PUBLIC_*` vars belong here — no secrets.

Structure is feature-first under `src/features/*`; the typed API client lives in `src/lib/api/`.
See the root `README.md` and `docs/ARCHITECTURE.md` for the full picture.
