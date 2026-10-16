const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function harness(fetch) {
    const storage = new Map();
    const context = {window: {}, navigator: {userAgent: 'tutor-check'}, URLSearchParams, FormData, console, setTimeout, fetch,
        localStorage: {getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, String(value)), removeItem: key => storage.delete(key)}};
    vm.createContext(context);
    for (const file of ['api.js', 'auth.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../../frontend', file), 'utf8'), context);
    return {api: context.window.MindSprintApi, auth: context.window.MindSprintAuth};
}
const reply = (status, data) => new Response(JSON.stringify(data), {status, headers: {'Content-Type': 'application/json'}});
const credentials = id => ({token: `access-${id}`, refreshToken: `refresh-${id}`, user: {id, displayName: `User ${id}`, email: `user${id}@example.test`}});

test('file tutor sends the original attachment and short question together without OCR', async () => {
    let call;
    const {api, auth} = harness(async (url, options) => {
        if (url.endsWith('/login')) return reply(200, credentials(1));
        call = {url, options}; return reply(200, {answer: '$x=4$', needsClarification:false});
    });
    await auth.login('user1@example.test', 'test');
    const file = new File(['original-pdf'], 'de.pdf', {type:'application/pdf'});
    const payload = {question:'Giải câu 1',style:'steps',history:[]};
    await api.nbTutorFile(10, file, payload);
    assert.equal(new URL(call.url).pathname, '/api/notebooks/10/tutor/file');
    assert.equal(call.options.headers.Authorization, 'Bearer access-1');
    assert.equal(call.options.headers['Content-Type'], undefined);
    assert.equal(await call.options.body.get('file').text(), 'original-pdf');
    assert.deepEqual(JSON.parse(call.options.body.get('request')), payload);
});

test('OCR uploads the original file through shared auth, refreshing without solving', async () => {
    const calls = []; let refreshed = false;
    const {api, auth} = harness(async (url, options) => {
        if (url.endsWith('/login')) return reply(200, credentials(1));
        if (url.endsWith('/refresh')) { refreshed = true; return reply(200, credentials(2)); }
        calls.push({url, options});
        return reply(refreshed ? 200 : 401, {text: 'Câu 1: $x^2$', warnings: [], pageCount: 1, method: 'ocr'});
    });
    await auth.login('user1@example.test', 'test');
    const file = new File(['image-bytes'], 'de.png', {type: 'image/png'});
    const result = await api.nbTutorOcr(10, file);
    assert.equal(result.text, 'Câu 1: $x^2$'); assert.equal(calls.length, 2);
    for (const call of calls) {
        assert.equal(new URL(call.url).pathname, '/api/notebooks/10/tutor/ocr');
        assert.equal(call.options.headers['Content-Type'], undefined);
        assert.equal(call.options.body.get('file').name, 'de.png');
        assert.equal(await call.options.body.get('file').text(), 'image-bytes');
    }
    assert.equal(calls[1].options.headers.Authorization, 'Bearer access-2');
});

test('tutor sends authenticated style and follow-up without source identifiers', async () => {
    let call;
    const {api, auth} = harness(async (url, options) => {
        if (url.endsWith('/login')) return reply(200, credentials(1));
        call = {url, options}; return reply(200, {answer: 'x = 4', needsClarification: false});
    });
    await auth.login('user1@example.test', 'test');
    const history = [{role: 'user', text: '2x + 3 = 11'}, {role: 'assistant', text: 'x = 4'}];
    const result = await api.nbTutor(10, 'Vì sao trừ 3?', 'brief', history);
    assert.equal(new URL(call.url).pathname, '/api/notebooks/10/tutor');
    assert.equal(call.options.headers.Authorization, 'Bearer access-1');
    assert.deepEqual(JSON.parse(call.options.body), {question: 'Vì sao trừ 3?', style: 'brief', history});
    assert.equal(result.answer, 'x = 4');
});

test('expired tutor request refreshes once and retains problem, style and history', async () => {
    const calls = []; let refreshes = 0;
    const {api, auth} = harness(async (url, options) => {
        if (url.endsWith('/login')) return reply(200, credentials(1));
        if (url.endsWith('/refresh')) {refreshes++; return reply(200, credentials(2));}
        calls.push(options);
        return options.headers.Authorization === 'Bearer access-2' ? reply(200, {answer: 'x = 4'}) : reply(401, {});
    });
    await auth.login('user1@example.test', 'test');
    await api.nbTutor(10, '2x + 3 = 11', 'steps', []);
    assert.equal(refreshes, 1); assert.equal(calls.length, 2);
    assert.equal(calls[0].body, calls[1].body);
    assert.equal(auth.isLoggedIn(), true);
});

test('quota keeps tutor retry metadata and the signed-in account', async () => {
    const {api, auth} = harness(async url => url.endsWith('/login') ? reply(200, credentials(1)) : reply(429, {message: 'Hết quota', code: 'ai_rate_limited', retryAfterSeconds: 65}));
    await auth.login('user1@example.test', 'test');
    await assert.rejects(api.nbTutor(10, 'Bài tập', 'steps', []), e => e.status === 429 && e.code === 'ai_rate_limited' && e.retryAfterSeconds === 65);
    assert.equal(auth.getCurrentUser().id, 1);
});

test('late tutor response from the previous account is discarded', async () => {
    let release;
    const {api, auth} = harness(async (url, options) => {
        if (url.endsWith('/login')) return reply(200, credentials(JSON.parse(options.body).email.includes('user2') ? 2 : 1));
        return new Promise(resolve => {release = () => resolve(reply(200, {answer: 'OLD_ACCOUNT_SOLUTION'}));});
    });
    await auth.login('user1@example.test', 'test');
    const oldRequest = api.nbTutor(10, 'Bài cũ', 'steps', []).catch(e => e);
    await new Promise(resolve => setImmediate(resolve));
    api.logout(); await auth.login('user2@example.test', 'test'); release();
    assert.match((await oldRequest).message, /Tài khoản đã thay đổi/);
    assert.equal(auth.getCurrentUser().id, 2);
});

test('provider failure leaves the problem available to retry without signing out', async () => {
    let failed = true;
    const {api, auth} = harness(async url => url.endsWith('/login') ? reply(200, credentials(1)) : failed ? reply(503, {message: 'AI đang bận', code: 'ai_unavailable'}) : reply(200, {answer: 'x = 4'}));
    await auth.login('user1@example.test', 'test');
    await assert.rejects(api.nbTutor(10, '2x + 3 = 11', 'steps', []), e => e.status === 503 && e.code === 'ai_unavailable');
    failed = false;
    assert.equal((await api.nbTutor(10, '2x + 3 = 11', 'steps', [])).answer, 'x = 4');
    assert.equal(auth.isLoggedIn(), true);
});

test('checking sends the problem and submission separately through the shared session', async () => {
    let payload;
    const {api, auth} = harness(async (url, options) => {
        if (url.endsWith('/login')) return reply(200, credentials(1));
        payload = JSON.parse(options.body); return reply(200, {answer: 'Bước 1 sai', feedback: {status: 'incorrect'}});
    });
    await auth.login('user1@example.test', 'test');
    await api.nbTutorWork(10, {question: '2x + 3 = 11', action: 'check', submission: '2x = 9'});
    assert.deepEqual(payload, {question: '2x + 3 = 11', action: 'check', submission: '2x = 9'});
});

test('programming refresh retains code byte-for-byte, error, language and follow-up context', async () => {
    const calls = [];
    const {api, auth} = harness(async (url, options) => {
        if (url.endsWith('/login')) return reply(200, credentials(1));
        if (url.endsWith('/refresh')) return reply(200, credentials(2));
        calls.push(options);
        return options.headers.Authorization === 'Bearer access-2' ? reply(200, {answer:'Dự kiến',executionStatus:'not_run'}) : reply(401, {});
    });
    await auth.login('user1@example.test', 'test');
    const payload = {action:'code',question:'Giải thích dòng 2',language:'python',code:'\n\tprint("$[1] ``` <script> &")\n  ',error:'SyntaxError',history:[{role:'assistant',text:'Đề xuất sửa'}]};
    await api.nbTutorWork(10, payload);
    assert.equal(calls.length,2);
    for (const call of calls) assert.deepEqual(JSON.parse(call.body),payload);
});
