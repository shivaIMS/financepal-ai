# 💸 FinancePal AI

A small but complete AI financial advisor chatbot. Tell it your income, expenses, and savings goal — then chat with a friendly advisor that personalizes budgeting, saving, and debt-payoff guidance in real time with streaming responses.

Built as a learning project for the GenAI course.

## ✨ Features

- **Personalized advice** — profile-aware system prompt (income, expenses, savings goal)
- **Streaming chat** — Server-Sent Events (SSE) for a fast, natural feel
- **Conversation memory** — follow-up questions keep context within a session
- **Animated typing indicator** and quick-suggestion chips
- **Provider flexibility** — OpenAI-compatible API or local Ollama (llama3.2)
- **Validation & error handling** — form validation, friendly error banners with retry
- **Privacy-minded** — no accounts, data stays in memory / on device
- **Responsive dark UI** — glassmorphism, animated background, mobile-friendly

## 🖥️ Tech Stack

| Layer      | Tech |
|------------|------|
| Frontend   | Vite + React 18 |
| Backend    | Node.js + Express |
| Streaming  | Server-Sent Events (SSE) |
| LLM        | OpenAI-compatible API **or** Ollama (local) |
| Packages   | pnpm workspace (server + client) |

## 📁 Structure

```
GenaiLearning/
├── PLAN.md                 # Development plan
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── App.jsx         # View switching (profile → chat)
│       ├── api/chat.js     # SSE streaming client
│       ├── components/     # ProfileForm, ChatWindow, bubbles, input
│       └── utils/          # Validation helpers
└── server/                 # Express backend
    └── src/
        ├── index.js        # App entry
        ├── routes/chat.js  # POST /api/chat (SSE)
        ├── services/llm.js # OpenAI / Ollama streaming
        ├── prompts/system.js
        └── store/session.js # In-memory sessions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm i -g pnpm`)
- One LLM provider: **Ollama** (free, local) or an **OpenAI API key**

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure the LLM

**Option A — Ollama (local, free):**

```bash
ollama pull llama3.2   # install the model
```

Create `server/.env`:

```env
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3.2
PORT=3001
```

**Option B — OpenAI (or any OpenAI-compatible endpoint):**

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
PORT=3001
```

### 3. Run it

```bash
pnpm dev
```

- App: http://localhost:5173
- Server API: http://localhost:3001

The Vite dev server proxies `/api` to Express, so no CORS config is needed locally.

### 4. Build for production

```bash
pnpm build
```

## 🔌 API

### `POST /api/chat`

Streams the assistant reply as Server-Sent Events.

```json
{ "sessionId": "optional", "message": "How should I budget?", "profile": { "monthlyIncome": 4500, "monthlyExpenses": 2800, "savingsGoal": 10000 } }
```

Events: `session` → `token`* → `done` (or `error`)

### `GET /api/chat/health`

```json
{ "ok": true, "provider": "ollama" }
```

## 🧠 How It Works

1. User submits a finance profile (or skips it).
2. The client calls `POST /api/chat` with the message + session id.
3. The server builds a system prompt that injects the profile, appends the conversation history, and streams the LLM reply back via SSE.
4. The client renders tokens as they arrive and keeps context for follow-ups.

The system prompt enforces a "friendly guidance, not licensed advice" disclaimer and asks the model never to request sensitive data.

## 🚢 Deployment

- **Option A (free tier):** Client → Vercel/Netlify, Server → Render/Railway. Set `OPENAI_API_KEY` (or `OLLAMA_BASE_URL`) in the platform env vars.
- **Option B (self-hosted):** Node behind Nginx + HTTPS, run with PM2.
- In production, either tighten CORS or serve the built client statically from Express.

## ⚠️ Disclaimer

FinancePal AI is an **educational tool**. It is not a licensed financial advisor and does not provide financial, tax, or investment advice. Always consult a qualified professional for major financial decisions.

## 📄 License

MIT
