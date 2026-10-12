const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

// Minimal DOM for delegated events; native input validity is also checked in a real browser.
function element(tag = 'div', attrs = {}) {
    const listeners = {}, classes = new Set();
    let children = [], html = '';
    const node = {
        tag, id: attrs.id, value: '', files: [], style: {}, hidden: 'hidden' in attrs,
        dataset: Object.fromEntries(Object.entries(attrs).filter(([k]) => k.startsWith('data-')).map(([k, v]) => [k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v])),
        disabled: false, isConnected: true, textContent: '',
        classList: { toggle(k, on) { on ? classes.add(k) : classes.delete(k); }, add(k) { classes.add(k); }, remove(k) { classes.delete(k); } },
        setAttribute(k, v) { attrs[k] = String(v); }, getAttribute(k) { return attrs[k] ?? null; },
        focus() { node.focused = true; }, remove() { node.isConnected = false; }, replaceChildren() {},
        matches(selector) {
            return selector.split(',').some(s => {
                s = s.trim();
                if (s.startsWith('#')) return s.slice(1) === node.id;
                if (s.startsWith('.')) {
                    const [, cls, key, value] = s.match(/^\.([\w-]+)(?:\[([^=\]]+)="([^"]*)"\])?$/) || [];
                    return (attrs.class || '').split(/\s+/).includes(cls) && (!key || attrs[key] === value);
                }
                if (s.startsWith('[')) { const [, k, v] = s.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/) || []; return k in attrs && (v === undefined || attrs[k] === v); }
                return s === tag;
            });
        },
        closest(selector) { return node.matches(selector) ? node : null; },
        querySelector(selector) { if (selector.startsWith('.nb-welcome ')) return children.find(c => c.tag === selector.split(' ')[1]) || null; return children.find(c => c.matches(selector)) || null; },
        querySelectorAll(selector) { return children.filter(c => c.matches(selector)); },
        addEventListener(type, callback) { (listeners[type] ||= []).push(callback); },
        dispatchEvent(event) { return node.dispatch(event.type, node); },
        async dispatch(type, target, extra = {}) {
            for (const callback of listeners[type] || []) await callback({target, preventDefault() {}, ...extra});
            await new Promise(resolve => setImmediate(resolve));
        },
        get validity() { return {typeMismatch: attrs.type === 'email' && !!node.value && !/^[^\s@]+@[^\s@]+$/.test(node.value)}; },
        get innerHTML() { return html; },
        set innerHTML(value) {
            html = value; children = [];
            for (const [, t, attributes] of value.matchAll(/<(\w+)\b([^>]*)>/g)) {
                const parsed = Object.fromEntries(Array.from(attributes.matchAll(/([\w-]+)="([^"]*)"/g), m => [m[1], m[2]]));
                if (/\bhidden(?:\s|$)/.test(attributes)) parsed.hidden = '';
                children.push(element(t, parsed));
            }
        }
    };
    return node;
}

function load(filename, window, document) {
    const context = vm.createContext({window, document, URL, Event, console, setTimeout() {},
        localStorage: {getItem() { return null; }, setItem() {}, removeItem() {}},
        alert(message) { throw new Error('Unexpected alert: ' + message); }});
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../frontend', filename), 'utf8'), context);
}

function authHarness() {
    let overlay;
    const calls = [];
    const api = {isLoggedIn: () => false, onSessionEnded() {}, googleConfig: async () => ({enabled: false}),
        login: async (...args) => { calls.push(['login', ...args]); throw new Error('Server rejected login'); },
        register: async (...args) => { calls.push(['register', ...args]); throw new Error('Server rejected registration'); }};
    const window = {MindSprintApi: api};
    const document = {activeElement: null, body: {style: {}, appendChild(node) { overlay = node; }},
        createElement: tag => element(tag), querySelector: () => overlay?.isConnected ? overlay : null};
    load('auth.js', window, document);
    window.MindSprintAuth.renderAuthModal();
    return {overlay, calls, input: id => overlay.querySelector('#' + id)};
}

test('auth validates while typing, handles Unicode length boundaries and blocks invalid submit/Enter', async () => {
    const h = authHarness(), email = h.input('auth-email'), password = h.input('auth-pass');
    assert.equal(h.input('auth-email-error').hidden, true);
    email.value = 'broken';
    await h.overlay.dispatch('input', email);
    assert.equal(email.getAttribute('aria-invalid'), 'true');
    assert.match(h.input('auth-email-error').textContent, /Email/);
    email.value = 'hung@example.test';
    await h.overlay.dispatch('input', email);
    assert.equal(email.getAttribute('aria-invalid'), 'false');
    assert.equal(h.input('auth-email-error').hidden, true);
    for (const [value, invalid] of [['12345', true], ['a1!234', false], ['a'.repeat(30), false], ['a'.repeat(31), true], ['😀'.repeat(30), false], ['😀'.repeat(31), true]]) {
        password.value = value;
        await h.overlay.dispatch('input', password);
        assert.equal(password.getAttribute('aria-invalid'), String(invalid), value);
        assert.equal(h.input('auth-pass-error').hidden, !invalid);
    }
    await h.overlay.dispatch('click', h.overlay.querySelector('[data-act="submit"]'));
    await h.overlay.dispatch('keydown', password, {key: 'Enter'});
    assert.equal(h.calls.length, 0);
    password.value = ' a1!23 ';
    await h.overlay.dispatch('input', password);
    await h.overlay.dispatch('keydown', password, {key: 'Enter'});
    assert.deepEqual(h.calls, [['login', 'hung@example.test', ' a1!23 ']]);
    assert.equal(password.value, ' a1!23 ');
    await h.overlay.dispatch('click', h.overlay.querySelector('[data-act="tab-register"]'));
    assert.equal(h.input('auth-pass-error').hidden, true);
    h.input('auth-name').value = 'Hùng';
    await h.overlay.dispatch('click', h.overlay.querySelector('[data-act="submit"]'));
    assert.deepEqual(h.calls[1], ['register', 'hung@example.test', ' a1!23 ', 'Hùng']);
});

async function notebookHarness(failUpload = false) {
    const pane = element(), calls = [];
    const api = {nbList: async () => [{id: 1, title: 'Notebook'}], nbSources: async () => [], nbNotes: async () => [],
        nbAddUrl: async (...args) => { calls.push(['url', ...args]); },
        nbAddFile: async (...args) => { calls.push(['file', ...args]); if (failUpload) throw new Error('Upload failed'); }};
    const auth = {isLoggedIn: () => true, onAuthChange(callback) { callback({id: 1}); }};
    load('notebook.js', {MindSprintApi: api, MindSprintAuth: auth},
        {getElementById: () => pane, querySelectorAll: () => []});
    await new Promise(resolve => setImmediate(resolve));
    return {pane, calls, input: id => pane.querySelector('#' + id)};
}

test('URL validates on input and submit, rejects broken HTTP URLs, clears errors and sends valid URLs', async () => {
    const h = await notebookHarness(), url = h.input('nb-url');
    for (const value of ['', 'not a url', 'ftp://example.com', 'https://bad host.test', 'https://example.com:bad', 'http://']) {
        url.value = value;
        await h.pane.dispatch('input', url);
        assert.equal(url.getAttribute('aria-invalid'), 'true', value);
        await h.pane.dispatch('click', h.pane.querySelector('[data-act="add-url"]'));
    }
    assert.equal(h.calls.length, 0);
    url.value = 'https://example.com/lesson?q=1';
    await h.pane.dispatch('input', url);
    assert.equal(url.getAttribute('aria-invalid'), 'false');
    assert.equal(h.input('nb-url-feedback').hidden, true);
    await h.pane.dispatch('click', h.pane.querySelector('[data-act="add-url"]'));
    assert.deepEqual(h.calls, [['url', 1, 'https://example.com/lesson?q=1']]);
    assert.equal(url.value, '');
    assert.match(h.input('nb-url-feedback').innerHTML, /Đã thêm/);
});

test('file change validates extension and 10 MiB boundary inline; submit checks again before upload', async () => {
    const h = await notebookHarness(), input = h.input('nb-file');
    assert.equal(h.input('nb-file-feedback').hidden, true);
    for (const file of [null, {name: 'bad.exe', size: 1}, {name: 'report.pdf.exe', size: 1}, {name: 'large.pdf', size: 10 * 1024 * 1024 + 1}]) {
        input.files = file ? [file] : [];
        await h.pane.dispatch('change', input);
        assert.equal(input.getAttribute('aria-invalid'), 'true');
        assert.equal(h.input('nb-file-feedback').hidden, false);
        await h.pane.dispatch('click', h.pane.querySelector('[data-act="add-file"]'));
    }
    assert.equal(h.calls.length, 0);
    for (const name of ['report.PDF', 'notes.txt', 'lesson.md', 'data.csv']) {
        input.files = [{name, size: 10 * 1024 * 1024}];
        await h.pane.dispatch('change', input);
        assert.equal(input.getAttribute('aria-invalid'), 'false');
        assert.equal(h.input('nb-file-feedback').hidden, true);
    }
    await h.pane.dispatch('click', h.pane.querySelector('[data-act="add-file"]'));
    assert.equal(h.calls[0][0], 'file');
    assert.equal(h.calls[0][2].size, 10 * 1024 * 1024);
});

test('failed uploads keep the selected file and show an inline error that clears after a new selection', async () => {
    const h = await notebookHarness(true), input = h.input('nb-file');
    const file = {name: 'lesson.pdf', size: 100};
    input.files = [file]; input.value = 'lesson.pdf';
    await h.pane.dispatch('click', h.pane.querySelector('[data-act="add-file"]'));
    assert.equal(input.files[0], file);
    assert.equal(input.value, 'lesson.pdf');
    assert.equal(h.input('nb-file-feedback').textContent, 'Upload failed');
    assert.equal(h.input('nb-file-feedback').hidden, false);
    await h.pane.dispatch('change', input);
    assert.equal(h.input('nb-file-feedback').hidden, true);
});
