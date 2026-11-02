# FlowFund code

Application code and runtime configuration live here. The project overview is in the [root README](../README.md), and release checks are in [deployment readiness](../documents/DEPLOYMENT_READINESS.md).

| Directory or file | Purpose |
| --- | --- |
| [frontend/](frontend/) | React / Vite app; its own npm manifest and lockfile |
| [backend/](backend/) | Spring Boot API, Maven tests, and Flyway migrations |
| [ai-service/](ai-service/) | FastAPI analysis service and its unit tests |
| [supabase/](supabase/) | Original database schema reference |
| [tests/](tests/) | Legacy manual scripts, separate from automated service tests |
| [docker-compose.yml](docker-compose.yml) | Local frontend, API, and analysis containers |
| [render.yaml](render.yaml) | Render Blueprint; Docker paths are relative to the repository root |
| [package.json](package.json) | Existing shared npm manifest; frontend commands use frontend/package.json |

## Local services

From the repository root, use a separate terminal for each service:

```sh
cd code/ai-service
python -m pip install -r requirements.txt
python main.py
```

```sh
cd code/backend
mvn spring-boot:run
```

```sh
cd code/frontend
npm ci
npm run dev
```

Supply backend and analysis settings through the process environment as described in the [readiness guide](../documents/DEPLOYMENT_READINESS.md). Spring Boot does not automatically load code/.env. For Vite, copy frontend/.env.example to frontend/.env and set the public API URL.

For Docker Compose, copy .env.example to an untracked .env in this directory, fill in its values, and run from code/:

```sh
docker compose --env-file .env -f docker-compose.yml config --quiet
docker compose --env-file .env -f docker-compose.yml up --build
```

## Verification

| Working directory from repository root | Command |
| --- | --- |
| code/frontend | npm ci, then npm run build |
| code/backend | mvn --batch-mode test |
| code/ai-service | python -m pip install -r requirements.txt, then python -m unittest test_analysis |

GitHub Actions uses these same directories. See the [structure guide](../documents/repository-structure.md) before configuring an existing deployment to use the new paths.
