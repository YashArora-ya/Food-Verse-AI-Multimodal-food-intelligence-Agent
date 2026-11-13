# FoodVerse AI

FoodVerse is a frontend-only food intelligence experience built with React, TypeScript, CSS, and Vite.

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

## Deploy on Vercel

Import the GitHub repository into Vercel. The included `vercel.json` supplies the deployment settings:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Root directory | `.` |
| Install command | `corepack enable && pnpm install --frozen-lockfile` |
| Build command | `pnpm run build` |
| Output directory | `dist` |

No Python runtime, Streamlit entrypoint, API URL, CORS configuration, or backend environment variables are required.

## Project structure

```text
src/
  App.tsx       Application screens and interactions
  services.ts   Browser-local demonstration analysis
  styles.css    Responsive visual system
  types.ts      Shared TypeScript data contracts
  main.tsx      React entrypoint
```

Do not commit `.env` files, virtual environments, dependency folders, or production build output. These remain excluded by `.gitignore`.
