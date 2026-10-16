const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const test = require('node:test');
const root = path.resolve(__dirname, '../..');
let chromium;
try { ({chromium} = require('playwright')); }
catch { ({chromium} = require(path.join(root, 'backend/MindSprint.Api/bin/Release/net8.0/.playwright/package'))); }

test('programming tutor preserves code, isolates follow-ups, escapes output, saves notes and retries', {timeout: 90000}, async () => {
    const server = http.createServer((req, res) => {
        const file = path.resolve(root, '.' + new URL(req.url, 'http://local').pathname);
        if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
        fs.readFile(file, (error, bytes) => {
            res.writeHead(error ? 404 : 200, {'Content-Type': {'.html':'text/html', '.js':'application/javascript', '.css':'text/css'}[path.extname(file)] || 'application/octet-stream'});
            res.end(error ? '' : bytes);
        });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
        browser = await chromium.launch({executablePath: process.env.TUTOR_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless:true});
        const context = await browser.newContext({serviceWorkers:'block', viewport:{width:1440,height:1000}});
        const page = await context.newPage(), errors = [], calls = [], notes = [];
        const base = `http://127.0.0.1:${server.address().port}`;
        const original = '\n\tprint("<img src=x onerror=alert(1)> $[1] ``` &")\n  ';
        let status = 200, release, delayed = false, clarify = false;
        page.on('pageerror', e => errors.push(e.message));
        await context.route('**/*', async route => {
            const req = route.request(), url = new URL(req.url());
            if (url.pathname.startsWith('/api/')) {
                const p = url.pathname, data = req.postData() ? req.postDataJSON() : null;
                let body = [], responseStatus = 200;
                if (p.endsWith('/auth/login')) body = {token:'qa',refreshToken:'qa-refresh',user:{id:1,displayName:'Test',email:'code@example.test'}};
                else if (p.endsWith('/auth/me')) body = {id:1,displayName:'Test',email:'code@example.test'};
                else if (p === '/api/notebooks') body = [{id:10,title:'Code'},{id:20,title:'Other'}];
                else if (p.endsWith('/notes') && req.method() === 'POST') { body = {id:notes.length+1,...data}; notes.push(body); }
                else if (p.endsWith('/notes')) body = notes;
                else if (p.endsWith('/tutor') && req.method() === 'POST') {
                    calls.push(data);
                    if (delayed) await new Promise(resolve => {release=resolve;});
                    responseStatus = status;
                    body = status !== 200 ? {message:'AI đang bận',code:status === 429 ? 'ai_rate_limited' : 'ai_unavailable',retryAfterSeconds:65} : {
                        answer:'<script>alert(1)</script> Giải thích theo code.', needsClarification:false, executionStatus:'not_run',
                        programming:{diagnosis:'Kiểm tra cú pháp <img src=x onerror=alert(1)>',location:'Dòng 2',fixedCode:original,
                            explanation:'Giữ chuỗi và thụt dòng.',tests:[{input:'<script>x</script>',expectedOutput:'$[1] ``` &',purpose:'Kiểm tra ký tự'}]}
                    };
                    if (status === 200 && clarify) body = {answer:'Hãy cung cấp định nghĩa helper và kết quả mong muốn.',needsClarification:true,executionStatus:'not_run',
                        programming:{diagnosis:'Chưa có định nghĩa helper trong ngữ cảnh.',location:'Dòng 2',fixedCode:null,explanation:'Cần thêm thông tin trước khi sửa.',tests:[]}};
                }
                return route.fulfill({status:responseStatus,contentType:'application/json',headers:{'Access-Control-Allow-Origin':base,'Access-Control-Allow-Headers':'authorization,content-type','Access-Control-Allow-Methods':'GET,POST,DELETE,OPTIONS'},body:JSON.stringify(body)});
            }
            if (url.origin !== base) return route.fulfill({status:200,body:'',contentType:url.pathname.endsWith('.css')?'text/css':'application/javascript'});
            return route.continue();
        });
        await page.goto(base+'/frontend/index.html');
        await page.evaluate(() => MindSprintAuth.login('code@example.test','test'));
        await page.locator('.sidebar [data-tab=notebook]').click();
        await page.locator('#nb-select option').first().waitFor({state:'attached'});
        await page.locator('[data-chat-mode=tutor]').click();
        const activity = page.locator('[data-tutor-task=code]');
        assert.equal(await activity.count(), 1, 'Gia sư offers a programming activity');
        await activity.click();
        await activity.press('ArrowLeft');
        assert.equal(await page.locator('[data-tutor-task=practice]').getAttribute('aria-checked'), 'true');
        await page.locator('[data-tutor-task=practice]').press('ArrowRight');
        assert.equal(await activity.getAttribute('aria-checked'), 'true');
        const code = page.locator('#nb-code'), question = page.locator('#nb-code-question'), error = page.locator('#nb-code-error');
        const send = page.locator('[data-act=tutor-code]'), messages = page.locator('#nb-code-messages');
        const finish = () => page.waitForFunction(() => !document.querySelector('[data-act=tutor-code]').disabled);
        await code.fill(original); await question.fill('Giữ các ký tự trong chuỗi'); await error.fill('SyntaxError: invalid syntax');
        await code.press('End'); await code.press('Enter');
        assert.equal(calls.length,0,'Enter in code only inserts a newline'); await code.fill(original);
        await send.click(); await finish();
        assert.equal(calls.at(-1).code, original);
        assert.equal(calls.at(-1).error, 'SyntaxError: invalid syntax');
        assert.equal(calls.at(-1).language, 'python');
        assert.deepEqual(calls.at(-1).history, []);
        assert.equal(await messages.locator('pre code').nth(1).textContent(), original);
        assert.equal(await messages.locator('script, img').count(), 0);
        assert.match(await messages.innerText(), /Chưa chạy code/);
        assert.match(await messages.innerText(), /Đầu ra dự kiến/);
        assert.ok((await messages.boundingBox()).height > 200, 'analysis remains readable inside the scrolling work area');
        await messages.locator('[data-act=save-answer]').click();
        await page.waitForFunction(() => document.querySelectorAll('#nb-notes .nb-note').length === 1);
        assert.ok(notes[0].content.includes(original));
        await page.locator('#nb-notes [data-act=note-open]').click();
        assert.equal(await page.locator('#nb-tutor-note pre code').first().textContent(), original, 'saved code reopens verbatim');
        await page.locator('#nb-code-followup').fill('Vì sao dòng 2 cần dấu ngoặc?');
        await send.click(); await finish();
        assert.equal(calls.at(-1).history.length, 2);
        assert.ok(calls.at(-1).question.includes('Vì sao dòng 2'));
        await page.locator('[data-tutor-task=solve]').click();
        await activity.click(); assert.equal(await code.inputValue(), original);
        await page.locator('#nb-code-language').selectOption('javascript');
        assert.equal(await messages.locator('.nb-msg').count(), 0);
        await code.fill('console.log("<script>")');
        status = 429; await send.click(); await finish();
        assert.match(await messages.innerText(), /2 phút/);
        assert.equal(await code.inputValue(), 'console.log("<script>")');
        status = 503; await send.click(); await finish();
        assert.match(await messages.innerText(), /AI đang bận/);
        status = 200; await send.click(); await finish();
        assert.deepEqual(calls.at(-1).history, []);
        assert.equal(calls.at(-1).language, 'javascript');
        for (const width of [320,375,768,1024,1440]) {
            await page.setViewportSize({width,height:1000});
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'no overflow at '+width);
        }
        const outputDir = process.env.TUTOR_SCREENSHOT_DIR;
        if (outputDir) {
            fs.mkdirSync(outputDir,{recursive:true});
            await code.scrollIntoViewIfNeeded(); await page.screenshot({path:path.join(outputDir,'programming-desktop.png'),fullPage:true});
            await messages.scrollIntoViewIfNeeded(); await page.screenshot({path:path.join(outputDir,'programming-answer.png'),fullPage:true});
            await page.setViewportSize({width:375,height:1000}); await page.screenshot({path:path.join(outputDir,'programming-mobile.png'),fullPage:true});
            await page.setViewportSize({width:1440,height:1000});
        }
        delayed = true; await send.click();
        while (!release) await new Promise(resolve => setTimeout(resolve,10));
        // Editing the draft while a response is pending must discard that old response.
        await code.fill('console.log("NEW_DRAFT")'); release(); delayed = false; await finish();
        assert.equal(await messages.locator('.nb-msg').count(),0);
        delayed = true; release = null; await send.click();
        while (!release) await new Promise(resolve => setTimeout(resolve,10));
        const previous = await code.elementHandle(); await page.locator('#nb-select').selectOption('20');
        await page.waitForFunction(element => !element.isConnected, previous); release(); delayed = false;
        assert.equal(await code.inputValue(), '');
        assert.equal(await messages.locator('.nb-msg').count(),0);
        await code.fill('print(1)'); await send.click(); await finish();
        await page.locator('[data-act=tutor-new]').click(); await page.locator('#app-dialog-submit').click();
        assert.equal(await code.inputValue(), '');
        assert.equal(notes.length,1);
        clarify = true;
        await code.fill('function transform(data) {\n  return helper(data);\n}'); await send.click(); await finish();
        assert.match(await messages.innerText(), /Cần bổ sung thông tin/);
        assert.match(await messages.innerText(), /Hãy cung cấp định nghĩa helper/);
        assert.doesNotMatch(await messages.innerText(), /Bản sửa đề xuất|Kiểm thử dự kiến/);
        clarify = false;
        delayed = true; release = null; await code.fill('print("OLD_ACCOUNT")'); await send.click();
        while (!release) await new Promise(resolve => setTimeout(resolve,10));
        await page.evaluate(() => MindSprintAuth.logout()); release(); delayed = false;
        assert.equal(await code.inputValue(), '');
        assert.equal(await messages.locator('.nb-msg').count(),0);
        assert.deepEqual(errors,[]);
        console.log('PASS original code, escaped output, predicted status, notes, follow-up, quota/outage retry, stale drafts/notebooks and responsive widths');
    } finally { if (browser) await browser.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});
