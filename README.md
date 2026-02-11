# Consent-First Matching MVP (Web)

Browser-based MVP for a consent-first matching product with safety-focused API and data model.

## Repository structure

- `web/` - Next.js app (UI + `/api/v1` route handlers)
- `infra/supabase/schema.sql` - production-oriented PostgreSQL schema
- `openapi/openapi.yaml` - API contract
- `docs/` - requirements and moderation runbook

## Quick start

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:3000`.

## Test accounts (MVP demo)

- `u1` / `u2` / `u4`: normal users
- `u_admin`: admin

Pass user identity via request header:

```text
x-user-id: u1
```

## API examples

```bash
curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com"}'

curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mio@example.com","password":"Password123!"}'
```

## Notes

- Current API persistence is in-memory for rapid prototyping.
- `infra/supabase/schema.sql` and `openapi/openapi.yaml` are the source of truth for production migration.