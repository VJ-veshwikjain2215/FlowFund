# Embarko deployment preparation

FlowFund needs three Embarko apps: the static frontend, the Spring Boot backend and the FastAPI analysis service. It also needs a separate PostgreSQL database. Do not point it at another application's production database.

This configuration is prepared but has not been deployed or verified on Embarko. The previous Google OAuth secret was exposed in Git history and must be revoked and replaced before enabling that login. The existing Spring configuration requires valid Google OAuth credentials at startup.

## Package

After choosing the actual backend app name and confirming its HTTPS URL, run:

```sh
python ops/package_embarko.py --api-url https://YOUR-BACKEND.embarko.app/api
```

The command creates three source-only `.tar.gz` files in `build/embarko`. It embeds the public backend API URL in the frontend archive; do not put secrets there. The archives made with `example.invalid` during local verification are test artifacts and must be regenerated with the actual URL before upload. The backend package includes Railpack startup settings; the AI package starts on Embarko's `PORT`.

## Server-side settings

Set these in Embarko's app setup, not in an archive or frontend file:

- **AI app:** `AI_SERVICE_SECRET`, a unique random secret.
- **Backend app:** `AI_SERVICE_SECRET` (the same value), `AI_SERVICE_URL` (the AI app's HTTPS origin), `JWT_SECRET` (a different random secret of at least 32 bytes), `FRONTEND_URL` (the exact frontend HTTPS origin), `SUPABASE_DB_URL` (a TLS-verified JDBC PostgreSQL URL), `SUPABASE_DB_USER`, `SUPABASE_DB_PASSWORD`, `GOOGLE_CLIENT_ID`, and the newly rotated `GOOGLE_CLIENT_SECRET`.

Configure the new Google OAuth client with the backend callback URL `https://YOUR-BACKEND.embarko.app/login/oauth2/code/google`. Do not use the exposed old secret.

Provision an isolated database, test the migrations on a disposable branch, and confirm backups and recovery before applying migrations to production. The backend currently uses Flyway and Hibernate schema update; its migration and runtime database permissions need staging verification. Embarko's process memory limit and the backend's actual memory use must be checked against the active plan; the bundled JVM limits are a starting point, not a capacity guarantee.

Upload each archive to its own app, configure server-side settings, and confirm each deployment is live. Then verify two-account isolation, registration, login, Google OAuth, CSV import, error handling, persistence after restart, and the full browser workflow. The frontend is only ready when those flows work with its actual backend and AI services.

References: [Embarko deployment requirements](https://embarko.ai/docs/deploy), [environment settings](https://embarko.ai/docs/env-vars), and [data storage](https://embarko.ai/docs/data).
