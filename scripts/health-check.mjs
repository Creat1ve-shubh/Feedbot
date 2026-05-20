#!/usr/bin/env node
// health-check.mjs — Verify Feedbot API and frontend are reachable
// Usage: node scripts/health-check.mjs [--api-url http://...] [--web-url http://...]

import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    "api-url": { type: "string", default: "http://localhost:8000" },
    "web-url": { type: "string", default: "http://localhost:3000" },
  },
});

const API = values["api-url"];
const WEB = values["web-url"];

const checks = [
  { name: "API health",   url: `${API}/health` },
  { name: "API metrics",  url: `${API}/metrics` },
  { name: "Frontend",     url: WEB },
];

let allOk = true;

for (const { name, url } of checks) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const ok  = res.ok || res.status === 200;
    console.log(`${ok ? "✓" : "✗"} ${name.padEnd(14)} ${res.status}  ${url}`);
    if (!ok) allOk = false;
  } catch (err) {
    console.log(`✗ ${name.padEnd(14)} ERR  ${url}  (${err.message})`);
    allOk = false;
  }
}

process.exit(allOk ? 0 : 1);
