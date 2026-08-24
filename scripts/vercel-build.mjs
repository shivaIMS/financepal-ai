// Vercel build entry: bundles the serverless function with esbuild.
// Output: api/index.js (self-contained, deps inlined) + api/package.json.
import { build } from "esbuild";
import { writeFileSync, mkdirSync } from "node:fs";

mkdirSync("api", { recursive: true });

await build({
  entryPoints: ["api/entry.js"],
  outfile: "api/index.js",
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  sourcemap: false,
  logLevel: "info",
  packages: "bundle",
});

// Mark the output as a CommonJS module so Vercel doesn't recompile it.
writeFileSync(
  "api/package.json",
  JSON.stringify({ name: "financepal-api", type: "commonjs", private: true }, null, 2)
);

console.log("✅ Serverless function bundled to api/index.js");
