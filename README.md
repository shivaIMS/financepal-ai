# 💸 FinancePal AI

> Your personal AI financial advisor — a small but complete chatbot that gives personalized budgeting, saving, and debt-payoff advice.

[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node](https://img.shields.io/badge/Node-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Table of Contents

- [Project Description](#-project-description)
- [Features](#-features)
- [Technology Used](#-technology-used)
- [How to Install](#-how-to-install)
- [How to Run Locally](#-how-to-run-locally)
- [GitHub Repository](#-github-repository)
- [Live Application URL](#-live-application-url)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [How It Works](#-how-it-works)
- [Deployment](#-deployment)
- [Disclaimer & License](#-disclaimer--license)

---

## 📖 Project Description

**FinancePal AI** is a web application where you can chat with an AI financial advisor. Instead of reading generic finance articles, you tell FinancePal your **monthly income, expenses, and savings goal** — then ask questions like *"How should I budget this month?"* or *"How much should I save for an emergency fund?"* and get **personalized, actionable advice** streamed back in real time.

Built as a learning project for the GenAI course, it demonstrates a complete AI application loop: a React chat interface, an Express backend, and a streaming LLM integration (OpenAI-compatible API or a local Ollama model).

---

## ✨ Features

- **Personalized advice** — the advisor factors in your income, expenses, and savings goal
- **Streaming chat** — responses appear token-by-token via Server-Sent Events (SSE)
- **Conversation memory** — follow-up questions keep context within a session
- **Profile setup form** — with live disposable-income calculation and full validation
- **Quick-suggestion chips** — one-tap starter questions
- **Animated typing indicator** — a natural, polished chat feel
- **Provider flexibility** — OpenAI-compatible API **or** local Ollama (llama3.2)
- **Friendly error handling** — clear error banner with a retry button if the LLM is unreachable
- **Privacy-minded** — no accounts, no long-term storage; data stays in memory / on device
- **Responsive dark UI** — glassmorphism, animated gradient background, mobile-friendly

---

## 🛠️ Technology Used

| Layer         | Technology                                             |
|---------------|--------------------------------------------------------|
| Frontend      | React 18, Vite 6, JavaScript (JSX), CSS3                |
| Backend       | Node.js 20+, Express 4                                  |
| Streaming     | Server-Sent Events (SSE)                                |
| LLM           | OpenAI-compatible API (e.g. GPT-4o-mini) **or** Ollama (local) |
| Package Mgr   | pnpm (workspace with `server` + `client`)               |
| Tools         | Git, GitHub CLI, Node's built-in `fetch`                |

---

## 📦 How to Install

### Prerequisites

- **Node.js** 20 or newer — [nodejs.org](https://nodejs.org)
- **pnpm** — install with `npm i -g pnpm`
- An LLM provider (pick one):
  - **Ollama** (free, local) — [ollama.com](https://ollama.com)
  - **OpenAI API key** — [platform.openai.com](https://platform.openai.com)

### Step 1 — Clone the repository

```bash
git clone https://github.com/shivaIMS/financepal-ai.git
cd financepal-ai
```

### Step 2 — Install dependencies

```bash
pnpm install
```

### Step 3 — Configure the LLM

Create a `server/.env` file (see `server/.env.example`).

**Option A — Ollama (local, free):**

```bash
ollama pull llama3.2
```

```env
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3.2
PORT=3001
```

**Option B — OpenAI (or any OpenAI-compatible endpoint):**

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
PORT=3001
```

> The API key stays server-side only and is never sent to the browser.

---

## ▶️ How to Run Locally

```bash
pnpm dev
```

This starts both apps together:

| Service   | URL                        | Notes                                    |
|-----------|----------------------------|------------------------------------------|
| Frontend  | http://localhost:5173      | Vite dev server (open this in a browser) |
| Backend   | http://localhost:3001      | Express API                              |

- Open **http://localhost:5173** — you'll land on the profile setup form.
- Fill in your income/expenses (or skip), then start chatting.
- The Vite dev server proxies `/api` to Express, so no CORS config is needed locally.

You can also run each part separately:

```bash
pnpm dev:server   # backend only
pnpm dev:client   # frontend only
```

### Production build

```bash
pnpm build        # builds the client into client/dist
pnpm start        # runs the Express server (serves API; pair with a static host)
```

---

## 🐙 GitHub Repository

**URL:** https://github.com/shivaIMS/financepal-ai

- Owner: [shivaIMS](https://github.com/shivaIMS)
- Default branch: `main`
- Includes: full source code, `PLAN.md`, `README.md`, `.gitignore`, `package.json` files, and lockfiles.

---

## 🌐 Live Application URL

**Not deployed yet.** The app runs locally during development.

Deployment is planned via one of these options (see [Deployment](#-deployment)):

- **Frontend** → Vercel/Netlify (static hosting)
- **Backend** → Render/Railway (Node web service)

Once deployed, the live URL will be listed here.

---

## 📁 Project Structure

```
financepal-ai/
├── PLAN.md                  # Development plan
├── README.md                # You are here
├── package.json             # pnpm workspace root
├── pnpm-workspace.yaml      # workspace + pnpm settings
├── .env.example             # environment template
├── .gitignore
├── client/                  # React frontend (Vite)
│   ├── index.html
│   ├── vite.config.js       # dev proxy /api → :3001
│   └── src/
│       ├── main.jsx         # entry point
│       ├── App.jsx          # view switching (profile → chat)
│       ├── styles.css       # global dark/glassmorphism theme
│       ├── api/chat.js      # SSE streaming client
│       ├── utils/validation.js
│       └── components/
│           ├── ProfileForm.jsx
│           ├── ChatWindow.jsx
│           ├── MessageBubble.jsx
│           └── ChatInput.jsx
└── server/                  # Express backend
    ├── .env.example
    └── src/
        ├── index.js         # app entry
        ├── routes/chat.js   # POST /api/chat (SSE)
        ├── services/llm.js  # OpenAI / Ollama streaming
        ├── prompts/system.js# advisor system prompt
        └── store/session.js # in-memory sessions
```

---

## 🔌 API Reference

### `GET /api/chat/health`

Health check — reports the active LLM provider.

```json
{ "ok": true, "provider": "ollama" }
```

### `POST /api/chat`

Streams the assistant's reply as Server-Sent Events.

**Request body:**

```json
{
  "sessionId": "optional-session-id",
  "message": "How should I budget this month?",
  "profile": {
    "monthlyIncome": 4500,
    "monthlyExpenses": 2800,
    "savingsGoal": 10000,
    "notes": "I have $5,000 credit card debt at 22% APR"
  }
}
```

**Response — event stream:**

```
event: session   → { "sessionId": "abc123" }
event: token     → { "text": "Start with the 50/30/20..." }   (repeats)
event: done      → {}
event: error     → { "message": "..." }                       (on failure)
```

---

## 🧠 How It Works

1. The user submits a finance profile (or skips it).
2. The React client calls `POST /api/chat` with the message, session id, and profile.
3. The Express server stores the message, builds a **system prompt that injects the user's profile**, and appends the conversation history.
4. The server streams the LLM's reply back as SSE `token` events.
5. The client renders tokens as they arrive, with an animated typing indicator.
6. Follow-up questions reuse the same `sessionId`, so the advisor remembers context.

The system prompt enforces guardrails: advice is "educational guidance, not licensed financial advice," and the model is told never to request sensitive data like bank account numbers or passwords.

---

## 🚢 Deployment

**Option A — Free tier (recommended):**

- Frontend → **Vercel** or **Netlify** (static hosting for `client/`)
- Backend → **Render** or **Railway** (Node web service for `server/`)
- Set `OPENAI_API_KEY` (or `OLLAMA_BASE_URL`) as platform environment variables
- Configure CORS on the server to allow your frontend domain

**Option B — Self-hosted:**

- Single VPS running the Node server behind **Nginx** (reverse proxy + HTTPS)
- Manage the process with **PM2**

---

## ⚠️ Disclaimer & License

**Disclaimer:** FinancePal AI is an **educational tool**. It is not a licensed financial advisor and does not provide financial, tax, or investment advice. Always consult a qualified professional for major financial decisions.

**License:** MIT
