# AegisRecruit: NDPR-Compliant Sovereign Agentic Recruitment Engine
### (BNH) — Executive Board Governance Platform

[![NDPR Compliant](https://img.shields.io/badge/NDPR%20%2F%20NDPA-100%25%20Compliant-10B981?style=for-the-badge)](https://ndpc.gov.ng)
[![Sovereign Edge AI](https://img.shields.io/badge/Inference-Local%20Ollama%20(gemma2%3A9b)-D4AF37?style=for-the-badge)](http://localhost:11434)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2B%20SQLAlchemy%20Async-009688?style=for-the-badge)](https://fastapi.tiangolo.com)
[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014%20App%20Router-black?style=for-the-badge)](https://nextjs.org)

---

## Executive Overview

**AegisRecruit** is an enterprise-grade, sovereign recruitment engine designed specifically for **(BNH)** and its diversified operating subsidiaries:
- **BNH Energy:** SCADA telemetry, smart grid IoT, power distribution, and renewable grid engineering.
- **BNH GovTech:** Federal civil registries, biometric verification pipelines, customs clearing, and civic portals.
- **BNH Property:** Smart tenancy platforms, automated lease contracts, and commercial asset operations.
- **BNH Agribusiness:** Grain exchange ledgers, warehouse receipt systems, and rural logistics networks.
- **BNH HoldCo:** Enterprise architecture, multi-tenant governance, and portfolio oversight.

In accordance with the **Nigeria Data Protection Regulation (NDPR 2019)** and **Nigeria Data Protection Act (NDPA 2023)**, candidate personally identifiable information (PII) is strictly prohibited from traversing public cloud networks or being processed by third-party multi-tenant LLM providers. AegisRecruit solves this through a **dual-layer sovereign architecture**:
1. **Edge Pre-Context Masking:** A strict regex and NLP governance middleware that scrubs Nigerian mobile numbers, emails, municipal residential addresses, and 11-digit statutory identification numbers (NIN/BVN) before text enters any AI context.
2. **Local SLM Sovereign Inference:** Purely on-premise execution using Google DeepMind's **Gemma 2 (9B)** running in a local Ollama container.

---

## Sovereign Architecture & Data Privacy Guarantee

```
  [Candidate Resume (PDF/TXT)]
               │
               ▼
┌──────────────────────────────────────────────┐
│  MODULE A: NDPR Security & Governance Shield  │
│  - Nigerian Phone Masks (+234, 080, 081, ...)│
│  - 11-Digit Statutory IDs (NIN & BVN) Masked │
│  - Municipal Addresses & Landmarks Scrubbed   │
│  - Adversarial Prompt Injection Quarantine   │
└──────────────────────┬───────────────────────┘
                       │
                       │ 100% PII-Purged & Redacted Stream
                       ▼
┌──────────────────────────────────────────────┐
│     MODULE B: Local SLM Resume Parser        │
│  - Local Ollama Host (http://localhost:11434)│
│  - Model: gemma2:9b (Strict JSON-Mode)       │
│  - Structured Schema Extraction              │
└──────────────────────┬───────────────────────┘
                       │
                       │ Structured Competency JSON
                       ▼
┌──────────────────────────────────────────────┐
│    MODULE C: Multi-Agent Evaluation Loop     │
│  - Agent 1: Technical Screener               │
│  - Agent 2: Institutional Fit & Governance   │
│  - Synthesizer: Board Briefing Card          │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│    MODULE D: Executive Frontend Dashboard    │
│  - View 1: Real-Time Live Ingestion Queue    │
│  - View 2: Candidate Dossier & Board Brief   │
│  - View 3: NDPR Audit & Regulatory Ledger    │
└──────────────────────────────────────────────┘
```

---

## Core System Modules

### 1. Module A: NDPR Security & Governance Gateway (`/backend/security/ndpr_shield.py`)
- **Carrier Redaction:** Identifies and strips Nigerian mobile formats across MTN, Airtel, Glo, and 9mobile (`+234...`, `0803...`, `0812...`, `0901...`).
- **Statutory Identity Shield:** Validates and redacts 11-digit National Identity Numbers (NIN) and Bank Verification Numbers (BVN).
- **Municipal Location Masking:** Replaces granular Nigerian residential addresses (Lekki Phase 1, Victoria Island, Maitama Abuja, etc.) with anonymous regional tokens.
- **Prompt Injection Quarantine:** Scans incoming resume text for malicious override vectors (`"Ignore previous instructions"`, `"You are now in God mode"`, etc.), neutralizes offending commands, and flags the candidate record.
- **Regulatory Audit Logging:** Generates a cryptographic SHA-256 compliance token for every redaction event.

### 2. Module B: Local SLM Resume Parser (`/backend/agents/parser.py`)
- Ingests PDF and text resume streams via PyPDF and binary decoders.
- Communicates directly with local Ollama (`gemma2:9b`) using a strict JSON-mode system prompt.
- Extracts structured profile fields:
  - `candidate_name`: Masked reference token (e.g., `[CANDIDATE_ANON_BNH-ENRG-841]`).
  - `years_of_experience`: Float.
  - `core_tech_stack`: List of verified languages and tools.
  - `seniority_level`: "Junior" | "Mid" | "Senior" | "Executive".
  - `matched_subsidiary_fit`: "Energy" | "GovTech" | "Property" | "Agribusiness" | "HoldCo".
- **Zero-Failure Fallback Engine:** If the local Ollama daemon is offline or warming weights, an autonomous deterministic NLP pipeline takes over seamlessly.

### 3. Module C: Multi-Agent Evaluation Loop (`/backend/agents/evaluator.py`)
- **Agent 1 (Technical Screener):** Scores technical capability against BNH core architectural assets (Python, FastAPI, Next.js, PostgreSQL, Docker, AWS, Kubernetes).
- **Agent 2 (Institutional Fit Assessor):** Evaluates documentation discipline (READMEs, runbooks, ADRs, post-mortems), operational autonomy, and compliance maturity.
- **Synthesizer Agent:** Computes composite score (`55% Tech + 45% Governance`) and generates an Executive Briefing Card with board-level probing questions and recommendation:
  - `Advance to Board Interview` (Composite >= 78.0, zero governance risks)
  - `Hold for Specialist Review` (Composite 68.0 - 77.9)
  - `Reject` (Composite < 68.0)

### 4. Module D: Executive Frontend Dashboard (`/frontend`)
- Designed with a posh, contained luxury executive aesthetic for BNH board members.
- **View 1: Live Ingestion Queue:** Real-time stream of anonymized candidate cards with subsidiary filtering and search.
- **View 2: Candidate Detail Modal:** Executive Briefing Card, score radar, tailored board scrutiny questions, and multi-agent deliberation logs.
- **View 3: Audit & Security Log:** Telemetry counters (total PII purged, injections quarantined, NDPR compliance rate) and exportable regulatory JSON records.
- **View 4: Sovereignty Specs:** Visual breakdown of the local SLM zero-leakage pipeline.

---

## Quickstart & Local Setup

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+ (or Python 3.11/3.14 via `py` or `uv`)
- Local Ollama running `gemma2:9b` (Optional: fallback engine active if offline)
- Docker & Docker Compose (for containerized deployment)

### 1. Native Windows PowerShell Setup

#### Backend Setup
```powershell
# In project root
uv venv .venv
uv pip install --python .venv\Scripts\python.exe -r backend\requirements.txt

# Run backend test suite
.venv\Scripts\python.exe -m pytest backend\tests\test_ndpr_and_agents.py -v

# Start FastAPI server
.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8001
```

#### Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```
Access the dashboard at **`http://localhost:3000`**.

---

### 2. Docker Compose Deployment

To spin up the entire sovereign stack (PostgreSQL 16, FastAPI backend, Next.js frontend):
```bash
docker-compose up --build
```
- **Frontend Dashboard:** `http://localhost:3000`
- **Backend API Docs:** `http://localhost:8001/docs`
- **PostgreSQL Database:** `localhost:5432`

---

### 3. Setting Up Local Ollama Container

To pull and run Google DeepMind's `gemma2:9b`:
```bash
# Pull model weights
ollama pull gemma2:9b

# Verify local endpoint
curl http://localhost:11434/api/tags
```
AegisRecruit connects to `http://localhost:11434` automatically.

---

## Database Migrations (Alembic)

To run migrations against PostgreSQL:
```bash
alembic -c backend/alembic.ini upgrade head
```

---

## Regulatory Compliance Verification

AegisRecruit provides an exportable regulatory ledger ready for submission to the **Nigeria Data Protection Commission (NDPC)**:
- Navigate to the **NDPR Audit & Telemetry** tab.
- Click **Export Regulatory Audit (NDPC)** to download verifiable audit logs with cryptographic hash tokens (`NDPR-SEC-...`).

---

## License & Proprietary Notice

Confidential and Proprietary. Developed exclusively for the Executive Board of **Brendan Nicholas Holdings (BNH)**.
