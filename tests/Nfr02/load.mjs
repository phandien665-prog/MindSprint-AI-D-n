import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";

const runId = process.env.NFR02_RUN_ID;
if (!runId || !/^[a-z0-9-]{6,40}$/i.test(runId)) throw new Error("Set NFR02_RUN_ID to the run ID used by prepare.mjs.");
const directory = path.resolve("artifacts", "issue43", runId);
const tokenFile = path.join(directory, "tokens.json");
const setup = JSON.parse(await readFile(tokenFile, "utf8"));
const baseUrl = (process.env.NFR02_BASE_URL ?? setup.baseUrl).replace(/\/$/, "");
const users = setup.users;
const config = {
  warmupMs: Number(process.env.NFR02_WARMUP_MS ?? 120_000),
  rampMs: Number(process.env.NFR02_RAMP_MS ?? 120_000),
  steadyMs: Number(process.env.NFR02_STEADY_MS ?? 600_000),
  idleMs: Number(process.env.NFR02_IDLE_MS ?? 300_000),
  cycles: Number(process.env.NFR02_CYCLES ?? 3),
  thinkTimeMs: Number(process.env.NFR02_THINK_TIME_MS ?? 1_000),
  maxVu: Number(process.env.NFR02_VUS ?? 50),
  startVu: Number(process.env.NFR02_START_VUS ?? 20),
  timeoutMs: Number(process.env.NFR02_TIMEOUT_MS ?? 5_000),
  systemCards: Number(process.env.NFR02_SYSTEM_CARDS ?? 1_814),
};
const smokeMode = process.env.NFR02_SMOKE === "1";
if (users.length !== 50 || config.maxVu !== 50 || config.startVu !== 20 || (!smokeMode && config.cycles !== 3)) {
  throw new Error("This acceptance profile requires 50 accounts, ramping from 20 VU, and 3 cycles.");
}

const routeNames = ["GET /api/flashcards", "GET /api/tasks", "GET /api/notebooks", "POST /api/tasks", "PATCH /api/tasks/{id}/move"];
const samples = Object.create(null);
const errors = [];
const events = [];
let currentPhase = "setup";
const runPrefix = `nfr02-${runId}`;
const perUser = new Map(users.map(user => [user.id, { ...user, taskIds: [], writeCounter: 0, moveCounter: 0 }]));

function record(phase, route, elapsedMs, error = null) {
  const key = `${phase} | ${route}`;
  (samples[key] ??= { count: 0, errors: 0, latenciesMs: [] }).count++;
  samples[key].latenciesMs.push(elapsedMs);
  if (error) {
    samples[key].errors++;
    if (errors.length < 100) errors.push({ phase, route, error });
  }
}

function percentile(values, p) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return Number(sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * p) - 1)].toFixed(2));
}

function assertFixture(user, route, body) {
  if (route === "GET /api/flashcards") {
    const ownPrefix = `${runPrefix}-u${user.id}-card-`;
    const ownCards = body.filter(card => String(card.id).startsWith(ownPrefix));
    const anyFixtureCards = body.filter(card => String(card.id).startsWith(`${runPrefix}-u`));
    if (body.length < config.systemCards + 500 || ownCards.length !== 500 || anyFixtureCards.length !== 500)
      return "flashcard count/ownership assertion failed";
  } else if (route === "GET /api/tasks") {
    if (body.length < 100 || body.some(task => task.userId !== user.id)) return "task count/ownership assertion failed";
  } else if (route === "GET /api/notebooks") {
    const ownPrefix = `${runPrefix}-u${user.id}-nb-`;
    if (body.length < 10 || body.some(notebook => !notebook.title.startsWith(ownPrefix) || notebook.sources !== 5))
      return "notebook count/ownership/source assertion failed";
  } else if (route === "POST /api/tasks") {
    if (!Number.isInteger(body.id) || body.userId !== user.id) return "created task ownership assertion failed";
    user.taskIds.push(body.id);
  } else if (route === "PATCH /api/tasks/{id}/move") {
    if (body.userId !== user.id || body.status !== 1) return "moved task ownership/status assertion failed";
  }
  return null;
}

async function request(user, phase, route, method, url, body, expectedStatus = 200) {
  const started = performance.now();
  let failure = null;
  try {
    const response = await fetch(`${baseUrl}${url}`, {
      method,
      headers: { authorization: `Bearer ${user.token}`, ...(body ? { "content-type": "application/json" } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(config.timeoutMs),
    });
    const text = await response.text();
    let payload;
    try { payload = text ? JSON.parse(text) : null; } catch { payload = null; }
    if (response.status !== expectedStatus) failure = `HTTP ${response.status}: ${text.slice(0, 240)}`;
    else if (payload == null) failure = "invalid JSON response";
    else failure = assertFixture(user, route, payload);
  } catch (error) {
    failure = error?.name === "TimeoutError" ? "timeout" : `network ${error?.name ?? "error"}: ${String(error?.message ?? "").slice(0, 180)}`;
  }
  record(phase, route, performance.now() - started, failure);
}

async function validateFixture() {
  for (let i = 0; i < users.length; i += 5) {
    await Promise.all(users.slice(i, i + 5).map(async raw => {
      const user = perUser.get(raw.id);
      const tasks = await fetch(`${baseUrl}/api/tasks`, { headers: { authorization: `Bearer ${user.token}` } });
      const taskRows = await tasks.json();
      const fixtureTasks = taskRows.filter(task => task.title.startsWith(`${runPrefix}-u${user.id}-task-`));
      if (!tasks.ok || fixtureTasks.length !== 100 || taskRows.some(task => task.userId !== user.id))
        throw new Error(`Fixture task ownership/count check failed for VU ${user.vu}.`);
      user.taskIds = fixtureTasks.map(task => task.id);
      for (const route of ["GET /api/flashcards", "GET /api/notebooks"]) {
        const response = await fetch(`${baseUrl}${route.slice(4)}`, { headers: { authorization: `Bearer ${user.token}` } });
        const body = await response.json();
        const failure = !response.ok ? `HTTP ${response.status}` : assertFixture(user, route, body);
        if (failure) throw new Error(`Fixture ${route} check failed for VU ${user.vu}: ${failure}.`);
      }
    }));
  }
}

async function operation(user, phase, sequence) {
  const slot = sequence % 20;
  if (slot < 7) return request(user, phase, routeNames[0], "GET", "/api/flashcards");
  if (slot < 12) return request(user, phase, routeNames[1], "GET", "/api/tasks");
  if (slot < 16) return request(user, phase, routeNames[2], "GET", "/api/notebooks");
  if (slot < 18) {
    const n = ++user.writeCounter;
    return request(user, phase, routeNames[3], "POST", "/api/tasks", {
      title: `${runPrefix}-u${user.id}-load-${n}`, description: "Synthetic issue-43 load task", priority: "Medium", status: 0,
    });
  }
  const taskId = user.taskIds[user.moveCounter++ % user.taskIds.length];
  return request(user, phase, routeNames[4], "PATCH", `/api/tasks/${taskId}/move`, { status: 1, position: 0 });
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const iso = () => new Date().toISOString();
function event(name, details = {}) { events.push({ name, atUtc: iso(), ...details }); console.log(`${iso()} ${name}`); }
async function startWorkers(indices, phase, stopAt) {
  return indices.map(index => {
    const user = perUser.get(users[index].id);
    return (async () => {
      let sequence = 0;
      let nextAt = performance.now();
      while (performance.now() < stopAt) {
        const currentPhase = typeof phase === "function" ? phase() : phase;
        await operation(user, currentPhase, sequence++);
        nextAt += config.thinkTimeMs;
        const wait = nextAt - performance.now();
        if (wait > 0) await sleep(Math.min(wait, Math.max(0, stopAt - performance.now())));
      }
    })();
  });
}

await validateFixture();
event("fixture-validated", { accounts: 50, systemCards: config.systemCards, userCards: 25_000, tasks: 5_000, notebooks: 500, sources: 2_500 });

currentPhase = "warmup";
event("warmup-start", { vus: 20, durationMs: config.warmupMs, thinkTimeMs: config.thinkTimeMs });
let warmupStop = performance.now() + config.warmupMs;
let workers = await startWorkers(Array.from({ length: 20 }, (_, i) => i), "warmup", warmupStop);
await sleep(config.warmupMs);
await Promise.all(workers);
event("warmup-complete", { activeVu: 0 });

const markers = [];
markers.push({ name: "baseline-after-warmup", atUtc: iso() });
for (let cycle = 1; cycle <= config.cycles; cycle++) {
  const cycleStart = performance.now();
  const steadyStart = cycleStart + config.rampMs;
  const stopAt = steadyStart + config.steadyMs;
  const phase = () => performance.now() < steadyStart ? `cycle-${cycle}-ramp` : `cycle-${cycle}-steady`;
  event(`cycle-${cycle}-ramp-start`, { startVu: 20, targetVu: 50, rampMs: config.rampMs });
  workers = await startWorkers(Array.from({ length: 20 }, (_, i) => i), phase, stopAt);
  for (let index = 20; index < 50; index++) {
    await sleep(config.rampMs / 30);
    workers.push(...await startWorkers([index], phase, stopAt));
  }
  event(`cycle-${cycle}-steady-start`, { vus: 50, durationMs: config.steadyMs });
  await sleep(Math.max(0, stopAt - performance.now()));
  await Promise.all(workers);
  const loadEnd = iso();
  event(`cycle-${cycle}-load-complete`, { atUtc: loadEnd });
  await sleep(config.idleMs);
  markers.push({ name: `after-cycle-${cycle}-idle`, atUtc: iso() });
  event(`cycle-${cycle}-idle-complete`, { idleMs: config.idleMs });
}

const summary = Object.fromEntries(Object.entries(samples).map(([key, value]) => {
  const latencies = value.latenciesMs;
  return [key, {
    samples: value.count, unexpectedErrors: value.errors,
    p50Ms: percentile(latencies, 0.50), p95Ms: percentile(latencies, 0.95), p99Ms: percentile(latencies, 0.99),
  }];
}));
const totalRequests = Object.values(samples).reduce((total, value) => total + value.count, 0);
const unexpectedErrorCount = Object.values(samples).reduce((total, value) => total + value.errors, 0);
const output = {
  runId, baseUrl, startedAtUtc: events[0]?.atUtc, finishedAtUtc: iso(), configuration: config,
  fixture: { accounts: 50, systemCards: config.systemCards, userCards: 25_000, tasks: 5_000, notebooks: 500, sources: 2_500, charsPerSource: 5_000 },
  events, memoryMarkers: markers, totalRequests, unexpectedErrorCount,
  unexpectedErrorRatePercent: Number((100 * unexpectedErrorCount / Math.max(1, totalRequests)).toFixed(3)),
  summary, unexpectedErrors: errors,
};
const outputFile = path.join(directory, "load-metrics.json");
await writeFile(outputFile, JSON.stringify(output, null, 2));
console.log(JSON.stringify({ runId, outputFile, totalRequests, unexpectedErrorCount,
  unexpectedErrorRatePercent: output.unexpectedErrorRatePercent, summary, errors: errors.slice(0, 20) }));
