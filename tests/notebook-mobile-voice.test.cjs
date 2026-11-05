const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const os = require('node:os');
const test = require('node:test');
const {launchBrowser} = require('./playwright-launch.cjs');
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
        browser = await launchBrowser(chromium);
        const context = await browser.newContext({serviceWorkers:'block',hasTouch:true,viewport:{width:1440,height:1000}});
        const page = await context.newPage(), base = `http://127.0.0.1:${server.address().port}`, calls = [], errors = [];
        const payload = '"><img src="/missing-audit-image" onerror="document.documentElement.dataset.auditXss=\'yes\'">';
        const control = {failNotebook:false, delay:false, release:null, category:'english'};
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
                else if (p.endsWith('/sources')) body=[{id:1,type:'text',title:'Nguồn',content:'Nguồn kiểm thử riêng của trình duyệt.'}];
                else if (p.endsWith('/tutor') || p.endsWith('/chat')) { if(control.failChat) {status=503;body={message:'Synthetic AI offline'};} else body={answer:'Synthetic answer',needsClarification:false}; }
                else if (p === '/api/flashcards') body = Array.from({length:8},(_,i) => ({id:'audit-'+i,category:control.category,subCategory:payload,question:payload+' Q'+i,answer:payload+' A'+i,status:'new',version:1}));
                else if (p.endsWith('/streak')) body = {currentStreak:0,longestStreak:0};
                return route.fulfill({status,contentType:'application/json',headers:{'Access-Control-Allow-Origin':base,'Access-Control-Allow-Headers':'authorization,content-type','Access-Control-Allow-Methods':'GET,POST,DELETE,OPTIONS'},body:JSON.stringify(body)});
            }
            if (url.origin !== base) return route.fulfill({status:200,body:'',contentType:url.pathname.endsWith('.css')?'text/css':'application/javascript'});
            return route.continue();
        });
        await page.addInitScript(() => {
            window.__voice = {starts:0, aborts:0, speaks:[], cancels:0};
            class Recognition {
                constructor() {window.__voice.current=this;}
                start() {window.__voice.starts++; this.onstart?.();}
                abort() {window.__voice.aborts++; this.onend?.();}
            }
            const supported=!location.search.includes('unsupported');
            Object.defineProperty(window,'SpeechRecognition',{configurable:true,value:supported?Recognition:undefined});
            Object.defineProperty(window,'webkitSpeechRecognition',{configurable:true,value:undefined});
            Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
                speak(u) {window.__voice.speaks.push(u.text);}, cancel() {window.__voice.cancels++;}, getVoices() {return [];} }});
        });
        await page.goto(base+'/frontend/');
        await page.evaluate(() => MindSprintAuth.login('audit@example.test','synthetic-only'));
        await run({page,calls,control,payload,base,browserVersion:browser.version()});
        assert.deepEqual(errors,[]);
    } finally { if (browser) await browser.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
}

test('Issue 16/37: editable speech, selected chat route, errors, lifecycle and small screens', {timeout:90000}, () => fixture(async ({page,calls,base,browserVersion,control}) => {
    const notebook=page.locator('.sidebar [data-tab=notebook]'); await notebook.click();
    const q=page.locator('#nb-q'), mic=page.locator('#nb-mic-toggle');
    const requests=()=>calls.filter(c=>c.method==='POST' && /\/(chat|tutor)$/.test(c.p));
    assert.equal(await page.evaluate(()=>__voice.starts),0);
    await q.fill('Đề bài:'); await mic.click();
    assert.equal(await mic.getAttribute('aria-pressed'),'true');
    assert.equal(await page.evaluate(()=>__voice.current.lang),'vi-VN');
    await page.evaluate(()=>__voice.current.onresult({results:[[{transcript:'giải hai x bằng bốn'}]]}));
    assert.equal(await q.inputValue(),'Đề bài: giải hai x bằng bốn');
    assert.equal(requests().length,0);
    await q.fill('Câu đã chỉnh');
    await page.locator('#nb-read-answer').check();
    await page.locator('#nb-voice-options summary').click();
    await page.locator('[data-act=send]').click();
    await page.waitForFunction(()=>!document.querySelector('[data-act=send]').disabled);
    assert.equal(requests().at(-1).p,'/api/notebooks/10/chat');
    assert.equal(requests().at(-1).data.question,'Câu đã chỉnh');
    assert.equal(await page.evaluate(()=>__voice.speaks.length),1);
    await page.locator('#nb-voice-options summary').click();
    await page.locator('#nb-read-stop').click();
    assert.equal(await page.locator('#nb-read-stop').isDisabled(),true);
    await page.locator('[data-chat-mode=tutor]').click();
    await mic.click();
    await page.evaluate(()=>__voice.current.onresult({results:[[{transcript:'Giải x cộng một bằng ba'}]]}));
    await page.locator('#nb-voice-options summary').click();
    await page.locator('[data-act=send]').click();
    await page.waitForFunction(()=>!document.querySelector('[data-act=send]').disabled);
    assert.equal(requests().at(-1).p,'/api/notebooks/10/tutor');
    for(const error of ['not-allowed','no-speech','network','audio-capture']) {
        await q.fill('Bản nháp'); await mic.click();
        await page.evaluate(error=>__voice.current.onerror({error}),error);
        assert.equal(await q.inputValue(),'Bản nháp');
        assert.equal(await q.isEnabled(),true);
        assert.match(await page.locator('#nb-voice-status').innerText(),/bàn phím/);
        await page.locator('#nb-voice-options summary').click();
    }
    for(const width of [320,360,390,768,1440]) {
        await page.setViewportSize({width,height:844});
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'notebook '+width);
        const box=await mic.boundingBox(); assert.ok(box.width>=44 && box.height>=44,'micro touch target '+width);
        await mic.tap(); await mic.tap();
        assert.equal(await mic.getAttribute('aria-pressed'),'false');
        await page.locator('#nb-voice-options summary').click();
        await page.locator('#nb-source-add').click();
        const dialog=await page.locator('#nb-add-source-dialog').boundingBox();
        assert.ok(dialog.x>=0 && dialog.x+dialog.width<=width+1,'source dialog '+width);
        await page.keyboard.press('Escape');
    }
    await page.setViewportSize({width:390,height:844});
    await page.screenshot({path:path.join(os.tmpdir(),'mindsprint-voice-mobile.png'),fullPage:true});
    await page.locator('[data-ui-act=toggle-chat-expanded]').click();
    const composer=await page.locator('.nb-composer').boundingBox();
    assert.ok(composer.y+composer.height<=844,'expanded mobile composer');
    await page.locator('[data-ui-act=toggle-chat-expanded]').click();
    await page.setViewportSize({width:1440,height:1000});
    await mic.click(); await page.locator('.sidebar [data-tab=kanban]').click();
    assert.ok(await page.evaluate(()=>__voice.aborts)>0);
    for(const width of [320,360,390,768,1440]) {
        await page.setViewportSize({width,height:844});
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'kanban '+width);
        await page.locator('#btn-new-task').click();
        await page.locator('#task-title').fill('Việc trên điện thoại');
        const dialog=await page.locator('#task-modal .modal-content').boundingBox();
        assert.ok(dialog.x>=0 && dialog.x+dialog.width<=width+1,'task dialog '+width);
        await page.keyboard.press('Escape');
        if(width===390) await page.screenshot({path:path.join(os.tmpdir(),'mindsprint-kanban-mobile-issues16.png'),fullPage:true});
    }
    await page.setViewportSize({width:1440,height:1000}); await notebook.click();
    control.failChat=true; await q.fill('Giữ câu khi AI lỗi'); await page.locator('[data-act=send]').click();
    await page.locator('[data-act=retry-chat]').waitFor();
    assert.equal(await q.isEnabled(),true);
    assert.equal(await page.locator('[data-act=retry-chat]').getAttribute('data-q'),'Giữ câu khi AI lỗi');
    control.failChat=false;
    await page.screenshot({path:path.join(os.tmpdir(),'mindsprint-voice-desktop.png'),fullPage:true});
    await mic.click(); await page.evaluate(()=>{window.__oldVoice=__voice.current; MindSprintAuth.logout();});
    await page.evaluate(()=>__oldVoice.onresult({results:[[{transcript:'OLD_ACCOUNT'}]]}));
    assert.equal(await q.inputValue(),'');
    await page.goto(base+'/frontend/?unsupported');
    await page.evaluate(()=>MindSprintAuth.login('audit@example.test','synthetic-only')); await notebook.click();
    assert.equal(await mic.isDisabled(),true); await q.fill('Vẫn gõ được');
    assert.equal(await q.inputValue(),'Vẫn gõ được');
    console.log('PASS browser '+browserVersion+'; speech adapter simulated, no microphone/cloud/real Gemini used');
}));
