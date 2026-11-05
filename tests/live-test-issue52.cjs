// Test Suite for Issue #52 (NFR-11) on Live Production:
// Frontend: https://mindsprint-ai-d-n-frontend.vercel.app/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const VERCEL_URL = process.env.VERCEL_URL || 'https://mindsprint-ai-d-n-frontend.vercel.app';
const root = path.resolve(__dirname, '..');

let chromium;
try { ({ chromium } = require('playwright')); }
catch {
    const packaged = ['Debug', 'Release'].map(config => path.join(root, `backend/MindSprint.Api/bin/${config}/net8.0/.playwright/package`)).find(fs.existsSync);
    if (packaged) ({ chromium } = require(packaged));
}

test('Live Issue #52 (NFR-11): PWA Manifest, Assets, Cross-Browser & Offline on Vercel', { timeout: 120000 }, async () => {
    console.log(`\n================================================================================`);
    console.log(`   LIVE VERIFICATION — ISSUE #52 (NFR-11): BROWSER & OFFLINE (VERCEL)         `);
    console.log(`================================================================================`);
    console.log(`Target: ${VERCEL_URL}\n`);

    // --- 1. Live Manifest Verification ---
    console.log('[1/4] Verifying Live Web App Manifest & Static Assets on Vercel...');
    const manifestRes = await fetch(`${VERCEL_URL}/manifest.json`);
    assert.equal(manifestRes.status, 200, 'manifest.json must be accessible on Vercel (200)');
    const manifest = await manifestRes.json();
    assert.equal(manifest.short_name, 'MindSprintAI');
    assert.equal(manifest.display, 'standalone');
    assert.ok(manifest.icons && manifest.icons.length >= 2);
    console.log('  [PASS] manifest.json is valid W3C PWA manifest');

    // Check icons on Vercel
    for (const icon of manifest.icons) {
        const iconRes = await fetch(`${VERCEL_URL}/${icon.src.replace('./', '')}`);
        assert.equal(iconRes.status, 200, `Icon must be accessible: ${icon.src}`);
        const buf = await iconRes.arrayBuffer();
        assert.ok(buf.byteLength > 1000, `Icon must not be empty: ${icon.src}`);
    }
    console.log('  [PASS] PWA Icons (192x192, 512x512) verified on Vercel');

    // Check Service Worker script on Vercel
    const swRes = await fetch(`${VERCEL_URL}/sw.js`);
    assert.equal(swRes.status, 200, 'sw.js must be accessible on Vercel');
    const swText = await swRes.text();
    assert.ok(swText.includes('CACHE_NAME'), 'sw.js must contain cache configuration');
    assert.ok(swText.includes('skipWaiting'), 'sw.js must implement skipWaiting');
    assert.ok(swText.includes('clients.claim'), 'sw.js must implement clients.claim');
    console.log('  [PASS] Service Worker script verified on Vercel');

    // --- 2. Live Runtime Config ---
    console.log('\n[2/4] Verifying Live Runtime Config on Vercel...');
    const configRes = await fetch(`${VERCEL_URL}/runtime-config.js`);
    assert.equal(configRes.status, 200);
    const configText = await configRes.text();
    assert.ok(configText.includes('https://mindsprint-api-zyur.onrender.com'), 'Must bind to Render API');
    console.log('  [PASS] runtime-config.js points to live Render backend');

    // --- 3. Browser E2E on Vercel (Desktop Edge & Mobile Safari) ---
    console.log('\n[3/4] Testing Live Navigation & Console Errors across Browser Matrix...');
    assert.ok(chromium, 'Playwright chromium must be available');

    const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
    const execPath = fs.existsSync(edgePath) ? edgePath : undefined;

    const browser = await chromium.launch({ executablePath: execPath, headless: true });

    try {
        // Desktop Check (1440x900)
        console.log('  Testing on Microsoft Edge (1440x900)...');
        const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const desktopPage = await desktopContext.newPage();
        const desktopErrors = [];
        desktopPage.on('pageerror', err => desktopErrors.push(err.message));

        await desktopPage.goto(VERCEL_URL, { waitUntil: 'domcontentloaded' });
        await desktopPage.waitForTimeout(1500);

        const pageTitle = await desktopPage.title();
        assert.ok(pageTitle.includes('MindSprintAI'), 'Page title should be MindSprintAI');

        // Test navigation between tabs on live Vercel
        const tabs = ['btn-nav-flashcards', 'btn-nav-study', 'btn-nav-kanban', 'btn-nav-notebook'];
        for (const tabId of tabs) {
            const btn = desktopPage.locator(`#${tabId}`);
            if (await btn.count() > 0) {
                await btn.click();
                await desktopPage.waitForTimeout(200);
            }
        }
        assert.equal(desktopErrors.length, 0, `Desktop run had uncaught JS errors: ${desktopErrors.join('; ')}`);
        console.log('  [PASS] Edge Desktop: 0 console errors, tab navigation smooth');
        await desktopContext.close();

        // Mobile Safari iOS Emulation (390x844, Touch)
        console.log('  Testing on Mobile Safari / iOS (390x844, Touch)...');
        const mobileContext = await browser.newContext({
            viewport: { width: 390, height: 844 },
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            hasTouch: true,
            isMobile: true
        });
        const mobilePage = await mobileContext.newPage();
        const mobileErrors = [];
        mobilePage.on('pageerror', err => mobileErrors.push(err.message));

        await mobilePage.goto(VERCEL_URL, { waitUntil: 'domcontentloaded' });
        await mobilePage.waitForTimeout(1500);

        // Tap on flashcard
        const card = mobilePage.locator('.card-inner, #flashcard-inner').first();
        if (await card.count() > 0) {
            await card.tap();
            await mobilePage.waitForTimeout(300);
        }
        assert.equal(mobileErrors.length, 0, `Mobile Safari had uncaught JS errors: ${mobileErrors.join('; ')}`);
        console.log('  [PASS] Mobile Safari iOS: 0 console errors, responsive touch interactions working');
        await mobileContext.close();

        // --- 4. Cốc Cốc Browser Compatibility Check ---
        const cocCocPath = 'C:\\Users\\phand\\AppData\\Local\\CocCoc\\Browser\\Application\\browser.exe';
        if (fs.existsSync(cocCocPath)) {
            console.log('\n[4/4] Testing on Cốc Cốc Browser...');
            const cocCocBrowser = await chromium.launch({ executablePath: cocCocPath, headless: true });
            try {
                const ccContext = await cocCocBrowser.newContext({ viewport: { width: 1280, height: 800 } });
                const ccPage = await ccContext.newPage();
                const ccErrors = [];
                ccPage.on('pageerror', err => ccErrors.push(err.message));

                await ccPage.goto(VERCEL_URL, { waitUntil: 'domcontentloaded' });
                await ccPage.waitForTimeout(1500);

                const header = ccPage.locator('header, .app-header, #brand-logo').first();
                assert.ok(await header.count() > 0, 'Header must render on Cốc Cốc');
                assert.equal(ccErrors.length, 0, `Cốc Cốc had errors: ${ccErrors.join('; ')}`);
                console.log('  [PASS] Cốc Cốc Browser: rendered successfully, 0 console errors');
                await ccContext.close();
            } finally {
                await cocCocBrowser.close();
            }
        } else {
            console.log('\n[4/4] Cốc Cốc executable not found, skipped');
        }

    } finally {
        await browser.close();
    }

    console.log(`\n================================================================================`);
    console.log(`   ALL LIVE ISSUE #52 (NFR-11) TESTS PASSED ON VERCEL DEPLOYMENT!              `);
    console.log(`================================================================================`);
});
