// Express app entry point.
import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat.js";

const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(cors()); // dev only; production is tightened below
app.use(express.json({ limit: "64kb" }));

// Simple request log
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.use("/api/chat", chatRouter);

// Root health check
app.get("/", (_req, res) => {
  res.json({ app: "FinancePal AI", status: "ok" });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler (never leaks stack traces)
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[server] unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`FinancePal server listening on http://localhost:${PORT}`);
});
