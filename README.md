# FoodVerse AI

FoodVerse is a food intelligence experience built with React, TypeScript, CSS, and Vite. A lightweight Streamlit entrypoint hosts the compiled React interface for Streamlit Community Cloud.

## Features

- Food image upload with recognition, nutrition, health-score, and freshness demonstrations
- Kitchen-video hygiene review with compliance checks and timestamped guidance
- Contextual recipe creation
- Personalized meal planning
- Responsive dashboard and actionable insights

All analysis currently runs through deterministic browser-local demonstration services in `src/services.ts`. Uploaded images and videos are not sent to a server. The results are UI demonstrations rather than medical, safety, or nutritional advice.

## Local development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

## Production build

```bash
pnpm run build
```

The static site is generated in `dist/`.

## Deploy on Streamlit Community Cloud

Use these settings:

| Setting | Value |
| --- | --- |
| Repository | This GitHub repository |
| Branch | `main` |
| Main file path | `streamlit_app.py` |
| Python version | 3.12 |

The production `dist/` directory is committed because `streamlit_app.py` embeds its JavaScript and CSS. Whenever the React source changes, run `pnpm run build` before committing.

## Deploy on Vercel

Import the GitHub repository into Vercel. The included `vercel.json` supplies the deployment settings:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Root directory | `.` |
| Install command | `corepack enable && pnpm install --frozen-lockfile` |
| Build command | `pnpm run build` |
| Output directory | `dist` |

No API URL, CORS configuration, backend, or secret environment variables are required.

## Project structure

```text
src/
  App.tsx       Application screens and interactions
  services.ts   Browser-local demonstration analysis
  styles.css    Responsive visual system
  types.ts      Shared TypeScript data contracts
  main.tsx      React entrypoint
```

Do not commit `.env` files, virtual environments, or dependency folders. The production build is intentionally committed for Streamlit hosting.
