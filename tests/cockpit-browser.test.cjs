const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
let chromium;
try { ({chromium} = require('playwright')); }
catch { ({chromium} = require(path.join(root, 'backend/MindSprint.Api/bin/Release/net8.0/.playwright/package'))); }

test('Cockpit preserves shared login, account checklists, feature routes and mobile navigation', {timeout:60000}, async () => {
    const server = http.createServer((req, res) => {
        const file = path.resolve(root, '.' + new URL(req.url, 'http://local').pathname);
        if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
        fs.readFile(file, (error, bytes) => {
            res.writeHead(error ? 404 : 200, {'Content-Type':{'.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.png':'image/png'}[path.extname(file)] || 'application/octet-stream'});
            res.end(error ? '' : bytes);
        });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
        browser = await chromium.launch({executablePath:process.env.TUTOR_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless:true});
        const context = await browser.newContext({serviceWorkers:'block', viewport:{width:1440,height:1000}, reducedMotion:'reduce'});
        const page = await context.newPage(), calls = [], errors = [];
        const base = `http://127.0.0.1:${server.address().port}`;
        let user = null;
        page.on('pageerror', error => errors.push(error.message));
        await context.route('**/*', async route => {
            const request = route.request(), url = new URL(request.url());
            if (url.pathname.startsWith('/api/')) {
                calls.push(url.pathname);
                let body = [];
                if (url.pathname.endsWith('/auth/login')) {
                    const second = request.postDataJSON().email === 'second@example.test';
                    user = {id:second ? 2 : 1, email:second ? 'second@example.test' : 'first@example.test', displayName:second ? 'Second User' : 'First User'};
                    body = {token:'synthetic-access',refreshToken:'synthetic-refresh',user};
                } else if (url.pathname.endsWith('/auth/me')) body = user;
                else if (url.pathname.endsWith('/auth/google/config')) body = {enabled:false};
                else if (url.pathname.endsWith('/streak')) body = {currentStreak:0,longestStreak:0};
                return route.fulfill({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':base,'Access-Control-Allow-Headers':'authorization,content-type','Access-Control-Allow-Methods':'GET,POST,OPTIONS'},body:JSON.stringify(body)});
            }
            if (url.origin !== base) return route.fulfill({status:200,body:'',contentType:url.pathname.endsWith('.css') ? 'text/css' : 'application/javascript'});
            return route.continue();
        });
        await page.goto(base+'/frontend/index.html');
        const name = page.locator('#sidebar-user-name');
        const goals = page.locator('.cockpit-goals input');
        assert.equal(await name.innerText(),'Khách');
        assert.equal(await page.locator('.cockpit-brand-image').evaluate(image => image.naturalWidth > 0),true);
        await goals.nth(0).check();
        async function signIn(email) {
            await page.locator('#sidebar-auth [data-act=login]').click();
            await page.locator('#auth-google-status').filter({hasText:'chưa được bật'}).waitFor();
            assert.equal(await page.locator('[data-act=demo]').count(),0);
            assert.doesNotMatch(await page.locator('#auth-google-status').innerText(),/demo/i);
            await page.locator('#auth-email').fill(email);
            await page.locator('#auth-pass').fill('SyntheticPass123!');
            await page.locator('#auth-submit-btn').click();
            await page.locator('.auth-overlay').waitFor({state:'detached'});
        }
        await signIn('first@example.test');
        assert.equal(await name.innerText(),'First User');
        assert.equal(await goals.nth(0).isChecked(),false);
        await goals.nth(1).check();
        await page.reload();
        assert.equal(await name.innerText(),'First User');
        assert.equal(await goals.nth(1).isChecked(),true);
        await page.locator('.sidebar [data-tab=notebook]').click();
        await page.locator('#nb-mic-toggle').waitFor();
        assert.ok(calls.includes('/api/notebooks'));
        await page.locator('.sidebar [data-tab=kanban]').click();
        await page.waitForFunction(() => document.querySelector('#tab-content-kanban').classList.contains('active'));
        assert.ok(calls.includes('/api/tasks'));
        await page.locator('#sidebar-auth [data-act=logout]').click();
        await page.locator('.sidebar [data-tab=home]').click();
        assert.equal(await goals.nth(0).isChecked(),true);
        assert.equal(await goals.nth(1).isChecked(),false);
        await signIn('second@example.test');
        assert.equal(await goals.nth(1).isChecked(),false);
        for (const width of [320,390,768]) {
            await page.setViewportSize({width,height:900});
            await page.locator('[data-cockpit-tab=kanban]').click();
            assert.equal(await page.locator('[data-cockpit-tab=kanban]').getAttribute('aria-current'),'page');
            await page.locator('[data-cockpit-tab=more]').click();
            assert.equal(await page.locator('[data-cockpit-tab=more]').getAttribute('aria-expanded'),'true');
            await page.locator('.sidebar [data-tab=notebook]').click();
            await page.locator('#nb-mic-toggle').waitFor();
            assert.equal(await page.locator('[data-cockpit-tab=more]').getAttribute('aria-expanded'),'false');
            await page.locator('[data-cockpit-tab=more]').click();
            await page.keyboard.press('Escape');
            assert.equal(await page.locator('[data-cockpit-tab=more]').getAttribute('aria-expanded'),'false');
            assert.equal(await page.locator('[data-cockpit-tab=more]').evaluate(button => button === document.activeElement),true);
            await page.locator('[data-cockpit-tab=home]').click();
            await page.locator('#sidebar-toggle').click();
            assert.equal(await page.locator('#sidebar-toggle').getAttribute('aria-expanded'),'true');
            await page.locator('.sidebar [data-tab=flashcards]').click({timeout:3000});
            await page.locator('[data-cockpit-tab=home]').click();
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true);
        }
        fs.mkdirSync(path.join(root,'artifacts/cockpit-merge'),{recursive:true});
        await page.screenshot({path:path.join(root,'artifacts/cockpit-merge/mobile.png'),animations:'disabled'});
        await page.setViewportSize({width:1440,height:1000});
        await page.screenshot({path:path.join(root,'artifacts/cockpit-merge/desktop.png'),animations:'disabled'});
        assert.deepEqual(errors,[]);
    } finally {
        if (browser) await browser.close();
        server.closeAllConnections();
        await new Promise(resolve => server.close(resolve));
    }
});
