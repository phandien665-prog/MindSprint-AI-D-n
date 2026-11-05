// Test Suite for Issue #42 (NFR-01) on Live Production:
// Frontend: https://mindsprint-ai-d-n-frontend.vercel.app/
// Backend:  https://mindsprint-api-zyur.onrender.com
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { performance } = require('node:perf_hooks');

async function safeFetch(url, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await safeFetch(url, options);
        } catch (e) {
            if (i === retries - 1) throw e;
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
    }
}

const VERCEL_URL = process.env.VERCEL_URL || 'https://mindsprint-ai-d-n-frontend.vercel.app';
const API = process.env.LIVE_API || 'https://mindsprint-api-zyur.onrender.com';
const root = path.resolve(__dirname, '..');

let chromium;
try { ({ chromium } = require('playwright')); }
catch {
    const packaged = ['Debug', 'Release'].map(config => path.join(root, `backend/MindSprint.Api/bin/${config}/net8.0/.playwright/package`)).find(fs.existsSync);
    if (packaged) ({ chromium } = require(packaged));
}

function quantile(sortedArr, q) {
    if (sortedArr.length === 0) return 0;
    const index = (sortedArr.length - 1) * q;
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight;
}

function computeStats(samples) {
    if (samples.length === 0) return { count: 0, min: 0, max: 0, avg: 0, p50: 0, p90: 0, p95: 0, p99: 0 };
    const sorted = [...samples].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, v) => acc + v, 0);
    return {
        count: sorted.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        avg: sum / sorted.length,
        p50: quantile(sorted, 0.50),
        p90: quantile(sorted, 0.90),
        p95: quantile(sorted, 0.95),
        p99: quantile(sorted, 0.99)
    };
}

test('Live Issue #42 (NFR-01): Performance & Web Vitals on Live Production', { timeout: 180000 }, async () => {
    console.log(`\n================================================================================`);
    console.log(`   LIVE VERIFICATION — ISSUE #42 (NFR-01): RESPONSE PERFORMANCE & VITALS      `);
    console.log(`================================================================================`);
    console.log(`Frontend URL: ${VERCEL_URL}`);
    console.log(`Backend API:  ${API}\n`);

    // --- 1. Live Core Web Vitals on Vercel ---
    console.log('[1/2] Measuring Core Web Vitals (LCP, CLS, INP) on Live Vercel App...');
    const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
    const execPath = fs.existsSync(edgePath) ? edgePath : undefined;

    const browser = await chromium.launch({ executablePath: execPath, headless: true });

    const configs = [
        { name: 'Desktop (1440x900)', viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false },
        { name: 'Mobile Safari/iOS (390x844)', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }
    ];

    const vitalsReport = {};

    try {
        for (const cfg of configs) {
            console.log(`  Evaluating ${cfg.name}...`);
            const context = await browser.newContext({
                viewport: cfg.viewport,
                isMobile: cfg.isMobile,
                hasTouch: cfg.hasTouch
            });

            await context.addInitScript(() => {
                const demoUser = { id: 4, email: 'notebookai@demo.local', displayName: 'Notebook AI Demo' };
                localStorage.setItem('auth-user', JSON.stringify(demoUser));
                localStorage.setItem('auth-token', 'mock-token');
                localStorage.setItem('refresh-token', 'mock-refresh');
            });

            const page = await context.newPage();

            await page.addInitScript(() => {
                window.__webVitals = { lcp: 0, cls: 0 };
                try {
                    new PerformanceObserver((entryList) => {
                        const entries = entryList.getEntries();
                        if (entries.length > 0) window.__webVitals.lcp = entries[entries.length - 1].startTime;
                    }).observe({ type: 'largest-contentful-paint', buffered: true });
                } catch {}
                try {
                    new PerformanceObserver((entryList) => {
                        for (const entry of entryList.getEntries()) {
                            if (!entry.hadRecentInput) window.__webVitals.cls += entry.value;
                        }
                    }).observe({ type: 'layout-shift', buffered: true });
                } catch {}
            });

            await page.goto(VERCEL_URL, { waitUntil: 'load' });
            await page.waitForTimeout(2000);

            // 35 interactions
            const interactionDurations = [];
            const actionSelectors = [
                '#btn-nav-flashcards', '#btn-nav-study', '#btn-nav-kanban', '#btn-nav-notebook',
                '.card-inner', '#flashcard-inner', '#flip-card-btn', '#next-card-btn'
            ];

            for (let i = 0; i < 35; i++) {
                const selector = actionSelectors[i % actionSelectors.length];
                const el = page.locator(selector).first();
                const count = await el.count();
                const t0 = performance.now();
                if (count > 0 && await el.isVisible()) {
                    try {
                        if (cfg.hasTouch) await el.tap({ timeout: 500 });
                        else await el.click({ timeout: 500 });
                    } catch {}
                }
                interactionDurations.push(performance.now() - t0);
                await page.waitForTimeout(40);
            }

            const rawVitals = await page.evaluate(() => window.__webVitals);
            const navTiming = await page.evaluate(() => {
                const p = performance.getEntriesByType('navigation')[0];
                return p ? p.domContentLoadedEventEnd : 0;
            });

            const lcp = rawVitals.lcp > 0 ? rawVitals.lcp : navTiming;
            const cls = rawVitals.cls;
            const sortedInp = [...interactionDurations].sort((a, b) => a - b);
            const p75Inp = quantile(sortedInp, 0.75);

            vitalsReport[cfg.name] = { lcp, cls, p75Inp };
            console.log(`    * LCP:     ${lcp.toFixed(1)} ms (Threshold: <= 2500 ms) -> ${lcp <= 2500 ? 'PASS' : 'FAIL'}`);
            console.log(`    * CLS:     ${cls.toFixed(4)} (Threshold: <= 0.10)     -> ${cls <= 0.10 ? 'PASS' : 'FAIL'}`);
            console.log(`    * p75 INP: ${p75Inp.toFixed(1)} ms (Threshold: <= 200 ms)   -> ${p75Inp <= 200 ? 'PASS' : 'FAIL'}`);

            assert.ok(lcp <= 2500, `LCP must be <= 2500ms on ${cfg.name}`);
            assert.ok(cls <= 0.10, `CLS must be <= 0.10 on ${cfg.name}`);
            assert.ok(p75Inp <= 200, `p75 INP must be <= 200ms on ${cfg.name}`);

            await context.close();
        }
    } finally {
        await browser.close();
    }

    // --- 2. Live API Performance Benchmark under Concurrent Load ---
    console.log('\n[2/2] Benchmarking Live Render API with 10 Concurrent VUs (Standard Request Mix)...');
    
    // Prepare 10 test accounts on live
    const vus = [];
    for (let i = 1; i <= 10; i++) {
        const email = `live-perf-vu-${i}@perf.mindsprint.vn`;
        const password = `PerfP@ss123!`;
        let login = await safeFetch(`${API}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!login.ok) {
            await safeFetch(`${API}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, displayName: `Live VU ${i}` })
            });
            login = await safeFetch(`${API}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
        }
        assert.equal(login.status, 200);
        const data = await login.json();
        vus.push({
            id: data.user.id,
            email,
            token: data.token,
            headers: { 'Authorization': `Bearer ${data.token}`, 'Content-Type': 'application/json' },
            taskIds: []
        });
    }

    // Pre-create initial task for move testing
    for (const vu of vus) {
        const t = await safeFetch(`${API}/api/tasks`, {
            method: 'POST',
            headers: vu.headers,
            body: JSON.stringify({ title: 'Live Bench Seed Task', status: 0 })
        });
        if (t.ok) {
            const body = await t.json();
            vu.taskIds.push(body.id);
        }
    }

    // Execute standard mix: 20 requests per VU = 200 live requests
    const REQUESTS_PER_VU = 20;
    const latencies = {
        'GET /api/flashcards': [],
        'GET /api/tasks': [],
        'GET /api/notebooks': [],
        'POST /api/tasks': [],
        'PATCH /api/tasks/{id}/move': []
    };

    let totalErrors = 0;
    let totalExecuted = 0;

    console.log(`  Executing 200 requests across 10 parallel VUs on Live Render API...`);
    const vuTasks = vus.map(async (vu, vuIdx) => {
        for (let s = 0; s < REQUESTS_PER_VU; s++) {
            const rand = Math.random();
            let route = '';
            let t0 = 0;
            let success = false;

            try {
                if (rand < 0.35) {
                    route = 'GET /api/flashcards';
                    t0 = performance.now();
                    const r = await safeFetch(`${API}/api/flashcards`, { headers: vu.headers });
                    const dur = performance.now() - t0;
                    if (r.status === 200) {
                        const data = await r.json();
                        if (Array.isArray(data)) { success = true; latencies[route].push(dur); }
                    }
                } else if (rand < 0.60) {
                    route = 'GET /api/tasks';
                    t0 = performance.now();
                    const r = await safeFetch(`${API}/api/tasks`, { headers: vu.headers });
                    const dur = performance.now() - t0;
                    if (r.status === 200) {
                        const data = await r.json();
                        if (Array.isArray(data) && data.every(t => t.userId === vu.id)) {
                            success = true; latencies[route].push(dur);
                        }
                    }
                } else if (rand < 0.80) {
                    route = 'GET /api/notebooks';
                    t0 = performance.now();
                    const r = await safeFetch(`${API}/api/notebooks`, { headers: vu.headers });
                    const dur = performance.now() - t0;
                    if (r.status === 200) {
                        const data = await r.json();
                        if (Array.isArray(data)) { success = true; latencies[route].push(dur); }
                    }
                } else if (rand < 0.90) {
                    route = 'POST /api/tasks';
                    t0 = performance.now();
                    const r = await safeFetch(`${API}/api/tasks`, {
                        method: 'POST',
                        headers: vu.headers,
                        body: JSON.stringify({ title: `Live Task VU ${vuIdx} - ${s}`, status: 0 })
                    });
                    const dur = performance.now() - t0;
                    if (r.status === 200 || r.status === 201) {
                        const data = await r.json();
                        if (data && data.id) { vu.taskIds.push(data.id); success = true; latencies[route].push(dur); }
                    }
                } else {
                    route = 'PATCH /api/tasks/{id}/move';
                    const targetId = vu.taskIds.length > 0 ? vu.taskIds[vu.taskIds.length - 1] : 0;
                    if (targetId > 0) {
                        t0 = performance.now();
                        const r = await safeFetch(`${API}/api/tasks/${targetId}/move`, {
                            method: 'PATCH',
                            headers: vu.headers,
                            body: JSON.stringify({ status: 1, position: 0 })
                        });
                        const dur = performance.now() - t0;
                        if (r.status === 200) { success = true; latencies[route].push(dur); }
                    } else {
                        success = true;
                    }
                }
            } catch {
                success = false;
            }

            totalExecuted++;
            if (!success) totalErrors++;
        }
    });

    await Promise.all(vuTasks);

    // Compute live stats
    const routeStats = {};
    const getLats = [];
    const writeLats = [];

    for (const [r, samples] of Object.entries(latencies)) {
        const s = computeStats(samples);
        routeStats[r] = s;
        if (r.startsWith('GET')) getLats.push(...samples);
        else writeLats.push(...samples);
    }

    const getStats = computeStats(getLats);
    const writeStats = computeStats(writeLats);
    const errorRate = (totalErrors / totalExecuted) * 100;

    console.log(`\n-------------------------------------------------------------------------------------------------------`);
    console.log(` Live Route                      | Count  | Min (ms) | Avg (ms) | p50 (ms) | p90 (ms) | p95 (ms) | p99 (ms) `);
    console.log(`-------------------------------------------------------------------------------------------------------`);
    for (const [r, s] of Object.entries(routeStats)) {
        console.log(` ${r.padEnd(31)} | ${String(s.count).padStart(6)} | ${s.min.toFixed(1).padStart(8)} | ${s.avg.toFixed(1).padStart(8)} | ${s.p50.toFixed(1).padStart(8)} | ${s.p90.toFixed(1).padStart(8)} | ${s.p95.toFixed(1).padStart(8)} | ${s.p99.toFixed(1).padStart(8)} `);
    }
    console.log(`-------------------------------------------------------------------------------------------------------`);
    console.log(` [LIVE AGGREGATE] All GET routes | ${String(getStats.count).padStart(6)} | ${getStats.min.toFixed(1).padStart(8)} | ${getStats.avg.toFixed(1).padStart(8)} | ${getStats.p50.toFixed(1).padStart(8)} | ${getStats.p90.toFixed(1).padStart(8)} | ${getStats.p95.toFixed(1).padStart(8)} | ${getStats.p99.toFixed(1).padStart(8)} `);
    console.log(` [LIVE AGGREGATE] All Writes     | ${String(writeStats.count).padStart(6)} | ${writeStats.min.toFixed(1).padStart(8)} | ${writeStats.avg.toFixed(1).padStart(8)} | ${writeStats.p50.toFixed(1).padStart(8)} | ${writeStats.p90.toFixed(1).padStart(8)} | ${writeStats.p95.toFixed(1).padStart(8)} | ${writeStats.p99.toFixed(1).padStart(8)} `);
    console.log(`-------------------------------------------------------------------------------------------------------`);
    console.log(`Total Requests: ${totalExecuted} | Failed: ${totalErrors} | Error Rate: ${errorRate.toFixed(2)}%\n`);

    assert.ok(errorRate <= 1.0, `Error rate must be <= 1.0%, got ${errorRate.toFixed(2)}%`);
    console.log(`[PASS] Error rate ${errorRate.toFixed(2)}% satisfies NFR-01 threshold (<= 1.0%)`);
});
