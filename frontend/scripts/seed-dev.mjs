/**
 * seed-dev.mjs
 * Trigger a sample analysis run against the backend so the Dashboard
 * has data to display during local development.
 *
 * Usage:
 *   node scripts/seed-dev.mjs [brand] [--limit=50]
 *
 * Examples:
 *   node scripts/seed-dev.mjs                 → seeds "Nike" with 50 posts
 *   node scripts/seed-dev.mjs Apple           → seeds "Apple" with 50 posts
 *   node scripts/seed-dev.mjs Tesla --limit=20
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const brand  = process.argv[2] && !process.argv[2].startsWith("--")
  ? process.argv[2]
  : "Nike";

const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : 50;

const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN   = "\x1b[36m";
const RESET  = "\x1b[0m";
const BOLD   = "\x1b[1m";

console.log(`\n${BOLD}Feedbot Dev Seeder${RESET}`);
console.log(`  Brand  : ${CYAN}${brand}${RESET}`);
console.log(`  Limit  : ${limit} posts`);
console.log(`  Backend: ${BACKEND}`);
console.log(`${"─".repeat(50)}\n`);

// 1. Kick off analysis
console.log(`▶  POSTing to ${BACKEND}/analyze …`);
const res = await fetch(`${BACKEND}/analyze`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ brand, limit, include_reddit: true, include_twitter: false }),
});

if (!res.ok) {
  const body = await res.text();
  console.error(`${RED}✗  Failed to start analysis (${res.status}):${RESET}`, body);
  process.exit(1);
}

const { task_id } = await res.json();
console.log(`${GREEN}✓  Task queued${RESET}  task_id=${YELLOW}${task_id}${RESET}\n`);

// 2. Poll until done
let attempts = 0;
const MAX    = 60;       // ~60 × 3s = 3 min timeout
const DELAY  = 3000;

process.stdout.write("  Waiting for results");

while (attempts < MAX) {
  await new Promise((r) => setTimeout(r, DELAY));
  process.stdout.write(".");

  try {
    const r2 = await fetch(`${BACKEND}/results?brand=${encodeURIComponent(brand)}`);
    if (r2.ok) {
      const data = await r2.json();
      if (Array.isArray(data) && data.length > 0) {
        console.log(`\n\n${GREEN}${BOLD}✓  Seeded ${data.length} posts for "${brand}"${RESET}`);
        console.log(`  Open: http://localhost:3000/Dashboard?brand=${encodeURIComponent(brand)}\n`);
        process.exit(0);
      }
    }
  } catch {}
  attempts++;
}

console.log(`\n\n${YELLOW}⚠  Timed out after ${MAX * DELAY / 1000}s — results may still be processing.${RESET}\n`);
process.exit(1);
