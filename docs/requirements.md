# Consent-First Matching Service (Browser MVP)

## Product goal

Provide a browser-based matching service where adult users can connect with explicit boundaries, consent controls, and strong moderation support.

## Scope

- Web only (no App Store submission).
- MVP focuses on safety-critical flows before growth features.

## Must requirements

1. Adult gate (18+) for registration workflow.
2. KYC state model (`pending/verified/rejected`).
3. Terms versioning and consent logs.
4. Explicit consent settings per user.
5. Boundary settings (`key/value`) per user.
6. Discovery excludes blocked/non-verified/non-visible users.
7. Like -> mutual like -> match automation.
8. Messaging available only for matched users.
9. Block and unblock actions with immediate effect.
10. Report creation with category and evidence details.
11. Admin report listing endpoint.
12. Audit-ready schema with append-only logs in production DB.

## Non-goals (MVP)

- Payments
- Ranking optimization
- Real-time push infrastructure
- Public app marketplace distribution

## KPI examples

- Time-to-first-safe-match
- Terms acceptance rate
- Report first-response time
- Repeat-abuse rate after moderation action
