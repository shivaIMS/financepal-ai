# Development Plan — FinancePal AI

## Application Name

**FinancePal AI** — a small, complete web chatbot that acts as a personal AI financial advisor.

## Problem Statement

Most people struggle to turn generic financial advice into actionable steps for their own situation. Existing advice is either generic articles (not personalized) or expensive human advisors (not accessible). FinancePal AI solves this by giving conversational, personalized budgeting and savings guidance based on the user's own income, expenses, and goals — available 24/7 in a chat interface.

## Target Users

- Young professionals and students who want basic budgeting help
- People looking for an easy first step before hiring a human advisor
- Anyone who prefers asking questions conversationally rather than reading articles

## Main Features

1. **Conversational chat** with a financial advisor persona (streaming responses)
2. **Personalized context** — user enters income, monthly expenses, and a savings goal; the advisor factors this into every answer
3. **Practical advice categories**: budgeting, emergency fund, debt payoff, savings targets
4. **Streaming responses** for a natural, fast chat feel
5. **Chat history** within a session so follow-up questions keep context
6. **Safety disclaimer** — clear that advice is educational, not licensed financial guidance

## Pages / Screens

1. **Profile Setup screen** — small form to capture income, monthly expenses, savings goal (skippable; defaults to generic advice)
2. **Chat screen** — message list with user/advisor bubbles, typing indicator, input box, streaming output
3. **Single-page app** — both screens are views in the same page (no router needed for v1)

## Technology Stack

| Layer      | Choice                                   | Why |
|------------|------------------------------------------|-----|
| Frontend   | Vite + React (JavaScript)                | Fast dev, small bundle, easy streaming UI |
| Backend    | Node.js + Express                        | Minimal, well-known, easy SSE streaming |
| LLM API    | OpenAI-compatible endpoint               | Works with most providers |
| LLM option | Ollama (local, e.g. `llama3`)            | Free/local fallback for testing |
| Streaming  | Server-Sent Events (SSE)                 | Simple one-way stream from server to client |
| Package mgr| pnpm                                     | Fast, disk-efficient monorepo workspaces |

## Project Folder Structure

```
GenaiLearning/
├── PLAN.md
├── README.md
├── package.json              # pnpm workspace root
├── .env.example              # API keys / config template
├── server/
│   ├── package.json
│   └── src/
│       ├── index.js          # Express app entry
│       ├── routes/
│       │   └── chat.js       # POST /api/chat (SSE stream)
│       ├── services/
│       │   └── llm.js        # LLM call + streaming logic
│       ├── prompts/
│       │   └── system.js     # Financial advisor system prompt
│       └── store/
│           └── session.js    # In-memory chat sessions + profiles
└── client/
    ├── package.json
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx           # view switching: profile → chat
        ├── api/
        │   └── chat.js       # fetch + SSE reader
        └── components/
            ├── ProfileForm.jsx
            ├── ChatWindow.jsx
            ├── MessageBubble.jsx
            └── ChatInput.jsx
```

## Data That Needs to Be Stored

| Data | Type | Storage |
|------|------|---------|
| User finance profile (income, expenses, goal) | JSON object per session | In-memory Map (server) |
| Chat messages (role, content, timestamp) | JSON array per session | In-memory Map (server) |
| Session ID | string | Client localStorage (to reconnect to same session) |

**Persistence decision:** in-memory for v1 (small and complete). Data is lost on server restart — acceptable for a demo. A JSON-file or SQLite store is a documented future extension.

## Development Steps

1. Scaffold pnpm workspace: root package + `server/` + `client/`
2. Build the LLM service with SSE streaming (OpenAI-compatible, Ollama fallback via env var)
3. Build `POST /api/chat` endpoint: session lookup → build prompt with profile → stream reply
4. Build the chat UI: message list, input, streaming render, typing indicator
5. Build the profile form and inject profile context into the system prompt
6. Add error handling (LLM down, empty input, provider failures) + disclaimer footer
7. Test end-to-end manually: profile → chat → follow-ups; test both LLM providers
8. Write README with setup/run instructions
9. Final polish: styling, mobile-friendly layout

## Testing Approach

- **Smoke test:** start server, verify `GET /` health check and `POST /api/chat` streams a reply (run against Ollama locally or a mock)
- **UI test:** manual checklist — profile setup → chat → follow-up question keeps context → error bubble shows when LLM is unreachable → disclaimer visible
- **Provider fallback test:** run once with `OLLAMA_BASE_URL` set and once with `OPENAI_API_KEY` set
- No automated unit tests in v1 (scope); add a minimal `node --test` suite for the LLM service if time permits

## Error States (UI + API)

- LLM provider unreachable → server returns a clean JSON/SSE error event; UI shows an error bubble with a "Retry" button
- Empty/oversized input → client-side validation with inline message
- Malformed session (stale/missing ID) → server creates a fresh session, client re-renders normally
- Unknown server error → generic friendly message, no stack traces leaked to client

## Deployment Approach

- **Option A (recommended, free tier):**
  - Frontend → Vercel/Netlify static hosting
  - Backend → Render/Railway web service
  - API key stored in platform env vars, never in the repo
- **Option B (self-hosted):**
  - Single VPS: Node server behind Nginx (reverse proxy + HTTPS), PM2 for process management
- Dev mode: Vite proxy forwards `/api` to the Express server, so no CORS config needed locally
- Production: configure CORS or serve client statically from Express; set `OLLAMA_BASE_URL` or `OPENAI_API_KEY` via env

## Project Hygiene

- `.gitignore` covering `node_modules/`, `.env`, `dist/`, and editor/OS junk
- Pin Node.js version via `engines` in package.json and a `.nvmrc`
- `.env.example` committed; real `.env` never committed

## Security & Guardrails

- LLM API key only in server env vars, never client-side
- System prompt includes a strict "educational only, not licensed financial advice" boundary
- Basic input sanitization / max message length on the chat endpoint
- No user accounts, no PII stored long-term (in-memory only) in v1

## Future Extensions (out of scope for v1)

- SQLite/JSON persistence across restarts
- Budget charts and expense breakdowns
- PDF/CSV expense import
- Multiple conversation topics / memory across sessions
