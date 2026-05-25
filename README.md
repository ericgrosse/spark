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
npm run test
npm run dev
```

The web app runs on Vite, the API runs on Express, the mobile app runs through Expo, and the desktop app launches Electron against the web build/dev server.

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
