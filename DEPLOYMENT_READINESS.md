# Deployment readiness notes

FlowFund is not yet approved for production use. Run the tests and verify a staging deployment with two independent accounts before exposing it to real financial data. Financial values are estimates based on imported records, not bank balances, tax advice, actual transfers, or a guarantee of future income.

## Required configuration

- Copy `.env.example` to an untracked `.env`. Supply the PostgreSQL JDBC URL, user and password, Google OAuth credentials, a random `JWT_SECRET` of at least 32 UTF-8 bytes, and a separate random `AI_SERVICE_SECRET`. Rotating the JWT secret invalidates sessions.
- The OAuth client secret formerly committed in `.env.example` must be revoked in Google Cloud and replaced. Removing the current copy does not remove it from Git history.
- Configure `FRONTEND_URL` as the exact frontend origin without a trailing slash and register the backend OAuth callback in Google Cloud.
- Build the frontend with `VITE_API_BASE_URL` set to the public backend URL ending in `/api`. Vite variables are embedded at build time.
- The backend and AI service must receive the same `AI_SERVICE_SECRET`; do not expose it in the frontend. Set `AI_SERVICE_URL` to the backend-reachable AI service origin. AI endpoints require the service secret.
- Apply Flyway migrations to a backed-up database, including `V2__Finance_Snapshots.sql` and `V3__Other_Expenses.sql`. Uploading a CSV replaces that account's prior imported snapshot. Data previously held only in AI-service memory is not migrated.
- For Render, check the existing services and Blueprint before syncing. `sync: false` values must be configured explicitly for existing services; set the same AI secret on both. The Blueprint does not configure the frontend. Validate the Blueprint with the current Render CLI and confirm private networking and service URLs for the target environment.

## Verification before release

1. Install frontend dependencies with `npm ci`, then run `npm run build` in `frontend`. Configure ESLint before relying on the existing lint script: the repository currently lacks an ESLint configuration.
2. Run `mvn test` in `backend` and `python -m unittest test_analysis` in `ai-service` with its requirements installed.
3. In staging, test registration, login, OAuth, onboarding, CSV upload, refresh and logout. Use two accounts with different CSVs and verify neither can see the other's data, including after restarting the services. Test unauthenticated requests and a direct AI request without its service key.
4. Verify malformed and oversized CSVs, error displays, browser refresh on nested frontend routes, and actual deployed URLs. Confirm backups, recovery and retention requirements before accepting real records.
5. Review calculation assumptions and product copy with a qualified financial reviewer. The model uses a simple rule-based estimate; it does not move funds or perform ARIMA forecasting. The 15% tax amount is illustrative, and the available transaction history does not establish an actual cash balance or emergency fund.

Manual transaction entry is currently disabled. The older Spring forecasting pipeline is separate from the CSV dashboard and its ARIMA endpoint is not implemented; do not present it as an active capability.
