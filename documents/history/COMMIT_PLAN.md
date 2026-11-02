# FlowFund - Hackathon Commit Plan

This structured commit guide organizes the FlowFund repository history into logical, progressive, human-readable chunks. Follow this exact sequence to commit your project professionally, demonstrating steady iteration from scaffolding to full-stack integration and final polish.

## Phase 1: Project Scaffolding & Configuration

### Commit 1: Initial project setup and core configuration
*   **Files to include:**
    *   `.gitignore`
    *   `package.json`
    *   `package-lock.json`
    *   `README.md`
    *   `frontend/package.json`
    *   `backend/pom.xml`
    *   `ai-service/requirements.txt`
*   **Commit message:** `chore: initialize monorepo structure and core dependencies`
*   **Functionality:** Establishes the monorepo root structure. Defines package dependencies for the React frontend, Maven configuration for the Spring Boot backend, and Python requirements for the AI service.
*   **Why here:** Every clean repository starts with configuration and dependency manifests before code is written.

## Phase 2: Frontend UI Skeleton & Routing

### Commit 2: Scaffold frontend architecture and main routes
*   **Files to include:**
    *   `frontend/src/App.jsx`
    *   `frontend/src/main.jsx`
    *   `frontend/index.html`
    *   `frontend/vite.config.js`
    *   `frontend/src/index.css`
*   **Commit message:** `feat(ui): bootstrap react app with global routing and tailwind styles`
*   **Functionality:** Sets up Vite, injects global Tailwind CSS defaults, and maps out the primary empty routing definitions (`/`, `/dashboard`, `/auth`).
*   **Why here:** You need a working structural shell and router before you can build isolated pages.

### Commit 3: Build high-fidelity landing and authentication screens
*   **Files to include:**
    *   `frontend/src/pages/Landing.jsx`
    *   `frontend/src/pages/Auth.jsx`
    *   `frontend/src/pages/Onboarding.jsx`
*   **Commit message:** `feat(ui): implement landing page typography and oauth modal skeletons`
*   **Functionality:** Adds the cyberpunk/glassmorphism aesthetic to the public-facing pages, including Google OAuth mockups and onboarding step forms without backend bindings.
*   **Why here:** Front-loads the visual presentation for hackathon UX, serving as the user's entry point.

### Commit 4: Construct static financial dashboard layout
*   **Files to include:**
    *   `frontend/src/pages/Dashboard.jsx`
    *   `frontend/src/pages/Transactions.jsx`
    *   `frontend/src/components/Sidebar.jsx` (if exists)
*   **Commit message:** `feat(ui): design core financial dashboard and transaction grid layout`
*   **Functionality:** Builds the grid system, the static Recharts layout, and the empty KPI cards (Money Usable, Emergency Buffer). Uses static mock data.
*   **Why here:** Secures the final primary view of the app before switching entirely to backend API design.

## Phase 3: Backend & AI Engine Foundation

### Commit 5: Initialize Spring Boot backend domain models
*   **Files to include:**
    *   `backend/src/main/java/**/Application.java`
    *   `backend/src/main/java/**/models/*` (Users, Transactions)
    *   `backend/src/main/resources/application.properties`
*   **Commit message:** `feat(api): set up spring boot foundation and domain entities`
*   **Functionality:** Initializes the core Spring context, establishes port mappings (`8080`), and writes the base data classes.
*   **Why here:** Transitioning to the backend starts with data models before routing controllers.

### Commit 6: Build Python forecasting engine endpoint
*   **Files to include:**
    *   `ai-service/main.py`
*   **Commit message:** `feat(ai): setup fastapi endpoint for csv ingestion and baseline forecasting`
*   **Functionality:** Sets up the initial FastAPI loop (`/upload-csv`), handling Pandas basic DataFrame loads and creating a mock prediction fallback.
*   **Why here:** Prepares the isolated Python service architecture so it can be consumed independently by the frontend.

## Phase 4: State Management & Full-Stack Integration

### Commit 7: Hook up Zustand store for frontend data hydration
*   **Files to include:**
    *   `frontend/src/store/useFinanceStore.js`
    *   `frontend/src/pages/Dashboard.jsx` (modify to consume store)
*   **Commit message:** `feat(ui): integrate zustand state store for dashboard metrics`
*   **Functionality:** Replaces hardcoded dashboard prop states with a global Zustand hook.
*   **Why here:** Lays the pipeline needed to catch data from the backend seamlessly.

### Commit 8: End-to-end integration of CSV file uploads
*   **Files to include:**
    *   `frontend/src/pages/Transactions.jsx` (upload handlers)
    *   `frontend/src/pages/Dashboard.jsx` (reactivity to uploads)
*   **Commit message:** `feat(core): implement end-to-end csv file upload and parsing synchronization`
*   **Functionality:** Hooks the `input type="file"` up to the exact API bindings, replacing static `mockData` with actual `.csv` extracts upon successful fetch limits.
*   **Why here:** The core feature format is now active. The front and back are actively communicating.

## Phase 5: Business Logic & Intelligence

### Commit 9: Upgrade time-series AI with pmdarima and fuzzy extraction
*   **Files to include:**
    *   `ai-service/main.py`
    *   `ai-service/requirements.txt`
*   **Commit message:** `feat(ai): integrate auto_arima predicting and unstructured bank phrase classification`
*   **Functionality:** Overhauls the CSV analyzer to strictly `resample('W')`, adds confidence boundaries, fuzzy-tracks bank fields (Credit/Debit/Description), and auto-selects ARIMA bounds.
*   **Why here:** This is the "brain" of the hackathon—swapping basic parsers out for heavy logical algorithms once the wiring is verified structurally.

### Commit 10: Dynamically map chronological datasets to UI charts
*   **Files to include:**
    *   `frontend/src/pages/Dashboard.jsx` (modifications to Recharts loop)
*   **Commit message:** `fix(ui): patch chart rendering to strictly map chronological absolute timestamps`
*   **Functionality:** Removes arbitrary slice limiters and replaces map keys with exact YYYY-MM `getTime()` trackers, matching historical graphing correctly to the new AI output.
*   **Why here:** Stabilizes visual glitches specifically induced by upgrading the data models in Commit 9.

## Phase 6: Polish & UI Adjustments

### Commit 11: Final aesthetic polish and dynamic KPI feedback
*   **Files to include:**
    *   Global CSS touchups, minor edits inside `Dashboard.jsx`.
    *   Testing scripts (`test_dates.py`, `stress_test.py`, etc.)
*   **Commit message:** `chore(polish): lock buffer calculation state and finalize motion interactions`
*   **Functionality:** Final spacing tweaks, Framer Motion sequence delays mapped perfectly, dynamic color injections complete (green for safe, red for high volatility). Commit supplementary testing scripts.
*   **Why here:** Everything works. The last hackathon commit should always be the final visual layer of paint ensuring judges have a perfect visual experience.
