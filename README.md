# FoodVerse AI

A multimodal food-intelligence platform built with React and FastAPI. The current product slice includes a polished responsive dashboard, food-image recognition, nutrition and freshness summaries, kitchen-video hygiene review, adaptive cooking guidance, and personalized meal plans.

## What works

- Image upload with food recognition, portion estimates, macros, health score, freshness, and recommendations
- Dedicated freshness workflow using the same vision-service boundary
- Kitchen video upload with hygiene scoring, compliance checks, and timestamped alerts
- Natural-language recipe creation with ingredients, steps, and contextual tips
- Meal planning by goal, diet, and calorie target
- Responsive, accessible dashboard with actionable—not raw—AI output
- Typed React client and modular FastAPI domain services

The included inference services return deterministic demonstration results so the full experience works without model credentials. Production model adapters can replace the functions in `backend/app/services/` without changing the API or frontend.

## Run locally

### Frontend

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

### Backend

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

The API docs are available at `http://localhost:8000/docs`. Vite proxies `/api` calls to the backend.

Alternatively, run both services with:

```bash
docker compose up
```

## Deployment

This project is **not a Streamlit application**. The browser interface is React + TypeScript + CSS, built with Vite, while `backend/app/main.py` is a FastAPI ASGI application. Selecting that Python file as a Streamlit entrypoint fails because it does not call `streamlit` or define a Streamlit page.

The recommended hosted architecture is:

- **Frontend: Vercel** — purpose-built CDN deployment for the Vite/React application.
- **Backend: Render Web Service** — persistent Python service for FastAPI and uploaded image/video requests.

### 1. Deploy the FastAPI backend on Render

The repository includes `render.yaml`, so the easiest path is **New → Blueprint**, then select this repository. For manual Web Service setup use:

| Setting | Value |
| --- | --- |
| Runtime | Python 3 |
| Root directory | `backend` |
| Build command | `pip install -r requirements.txt` |
| Start command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Health check | `/api/health` |
| Python version | `3.12.11` |

After the first deployment, copy the generated URL, such as `https://foodverse-api.onrender.com`.

In Render’s **Environment** settings add:

```text
FOODVERSE_CORS_ORIGINS=https://your-vercel-project.vercel.app
```

Use the exact Vercel origin with no trailing slash. Multiple allowed frontends can be supplied as a comma-separated list. Do not put API keys in `render.yaml`; add them through Render’s Environment page.

### 2. Deploy the React frontend on Vercel

Import the same GitHub repository into Vercel. `vercel.json` supplies the build settings. For manual setup use:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Root directory | repository root (`.`) |
| Install command | `corepack enable && pnpm install --frozen-lockfile` |
| Build command | `pnpm run build` |
| Output directory | `dist` |

In Vercel’s **Project Settings → Environment Variables**, add this for Production and Preview:

```text
VITE_API_BASE_URL=https://foodverse-api.onrender.com
```

Vite reads this value at build time, so redeploy the frontend after changing it. The application automatically keeps using relative `/api` URLs during local development.

### Single-service alternative

The multi-stage `Dockerfile` builds the React frontend and serves it from FastAPI. Use this option on Railway, Render Docker, Fly.io, or another Docker-compatible host when you prefer one URL and no cross-origin configuration.

For Railway, connect the repository normally. `railway.json` selects the root `Dockerfile`, and Railway supplies `PORT` automatically.

### Any Docker-compatible host

```bash
docker build -t foodverse-ai .
docker run --rm -p 8000:8000 foodverse-ai
```

Open `http://localhost:8000`. API documentation remains available at `http://localhost:8000/docs`.

Secrets and model credentials must be configured in the hosting provider's environment-variable settings. Never add them to `.env.example`, source files, deployment manifests, or Git history. `.venv`, `.env*`, `node_modules`, and build output are excluded by `.gitignore` and `.dockerignore`.

## Architecture

```text
React client
  ├─ Food & freshness upload
  ├─ Hygiene video review
  ├─ Cooking copilot
  └─ Adaptive meal planner
          │
          ▼
FastAPI orchestration layer
  ├─ food_analysis service  → vision model + nutrition database
  ├─ hygiene service        → video sampling + detection/tracking
  ├─ recommendation service → LLM + profile/retrieval layer
  └─ response schemas       → normalized actionable insights
```

For production, add object storage for uploads, a job queue for long video analysis, PostgreSQL for user profiles/history, Redis for caching, and authenticated model-provider adapters. Confidence values and nutrition estimates should be labeled as estimates and validated against region-appropriate food databases.

