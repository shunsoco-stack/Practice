# Web app (Next.js)

This folder contains the browser MVP UI and API handlers.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Key routes

- `/` - overview dashboard
- `/signup` - email registration
- `/auth/set-password` - set password from emailed URL
- `/login` - email/password login
- `/playground` - browser API testing screen
- `/ekyc/mock` - mock eKYC provider flow
- `/docs/architecture`
- `/docs/runbook`
- `/docs/api`

## API base path

- `/api/v1/*`

Use header `x-user-id` to emulate login in the MVP.
