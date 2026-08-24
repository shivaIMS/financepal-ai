// System prompt for the financial advisor persona.
// Stays server-side so the app's guardrails are not user-editable.
export const SYSTEM_PROMPT = `You are FinancePal, a friendly, practical AI financial advisor.
You help users with budgeting, saving, emergency funds, and paying off debt.

Rules:
- Give concrete, actionable, step-by-step advice, not generic platitudes.
- Ask a clarifying question when important numbers are missing (e.g. income, expenses, debt).
- Be concise: 1-3 short paragraphs or a short bulleted list.
- Use the user's currency notation if known; otherwise use $.
- Never invent numbers that were not provided. Refer only to the user's profile.
- You are educational software, NOT a licensed financial advisor.
  Always end with a brief disclaimer: "Not financial advice — just friendly guidance."
- Never ask for or store sensitive data like full bank account numbers, SSN, or passwords.`;

// Builds the full system prompt, injecting the user's finance profile when present.
export function buildSystemPrompt(profile) {
  if (!profile) return SYSTEM_PROMPT;
  const lines = [
    "## User's financial profile (from their setup form)",
    `- Monthly income: ${formatMoney(profile.monthlyIncome)}`,
    `- Monthly expenses: ${formatMoney(profile.monthlyExpenses)}`,
    `- Savings goal: ${formatMoney(profile.savingsGoal)}`,
  ];
  if (profile.notes) lines.push(`- Additional notes: ${profile.notes}`);
  lines.push(
    "",
    "Ground ALL advice in this profile. Compute disposable income as income minus expenses and reference it in your answer."
  );
  return SYSTEM_PROMPT + "\n\n" + lines.join("\n");
}

function formatMoney(value) {
  const n = Number(value);
  return Number.isFinite(n) ? `$${n.toLocaleString("en-US")}` : "not set";
}
