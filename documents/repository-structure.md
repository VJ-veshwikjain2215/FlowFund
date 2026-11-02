# Repository structure

FlowFund follows the same top-level convention as Portfolio and CountCheck: application files in code/, documentation in documents/, and GitHub metadata at the root.

## File placement

| Before | Now |
| --- | --- |
| frontend/, backend/, ai-service/, supabase/ | code/frontend/, code/backend/, code/ai-service/, code/supabase/ |
| .env.example, package.json, package-lock.json | Same filenames in code/ |
| docker-compose.yml, render.yaml | code/docker-compose.yml, code/render.yaml |
| stress_test.py, test_dates.py, test_sync.py | code/tests/legacy/ |
| DEPLOYMENT_READINESS.md | documents/DEPLOYMENT_READINESS.md |
| COMMIT_PLAN.md | documents/project-plan/COMMIT_PLAN.md |
| Generated build and backend logs | code/logs/, retained locally and excluded from version control |
| Local build/ output | code/build/, still ignored |

The root README.md, .gitignore, .gitattributes, and .github/ remain repository-level files. Service source code, Dockerfile-relative paths, and migration names are unchanged. Local dependencies and generated service outputs move with their service directories and remain ignored.

## Commands and deployment paths

- GitHub Actions runs in code/frontend, code/backend, and code/ai-service, with dependency caches using the relocated lockfile and requirements paths.
- Docker Compose lives in code/. Its ./frontend, ./backend, and ./ai-service contexts remain relative to that file. Use code/.env for Compose settings; individual processes still need their own environment settings.
- The Render Blueprint is code/render.yaml. Select that custom Blueprint path when linking or updating a Blueprint. Its dockerContext and dockerfilePath fields point to ./code/ai-service and ./code/backend from the repository root, as required by the [Render Blueprint reference](https://render.com/docs/blueprint-spec#docker).
- For services configured directly from GitHub, set their application roots to code/frontend, code/backend, or code/ai-service as appropriate. Keep the existing service-specific build and start commands relative to those roots.
- Existing Embarko source archives remain ignored in code/build/. Uploads and deployments are separate operations; changing repository paths does not update an already uploaded archive.

This reorganization does not apply a Blueprint or deploy services. The existing feature and documentation pull requests were not merged as part of this change. Their patches may need their paths reconciled against the new layout when reviewed.

## Verification

Run the build and tests in [code/README.md](../code/README.md). Review git diff --check and the renamed-file summary before committing. Generated logs, environment secrets, dependencies, and build outputs must remain ignored.

Checked locally on 2 November 2026: frontend production build passed from code/frontend; a clean Maven test run passed both backend tests from code/backend. All workflow working directories and dependency-cache paths, both Render Docker contexts and Dockerfile paths, all Compose contexts, and 30 local Markdown links resolved correctly. The relocated Blueprint passed Render's current public JSON Schema with a draft-2020-12 validator. Git identified 90 unchanged file renames; application source and service manifests were preserved.
