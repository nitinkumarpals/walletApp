# NimbleWallet — Backend

Spring Boot **3.5** modular monolith (**Spring Modulith**) on **Java 25**, built with **Maven** (wrapper), backed by **PostgreSQL** (Supabase). Razorpay is the sole funding rail.

## Run

Needs **JDK 25**. Uses the Maven wrapper (`./mvnw`) — no global Maven required.

```bash
cd backend
./mvnw spring-boot:run          # http://localhost:8080
```

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs` (committed to `../docs/openapi.json`)
- Health: `http://localhost:8080/actuator/health`

## Configuration & secrets

Real secrets live in `src/main/resources/application-local.yml` — **gitignored**, loaded by the default `local` profile. Copy the template to get started:

```bash
cp src/main/resources/application-local.yml.example src/main/resources/application-local.yml
# then fill in DB, Google OAuth, Razorpay, and JWT values
```

`application.yml` holds only `${ENV:default}` placeholders. In production, run with `SPRING_PROFILES_ACTIVE=prod` and supply values as environment variables.

## Modules

`com.nimblewallet.wallet.*` — boundaries enforced by `ModularityTests`:

`authentication` · `user` · `ledger` (sole balance writer) · `deposit` (Razorpay add-money) · `payment` (Razorpay gateway + signature) · `transfer` (p2p) · `activity` (reporting) · `shared`.

Money is stored as minor units (paise, `BIGINT`); the DB schema is owned by **Flyway** (`db/migration`), Hibernate is `validate`-only.

## Test / verify

```bash
./mvnw -B clean verify          # compiles + runs the Modulith boundary test (no DB/secrets needed)
```

## Notes for this machine

- **TLS interception:** the JVM must trust the Windows cert store. `.mvn/jvm.config` (gitignored) sets `-Djavax.net.ssl.trustStoreType=Windows-ROOT`; for `spring-boot:run` also pass `-Dspring-boot.run.jvmArguments=-Djavax.net.ssl.trustStoreType=Windows-ROOT` (needed for Razorpay HTTPS).
- **Supabase:** on IPv4-only networks use the **Session pooler** host + user `postgres.<project-ref>` (see `application-local.yml.example`).

See `../docs/ARCHITECTURE.md` for the full design.
