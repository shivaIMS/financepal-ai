// Local development entry: starts the Express server with app.listen().
import app from "./app.js";

const PORT = Number(process.env.PORT || 3001);

app.listen(PORT, () => {
  console.log(`FinancePal server listening on http://localhost:${PORT}`);
});
