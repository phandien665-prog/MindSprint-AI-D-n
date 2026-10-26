// Real browser and synthetic HTTP responses: no cloud key or personal account.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
let chromium;
try { ({chromium} = require('playwright')); }
catch { ({chromium} = require(path.join(root, 'backend/MindSprint.Api/bin/Release/net8.0/.playwright/package'))); }

test('AI cards preview, selection, partial save retry, reload and quota fallback', {timeout:60000}, async () => {
    const server = http.createServer((req, res) => {
        const file = path.resolve(root, '.' + new URL(req.url, 'http://local').pathname);
        if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
        fs.readFile(file, (error, bytes) => {
            res.writeHead(error ? 404 : 200, {'Content-Type':{'.html':'text/html', '.js':'application/javascript', '.css':'text/css'}[path.extname(file)] || 'application/octet-stream'});
            res.end(error ? '' : bytes);
        });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
        browser = await chromium.launch({executablePath:process.env.TUTOR_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless:true});
        const context = await browser.newContext({serviceWorkers:'block', viewport:{width:1440,height:1000}});
        const page = await context.newPage(), base = `http://127.0.0.1:${server.address().port}`;
        const cards = [], errors = [], generated = ['Alpha', 'Beta', 'Gamma'].map(word => ({question:word, answer:word+' definition'}));
        let saveAttempts = 0, failSecond = true, quota = false, generations = 0;
        page.on('pageerror', error => errors.push(error.message));
        await context.route('**/*', async route => {
            const request = route.request(), url = new URL(request.url());
            if (url.pathname.startsWith('/api/')) {
                const p = url.pathname, method = request.method();
                let status = 200, body = [];
                if (p.endsWith('/google/config')) body = {enabled:false};
                else if (p.endsWith('/auth/login')) body = {token:'synthetic-access',refreshToken:'synthetic-refresh',user:{id:17,email:'qa@example.test',displayName:'QA'}};
                else if (p.endsWith('/auth/me')) body = {id:17,email:'qa@example.test',displayName:'QA'};
                else if (p.endsWith('/streak')) body = {currentStreak:0,longestStreak:0};
                else if (p === '/api/ai/flashcards') {
                    generations++;
                    assert.equal(request.postDataJSON().count,3);
                    status = quota ? 429 : 200;
                    body = quota ? {message:'Synthetic quota',code:'ai_rate_limited',retryAfterSeconds:60} : [...generated,{question:'',answer:'invalid'}];
                } else if (p === '/api/flashcards' && method === 'POST') {
                    saveAttempts++;
                    if (failSecond && saveAttempts === 2) {status=503; body={message:'Synthetic save failure'};}
                    else {body={...request.postDataJSON(),version:1,updatedAt:'2026-10-26T00:00:00Z'}; cards.push(body);}
                } else if (p === '/api/flashcards') body = cards;
                return route.fulfill({status,contentType:'application/json',headers:{'Access-Control-Allow-Origin':base,'Access-Control-Allow-Headers':'authorization,content-type','Access-Control-Allow-Methods':'GET,POST,OPTIONS'},body:JSON.stringify(body)});
            }
            if (url.origin !== base) return route.fulfill({status:200,body:'',contentType:url.pathname.endsWith('.css')?'text/css':'application/javascript'});
            return route.continue();
        });
        await page.goto(base+'/frontend/index.html');
        await page.locator('#sidebar-auth [data-act=login]').click();
        await page.locator('#auth-email').fill('qa@example.test');
        await page.locator('#auth-pass').fill('SyntheticPass123!');
        await page.locator('#auth-submit-btn').click();
        await page.locator('.auth-overlay').waitFor({state:'detached'});
        await page.locator('.sidebar [data-tab=flashcards]').click();
        await page.locator('#open-ai-card-modal').click();
        const source = 'Photosynthesis converts sunlight into chemical energy. Chlorophyll absorbs light in plant leaves. Water and carbon dioxide produce glucose and oxygen.';
        await page.locator('#ai-card-source').fill(source);
        await page.locator('#ai-card-count').fill('3');
        await page.locator('#ai-card-category').selectOption('english');
        await page.locator('#ai-card-new-sub').fill('Sprint 3 QA');
        await page.locator('#generate-ai-cards-btn').click();
        await page.locator('.ai-card-result').nth(2).waitFor();
        assert.equal(await page.locator('.ai-card-result').count(),3);
        assert.match(await page.locator('#ai-card-status').innerText(),/Bỏ qua 1 thẻ/);
        assert.equal(cards.length,0,'generating must not save automatically');
        await page.locator('.ai-card-result input').nth(2).uncheck();
        await page.locator('#save-ai-cards-btn').click();
        await page.waitForFunction(() => document.querySelector('#ai-card-status').textContent.includes('Lỗi khi lưu'));
        assert.deepEqual(cards.map(card=>card.question),['Alpha']);
        failSecond=false;
        await page.locator('#save-ai-cards-btn').click();
        await page.waitForFunction(() => document.querySelector('#ai-card-status').textContent.includes('Đã lưu 2'));
        assert.deepEqual(cards.map(card=>card.question),['Alpha','Beta'],'retry excludes saved and unselected cards');
        await page.reload();
        await page.locator('.sidebar [data-tab=flashcards]').click();
        await page.locator('.deck-title').filter({hasText:'Sprint 3 QA'}).waitFor();
        assert.match(await page.locator('.deck-card').filter({hasText:'Sprint 3 QA'}).innerText(),/2 thẻ/);
        await page.locator('#open-ai-card-modal').click();
        assert.equal(await page.evaluate(() => window.MindSprintAuth.getCurrentUser().id),17);
        quota=true;
        await page.locator('#ai-card-source').fill(source);
        await page.locator('#ai-card-count').fill('3');
        await page.locator('#generate-ai-cards-btn').click();
        await page.waitForFunction(() => document.querySelector('#ai-card-status').textContent.includes('dự phòng'));
        assert.equal(generations,2);
        assert.equal(cards.length,2,'fallback needs an explicit save');
        assert.equal(await page.locator('#sidebar-user-name').innerText(),'QA','quota must preserve the session');
        assert.deepEqual(errors,[]);
        console.log('PASS TC-AI-01/02/03/04/05; browser '+browser.version()+'; HTTP and Gemini synthetic');
    } finally {
        if (browser) await browser.close();
        server.closeAllConnections();
        await new Promise(resolve => server.close(resolve));
    }
});
