# Spark Dating Platform

Spark is a cross-platform dating app starter for web, Android, iOS, Windows, macOS, and Linux. It uses a shared design system, shared validation schemas, and shared business logic so each platform can ship nearly identical styling and functionality.

## Stack

- Web: Vite, React, shared CSS tokens
- Mobile: Expo React Native
- Desktop: Electron wrapper around the web app
- API: Express, Prisma/PostgreSQL, Socket.IO
- Shared logic: TypeScript packages for validation, matching, privacy, moderation, and rate-limit helpers
- Security: Argon2 password hashing, JWT sessions, Helmet, CORS, input validation, rate limiting
- Tests: Vitest unit tests for shared logic and API behavior

## Features Scaffolded

- Account creation and secure login
- Profile creation with bio, interests, photos, location, privacy settings
- Location-aware discovery feed
- Like/pass swipe model
- Mutual match detection
- Real-time chat transport with Socket.IO
- Notifications endpoint hooks
- Blocking and reporting
- Account deletion
- Privacy controls
- Basic moderation queue and actions
- Mobile-first responsive UI with shared visual tokens

## Quick Start

```bash
npm install
cp apps/api/.env.example apps/api/.env
npm run prisma:generate
npm test
npm run dev
```

The web app runs on Vite, the API runs on Express, the mobile app runs through Expo, and the desktop app launches Electron against the web build/dev server.

## Local Development

Requirements:

- Node.js 20.11 or newer
- npm 10 or newer
- PostgreSQL 15 or newer for API persistence

Environment variables live in `apps/api/.env`:

```bash
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://spark:spark@localhost:5432/spark?schema=public
JWT_SECRET=replace-with-a-long-random-secret
WEB_ORIGIN=http://localhost:5173
UPLOAD_DIR=uploads
```

Database setup:

```bash
createdb spark
npm install
npm run prisma:generate
npm --workspace @spark/api run prisma:migrate
```

Daily commands:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit
```

Netlify deploys the web app from `apps/web/dist`:

```bash
npm run netlify:build
```

## CI Notes

`npm install` runs `postinstall`, which calls `npm run prisma:generate`. The root `prisma:generate` script delegates to the API workspace and uses the checked-in schema path `apps/api/prisma/schema.prisma`, so generated Prisma client setup is deterministic in CI.

The repository includes `.npmrc` with `audit-level=high`. Current high and critical advisories are fixed. Remaining moderate advisories are from Expo/React Native CLI development tooling (`fast-xml-parser`) and Expo config parsing (`uuid` through `xcode`). Root `overrides` pin patched transitive versions where npm can safely apply them; the remaining audit entries are tracked upstream and do not affect the deployed Netlify web app or the runtime API.

## Repository Layout

```text
apps/api       Express API, Prisma models, Socket.IO
apps/web       React web client
apps/mobile    Expo React Native client
apps/desktop   Electron desktop shell
packages/shared Validation, types, matching, privacy logic
packages/ui     Shared design tokens and component contracts
docs            Deployment and security notes
```

## Deployment

See [docs/deployment.md](docs/deployment.md) for web hosting, API deployment, app store release, and desktop packaging steps.

## Security

See [docs/security.md](docs/security.md) for password handling, validation, privacy, moderation, and operational controls.
