// Form validation helpers.

export function validateProfile(profile) {
  const errors = {};
  const money = (v) => Number(v);

  if (profile.monthlyIncome === "" || !Number.isFinite(money(profile.monthlyIncome))) {
    errors.monthlyIncome = "Enter your monthly income as a number.";
  } else if (money(profile.monthlyIncome) < 0) {
    errors.monthlyIncome = "Income can't be negative.";
  }

  if (profile.monthlyExpenses === "" || !Number.isFinite(money(profile.monthlyExpenses))) {
    errors.monthlyExpenses = "Enter your monthly expenses as a number.";
  } else if (money(profile.monthlyExpenses) < 0) {
    errors.monthlyExpenses = "Expenses can't be negative.";
  }

  if (profile.savingsGoal !== "" && !Number.isFinite(money(profile.savingsGoal))) {
    errors.savingsGoal = "Savings goal must be a number.";
  } else if (money(profile.savingsGoal) < 0) {
    errors.savingsGoal = "Savings goal can't be negative.";
  }

  return errors;
}

export function formatMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
