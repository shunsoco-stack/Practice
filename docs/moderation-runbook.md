# Moderation Runbook (MVP)

## Principles

1. Safety over convenience.
2. Preserve evidence before taking destructive actions.
3. Keep moderation actions auditable.

## Severity levels

- `low`: minor policy concern, no immediate user risk.
- `medium`: repeated boundary crossing or suspicious behavior.
- `high`: harassment, coercion, possible real-world risk.
- `critical`: explicit threat, illegal behavior, or user safety emergency.

## Incident flow

1. Receive report.
2. Classify severity.
3. For `high/critical`, immediately restrict account interaction.
4. Collect message and account evidence.
5. Apply moderation action (`warn/freeze/suspend/ban`).
6. Notify reporter (status update) and keep audit log.

## SLA recommendation

- High/Critical: first action within 5 minutes.
- Medium: review within 2 hours.
- Low: review within 24 hours.

## Data handling

- Report details are sensitive and should be role-restricted.
- Audit log records must be append-only.
- Apply retention/deletion policy according to legal review.
