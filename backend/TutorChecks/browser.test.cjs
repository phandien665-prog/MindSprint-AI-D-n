// Integration checks use a mock API and fresh browser storage; never the local database.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const os = require('node:os');
const test = require('node:test');
const root = path.resolve(__dirname, '../..');
let chromium;
try { ({chromium} = require('playwright')); }
catch {
    const packaged = ['Debug', 'Release'].map(config => path.join(root, `backend/MindSprint.Api/bin/${config}/net8.0/.playwright/package`)).find(dir => fs.existsSync(dir));
    if (!packaged) throw new Error('Build MindSprint.Api or install Playwright before running browser checks.');
    ({chromium} = require(packaged));
}

test('tutor and source UI: isolated context, notes, retries, keyboard, responsive and account changes', {timeout: 90000}, async () => {
    const server = http.createServer((req, res) => {
        let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://local').pathname));
        if (!file.startsWith(root + path.sep)) {res.writeHead(403); return res.end();}
        if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
        const types = {'.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'application/javascript; charset=utf-8', '.woff2':'font/woff2', '.png':'image/png', '.jpg':'image/jpeg', '.json':'application/json'};
        fs.readFile(file, (err, bytes) => {res.writeHead(err ? 404 : 200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream'}); res.end(err ? 'Not found' : bytes);});
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
        const edge = process.env.TUTOR_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
        browser = await chromium.launch({executablePath: edge, headless:true});
        const context = await browser.newContext({serviceWorkers:'block', viewport:{width:1440, height:1000}});
        const page = await context.newPage();
        const base = `http://127.0.0.1:${server.address().port}`, errors=[], native=[], calls=[];
        page.on('pageerror', e => errors.push(e.message));
        page.on('dialog', async d => {native.push(d.message()); await d.dismiss();});
        let sources=[], notes=[], user=42, failure=0, gate=null, release=null;
        const answer = '**Cách giải**\n\nTrừ 3 ở hai vế: $2x = 8$.\n\nChia hai vế cho 2: $x = 4$.\n\n```python\nx = (11 - 3) / 2\n```';
        await context.route('**/*', async route => {
            const req=route.request(), url=new URL(req.url());
            if (url.hostname==='localhost' && ['5000','5100'].includes(url.port)) {
                const p=url.pathname, data=req.headers()['content-type']?.includes('application/json') ? req.postDataJSON() : undefined;
                calls.push({path:p, method:req.method(), data});
                let status=200, body=[];
                if(req.method()!=='OPTIONS') {
                    if(p.endsWith('/google/config')) body={enabled:false};
                    else if(p.endsWith('/auth/login')) {user=data.email.startsWith('other')?43:42; body={token:'qa-access-'+user, refreshToken:'qa-refresh-'+user, user:{id:user, displayName:'Duy', email:data.email}};}
                    else if(p.endsWith('/auth/me')) body={id:user, displayName:'Duy', email:'duy@example.test'};
                    else if(p==='/api/notebooks') body=[{id:77,title:'Sổ tay kiểm tra'}, {id:78,title:'Sổ tay khác'}];
                    else if(req.method()==='POST' && /\/sources\/(file|url)$/.test(p)) {status=400; body={message:'Validation mock rejected source'};}
                    else if(p.endsWith('/sources/text')) {sources=[{id:1, type:'text', title:data.title, content:data.text}]; body=sources[0];}
                    else if(p.endsWith('/sources')) body=sources;
                    else if(p.endsWith('/notes') && req.method()==='POST') {body={id:notes.length+1, ...data}; notes.push(body);}
                    else if(p.endsWith('/notes')) body=notes;
                    else if(p.endsWith('/tutor')) {
                        if(gate) await new Promise(resolve => {release=resolve;});
                        status=failure || 200;
                        body=failure ? {message:'AI đang bận', code:failure===429?'ai_rate_limited':'ai_unavailable', retryAfterSeconds:65} : {answer:data.question.includes('hình chữ nhật')?'Bạn cho biết chiều dài và chiều rộng nhé.':answer, needsClarification:data.question.includes('hình chữ nhật')};
                        if (!failure && data.action === 'check') body = {answer: 'Đối chiếu bài làm của bạn.', needsClarification: false, feedback: {status: data.submission.includes('2x = 8') ? 'correct' : 'incorrect', errorType: data.submission.includes('2x = 8') ? 'none' : 'calculation', firstErrorStep: data.submission.includes('2x = 8') ? null : 'Bước 1: 2x = 9', reason: '11 - 3 = 8', suggestion: 'Tính lại phép trừ ở bước 1'}};
                        if (!failure && data.action === 'hint') body = {answer: data.question.includes('mơ hồ') ? 'Bạn cho biết dữ kiện còn thiếu nhé.' : ['Dùng phép biến đổi tương đương.', 'Cô lập số hạng chứa ẩn.', 'Trừ 3 ở hai vế; hãy tự tính kết quả.'][data.hintLevel-1], needsClarification: data.question.includes('mơ hồ'), revealsAnswer: false};
                    }
                    else if(p.endsWith('/chat')) body={answer:'Theo tài liệu: kết quả $x = 4$ [1].', citations:[{source:1,quote:'SOURCE_QUOTE_NOT_SHOWN'}]};
                    else if(p==='/api/flashcards') body=Array.from({length:8},(_,i)=>({id:100+i,question:'Question '+i,answer:'Answer '+i,category:'english',subCategory:'Kiểm tra',version:1}));
                    else if(p.endsWith('/streak')) body={currentStreak:0,longestStreak:0};
                }
                return route.fulfill({status, headers:{'Access-Control-Allow-Origin':base,'Access-Control-Allow-Headers':'authorization,content-type','Access-Control-Allow-Methods':'GET,POST,PUT,PATCH,DELETE,OPTIONS'}, contentType:'application/json', body:JSON.stringify(body)});
            }
            if(url.origin!==base) return route.fulfill({status:200, body:'', contentType:url.pathname.endsWith('.css')?'text/css':'application/javascript'});
            return route.continue();
        });
        await page.goto(base+'/frontend/');
        await page.evaluate(() => window.MindSprintAuth.login('duy@example.test','qa-password'));
        await page.locator('.sidebar [data-tab=notebook]').click();
        await page.locator('#nb-select').selectOption('77');
        // Issue #11 must survive the new source dialog and its drag/drop input path.
        await page.locator('.nb-add-source-btn').click();
        const fileInput=page.locator('#nb-file'), fileError=page.locator('#nb-file-feedback');
        const sourceCalls=()=>calls.filter(c=>c.method==='POST' && /\/sources\/(file|url)$/.test(c.path));
        await page.locator('[data-act=add-file]').click();
        assert.match(await fileError.innerText(), /chọn một file/);
        assert.equal(await page.locator('[data-ui-act=pick-source-file]').evaluate(el=>el===document.activeElement),true);
        await fileInput.setInputFiles({name:'bad.exe',mimeType:'application/octet-stream',buffer:Buffer.from('bad')});
        assert.match(await fileError.innerText(), /Chỉ hỗ trợ/);
        await page.locator('[data-act=add-file]').click();
        assert.equal(sourceCalls().length,0);
        await page.locator('#nb-file-dropzone').evaluate(zone=>{
            const transfer=new DataTransfer();
            transfer.items.add(new File([new Uint8Array(10*1024*1024+1)],'too-large.pdf',{type:'application/pdf'}));
            zone.dispatchEvent(new DragEvent('drop',{bubbles:true,dataTransfer:transfer}));
        });
        assert.match(await fileError.innerText(), /tối đa 10 MB/);
        assert.equal(await fileInput.getAttribute('aria-invalid'),'true');
        await page.locator('[data-act=add-file]').click(); assert.equal(sourceCalls().length,0);
        await fileInput.setInputFiles({name:'lesson.PDF',mimeType:'application/pdf',buffer:Buffer.alloc(10*1024*1024)});
        assert.equal(await fileError.isVisible(),false);
        await page.locator('[data-act=add-file]').click();
        await page.waitForFunction(()=>document.querySelector('#nb-file-feedback').textContent.includes('Validation mock'));
        assert.equal(sourceCalls().length,1);
        assert.equal(await fileInput.evaluate(el=>el.files[0].name),'lesson.PDF');
        await page.locator('[data-source-kind=url]').click();
        await page.locator('#nb-url').fill('https://example.com:bad');
        assert.equal(await page.locator('#nb-url').getAttribute('aria-invalid'),'true');
        await page.locator('[data-act=add-url]').click(); assert.equal(sourceCalls().length,1);
        await page.locator('#nb-url').fill('https://example.com/lesson');
        await page.locator('[data-act=add-url]').click();
        await page.waitForFunction(()=>document.querySelector('#nb-url-feedback').textContent.includes('Validation mock'));
        assert.equal(sourceCalls().length,2);
        assert.equal(await page.locator('#nb-url').inputValue(),'https://example.com/lesson');
        await page.keyboard.press('Escape');
        console.log('PASS source dialog validation, file selection/drop, exact size boundary, blocked requests and retained failed inputs');
        const q=page.locator('#nb-q'), tutor=page.locator('[data-chat-mode=tutor]'), source=page.locator('[data-chat-mode=source]');
        const submit=async text => {await q.fill(text); await page.locator('[data-act=send]').click(); await page.locator('[data-act=send]').waitFor({state:'visible'}); await page.waitForFunction(() => !document.querySelector('[data-act=send]').disabled);};
        const tutorCalls=() => calls.filter(c=>c.path.endsWith('/tutor')&&c.method==='POST');
        await q.fill('Nguồn chưa gửi'); await tutor.click();
        assert.equal(await q.inputValue(),'');
        assert.equal(await page.locator('.nb-studio-grid').isVisible(),false);
        assert.equal(await page.locator('.nb-notes-panel').isVisible(),true);
        await q.fill('Nháp gia sư'); await source.click(); assert.equal(await q.inputValue(),'Nguồn chưa gửi');
        await page.locator('[data-act=send]').click(); await page.locator('#app-dialog').waitFor({state:'visible'});
        assert.match(await page.locator('#app-dialog-message').innerText(),/thêm ít nhất một nguồn/);
        await page.locator('#app-dialog-submit').click();
        assert.equal(calls.filter(c=>c.path.endsWith('/chat')).length,0);
        await tutor.click(); assert.equal(await q.inputValue(),'Nháp gia sư');
        assert.match(await page.locator('#nb-tutor-help').innerText(),/Nhập đề bài trực tiếp/);
        await submit('Giải 2x + 3 = 11');
        assert.deepEqual(tutorCalls().at(-1).data,{question:'Giải 2x + 3 = 11',style:'steps',history:[]});
        assert.equal(await page.locator('#nb-tutor-messages .nb-msg').count(),2);
        assert.ok(await page.locator('#nb-tutor-messages .katex').count()>0);
        assert.equal(await page.locator('.nb-welcome').isVisible(),false);
        await page.locator('[data-tutor-style=brief]').click(); await submit('Tại sao phải trừ 3?');
        assert.equal(tutorCalls().at(-1).data.style,'brief'); assert.equal(tutorCalls().at(-1).data.history.length,2);
        assert.equal(tutorCalls().at(-1).data.history[1].text,answer);
        await page.locator('#nb-tutor-messages [data-act=save-answer]').first().click();
        await page.locator('#nb-notes [data-act=note-open]').waitFor();
        assert.equal(notes[0].content,answer);
        await page.locator('#nb-notes [data-act=note-open]').click();
        assert.ok(await page.locator('#nb-tutor-note .katex').count()>0);
        await page.locator('[data-act=note-close]').click(); assert.equal(await page.locator('#nb-tutor-note').isVisible(),false);
        console.log('PASS no-source tutor, follow-up/style, math/code rendering, save/open note, separate drafts');

        failure=429; await submit('Giải lại giúp tôi');
        assert.match(await page.locator('#nb-tutor-messages').innerText(),/2 phút/);
        assert.equal(await page.evaluate(()=>MindSprintAuth.isLoggedIn()),true);
        const retryData=tutorCalls().at(-1).data;
        await page.locator('[data-tutor-style=steps]').click(); failure=0;
        await page.locator('#nb-tutor-messages [data-act=retry-chat]').click();
        await page.waitForFunction(()=>!document.querySelector('[data-act=send]').disabled);
        assert.deepEqual(tutorCalls().at(-1).data,retryData);
        gate=true; const before=tutorCalls().length;
        await q.fill('Chống gửi lặp'); await q.press('Enter');
        await page.waitForFunction(()=>document.querySelector('[data-act=send]').disabled);
        await page.keyboard.press('Enter'); await page.waitForTimeout(60);
        assert.equal(tutorCalls().length,before+1); assert.equal(await tutor.isDisabled(),true);
        release(); gate=null; await page.waitForFunction(()=>!document.querySelector('[data-act=send]').disabled);
        console.log('PASS quota/login, retry retains original style/context, loading and duplicate submit');

        await source.click(); assert.equal(await page.locator('.nb-welcome').isVisible(),true);
        await page.locator('.nb-add-source-btn').click(); await page.locator('#nb-method-text').click();
        await page.locator('#nb-txt-title').fill('Nguồn riêng'); await page.locator('#nb-txt-body').fill('SOURCE_ONLY: Đây là tài liệu thử nghiệm đủ dài.');
        await page.locator('[data-act=add-text]').click(); await page.locator('.nb-src-t').waitFor();
        assert.match(await page.locator('#nb-tutor-help').textContent(),/Gia sư đọc 1 nguồn/);
        await page.keyboard.press('Escape'); await submit('Hỏi tài liệu');
        const sourceRequest=calls.filter(c=>c.path.endsWith('/chat')).at(-1).data;
        assert.deepEqual(sourceRequest,{question:'Hỏi tài liệu',history:[]});
        assert.equal(await page.locator('#nb-messages').innerText().then(s=>s.includes('SOURCE_QUOTE_NOT_SHOWN')),false);
        await tutor.click(); assert.equal(await page.locator('#nb-tutor-messages .nb-msg').count(),10);
        await submit('Tính diện tích hình chữ nhật'); assert.match(await page.locator('#nb-tutor-messages').innerText(),/chiều dài và chiều rộng/);
        assert.ok(tutorCalls().at(-1).data.history.every(t=>!t.text.includes('SOURCE_ONLY')&&!t.text.includes('Hỏi tài liệu')));
        await page.locator('[data-act=tutor-new]').click(); await page.locator('#app-dialog-cancel').click();
        assert.equal(await page.locator('#nb-tutor-messages .nb-msg').count(),12);
        await page.locator('[data-act=tutor-new]').click(); await page.locator('#app-dialog-submit').click();
        assert.equal(await page.locator('#nb-tutor-messages .nb-msg').count(),0);
        await submit('<img src=x onerror="window.tutorInjected=true">');
        assert.equal(await page.evaluate(()=>window.tutorInjected),undefined); assert.deepEqual(tutorCalls().at(-1).data.history,[]);
        assert.equal(await page.locator('#nb-notes [data-act=note-open]').count(),1);
        await tutor.focus(); await page.keyboard.press('ArrowLeft'); assert.equal(await source.getAttribute('aria-checked'),'true');
        await page.keyboard.press('ArrowRight'); assert.equal(await tutor.getAttribute('aria-checked'),'true');
        await q.fill('Dòng đầu'); await q.press('Shift+Enter'); assert.equal(await q.inputValue(),'Dòng đầu\n');
        console.log('PASS source route unchanged, tutor source feedback, modes do not share messages, missing-data response, new problem, HTML escaping, keyboard');

        await page.locator('[data-tutor-task=check]').click();
        assert.equal(await page.locator('.nb-composer').isVisible(), false);
        await page.locator('#nb-problem').fill('Giải 2x + 3 = 11');
        await page.locator('#nb-submission').fill('Bước 1: 2x = 9');
        const checkWork = async () => { await page.locator('[data-act=tutor-check]').click(); await page.waitForFunction(()=>!document.querySelector('[data-act=tutor-check]').disabled); };
        await checkWork();
        assert.deepEqual(tutorCalls().at(-1).data, {question: 'Giải 2x + 3 = 11', action: 'check', submission: 'Bước 1: 2x = 9'});
        assert.match(await page.locator('#nb-work-messages').innerText(), /Bước 1: 2x = 9/);
        assert.match(await page.locator('#nb-work-messages').innerText(), /Tính toán/);
        await page.locator('#nb-work-messages [data-act=save-answer]').click();
        await page.waitForFunction(()=>document.querySelectorAll('#nb-notes [data-act=note-open]').length===2);
        assert.match(notes.at(-1).content, /Bài làm: Bước 1/);
        await page.locator('#nb-submission').fill('Bước 1: 2x = 8; bước 2: x = 4'); await checkWork();
        assert.match(await page.locator('#nb-work-messages').innerText(), /Bài làm đúng/);
        failure=429; await checkWork();
        assert.equal(await page.locator('#nb-submission').inputValue(), 'Bước 1: 2x = 8; bước 2: x = 4');
        assert.match(await page.locator('#nb-work-messages').innerText(), /2 phút/);
        failure=0; gate=true; const workCount=tutorCalls().length;
        await page.locator('[data-act=tutor-check]').click();
        await page.waitForFunction(()=>document.querySelector('[data-act=tutor-check]').disabled);
        await page.locator('#nb-submission').fill('Bài đã sửa khi yêu cầu đang chạy');
        release(); gate=null; await page.waitForFunction(()=>!document.querySelector('[data-act=tutor-check]').disabled);
        assert.equal(tutorCalls().length, workCount+1);
        assert.equal(await page.locator('#nb-work-messages .nb-msg').count(),0);
        console.log('PASS separate submission, first error/type, correct revision, saved feedback, quota preserves work, stale edited submission discarded');

        await page.locator('[data-tutor-task=practice]').click();
        const hint=page.locator('[data-act=tutor-hint]'), solution=page.locator('[data-act=tutor-solution]');
        const finishWork = () => page.waitForFunction(()=>!document.querySelector('[data-tutor-task=solve]').disabled);
        assert.equal(await page.locator('#nb-submission').isVisible(),false);
        failure=429; await hint.click(); await finishWork();
        assert.match(await page.locator('#nb-hint-progress').innerText(),/0\/3/);
        assert.equal(await page.locator('#nb-problem').inputValue(),'Giải 2x + 3 = 11');
        failure=0; gate=true; const hintCount=tutorCalls().length;
        await hint.click(); await page.waitForFunction(()=>document.querySelector('[data-act=tutor-hint]').disabled);
        await page.keyboard.press('Enter');
        assert.equal(tutorCalls().length,hintCount+1);
        release(); gate=null; await finishWork();
        assert.equal(tutorCalls().at(-1).data.hintLevel,1);
        assert.deepEqual(tutorCalls().at(-1).data.history,[]);
        for (const level of [2,3]) {await hint.click(); await finishWork(); assert.equal(tutorCalls().at(-1).data.hintLevel,level);}
        assert.equal(await hint.isDisabled(),true);
        assert.equal(tutorCalls().at(-1).data.history.length,2);
        assert.ok(tutorCalls().at(-1).data.history.every(t=>!t.text.includes('x = 4')&&!t.text.includes('Bài đã sửa')));
        assert.equal((await page.locator('#nb-practice-messages').innerText()).includes('x = 4'),false);
        assert.equal(tutorCalls().filter(c=>c.data.action==='solution').length,0);
        await page.screenshot({path:path.join(os.tmpdir(),'mindsprint-sprint2-practice-desktop.png'),fullPage:true});
        await solution.click(); await finishWork();
        assert.equal(tutorCalls().at(-1).data.action,'solution');
        assert.match(await page.locator('#nb-practice-messages .nb-msg').last().getAttribute('data-raw'), /x = 4/);
        assert.equal(await solution.isDisabled(),true);
        await page.locator('[data-tutor-task=solve]').click(); await page.locator('[data-tutor-task=practice]').click();
        assert.equal(await solution.isDisabled(),true,'progress survives activity switch');
        await page.locator('#nb-problem').fill('Đề mơ hồ'); await hint.click(); await finishWork();
        assert.match(await page.locator('#nb-hint-progress').innerText(),/0\/3/);
        await page.locator('#nb-problem').fill('Giải 3x - 6 = 9');
        gate=true; await hint.click(); await page.waitForFunction(()=>document.querySelector('[data-act=tutor-hint]').disabled);
        await page.locator('#nb-problem').fill('Giải 5x + 2 = 17');
        release(); gate=null; await finishWork();
        assert.equal(await page.locator('#nb-practice-messages .nb-msg').count(),0);
        assert.match(await page.locator('#nb-hint-progress').innerText(),/0\/3/);
        await hint.click(); await finishWork(); assert.equal(tutorCalls().at(-1).data.hintLevel,1);
        console.log('PASS sequential hints, no early answer/full-solution request, no double submit, explicit solution, quota/clarification retain level, changed problem discards late hint');

        for(const width of [320,375,414,768,1440]) {
            await page.setViewportSize({width,height:1000}); await page.waitForTimeout(180);
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'overflow at '+width);
            for(const selector of ['.nb-mode-switch','#nb-tutor-controls','#nb-tutor-work']) {
                const b=await page.locator(selector).boundingBox(); assert.ok(b.x>=0&&b.x+b.width<=width+1,selector+' at '+width);
            }
            if(width===375||width===1440) await page.screenshot({path:path.join(os.tmpdir(),`mindsprint-tutor-${width}.png`),fullPage:true});
            if(width===375) await page.screenshot({path:path.join(os.tmpdir(),'mindsprint-sprint2-practice-mobile.png'),fullPage:true});
        }
        await page.evaluate(()=>document.documentElement.dataset.theme='dark'); await page.waitForTimeout(300);
        await page.screenshot({path:path.join(os.tmpdir(),'mindsprint-tutor-dark.png'),fullPage:true});
        const luminance = color => {
            const rgb=color.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);
            return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
        };
        const contrast = (a,b) => {const x=luminance(a),y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
        for(const theme of ['light','dark']) {
            await page.evaluate(t=>document.documentElement.dataset.theme=t,theme); await page.waitForTimeout(300);
            const colors=await page.evaluate(()=>[...document.querySelectorAll('[data-chat-mode][aria-checked="true"], [data-tutor-style][aria-checked="true"], #nb-tutor-help')].map(el=>{
                let parent=el; while(parent.parentElement && ['transparent','rgba(0, 0, 0, 0)'].includes(getComputedStyle(parent).backgroundColor)) parent=parent.parentElement;
                const cs=getComputedStyle(el);return {fg:cs.color,bg:getComputedStyle(parent).backgroundColor,focus:getComputedStyle(document.documentElement).getPropertyValue('--focus-color').trim()};
            }));
            assert.ok(colors.every(c=>contrast(c.fg,c.bg)>=4.5),'text contrast '+theme);
        }
        await page.emulateMedia({reducedMotion:'reduce'});
        assert.equal(await tutor.evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
        await page.locator('#nb-select').selectOption('78'); await finishWork();
        await page.waitForFunction(()=>document.querySelector('#nb-problem').value==='' && document.querySelector('#nb-hint-progress').textContent.includes('0/3'));
        assert.match(await page.locator('#nb-hint-progress').innerText(),/0\/3/);
        assert.equal(await page.locator('#nb-problem').inputValue(),'');
        await page.locator('[data-tutor-task=solve]').click();
        gate=true; await q.fill('OLD_NOTEBOOK_ANSWER'); await page.locator('[data-act=send]').click();
        await page.waitForFunction(()=>document.querySelector('[data-act=send]').disabled);
        await page.locator('#nb-select').selectOption('78');
        await page.waitForFunction(()=>!document.querySelector('[data-act=send]').disabled);
        release(); gate=null; await page.waitForTimeout(80);
        assert.equal(await page.locator('#nb-tutor-messages .nb-msg').count(),0);
        await submit('Bài sổ tay mới'); assert.deepEqual(tutorCalls().at(-1).data.history,[]);
        gate=true; await q.fill('OLD_ACCOUNT_ANSWER'); await page.locator('[data-act=send]').click();
        await page.waitForFunction(()=>document.querySelector('[data-act=send]').disabled);
        await page.evaluate(()=>MindSprintAuth.logout());
        release(); gate=null;
        await page.evaluate(()=>MindSprintAuth.login('other@example.test','qa-password'));
        await tutor.click(); await submit('Bài tài khoản mới');
        assert.deepEqual(tutorCalls().at(-1).data.history,[]);
        assert.equal(await page.locator('#nb-tutor-messages .nb-msg').count(),2);
        assert.deepEqual(errors,[]); assert.deepEqual(native,[]);
        await page.goto(base+'/frontend/design-reference/tutor.preview.html');
        assert.equal(await page.locator('.state').count(),8);
        assert.match(await page.locator('h1').innerText(),/Gia sư AI/);
        for(const width of [320,375,414,768]) {
            await page.setViewportSize({width,height:1000});
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'preview overflow '+width);
        }
        console.log('PASS 320/375/414/768/1440, light/dark/reduced-motion, text contrast, eight-state preview, stale notebook/account responses');
    } finally {if(browser) await browser.close(); server.closeAllConnections(); await new Promise(resolve=>server.close(resolve));}
});
