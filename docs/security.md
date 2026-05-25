# Security And Privacy

## Authentication

- Passwords are validated client/server through shared Zod schemas.
- Password hashes use Argon2id.
- JWT sessions expire after 14 days in the scaffold; shorten or add refresh-token rotation for stricter deployments.
- Production `JWT_SECRET` must be random and at least 32 characters.

## Input Validation

- API request bodies use shared schemas from `@spark/shared`.
- Profile bios, interests, messages, reports, and settings have length and enum limits.
- File uploads accept only JPEG, PNG, and WebP and enforce an 8 MB limit.

## Rate Limiting

- The API applies a global request limit.
- Add tighter limits for login, registration, messaging, reporting, and photo upload in production.
- Keep IP-aware limits at the edge when running behind a proxy.

## Privacy Controls

- Users can hide distance, online status, and discovery visibility.
- Account deletion soft-deletes the account immediately; production should schedule irreversible erasure after the legal retention window.
- Location should be stored at reduced precision unless exact coordinates are required for a specific feature.

## Safety And Moderation

- Users can block and report other users.
- Blocked users are excluded from discovery.
- Moderators can review open reports and hide profiles.
- Production should add audit logs, evidence snapshots, moderator notes, appeal flow, and automated media scanning.

## Operations

- Use TLS everywhere.
- Store uploaded photos in private object storage with signed delivery URLs.
- Encrypt database backups.
- Monitor authentication failures, report spikes, message spam, and upload abuse.
- Keep dependency scanning enabled in CI.
