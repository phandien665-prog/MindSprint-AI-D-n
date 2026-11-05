import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const baseUrl = (process.env.NFR02_BASE_URL ?? "http://127.0.0.1:5081").replace(/\/$/, "");
const runId = process.env.NFR02_RUN_ID ?? new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
if (!/^[a-z0-9-]{6,40}$/i.test(runId)) throw new Error("NFR02_RUN_ID must contain only letters, digits, and hyphens.");

async function request(route, body) {
  const response = await fetch(`${baseUrl}${route}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  const text = await response.text();
  let payload;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = null; }
  if (!response.ok) throw new Error(`POST ${route} returned HTTP ${response.status}.`);
  return payload;
}

const users = [];
const batchSize = 5;
for (let first = 0; first < 50; first += batchSize) {
  const batch = await Promise.all(Array.from({ length: Math.min(batchSize, 50 - first) }, async (_, offset) => {
    const vu = first + offset + 1;
    const email = `nfr02-${runId}-vu${String(vu).padStart(2, "0")}@issue43.invalid`;
    const result = await request("/api/auth/register", {
      email,
      password: `Nfr02-${runId}-local-test!`,
      displayName: `NFR-02 ${runId} VU ${vu}`,
    });
    if (!result?.token || !Number.isInteger(result?.user?.id)) throw new Error(`Registration did not return a user/token for VU ${vu}.`);
    return { vu, id: result.user.id, email, token: result.token };
  }));
  users.push(...batch);
}

const outputDir = path.resolve("artifacts", "issue43", runId);
await mkdir(outputDir, { recursive: true });
const tokenFile = path.join(outputDir, "tokens.json");
await writeFile(tokenFile, JSON.stringify({ runId, baseUrl, users }, null, 2), { mode: 0o600 });
console.log(JSON.stringify({ runId, baseUrl, registeredAccounts: users.length, tokenFile }));
