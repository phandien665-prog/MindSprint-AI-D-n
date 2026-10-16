const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
let chromium;
try { ({chromium} = require('playwright')); }
catch { ({chromium} = require(path.join(root, 'backend/MindSprint.Api/bin/Release/net8.0/.playwright/package'))); }

async function fixture(run) {
    const server = http.createServer((req, res) => {
        let file = path.resolve(root, '.' + new URL(req.url, 'http://local').pathname);
        if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
        if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
        fs.readFile(file, (error, bytes) => {
            res.writeHead(error ? 404 : 200, {'Content-Type':{'.html':'text/html', '.js':'application/javascript', '.css':'text/css'}[path.extname(file)] || 'application/octet-stream'});
            res.end(error ? '' : bytes);
        });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
        browser = await chromium.launch({executablePath:process.env.TUTOR_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless:true});
        const context = await browser.newContext({serviceWorkers:'block',viewport:{width:1440,height:1000}});
        const page = await context.newPage(), base = `http://127.0.0.1:${server.address().port}`, calls = [], errors = [];
        const payload = '<img src="/missing-audit-image" onerror="document.documentElement.dataset.auditXss=\'yes\'">';
        const control = {failNotebook:false, delay:false, release:null};
        page.on('pageerror', e => errors.push(e.message));
        await context.route('**/*', async route => {
            const req = route.request(), url = new URL(req.url());
            if (url.pathname.startsWith('/api/')) {
                const p = url.pathname, data = req.postData() ? req.postDataJSON() : null;
                calls.push({p,method:req.method(),data});
                let status = 200, body = [];
                if (p.endsWith('/auth/login')) body = {token:'synthetic-access',refreshToken:'synthetic-refresh',user:{id:1,displayName:'Audit',email:'audit@example.test'}};
                else if (p.endsWith('/auth/me')) body = {id:1,displayName:'Audit',email:'audit@example.test'};
                else if (p === '/api/notebooks') body = [{id:10,title:'Notebook A'},{id:20,title:'Notebook B'}];
                else if (p === '/api/notebooks/20/sources') {
                    if (control.delay) await new Promise(resolve => { control.release = resolve; });
                    if (control.failNotebook) { status = 503; body = {message:'Synthetic notebook load failure'}; }
                }
                else if (p.endsWith('/tutor')) body = {answer:'Synthetic answer',needsClarification:false};
                else if (p === '/api/flashcards') body = Array.from({length:8},(_,i) => ({id:'audit-'+i,category:'english',subCategory:payload,question:payload+' Q'+i,answer:payload+' A'+i,status:'new',version:1}));
                else if (p.endsWith('/streak')) body = {currentStreak:0,longestStreak:0};
                return route.fulfill({status,contentType:'application/json',headers:{'Access-Control-Allow-Origin':base,'Access-Control-Allow-Headers':'authorization,content-type','Access-Control-Allow-Methods':'GET,POST,DELETE,OPTIONS'},body:JSON.stringify(body)});
            }
            if (url.origin !== base) return route.fulfill({status:200,body:'',contentType:url.pathname.endsWith('.css')?'text/css':'application/javascript'});
            return route.continue();
        });
        await page.goto(base+'/frontend/');
        await page.evaluate(() => MindSprintAuth.login('audit@example.test','synthetic-only'));
        await run({page,calls,control,payload});
        assert.deepEqual(errors,[]);
    } finally { if (browser) await browser.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
}

test('library names and quiz answers render literal HTML instead of executable nodes', {timeout:60000}, () => fixture(async ({page,payload}) => {
    assert.equal(await page.locator('img[onerror]').count(),0);
    assert.equal(await page.locator('.suggestion-title').first().textContent(),payload);
    await page.locator('.sidebar [data-tab=flashcards]').click();
    assert.equal(await page.locator('.deck-title').first().textContent(),payload);
    assert.equal(await page.locator('img[onerror]').count(),0);
    await page.locator('.sidebar [data-tab=quiz]').click();
    await page.locator('#quiz-setup-form button[type=submit]').click();
    for (let i=0;i<8;i++) {
        const question = await page.locator('#quiz-question-text').textContent();
        const answer = question.replace(/ Q(\d+)$/, ' A$1');
        const choices = page.locator('#quiz-options-grid .quiz-option-btn');
        let wrong = 0;
        while (await choices.nth(wrong).locator('.option-text').textContent() === answer) wrong++;
        assert.equal(await choices.locator('img[onerror]').count(),0);
        await choices.nth(wrong).click(); await page.locator('#quiz-next-q-btn').click();
    }
    assert.equal(await page.locator('#wrong-answers-tbody tr').count(),8);
    assert.equal(await page.locator('#wrong-answers-tbody img, #quiz-options-grid img').count(),0);
    assert.equal(await page.evaluate(() => document.documentElement.dataset.auditXss),undefined);
}));

test('failed notebook switch retains the active selection and requests; a later successful switch changes both', {timeout:60000}, () => fixture(async ({page,calls,control}) => {
    await page.locator('.sidebar [data-tab=notebook]').click();
    await page.locator('#nb-select option').first().waitFor({state:'attached'});
    await page.locator('[data-chat-mode=tutor]').click();
    control.failNotebook = true; control.delay = true;
    await page.locator('#nb-select').selectOption('20');
    assert.equal(await page.locator('#nb-select').inputValue(),'10','selection remains on the active notebook while loading');
    await page.waitForFunction(() => document.querySelector('#nb-select').disabled);
    while (!control.release) await new Promise(resolve => setTimeout(resolve,10));
    control.release(); control.delay = false;
    await page.locator('#app-dialog').waitFor({state:'visible'}); await page.locator('#app-dialog-submit').click();
    assert.equal(await page.locator('#nb-select').inputValue(),'10');
    assert.equal(await page.locator('#nb-select').isDisabled(),false);
    const send = async text => {
        await page.locator('#nb-q').fill(text); await page.locator('[data-act=send]').click();
        await page.waitForFunction(() => !document.querySelector('[data-act=send]').disabled);
    };
    await send('Still in A'); assert.equal(calls.filter(c => c.p.endsWith('/tutor')).at(-1).p,'/api/notebooks/10/tutor');
    control.failNotebook = false;
    const previous = await page.locator('#nb-select').elementHandle(); await page.locator('#nb-select').selectOption('20');
    await page.waitForFunction(element => !element.isConnected,previous);
    assert.equal(await page.locator('#nb-select').inputValue(),'20');
    await send('Now in B'); assert.equal(calls.filter(c => c.p.endsWith('/tutor')).at(-1).p,'/api/notebooks/20/tutor');
}));
