import { useState } from "react";
import { validateProfile, formatMoney } from "../utils/validation.js";

export default function ProfileForm({ onSubmit }) {
  const [form, setForm] = useState({
    monthlyIncome: "",
    monthlyExpenses: "",
    savingsGoal: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // Clear the field's error as the user fixes it.
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validateProfile(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      monthlyIncome: Number(form.monthlyIncome),
      monthlyExpenses: Number(form.monthlyExpenses),
      savingsGoal: form.savingsGoal === "" ? 0 : Number(form.savingsGoal),
      notes: form.notes.trim(),
    });
  }

  const disposable =
    Number(form.monthlyIncome) - Number(form.monthlyExpenses);

  return (
    <div className="profile-page">
      <header className="brand">
        <span className="brand-logo">💸</span>
        <div>
          <h1>FinancePal AI</h1>
          <p className="tagline">Your personal AI financial advisor</p>
        </div>
      </header>

      <main className="card">
        <h2>Set up your profile</h2>
        <p className="muted">
          Tell us about your finances so the advisor can personalize its advice.
          Everything stays on your device and in memory — we don't store your data.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="monthlyIncome">Monthly income *</label>
            <div className="input-wrap">
              <span className="prefix">$</span>
              <input
                id="monthlyIncome"
                name="monthlyIncome"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="e.g. 4500"
                value={form.monthlyIncome}
                onChange={handleChange}
                className={errors.monthlyIncome ? "invalid" : ""}
              />
            </div>
            {errors.monthlyIncome && <p className="field-error">{errors.monthlyIncome}</p>}
          </div>

          <div className="field">
            <label htmlFor="monthlyExpenses">Monthly expenses *</label>
            <div className="input-wrap">
              <span className="prefix">$</span>
              <input
                id="monthlyExpenses"
                name="monthlyExpenses"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="e.g. 2800"
                value={form.monthlyExpenses}
                onChange={handleChange}
                className={errors.monthlyExpenses ? "invalid" : ""}
              />
            </div>
            {errors.monthlyExpenses && <p className="field-error">{errors.monthlyExpenses}</p>}
          </div>

          <div className="field">
            <label htmlFor="savingsGoal">Savings goal (optional)</label>
            <div className="input-wrap">
              <span className="prefix">$</span>
              <input
                id="savingsGoal"
                name="savingsGoal"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="e.g. 10000"
                value={form.savingsGoal}
                onChange={handleChange}
                className={errors.savingsGoal ? "invalid" : ""}
              />
            </div>
            {errors.savingsGoal && <p className="field-error">{errors.savingsGoal}</p>}
          </div>

          <div className="field">
            <label htmlFor="notes">Anything else? (optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              maxLength="500"
              placeholder="e.g. I have a $5,000 credit card debt at 22% APR"
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          {Number.isFinite(disposable) && (
            <div className="summary-strip">
              Monthly disposable income:{" "}
              <strong>{formatMoney(disposable)}</strong>
            </div>
          )}

          <div className="actions">
            <button type="submit" className="btn primary">
              Start chatting
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() =>
                onSubmit({ monthlyIncome: 0, monthlyExpenses: 0, savingsGoal: 0, notes: "" })
              }
            >
              Skip for now
            </button>
          </div>
        </form>
      </main>

      <footer className="footer">
        Educational tool only — not licensed financial advice.
      </footer>
    </div>
  );
}
