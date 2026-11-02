<div align="center">

# FlowFund

**A personal ledger for freelancers with irregular income.**

Import a transaction CSV, review your monthly income and expenses, and explore how long your savings could cover a break.

[Open FlowFund](https://veshwik-flowfund.embarko.app/) · [Run locally](#run-locally) · [Explore the dashboard](frontend/src/pages/Dashboard.jsx) · [Report a bug](../../issues/new?template=bug_report.yml)

[![Verify FlowFund](https://github.com/VJ-veshwikjain2215/FlowFund/actions/workflows/verify.yml/badge.svg?branch=main)](https://github.com/VJ-veshwikjain2215/FlowFund/actions/workflows/verify.yml)
[![Java 21](https://img.shields.io/badge/Java-21-426e45)](backend/pom.xml)
[![React 19](https://img.shields.io/badge/React-19-149eca)](frontend/package.json)

</div>

[![FlowFund desktop landing page](.github/assets/desktop.png)](https://veshwik-flowfund.embarko.app/)

<details>
<summary>Phone preview</summary>

<img src=".github/assets/mobile.png" alt="FlowFund on a 390-pixel phone screen" width="280" />

</details>

## What FlowFund does

1. **Set a baseline.** Enter your income pattern and regular expenses during onboarding.
2. **Import transactions.** Upload a CSV with dates and typed amounts or separate credit and debit columns. Each import replaces your account’s previous snapshot. [Example CSV](ai-service/test.csv)
3. **Review a month.** See income, expenses, and estimated surplus together. The estimates use rules applied to imported records.
4. **Plan time off.** Compare savings with monthly expenses to explore how long a break could last.

## Built with

| Layer | Technology | Where to look |
| --- | --- | --- |
| Interface | React, Vite, Tailwind CSS, Recharts | [Frontend](frontend/) |
| Accounts and API | Java 21, Spring Boot, Spring Security, Google OAuth | [Backend](backend/) |
| CSV analysis | Python, FastAPI, pandas | [Analysis service](ai-service/) |
| Storage | PostgreSQL and Flyway migrations | [Schema](backend/src/main/resources/db/migration/) |
| Hosting | Embarko | [Live website](https://veshwik-flowfund.embarko.app/) |

The browser calls the Spring API. The backend associates imports with the signed-in account, calls the Python service for analysis, and saves the financial snapshot in PostgreSQL.

## Run locally

Install Docker with Compose. Use a development PostgreSQL database and a Google OAuth web client.

```sh
git clone https://github.com/VJ-veshwikjain2215/FlowFund.git
cd FlowFund
cp .env.example .env
```

On PowerShell, use `Copy-Item .env.example .env`. Fill in the database connection, OAuth credentials, and separate JWT and analysis-service secrets. For local Google login, register `http://localhost:8080/login/oauth2/code/google` as an authorized redirect URI.

```sh
docker compose up --build
```

Open [localhost:3000](http://localhost:3000). See the [deployment readiness notes](DEPLOYMENT_READINESS.md) for credential rotation, staging checks, and estimate assumptions.

## Verification

GitHub Actions runs these checks on pushes and pull requests.

| Directory | Command | Purpose |
| --- | --- | --- |
| `frontend/` | `npm ci && npm run build` | Build the production frontend |
| `backend/` | `mvn test` | Run the Java security regression tests |
| `ai-service/` | `python -m pip install -r requirements.txt` then `python -m unittest test_analysis` | Check transaction parsing and analysis |

## Project notes

- [Deployment readiness](DEPLOYMENT_READINESS.md) covers account isolation, database configuration, and financial estimates.
- [Development history](documents/history/COMMIT_PLAN.md) preserves the original implementation plan.
