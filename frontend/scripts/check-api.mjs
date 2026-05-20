/**
 * check-api.mjs
 * Quick health check for the Feedbot backend API.
 *
 * Usage:
 *   node scripts/check-api.mjs [--host http://localhost:8000]
 */

const BASE = process.argv.find((a) => a.startsWith("--host="))?.split("=")[1]
  ?? "http://localhost:8000";

const ENDPOINTS = [
  { method: "GET",  path: "/health",           label: "Health" },
  { method: "GET",  path: "/metrics",          label: "Metrics" },
  { method: "GET",  path: "/results?brand=Nike", label: "Results (Nike – sample)" },
];

const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET  = "\x1b[0m";
const BOLD   = "\x1b[1m";

function statusColor(code) {
  if (code >= 200 && code < 300) return GREEN;
  if (code >= 400 && code < 500) return YELLOW;
  return RED;
}

async function checkEndpoint({ method, path, label }) {
  const url = `${BASE}${path}`;
  const start = Date.now();
  try {
    const res = await fetch(url, { method });
    const ms  = Date.now() - start;
    const col = statusColor(res.status);
    console.log(
      `  ${col}${BOLD}${res.status}${RESET}  ${label.padEnd(30)} ${YELLOW}${ms}ms${RESET}  ${url}`
    );
    return res.ok;
  } catch (err) {
    const ms = Date.now() - start;
    console.log(
      `  ${RED}${BOLD}ERR${RESET}  ${label.padEnd(30)} ${YELLOW}${ms}ms${RESET}  ${url}`
    );
    console.log(`       ${RED}${err.message}${RESET}`);
    return false;
  }
}

console.log(`\n${BOLD}Feedbot API Check${RESET}  →  ${BASE}\n${"─".repeat(60)}`);

let passed = 0;
for (const ep of ENDPOINTS) {
  const ok = await checkEndpoint(ep);
  if (ok) passed++;
}

console.log(`\n${"─".repeat(60)}`);
console.log(
  `${passed === ENDPOINTS.length ? GREEN : RED}${BOLD}${passed}/${ENDPOINTS.length} endpoints healthy${RESET}\n`
);

process.exit(passed === ENDPOINTS.length ? 0 : 1);
