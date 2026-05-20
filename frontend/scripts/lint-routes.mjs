/**
 * lint-routes.mjs
 * Verifies that all app routes respond with HTTP 200 on the local dev server.
 *
 * Usage (dev server must be running on port 3000):
 *   node scripts/lint-routes.mjs [--host http://localhost:3000]
 */

const BASE = process.argv.find((a) => a.startsWith("--host="))?.split("=")[1]
  ?? "http://localhost:3000";

const ROUTES = [
  "/",
  "/analyze",
  "/insights?brand=Nike",
  "/Dashboard?brand=Nike",
];

const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET  = "\x1b[0m";
const BOLD   = "\x1b[1m";

console.log(`\n${BOLD}Feedbot Route Check${RESET}  →  ${BASE}\n${"─".repeat(55)}`);

let ok = 0;
for (const route of ROUTES) {
  const url   = `${BASE}${route}`;
  const start = Date.now();
  try {
    const res = await fetch(url);
    const ms  = Date.now() - start;
    const icon = res.ok ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
    const code = res.ok
      ? `${GREEN}${res.status}${RESET}`
      : `${RED}${res.status}${RESET}`;
    console.log(`  ${icon}  ${code}  ${route.padEnd(35)} ${YELLOW}${ms}ms${RESET}`);
    if (res.ok) ok++;
  } catch (err) {
    console.log(`  ${RED}✗  ERR  ${route.padEnd(35)} ${err.message}${RESET}`);
  }
}

console.log(`\n${"─".repeat(55)}`);
console.log(
  `${ok === ROUTES.length ? GREEN : RED}${BOLD}${ok}/${ROUTES.length} routes OK${RESET}\n`
);
process.exit(ok === ROUTES.length ? 0 : 1);
