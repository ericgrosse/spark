# Deployment

## API

1. Provision PostgreSQL and object storage for uploaded photos.
2. Set production environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `WEB_ORIGIN`
   - `UPLOAD_DIR` or replace local upload storage with S3/GCS.
3. Run:

```bash
npm install
npm --workspace @spark/api run prisma:generate
npm --workspace @spark/api run prisma:migrate
npm --workspace @spark/api run build
npm --workspace @spark/api start
```

Recommended hosts: Fly.io, Render, Railway, Heroku, AWS ECS, Google Cloud Run, or Azure Container Apps. Put the API behind TLS and a managed load balancer.

## Web

```bash
VITE_API_URL=https://api.example.com npm --workspace @spark/web run build
```

Deploy `apps/web/dist` to Vercel, Netlify, Cloudflare Pages, S3/CloudFront, Azure Static Web Apps, or any static web host.

## Android

Use EAS Build or native Gradle builds.

```bash
npm --workspace @spark/mobile run android
eas build --platform android
eas submit --platform android
```

Before submission, update `apps/mobile/app.json` with the production package id, icons, splash assets, privacy policy URL, and API endpoint.

## iOS

Use EAS Build or Xcode.

```bash
npm --workspace @spark/mobile run ios
eas build --platform ios
eas submit --platform ios
```

Before submission, update the bundle id, Apple Team settings, privacy nutrition labels, photo/location permission copy, and App Store screenshots.

## Desktop

Build the web app first, then package Electron.

```bash
npm --workspace @spark/web run build
npm --workspace @spark/desktop run build
```

The Electron config emits:

- Windows: NSIS installer
- macOS: DMG
- Linux: AppImage and DEB

Use code signing and notarization for production macOS and Windows releases.

## Release Checklist

- Run `npm run test`, `npm run lint`, and `npm run typecheck`.
- Confirm API migrations are applied.
- Confirm production CORS origins.
- Confirm rate-limit values against expected traffic.
- Verify push notification credentials.
- Verify moderation escalation path and abuse mailbox.
- Publish privacy policy, terms, and account deletion instructions.
