# FlowFund | The Financial Operating System 🌊

> **Deployment status:** Not production-ready until the security and end-to-end checks in [deployment readiness notes](documents/DEPLOYMENT_READINESS.md) pass. The current CSV dashboard provides rule-based estimates; it does not move money or provide ARIMA forecasts. Claims below describing those capabilities are aspirational.

FlowFund is a production-grade Financial Operating System (OS) designed for the modern freelance economy. It provides automated income stabilization, predictive financial forecasting, and risk-aware buffer management.

## Repository structure

```text
FlowFund/
|-- code/                       Application, configuration, and developer tools
|   |-- frontend/               React / Vite interface
|   |-- backend/                Spring Boot API and migrations
|   |-- ai-service/             FastAPI analysis service
|   |-- supabase/               Database schema reference
|   |-- tests/legacy/           Original manual integration scripts
|   |-- docker-compose.yml      Local multi-service setup
|   `-- render.yaml             Render Blueprint
|-- documents/                  Project documentation
|   |-- project-plan/           Historical planning notes
|   `-- DEPLOYMENT_READINESS.md  Configuration and release checks
|-- .github/                    GitHub Actions and repository assets
`-- README.md                   Project overview
```

See [code setup](code/README.md), the [documentation index](documents/README.md), and [structure and path changes](documents/repository-structure.md). Run service commands from the repository root unless a working directory is shown. Existing deployment settings that refer to the old directories need the paths in the structure guide.

---

## 🔄 The Platform Flow: A User Journey

The FlowFund experience is a synchronized lifecycle across three specialized engines: **The UI (React)**, **The Orchestrator (Spring Boot)**, and **The Brain (FastAPI AI)**.

### 1. 🛫 Genesis: Entry & Identity Establishment
The journey begins at the **Landing Experience**, where the platform's value propositions are presented through interactive motion-rich designs.
*   **Onboarding Phase**: New users go through a multi-step "Professional Intelligence" gathering process. Here, they define their freelance category, baseline expenses, and financial goals.
*   **Identity Sync**: Secure authentication creates a persistent profile that will house all future financial intelligence.

### 2. 📥 Ingestion: Establishing the Financial Baseline
To provide accurate insights, FlowFund needs to understand your financial history.
*   **Data Pipeline**: Users upload historical transaction records (CSV) or synchronize financial data.
*   **Normalization**: The system automatically categorizes income streams, separating professional freelance earnings from side-hustles or personal transfers.

### 3. 🧠 Analysis: Deep-Trend Prediction (The AI Engine)
As soon as data is ingested, the system's AI algorithms (ARIMA and Weighted Moving Averages) take over.
*   **Volatility Detection**: The AI engine calculates the "Coefficient of Variation" in your income—identifying exactly how unpredictable your earnings are.
*   **Forecasting**: The system generates a **6-month predictive forecast**, identifying potential "Dry Months" (where income might drop below baseline) and "Surplus Months" (where income is predicted to peak).

### 4. 📊 Visualization: Financial Health Mission Control
The raw intelligence is translated into actionable insights on the **Dashboard**.
*   **Health Score**: A real-time risk meter that dynamically updates based on your current savings versus your predicted income volatility.
*   **Future Trends**: High-fidelity line and area charts visualize the predicted 6-month trajectory, allowing for early planning.

### 5. 🛡️ Stabilization: Automated Income Buffers
The final and most critical step is active mitigation.
*   **Risk-Aware Buffering**: Based on the AI's risk assessment (Low, Medium, or High), the system recommends an "Income Buffer" size.
*   **Stabilization Logic**: During surplus months, the system "skims" funds into the buffer. During dry months (as predicted by the AI), it automatically releases those funds to ensure the user's personal "monthly salary" remains stable.

---

## 🛠️ Operational Execution

To run the full FlowFund ecosystem, all three specialized engines must be active simultaneously:

### Stage 1: The AI Engine (Python FastAPI)
Power the predictive modeling backbone.
```bash
cd code/ai-service && python main.py
```

### Stage 2: The Orchestrator (Java Spring Boot)
Provide the secure API gateway and data management layer.
```bash
cd code/backend && mvn spring-boot:run
```

### Stage 3: The Dashboard (React Vite)
Launch the premium visual interface.
```bash
cd code/frontend && npm run dev
```

---
*FlowFund: Turning financial volatility into predictable stability.*
