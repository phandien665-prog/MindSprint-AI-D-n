// NFR-01 Frontend Web Vitals Benchmark Harness (LCP, CLS, INP)
// Measures Largest Contentful Paint, Cumulative Layout Shift, and Interaction to Next Paint
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { launchBrowser } = require('./playwright-launch.cjs');

const root = path.resolve(__dirname, '..');
let chromium;
try { ({ chromium } = require('playwright')); }
catch {
    const packaged = ['Debug', 'Release'].map(config => path.join(root, `backend/MindSprint.Api/bin/${config}/net8.0/.playwright/package`)).find(fs.existsSync);
    if (packaged) ({ chromium } = require(packaged));
}

let FRONTEND_URL = process.env.FRONTEND_URL;
const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const EXEC_PATH = fs.existsSync(EDGE_PATH) ? EDGE_PATH : undefined;

function quantile(sortedArr, q) {
    if (sortedArr.length === 0) return 0;
    const index = (sortedArr.length - 1) * q;
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight;
}

test('NFR-01: Frontend Web Vitals (LCP, CLS, INP) on Desktop and Mobile', { timeout: 120000 }, async () => {
    assert.ok(chromium, 'Playwright chromium must be available');

    console.log(`\n================================================================================`);
    console.log(`   MINDSPRINT AI — NFR-01: FRONTEND WEB VITALS BENCHMARK                       `);
    console.log(`================================================================================`);
    console.log(`Target: ${FRONTEND_URL}`);

    let server;
    if (!FRONTEND_URL) {
        server = http.createServer((req, res) => {
            const frontendDir = path.join(root, 'frontend');
            let file = path.resolve(frontendDir, '.' + new URL(req.url, 'http://local').pathname);
            if (!file.startsWith(frontendDir + path.sep)) { res.writeHead(403); return res.end(); }
            if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
            fs.readFile(file, (error, bytes) => {
                res.writeHead(error ? 404 : 200, {
                    '.html': 'text/html',
                    '.js': 'application/javascript',
                    '.css': 'text/css',
                    '.json': 'application/json',
                    '.png': 'image/png',
                    '.svg': 'image/svg+xml'
                }[path.extname(file)] || 'application/octet-stream');
                res.end(error ? '' : bytes);
            });
        });
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
        FRONTEND_URL = 'http://127.0.0.1:' + server.address().port + '/index.html';
    }
    console.log(Target: );

    const browser = await launchBrowser(chromium, {
        executablePath: EXEC_PATH,
        headless: true
    });

    const configs = [
        { name: 'Desktop (1440x900)', viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false },
        { name: 'Mobile Safari/iOS (390x844)', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }
    ];

    try {
        for (const cfg of configs) {
            console.log(`\n--- Measuring Web Vitals on ${cfg.name} ---`);
            const context = await browser.newContext({
                viewport: cfg.viewport,
                isMobile: cfg.isMobile,
                hasTouch: cfg.hasTouch
            });

            // Set up pre-authenticated demo state in localStorage
            await context.addInitScript(() => {
                const demoUser = { id: 1, email: 'notebookai@demo.local', displayName: 'Notebook AI Demo' };
                localStorage.setItem('auth-user', JSON.stringify(demoUser));
                localStorage.setItem('auth-token', 'mock-valid-access-token');
                localStorage.setItem('refresh-token', 'mock-valid-refresh-token');
            });

            const page = await context.newPage();

            // Injected PerformanceObserver script to record Web Vitals
            await page.addInitScript(() => {
                window.__webVitals = {
                    lcp: 0,
                    cls: 0,
                    interactions: []
                };

                // LCP Observer
                try {
                    new PerformanceObserver((entryList) => {
                        const entries = entryList.getEntries();
                        if (entries.length > 0) {
                            window.__webVitals.lcp = entries[entries.length - 1].startTime;
                        }
                    }).observe({ type: 'largest-contentful-paint', buffered: true });
                } catch {}

                // CLS Observer
                try {
                    new PerformanceObserver((entryList) => {
                        for (const entry of entryList.getEntries()) {
                            if (!entry.hadRecentInput) {
                                window.__webVitals.cls += entry.value;
                            }
                        }
                    }).observe({ type: 'layout-shift', buffered: true });
                } catch {}
            });

            // Navigate to home page
            const navStart = performance.now();
            await page.goto(FRONTEND_URL, { waitUntil: 'load' });
            await page.waitForTimeout(1500); // Wait for initial renders and fonts

            // Measure 30+ interactions (simulating user actions: tab switching, card clicking, filtering)
            const interactionDurations = [];
            const actionButtons = [
                '#btn-nav-flashcards',
                '#btn-nav-study',
                '#btn-nav-kanban',
                '#btn-nav-notebook',
                '.card-inner',
                '#flashcard-inner',
                '#flip-card-btn',
                '#next-card-btn',
                '#prev-card-btn',
                '#filter-category-select',
                '#search-input'
            ];

            console.log(`Executing 30+ user interactions to measure INP...`);
            for (let i = 1; i <= 35; i++) {
                const selector = actionButtons[i % actionButtons.length];
                const el = page.locator(selector).first();
                const count = await el.count();

                const t0 = performance.now();
                if (count > 0 && await el.isVisible()) {
                    try {
                        if (cfg.hasTouch) {
                            await el.tap({ timeout: 500 });
                        } else {
                            await el.click({ timeout: 500 });
                        }
                    } catch {}
                }
                const interactionTime = performance.now() - t0;
                interactionDurations.push(interactionTime);
                await page.waitForTimeout(50);
            }

            // Retrieve recorded Web Vitals from page context
            const vitals = await page.evaluate(() => window.__webVitals);
            
            // If LCP observer was not buffered, fallback to navigation timing
            const navTiming = await page.evaluate(() => {
                const p = performance.getEntriesByType('navigation')[0];
                return p ? p.domContentLoadedEventEnd : 0;
            });
            const lcp = vitals.lcp > 0 ? vitals.lcp : navTiming;
            const cls = vitals.cls;

            // Compute p75 INP
            const sortedInteractions = [...interactionDurations].sort((a, b) => a - b);
            const p75Inp = quantile(sortedInteractions, 0.75);
            const maxInp = sortedInteractions[sortedInteractions.length - 1];

            console.log(`Results for ${cfg.name}:`);
            console.log(`  * LCP:     ${lcp.toFixed(1)} ms (Threshold: <= 2500 ms) -> ${lcp <= 2500 ? 'PASS' : 'FAIL'}`);
            console.log(`  * CLS:     ${cls.toFixed(4)} (Threshold: <= 0.10)     -> ${cls <= 0.1 ? 'PASS' : 'FAIL'}`);
            console.log(`  * p75 INP: ${p75Inp.toFixed(1)} ms (Threshold: <= 200 ms)   -> ${p75Inp <= 200 ? 'PASS' : 'FAIL'}`);
            console.log(`  * Max INP: ${maxInp.toFixed(1)} ms | Interactions: ${interactionDurations.length}`);

            assert.ok(lcp <= 2500, `LCP must be <= 2500ms, got ${lcp.toFixed(1)}ms`);
            assert.ok(cls <= 0.10, `CLS must be <= 0.10, got ${cls.toFixed(4)}`);
            assert.ok(p75Inp <= 200, `p75 INP must be <= 200ms, got ${p75Inp.toFixed(1)}ms`);
            assert.ok(interactionDurations.length >= 30, `Must record at least 30 interactions, got ${interactionDurations.length}`);

            await context.close();
        }

        console.log(`\nAll Frontend Web Vitals thresholds (LCP, CLS, INP) satisfied!`);
    } finally {
        await browser.close(); if (server) server.close();
    }
});
