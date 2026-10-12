const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function harness(fetch, saved = {}) {
    const storage = new Map(Object.entries(saved));
    const context = {
        window: {location: {hostname: 'localhost'}}, navigator: {userAgent: 'session-test'}, URLSearchParams, FormData,
        console, setTimeout, fetch,
        localStorage: {
            getItem: key => storage.get(key) ?? null,
            setItem: (key, value) => storage.set(key, String(value)),
            removeItem: key => storage.delete(key)
        }
    };
    vm.createContext(context);
    for (const filename of ['api.js', 'auth.js']) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, '../frontend', filename), 'utf8'), context);
    }
    return {api: context.window.MindSprintApi, auth: context.window.MindSprintAuth, storage};
}

const reply = (status, data) => new Response(JSON.stringify(data), {status, headers: {'Content-Type': 'application/json'}});
const credentials = id => ({token: `access-${id}`, refreshToken: `refresh-${id}`, user: {id, email: `user${id}@example.test`, displayName: `User ${id}`}});
const deferred = () => {
    let resolve;
    const promise = new Promise(done => { resolve = done; });
    return {promise, resolve};
};

test('AI quota errors preserve retry information without ending the login session', async () => {
    const {api, auth} = harness(async url => url.endsWith('/login') ? reply(200, credentials(1)) :
        reply(429, {message: 'AI quota reached', code: 'ai_rate_limited', retryAfterSeconds: 66000}));
    await auth.login('user1@example.test', 'password');
    await assert.rejects(api.nbGenerate(1, 'summary', '', 10), error =>
        error.status === 429 && error.code === 'ai_rate_limited' && error.retryAfterSeconds === 66000);
    assert.equal(auth.isLoggedIn(), true);
});

test('one login authorizes all features and notifies the app with the normalized user', async () => {
    const calls = [];
    const {api, auth, storage} = harness(async (url, options) => {
        calls.push({url, options});
        if (url.endsWith('/login')) return reply(200, credentials(1));
        return reply(200, []);
    });
    const users = [];
    auth.onAuthChange(user => users.push(user));
    await auth.login('user1@example.test', 'password');
    await Promise.all([api.getCards(), api.getDue(), api.getTasks(), api.studyGetSchedule(), api.studyGetDays(), api.studyGetStreak(), api.nbList(), api.aiQuiz('study text', 1)]);
    assert.equal(users.length, 1);
    assert.equal(users[0].displayName, 'User 1');
    assert.ok(calls.slice(1).every(call => call.options.headers.Authorization === 'Bearer access-1'));
    assert.equal(storage.get('ms-refresh-token'), 'refresh-1');
});

test('simultaneous expired requests share one refresh and retry with the new access token', {timeout: 3000}, async () => {
    let refreshCalls = 0;
    const gate = deferred();
    const {api, auth} = harness(async (url, options) => {
        if (url.endsWith('/login')) return reply(200, credentials(1));
        if (url.endsWith('/refresh')) { refreshCalls++; await gate.promise; return reply(200, credentials(2)); }
        return options.headers.Authorization === 'Bearer access-2' ? reply(200, []) : reply(401, {});
    });
    await auth.login('user1@example.test', 'password');
    const requests = Promise.all([api.getCards(), api.nbList(), api.studyGetSchedule()]);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(refreshCalls, 1);
    gate.resolve();
    await requests;
    assert.equal(api.isLoggedIn(), true);
});

test('failed refresh settles every pending request and signs out all app features', {timeout: 3000}, async () => {
    const gate = deferred();
    const {api, auth, storage} = harness(async (url) => {
        if (url.endsWith('/login')) return reply(200, credentials(1));
        if (url.endsWith('/refresh')) { await gate.promise; return reply(401, {}); }
        return reply(401, {});
    });
    await auth.login('user1@example.test', 'password');
    const changes = [];
    auth.onAuthChange(user => changes.push(user));
    const requests = Promise.allSettled([api.getCards(), api.nbList(), api.studyGetSchedule()]);
    await new Promise(resolve => setImmediate(resolve));
    gate.resolve();
    assert.ok((await requests).every(result => result.status === 'rejected'));
    assert.equal(auth.isLoggedIn(), false);
    assert.equal(changes.at(-1), null);
    assert.equal(storage.has('ms-user'), false);
});

test('a late refresh from the previous account cannot overwrite a new login', {timeout: 3000}, async () => {
    const gate = deferred();
    const {api, auth, storage} = harness(async (url, options) => {
        if (url.endsWith('/login')) return reply(200, credentials(JSON.parse(options.body).email.includes('user2') ? 2 : 1));
        if (url.endsWith('/refresh')) { await gate.promise; return reply(200, credentials(9)); }
        return reply(401, {});
    });
    await auth.login('user1@example.test', 'password');
    const oldRequest = api.getCards().catch(error => error);
    await new Promise(resolve => setImmediate(resolve));
    api.logout();
    await auth.login('user2@example.test', 'password');
    gate.resolve();
    await oldRequest;
    assert.equal(storage.get('ms-token'), 'access-2');
    assert.equal(auth.getCurrentUser().id, 2);
});

test('switching accounts while a refresh body is being parsed preserves the new login', {timeout: 3000}, async () => {
    const gate = deferred();
    const {api, auth, storage} = harness(async (url, options) => {
        if (url.endsWith('/login')) return reply(200, credentials(JSON.parse(options.body).email.includes('user2') ? 2 : 1));
        if (url.endsWith('/refresh')) return {ok: true, json: () => gate.promise};
        return reply(401, {});
    });
    await auth.login('user1@example.test', 'password');
    const oldRequest = api.getCards().catch(error => error);
    await new Promise(resolve => setImmediate(resolve));
    api.logout();
    await auth.login('user2@example.test', 'password');
    gate.resolve(credentials(9));
    await oldRequest;
    assert.equal(storage.get('ms-token'), 'access-2');
    assert.equal(auth.getCurrentUser().id, 2);
});

test('reload verifies the saved session and accepts PascalCase user fields', async () => {
    const {api, auth} = harness(async () => reply(200, {Id: 3, Email: 'user3@example.test', DisplayName: 'User 3'}), {
        'ms-token': 'saved-access', 'ms-refresh-token': 'saved-refresh',
        'ms-user': JSON.stringify({Id: 3, Email: 'user3@example.test', DisplayName: 'User 3'})
    });
    await auth.ready;
    assert.equal(api.isLoggedIn(), true);
    assert.equal(auth.getCurrentUser().displayName, 'User 3');
    assert.equal(auth.getCurrentUser().id, 3);
});

test('wrong credentials preserve the current session and surface the server error', async () => {
    let rejectLogin = false;
    const {api, auth, storage} = harness(async () => rejectLogin ? reply(401, {message: 'Wrong password'}) : reply(200, credentials(1)));
    await auth.login('user1@example.test', 'password');
    rejectLogin = true;
    await assert.rejects(auth.login('user2@example.test', 'bad-password'), /Wrong password/);
    assert.equal(api.isLoggedIn(), true);
    assert.equal(storage.get('ms-token'), 'access-1');
});

test('login completes after account data subscribers are ready', {timeout: 3000}, async () => {
    const gate = deferred();
    const {auth} = harness(async () => reply(200, credentials(1)));
    let completed = false;
    auth.onAuthChange(async user => { if (user) await gate.promise; });
    const login = auth.login('user1@example.test', 'password').then(() => { completed = true; });
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(completed, false);
    gate.resolve();
    await login;
    assert.equal(completed, true);
});

test('demo login shares the same account and refresh session as regular login', async () => {
    let loginPath;
    const {api, auth} = harness(async url => {
        loginPath = new URL(url).pathname;
        return reply(200, credentials(4));
    });
    await auth.demoLogin();
    assert.equal(loginPath, '/api/auth/demo');
    assert.equal(auth.isLoggedIn(), true);
    assert.equal(api.getUser().id, 4);
});

test('upload refresh preserves a real file validation error instead of signing out', async () => {
    let uploads = 0;
    const {api, auth} = harness(async url => {
        if (url.endsWith('/login')) return reply(200, credentials(1));
        if (url.endsWith('/refresh')) return reply(200, credentials(2));
        return ++uploads === 1 ? reply(401, {}) : reply(400, {message: 'Unsupported file'});
    });
    await auth.login('user1@example.test', 'password');
    await assert.rejects(api.nbAddFile(1, new Blob(['source'])), error => error.status === 400 && error.message === 'Unsupported file');
    assert.equal(auth.isLoggedIn(), true);
});
