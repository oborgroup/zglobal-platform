#!/usr/bin/env node
/**
 * Grant or revoke platform admin access for an existing account.
 *
 * Admin status is stored in the account's Supabase `app_metadata.is_admin`
 * (server-controlled — users cannot change it themselves). This script uses
 * the service-role key from `.env.local`, so it must only ever be run locally
 * by a trusted operator.
 *
 * Usage:
 *   node scripts/set-admin.mjs <email>            # grant admin
 *   node scripts/set-admin.mjs <email> --revoke   # revoke admin
 *   node scripts/set-admin.mjs --list             # list all admins
 *
 * The target account must already exist (create it via /signup first).
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const env = {};
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2];
    }
  } catch {
    // ignore — validated below
  }
  return env;
}

const env = loadEnv();
const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL_BASE || !KEY) {
  console.error("✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const ADMIN_API = `${URL_BASE}/auth/v1/admin/users`;
const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

async function listAllUsers() {
  const users = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${ADMIN_API}?page=${page}&per_page=1000`, { headers });
    if (!res.ok) throw new Error(`List failed: ${res.status} ${await res.text()}`);
    const json = await res.json();
    const batch = json.users || [];
    users.push(...batch);
    if (batch.length < 1000) break;
  }
  return users;
}

const args = process.argv.slice(2);

if (args.includes("--list")) {
  const admins = (await listAllUsers()).filter((u) => u.app_metadata?.is_admin === true);
  if (admins.length === 0) {
    console.log("No admins yet.");
  } else {
    console.log(`${admins.length} admin(s):`);
    admins.forEach((u) => console.log(`  • ${u.email}`));
  }
  process.exit(0);
}

const email = args.find((a) => !a.startsWith("--"));
const revoke = args.includes("--revoke");

if (!email) {
  console.error("Usage: node scripts/set-admin.mjs <email> [--revoke] | --list");
  process.exit(1);
}

const user = (await listAllUsers()).find((u) => u.email?.toLowerCase() === email.toLowerCase());
if (!user) {
  console.error(`✗ No account found for ${email}. Create it via /signup first.`);
  process.exit(1);
}

const res = await fetch(`${ADMIN_API}/${user.id}`, {
  method: "PUT",
  headers,
  body: JSON.stringify({ app_metadata: { is_admin: !revoke } }),
});
if (!res.ok) {
  console.error(`✗ Update failed: ${res.status} ${await res.text()}`);
  process.exit(1);
}
const updated = await res.json();
const now = updated.app_metadata?.is_admin === true;
console.log(`✓ ${email} → is_admin: ${now}${revoke ? " (revoked)" : " (granted)"}`);
