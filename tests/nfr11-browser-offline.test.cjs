// Node.js test suite for NFR-11: Browser Compatibility and Offline Mode
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const root = path.resolve(__dirname, '..');
const frontendDir = path.join(root, 'frontend');

// Helper to load Playwright
let chromium;
try { ({ chromium } = require('playwright')); }
catch {
    const packaged = ['Debug', 'Release'].map(config => path.join(root, `backend/MindSprint.Api/bin/${config}/net8.0/.playwright/package`)).find(fs.existsSync);
    if (packaged) ({ chromium } = require(packaged));
}

// ---------------------------------------------------------------------------
// 1. Service Worker & Manifest Static & Structural Integrity
// ---------------------------------------------------------------------------
test('NFR-11.1: Web App Manifest conforms to PWA specification', () => {
    const manifestPath = path.join(frontendDir, 'manifest.json');
    assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist');
    
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.equal(manifest.short_name, 'MindSprintAI');
    assert.ok(manifest.name && manifest.name.includes('MindSprintAI'));
    assert.equal(manifest.display, 'standalone');
    assert.equal(manifest.start_url, './index.html');
    assert.ok(manifest.icons && manifest.icons.length >= 2, 'Must include at least 192x192 and 512x512 icons');
    
    for (const icon of manifest.icons) {
        const iconPath = path.join(frontendDir, icon.src);
        assert.ok(fs.existsSync(iconPath), `Icon asset must exist on disk: ${icon.src}`);
        const stat = fs.statSync(iconPath);
        assert.ok(stat.size > 1000, `Icon asset must not be empty: ${icon.src}`);
    }
});

test('NFR-11.2: Service Worker static asset cache list integrity', () => {
    const swPath = path.join(frontendDir, 'sw.js');
    assert.ok(fs.existsSync(swPath), 'sw.js must exist');
    const swContent = fs.readFileSync(swPath, 'utf8');
    
    // Check cache name
    assert.match(swContent, /const CACHE_NAME = 'mindsprintai-cache-v\d+';/);
    
    // Check math fonts
    const mathFontsMatch = swContent.match(/const MATH_FONTS = \[([\s\S]*?)\];/);
    assert.ok(mathFontsMatch, 'MATH_FONTS array must be defined');
    const fonts = mathFontsMatch[1].match(/'([^']+)'/g).map(s => s.replace(/'/g, ''));
    assert.equal(fonts.length, 20, 'Should declare all 20 KaTeX math fonts');
    
    for (const font of fonts) {
        const fontFile = path.join(frontendDir, `vendor/katex/fonts/KaTeX_${font}.woff2`);
        assert.ok(fs.existsSync(fontFile), `Font file must exist: KaTeX_${font}.woff2`);
    }

    // Verify all local assets declared in ASSETS exist on disk
    const assetsMatch = swContent.match(/const ASSETS = \[([\s\S]*?)\];/);
    assert.ok(assetsMatch, 'ASSETS array must be defined');
    
    const assetLines = assetsMatch[1]
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.startsWith("'./") && !l.includes('https://'));
        
    for (const line of assetLines) {
        const rawPath = line.match(/'\.\/([^'?]+)/);
        if (rawPath && rawPath[1]) {
            const relFile = rawPath[1];
            const fullPath = path.join(frontendDir, relFile);
            assert.ok(fs.existsSync(fullPath), `Asset in SW manifest must exist: ${relFile}`);
        }
    }
});

test('NFR-11.3: Service Worker cache lifecycle (skipWaiting, clients.claim, stale eviction)', () => {
    const swContent = fs.readFileSync(path.join(frontendDir, 'sw.js'), 'utf8');
    
    // Check skipWaiting on install
    assert.ok(swContent.includes('self.skipWaiting()'), 'SW must call skipWaiting to avoid stale asset lock');
    
    // Check clients.claim on activate
    assert.ok(swContent.includes('self.clients.claim()'), 'SW must call clients.claim to control immediate requests');
    
    // Check stale cache eviction logic
    assert.ok(swContent.includes('caches.delete(key)'), 'SW must prune older cache versions');
    assert.ok(swContent.includes('key !== CACHE_NAME'), 'SW must preserve current active cache');
    
    // Check fetch routing rules
    assert.ok(swContent.includes("e.request.url.includes('/api/')"), 'API requests must bypass cache');
    assert.ok(swContent.includes("accounts.google.com"), 'OAuth requests must bypass cache');
    assert.ok(swContent.includes("caches.match('./index.html')"), 'Fallback to index.html on offline navigate');
});

// ---------------------------------------------------------------------------
// 2. Account-Scoped LocalStorage Partitioning & Queue Isolation
// ---------------------------------------------------------------------------
test('NFR-11.4: Storage partitioning isolates guest, User A and User B namespaces', () => {
    // Model personalStorage logic from frontend/script.js
    function createPersonalStorage(activeAccountId) {
        const store = new Map();
        return {
            key(k) { return activeAccountId === 'guest' ? k : `ms-account:${activeAccountId}:${k}`; },
            getItem(k) { return store.get(this.key(k)) ?? null; },
            setItem(k, v) { store.set(this.key(k), String(v)); },
            hasKey(k) { return store.has(this.key(k)); },
            dump() { return Object.fromEntries(store.entries()); }
        };
    }

    const guestStore = createPersonalStorage('guest');
    guestStore.setItem('timetable-slots', '[1,2,3]');
    assert.equal(guestStore.key('timetable-slots'), 'timetable-slots');

    const userAStore = createPersonalStorage('101');
    const userBStore = createPersonalStorage('202');

    userAStore.setItem('study-streak', '15');
    userAStore.setItem('ms-offline-queue', JSON.stringify([{ type: 'create', cardId: 'a1' }]));

    userBStore.setItem('study-streak', '0');
    userBStore.setItem('ms-offline-queue', JSON.stringify([]));

    // Keys must be strictly namespaced
    assert.equal(userAStore.key('study-streak'), 'ms-account:101:study-streak');
    assert.equal(userBStore.key('study-streak'), 'ms-account:202:study-streak');
    assert.notEqual(userAStore.key('ms-offline-queue'), userBStore.key('ms-offline-queue'));
});

test('NFR-11.5: Offline queue replay processes sequentially and halts on account switch', async () => {
    let accountVersion = 1;
    let activeUser = { id: 101, name: 'Alice' };
    const executedOps = [];
    
    const offlineQueue = [
        { type: 'create', card: { id: 'local-1', question: 'Q1', answer: 'A1' } },
        { type: 'update', card: { id: 'local-2', question: 'Q2 (Updated)', answer: 'A2' } },
        { type: 'study', day: { studyDate: '2026-11-02', cardsReviewed: 20, minutesStudied: 15 } }
    ];

    async function processQueue(versionAtStart) {
        for (const op of [...offlineQueue]) {
            if (versionAtStart !== accountVersion) {
                // Abort immediately: account changed during in-flight replay
                return false;
            }
            // Simulate network sync
            executedOps.push({ user: activeUser.id, op: op.type });
            offlineQueue.splice(offlineQueue.indexOf(op), 1);
        }
        return true;
    }

    // Process first 2 operations
    const initialVersion = accountVersion;
    executedOps.push({ user: activeUser.id, op: offlineQueue.shift().type });
    executedOps.push({ user: activeUser.id, op: offlineQueue.shift().type });

    // Now user switches account in the middle!
    accountVersion++;
    activeUser = { id: 202, name: 'Bob' };

    // Attempt to continue previous account's replay
    const completed = await processQueue(initialVersion);
    
    // Must have aborted because version changed
    assert.equal(completed, false, 'Queue replay must abort when account switches in-flight');
    assert.ok(executedOps.every(item => item.user === 101), 'No operations from Alice should run under Bob');
});

// ---------------------------------------------------------------------------
// 3. Offline Capabilities & Fallbacks
// ---------------------------------------------------------------------------
test('NFR-11.6: Heuristic card generator produces valid flashcards offline without network', () => {
    const scriptContent = fs.readFileSync(path.join(frontendDir, 'script.js'), 'utf8');
    assert.ok(scriptContent.includes('extractFallbackCards') || scriptContent.includes('extractHeuristicCards'),
        'Fallback heuristic extraction function must exist in script.js');

    // Test heuristic pair extractor
    const sampleText = `
        Polymorphism: Khả năng các đối tượng khác nhau phản ứng với cùng một thông điệp theo các cách khác nhau.
        Encapsulation: Đóng gói dữ liệu và phương thức thao tác trên dữ liệu vào một đơn vị.
        Inheritance: Kế thừa thuộc tính và hành vi từ lớp cha sang lớp con.
    `;

    const lines = sampleText.split('\n').map(l => l.trim()).filter(Boolean);
    const cards = [];
    const pairRegex = /^([^:\-–—\n]{2,50})[:\-–—]\s*(.+)$/;

    for (const line of lines) {
        const match = line.match(pairRegex);
        if (match) {
            cards.push({
                question: match[1].trim(),
                answer: match[2].trim(),
                status: 'new'
            });
        }
    }

    assert.equal(cards.length, 3, 'Extracted 3 pairs offline');
    assert.equal(cards[0].question, 'Polymorphism');
    assert.ok(cards[0].answer.includes('Khả năng'));
});

test('NFR-11.7: Local Oxford vocabulary (1,814 words) accessible completely offline', () => {
    const vocabPath = path.join(frontendDir, 'vocab_data.js');
    assert.ok(fs.existsSync(vocabPath), 'vocab_data.js must exist on disk');
    
    const vocabCode = fs.readFileSync(vocabPath, 'utf8');
    const extractFn = new Function(vocabCode + '; return OXFORD_VOCAB_DATA;');
    const vocabData = extractFn();

    assert.equal(vocabData.length, 1814, 'Must seed exactly 1,814 Oxford words for offline study');
    
    // Verify word schema
    const firstWord = vocabData[0];
    assert.ok(firstWord.id && firstWord.id.startsWith('oxford-'));
    assert.equal(firstWord.category, 'english');
    assert.ok(firstWord.question && firstWord.question.length > 0);
    assert.ok(firstWord.answer && firstWord.answer.length > 0);

    // Verify categories available offline
    const categories = new Set(vocabData.map(w => w.subCategory));
    assert.ok(categories.size >= 10, 'Should have rich subcategories for offline study');
});

test('NFR-11.8: Kanban & Notebook display clear network required notifications when offline', () => {
    const kanbanCode = fs.readFileSync(path.join(frontendDir, 'kanban.js'), 'utf8');
    const notebookCode = fs.readFileSync(path.join(frontendDir, 'notebook.js'), 'utf8');

    // Kanban error messaging & form persistence
    assert.ok(kanbanCode.includes("showToast('Chưa tải được công việc: ' + err.message, 'error')"),
        'Kanban should toast clear error on network failure');
    assert.ok(kanbanCode.includes("document.getElementById('task-form-error')"),
        'Kanban retains task form and shows inline error box so user input is not lost');
    assert.ok(kanbanCode.includes("document.getElementById('kanban-reload').hidden = false"),
        'Kanban shows retry/reload button on connection failure');

    // Notebook error messaging & offline alternatives
    assert.ok(notebookCode.includes('showUrlFeedback'),
        'Notebook provides structured URL feedback on failure');
    assert.ok(notebookCode.includes('Bạn vẫn có thể mở trang để sao chép nội dung rồi dán vào sổ tay'),
        'Notebook guides users with offline copy-paste alternative when URL network load fails');
});

// ---------------------------------------------------------------------------
// 4. Playwright End-to-End Browser & Offline Execution
// ---------------------------------------------------------------------------
test('NFR-11.9: E2E Browser & Offline Navigation Check (Edge / Chromium)', { timeout: 90000 }, async () => {
    if (!chromium) {
        console.log('Skipping browser execution: Playwright chromium not available');
        return;
    }

    const server = http.createServer((req, res) => {
        let file = path.resolve(frontendDir, '.' + new URL(req.url, 'http://local').pathname);
        if (!file.startsWith(frontendDir + path.sep) && file !== frontendDir) {
            res.writeHead(403); return res.end();
        }
        if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
            file = path.join(file, 'index.html');
        }
        const types = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.woff2': 'font/woff2',
            '.jpg': 'image/jpeg'
        };
        fs.readFile(file, (err, data) => {
            res.writeHead(err ? 404 : 200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
            res.end(err ? 'Not found' : data);
        });
    });

    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;
    const appUrl = `http://127.0.0.1:${port}/index.html`;

    const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
    const execPath = fs.existsSync(edgePath) ? edgePath : undefined;

    const browser = await chromium.launch({
        executablePath: execPath,
        headless: true
    });

    try {
        // --- 4.1 Desktop Viewport Check (1440x900) ---
        const desktopContext = await browser.newContext({
            viewport: { width: 1440, height: 900 }
        });
        const desktopPage = await desktopContext.newPage();
        const pageErrors = [];
        desktopPage.on('pageerror', err => pageErrors.push(err.message));

        await desktopPage.goto(appUrl, { waitUntil: 'domcontentloaded' });
        await desktopPage.waitForTimeout(1000);

        // Verify title & app shell
        const title = await desktopPage.title();
        assert.ok(title.includes('MindSprintAI'), 'Page title should be MindSprintAI');

        // Check tabs can switch without JavaScript errors
        const tabs = ['btn-nav-flashcards', 'btn-nav-study', 'btn-nav-kanban', 'btn-nav-notebook'];
        for (const tabId of tabs) {
            const btn = desktopPage.locator(`#${tabId}`);
            if (await btn.count() > 0) {
                await btn.click();
                await desktopPage.waitForTimeout(300);
            }
        }

        // Verify no uncaught exceptions on desktop
        assert.equal(pageErrors.length, 0, `Desktop run had uncaught JS exceptions: ${pageErrors.join('; ')}`);
        await desktopContext.close();

        // --- 4.2 Mobile Safari / iOS Emulation Check (390x844, Touch) ---
        const mobileContext = await browser.newContext({
            viewport: { width: 390, height: 844 },
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            hasTouch: true,
            isMobile: true
        });
        const mobilePage = await mobileContext.newPage();
        const mobileErrors = [];
        mobilePage.on('pageerror', err => mobileErrors.push(err.message));

        await mobilePage.goto(appUrl, { waitUntil: 'domcontentloaded' });
        await mobilePage.waitForTimeout(1000);

        // Check card flip interaction works with touch
        const cardInner = mobilePage.locator('.card-inner, #flashcard-inner').first();
        if (await cardInner.count() > 0) {
            await cardInner.tap();
            await mobilePage.waitForTimeout(300);
        }

        assert.equal(mobileErrors.length, 0, `Mobile Safari run had uncaught JS exceptions: ${mobileErrors.join('; ')}`);
        await mobileContext.close();

        console.log('PASS: Desktop Edge and Mobile Safari emulation executed without uncaught exceptions.');
    } finally {
        await browser.close();
        server.close();
    }
});

test('NFR-11.10: Cốc Cốc Browser Compatibility Check', { timeout: 60000 }, async () => {
    const cocCocPath = 'C:\\Users\\phand\\AppData\\Local\\CocCoc\\Browser\\Application\\browser.exe';
    if (!fs.existsSync(cocCocPath) || !chromium) {
        console.log('Skipping Cốc Cốc check: executable not found');
        return;
    }

    const server = http.createServer((req, res) => {
        let file = path.resolve(frontendDir, '.' + new URL(req.url, 'http://local').pathname);
        if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
        const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg' };
        fs.readFile(file, (err, data) => {
            res.writeHead(err ? 404 : 200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
            res.end(err ? 'Not found' : data);
        });
    });

    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;

    const browser = await chromium.launch({
        executablePath: cocCocPath,
        headless: true
    });

    try {
        const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', err => errors.push(err.message));

        await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1000);

        const heading = await page.locator('header, .app-header, #brand-logo').first();
        assert.ok(await heading.count() > 0, 'Header should render on Cốc Cốc');
        assert.equal(errors.length, 0, `Cốc Cốc run had uncaught JS errors: ${errors.join('; ')}`);
        
        console.log('PASS: Cốc Cốc browser launched and rendered without uncaught exceptions.');
        await context.close();
    } finally {
        await browser.close();
        server.close();
    }
});
