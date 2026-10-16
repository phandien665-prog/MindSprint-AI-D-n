const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

function harness(fetch) {
    const storage = new Map();
    const context = { window: {location: {hostname: 'localhost'}}, navigator: { userAgent: 'google-auth-check' },
        console, setTimeout, URLSearchParams, FormData, fetch,
        localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k) } };
    vm.createContext(context);
    for (const file of ['api.js', 'auth.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../../frontend', file), 'utf8'), context);
    return { api: context.window.MindSprintApi, auth: context.window.MindSprintAuth, storage };
}
const reply = (status, data) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
const session = id => ({ token: 'app-access-' + id, refreshToken: 'app-refresh-' + id,
    user: { Id: id, Email: `google${id}@example.test`, DisplayName: `Google ${id}` } });
const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; };

test('Google configuration/challenge are public and credentials are exchanged for app tokens across all features', async () => {
    const calls = [];
    const {api, auth, storage} = harness(async (url, options) => {
        calls.push({url, options});
        if (url.endsWith('/config')) return reply(200, {enabled: true, clientId: 'public-client'});
        if (url.endsWith('/challenge')) return reply(200, {nonce: 'one-use-nonce'});
        if (url.endsWith('/google')) return reply(200, session(1));
        return reply(200, []);
    });
    assert.equal((await api.googleConfig()).enabled, true);
    const {nonce} = await api.googleChallenge();
    const users = [];
    auth.onAuthChange(user => users.push(user));
    await auth.googleLogin('google-id-token', nonce);
    await Promise.all([api.getCards(), api.getTasks(), api.nbList(), api.getDue(), api.studyGetDays(), api.studyGetSchedule(), api.studyGetStreak(), api.aiQuiz('test', 1)]);
    assert.deepEqual(JSON.parse(calls[2].options.body), {credential: 'google-id-token', nonce});
    assert.ok(calls.slice(0, 3).every(c => !c.options.headers.Authorization));
    assert.ok(calls.slice(3).every(c => c.options.headers.Authorization === 'Bearer app-access-1'));
    assert.equal(users[0].displayName, 'Google 1');
    assert.equal(auth.getCurrentUser().id, 1);
    assert.equal(storage.get('ms-refresh-token'), 'app-refresh-1');
    assert.ok([...storage.values()].every(value => !value.includes('google-id-token')));
});

test('linking requires proof, preserves the current session, and retries through the same Google endpoint', async () => {
    const payloads = [];
    const {auth, storage} = harness(async (url, options) => {
        if (url.endsWith('/login')) return reply(200, session(1));
        const data = JSON.parse(options.body); payloads.push(data);
        return data.existingPassword === 'existing-password' ? reply(200, session(1))
            : reply(409, {code: 'google_link_required', message: 'Nhập mật khẩu hiện tại.'});
    });
    await auth.login('google1@example.test', 'existing-password');
    await assert.rejects(auth.googleLogin('credential', 'nonce'), e => e.status === 409 && e.code === 'google_link_required');
    assert.equal(storage.get('ms-token'), 'app-access-1');
    await auth.googleLogin('credential', 'nonce', 'existing-password');
    assert.equal(auth.getCurrentUser().id, 1);
    assert.equal(payloads[1].existingPassword, 'existing-password');
});

test('invalid Google credential never expires an existing app session', async () => {
    const {auth, storage} = harness(async url => url.endsWith('/login') ? reply(200, session(2))
        : reply(401, {code: 'google_invalid_credential', message: 'Token không hợp lệ.'}));
    await auth.login('google2@example.test', 'password');
    await assert.rejects(auth.googleLogin('invalid', 'nonce'), e => e.code === 'google_invalid_credential');
    assert.equal(auth.isLoggedIn(), true);
    assert.equal(storage.get('ms-token'), 'app-access-2');
});

test('late Google login cannot overwrite an account selected in the meantime', async () => {
    const gate = deferred();
    const {auth, storage} = harness(async url => {
        if (url.endsWith('/google')) { await gate.promise; return reply(200, session(9)); }
        return reply(200, session(2));
    });
    const pending = auth.googleLogin('credential', 'nonce').catch(e => e);
    await auth.login('google2@example.test', 'password');
    gate.resolve();
    assert.match((await pending).message, /Phiên đăng nhập đã thay đổi/);
    assert.equal(storage.get('ms-token'), 'app-access-2');
    assert.equal(auth.getCurrentUser().id, 2);
});

test('logout while Google exchange is pending prevents a late sign-in', async () => {
    const gate = deferred();
    const {auth, storage} = harness(async () => { await gate.promise; return reply(200, session(9)); });
    const pending = auth.googleLogin('credential', 'nonce').catch(e => e);
    await auth.logout();
    gate.resolve();
    await pending;
    assert.equal(auth.isLoggedIn(), false);
    assert.equal(storage.has('ms-token'), false);
});

test('Google sessions rotate refresh tokens just like email sessions', async () => {
    const {api, auth, storage} = harness(async (url, options) => {
        if (url.endsWith('/google')) return reply(200, session(1));
        if (url.endsWith('/refresh')) return reply(200, {token: 'rotated-access', refreshToken: 'rotated-refresh'});
        return options.headers.Authorization === 'Bearer rotated-access' ? reply(200, []) : reply(401, {});
    });
    await auth.googleLogin('credential', 'nonce');
    await api.nbList();
    assert.equal(storage.get('ms-refresh-token'), 'rotated-refresh');
    assert.equal(auth.isLoggedIn(), true);
});
