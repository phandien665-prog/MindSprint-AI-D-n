// Fresh browser storage and an isolated API fixture; no real accounts or database.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const os = require('node:os');
const root = path.resolve(__dirname, '..');
let chromium;
try { ({chromium} = require('playwright')); }
catch {
    const packaged = ['Debug', 'Release'].map(config => path.join(root, `backend/MindSprint.Api/bin/${config}/net8.0/.playwright/package`)).find(fs.existsSync);
    if (!packaged) throw new Error('Build MindSprint.Api or install Playwright before running browser checks.');
    ({chromium} = require(packaged));
}

test('Kanban CRUD, ordered drops, filters, failed moves, reload and touch controls', {timeout: 90000}, async () => {
    const server = http.createServer((req, res) => {
        let file = path.resolve(root, '.' + new URL(req.url, 'http://local').pathname);
        if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
        if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
        const types = {'.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'application/javascript', '.woff2':'font/woff2', '.jpg':'image/jpeg'};
        fs.readFile(file, (err, data) => {res.writeHead(err ? 404 : 200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream'}); res.end(err ? 'Not found' : data);});
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
        browser = await chromium.launch({executablePath:process.env.TUTOR_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless:true});
        const context = await browser.newContext({serviceWorkers:'block', viewport:{width:1440, height:1000}});
        const page = await context.newPage(), base = `http://127.0.0.1:${server.address().port}`;
        const errors = [], moves = [];
        page.on('pageerror', error => errors.push(error.message));
        const seed = () => ['Visible A', 'Hidden B', 'Visible C', 'Doing D'].map((title, i) => ({id:i+1, title, status:i===3?1:0, position:i===3?0:i, priority:'Medium'}));
        let tasks = seed(), failMove = false;
        await context.route('**/*', async route => {
            const req = route.request(), url = new URL(req.url());
            if (url.hostname === 'localhost' && ['5000', '5100'].includes(url.port)) {
                const p = url.pathname, method = req.method(), data = req.postData() && req.headers()['content-type']?.includes('json') ? req.postDataJSON() : null;
                let body = [], status = 200;
                if (p.endsWith('/google/config')) body = {enabled:false};
                else if (p.endsWith('/auth/login')) body = {token:'fixture-access', refreshToken:'fixture-refresh', user:{id:42, displayName:'QA', email:'qa@example.test'}};
                else if (p.endsWith('/auth/me')) body = {id:42, displayName:'QA', email:'qa@example.test'};
                else if (p.endsWith('/streak')) body = {currentStreak:0, longestStreak:0};
                else if (p === '/api/tasks' && method === 'GET') body = [...tasks].sort((a,b) => a.status-b.status || a.position-b.position);
                else if (p === '/api/tasks' && method === 'POST') {body = {id:Math.max(0,...tasks.map(t=>t.id))+1, ...data, position:tasks.filter(t=>t.status===data.status).length}; tasks.push(body);}
                else if (/^\/api\/tasks\/\d+/.test(p)) {
                    const id = Number(p.split('/')[3]), task = tasks.find(t=>t.id===id);
                    if (method === 'PATCH') {
                        moves.push({id, ...data});
                        if (failMove) {status=503; body={message:'Move failed'};}
                        else {
                            const old = task.status, target = tasks.filter(t=>t.id!==id && t.status===data.status).sort((a,b)=>a.position-b.position);
                            task.status=data.status; target.splice(data.position,0,task); target.forEach((t,i)=>t.position=i);
                            if (old!==task.status) tasks.filter(t=>t.status===old).sort((a,b)=>a.position-b.position).forEach((t,i)=>t.position=i);
                            body=task;
                        }
                    } else if (method==='PUT') {Object.assign(task,data); body=task;}
                    else if (method==='DELETE') {tasks=tasks.filter(t=>t.id!==id); status=204;}
                }
                return route.fulfill({status, contentType:'application/json', body:status===204?'':JSON.stringify(body), headers:{'Access-Control-Allow-Origin':base, 'Access-Control-Allow-Headers':'authorization,content-type', 'Access-Control-Allow-Methods':'GET,POST,PUT,PATCH,DELETE,OPTIONS'}});
            }
            if (url.origin!==base) return route.fulfill({status:200, body:'', contentType:url.pathname.endsWith('.css')?'text/css':'application/javascript'});
            return route.continue();
        });
        await page.goto(base+'/frontend/');
        await page.locator('.sidebar [data-tab=kanban]').click();
        await page.locator('#kanban-login').click();
        await page.locator('#auth-email').fill('qa@example.test');
        await page.locator('#auth-pass').fill('Qa-Test-2026!');
        await page.locator('[data-act=submit]').click();
        const card = id => page.locator(`.kanban-card[data-id="${id}"]`);
        const order = async (column, expected) => {
            await page.waitForFunction(({column,expected}) => JSON.stringify(Array.from(document.querySelectorAll(column+' .kanban-card'), c=>Number(c.dataset.id)))===JSON.stringify(expected), {column,expected});
        };
        const dropBefore = async (id, before) => card(id).dragTo(card(before), {targetPosition:{x:50,y:8}});
        await order('#col-todo-list',[1,2,3]);
        await dropBefore(3,1);
        await order('#col-todo-list',[3,1,2]);
        assert.deepEqual(moves.at(-1),{id:3,status:0,position:0});
        await card(1).dragTo(card(2), {targetPosition:{x:50,y:(await card(2).boundingBox()).height-8}});
        await order('#col-todo-list',[3,2,1]);
        await page.reload(); await page.locator('.sidebar [data-tab=kanban]').click();
        await order('#col-todo-list',[3,2,1]);
        await dropBefore(3,4); await order('#col-inprogress-list',[3,4]);
        assert.deepEqual(moves.at(-1),{id:3,status:1,position:0});
        console.log('PASS native drag to start/end and between columns, exact API position and reload');

        tasks=seed(); await page.reload(); await page.locator('.sidebar [data-tab=kanban]').click(); await order('#col-todo-list',[1,2,3]);
        await page.locator('#kanban-search').fill('Visible'); await order('#col-todo-list',[1,3]);
        await dropBefore(1,3); await order('#col-todo-list',[1,3]);
        await page.waitForFunction(() => document.querySelector('#kanban-status').textContent.includes('sắp xếp'));
        assert.deepEqual(moves.at(-1),{id:1,status:0,position:1});
        await page.locator('#kanban-search').fill(''); await order('#col-todo-list',[2,1,3]);
        failMove=true; await dropBefore(3,2);
        await page.waitForFunction(() => document.querySelector('#kanban-status').textContent.includes('Move failed'));
        await order('#col-todo-list',[2,1,3]);
        failMove=false; await dropBefore(3,2); await order('#col-todo-list',[3,2,1]);
        console.log('PASS filtered drops retain hidden tasks, failure preserves order and retry works');

        await page.setViewportSize({width:375,height:850});
        await card(3).getByRole('button',{name:'Đưa xuống'}).click(); await order('#col-todo-list',[2,3,1]);
        assert.equal(await card(3).getByRole('button',{name:'Đưa xuống'}).evaluate(el=>el===document.activeElement),true);
        await card(3).getByRole('button',{name:'Đưa lên'}).focus(); await page.keyboard.press('Enter'); await order('#col-todo-list',[3,2,1]);
        assert.equal(await card(3).getByRole('button',{name:'Đưa lên'}).isEnabled(),false);
        assert.equal(await card(3).getByRole('button',{name:'Đưa xuống'}).evaluate(el=>el===document.activeElement),true);
        const count = moves.length;
        await dropBefore(3,2); await page.waitForTimeout(150); assert.equal(moves.length,count);
        await page.locator('#btn-new-task').click(); await page.locator('#task-title').fill('Created task'); await page.locator('#task-modal-submit').click(); await card(5).waitFor();
        await card(5).getByRole('button',{name:'Sửa công việc'}).click(); await page.locator('#task-title').fill('Edited task'); await page.locator('#task-modal-submit').click(); await page.getByText('Edited task',{exact:true}).waitFor();
        await card(5).getByRole('button',{name:'Xóa công việc'}).click(); await page.getByRole('button',{name:'Xóa công việc',exact:true}).last().click(); await card(5).waitFor({state:'detached'});
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth),true);
        assert.deepEqual(errors,[]);
        await page.screenshot({path:path.join(os.tmpdir(),'mindsprint-kanban-reorder-mobile.png'),fullPage:true});
        await page.setViewportSize({width:1440,height:1000});
        await page.screenshot({path:path.join(os.tmpdir(),'mindsprint-kanban-reorder-desktop.png'),fullPage:true});
        console.log('PASS CRUD, mobile and keyboard reorder, boundaries and no-op drop');
    } finally {await browser?.close(); await new Promise(resolve=>server.close(resolve));}
});
