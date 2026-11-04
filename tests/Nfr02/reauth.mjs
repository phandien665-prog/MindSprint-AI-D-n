import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const runId = process.env.NFR02_RUN_ID;
if (!runId || !/^[a-z0-9-]{6,40}$/i.test(runId)) throw new Error("Set NFR02_RUN_ID to the prepared fixture run ID.");
const file = path.resolve("artifacts", "issue43", runId, "tokens.json");
const setup = JSON.parse(await readFile(file, "utf8"));
const password = `Nfr02-${runId}-local-test!`;

for (let i = 0; i < setup.users.length; i += 5) {
  const batch = await Promise.all(setup.users.slice(i, i + 5).map(async user => {
    const response = await fetch(`${setup.baseUrl}/api/auth/login`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: user.email, password }), signal: AbortSignal.timeout(15_000),
    });
    const text = await response.text();
    let result;
    try { result = text ? JSON.parse(text) : null; } catch { result = null; }
    if (!response.ok || !result?.token) throw new Error(`Login failed for VU ${user.vu} (HTTP ${response.status}).`);
    return { ...user, id: result.user.id, token: result.token, refreshToken: result.refreshToken };
  }));
  setup.users.splice(i, batch.length, ...batch);
}

await writeFile(file, JSON.stringify(setup, null, 2), { mode: 0o600 });
console.log(JSON.stringify({ runId, authenticatedAccounts: setup.users.length }));
