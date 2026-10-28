const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function harness(supported = true) {
    const listeners = {}, nodes = {}, sessions = [], spoken = [];
    let signedIn = true, visible = true, authChange, cancels = 0;
    const pane = {classList: {contains: () => visible}, querySelector: sel => nodes[sel] || null,
        addEventListener(type, fn) { (listeners[type] ||= []).push(fn); }};
    for (const id of ['nb-q', 'nb-mic-toggle', 'nb-voice-status', 'nb-voice-preview', 'nb-read-answer', 'nb-read-stop'])
        nodes['#' + id] = {id, value: '', maxLength: 1000, disabled: false, checked: false, hidden: false, textContent: '',
            attrs: {}, setAttribute(k,v) { this.attrs[k] = v; }, focus() {}, dispatchEvent(event) { emit(event.type, {target: this}); }};
    function emit(type, extra = {}) { for (const fn of listeners[type] || []) fn({target: {}, ...extra}); }
    class Recognition {
        constructor() { sessions.push(this); }
        start() { this.started = true; this.onstart?.(); }
        abort() { this.aborted = true; this.onend?.(); }
    }
    const auth = {isLoggedIn: () => signedIn, onAuthChange(fn) { authChange = fn; }};
    const window = {MindSprintAuth: auth, SpeechSynthesisUtterance: class {constructor(text) { this.text = text; }},
        speechSynthesis: {cancel() { cancels++; }, speak(value) { spoken.push(value); }, getVoices: () => []}};
    if (supported) window.SpeechRecognition = Recognition;
    const document = {hidden: false, getElementById: () => pane, addEventListener(type, fn) { (listeners[type] ||= []).push(fn); }};
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../frontend/voice.js'), 'utf8'), {window, document, Event});
    emit('ms-notebook-rendered');
    const click = id => emit('click', {target: {...nodes['#' + id], closest(sel) { return sel === '#' + id ? this : null; }}});
    return {nodes, sessions, spoken, emit, click, get cancels() {return cancels;},
        logout() {signedIn = false; authChange(null);}, hide() {visible = false;}, window};
}

test('voice is opt-in, keeps the typed draft, returns editable Vietnamese text and never auto-submits', () => {
    const h = harness();
    assert.equal(h.sessions.length, 0);
    h.nodes['#nb-q'].value = 'Đề bài:';
    h.click('nb-mic-toggle');
    const rec = h.sessions[0];
    assert.equal(rec.lang, 'vi-VN');
    assert.equal(rec.started, true);
    rec.onresult({results: [[{transcript: 'giải hai x bằng bốn'}]]});
    assert.equal(h.nodes['#nb-q'].value, 'Đề bài: giải hai x bằng bốn');
    assert.equal(h.nodes['#nb-q'].disabled, false);
    assert.match(h.nodes['#nb-voice-status'].textContent, /kiểm tra|chỉnh/i);
});

test('permission, silence and network failures retain keyboard input; unsupported browser has a fallback', () => {
    for (const error of ['not-allowed', 'no-speech', 'network', 'audio-capture']) {
        const h = harness(); h.nodes['#nb-q'].value = 'Giữ nguyên';
        h.click('nb-mic-toggle'); h.sessions[0].onerror({error});
        assert.equal(h.nodes['#nb-q'].value, 'Giữ nguyên');
        assert.equal(h.nodes['#nb-q'].disabled, false);
        assert.match(h.nodes['#nb-voice-status'].textContent, /gõ|bàn phím/i);
    }
    const h = harness(false);
    assert.equal(h.nodes['#nb-mic-toggle'].disabled, true);
    assert.equal(h.nodes['#nb-q'].disabled, false);
});

test('manual editing, context changes and logout discard late recognition and stop speech', () => {
    for (const boundary of ['input', 'ms-notebook-reset', 'logout', 'ms-notebook-suspend']) {
        const h = harness(); h.click('nb-mic-toggle'); const rec = h.sessions[0];
        if (boundary === 'logout') h.logout();
        else h.emit(boundary, {target: h.nodes['#nb-q']});
        h.nodes['#nb-q'].value = 'New draft';
        rec.onresult?.({results: [[{transcript: 'old account secret'}]]});
        assert.equal(h.nodes['#nb-q'].value, 'New draft');
        assert.equal(rec.aborted, true);
        assert.ok(h.cancels > 0);
    }
});

test('answer reading is opt-in and cancellable, and speech errors do not break input', () => {
    const h = harness();
    h.emit('ms-notebook-answer', {detail: {text: 'Không đọc tự động'}});
    assert.equal(h.spoken.length, 0);
    h.nodes['#nb-read-answer'].checked = true;
    h.emit('ms-notebook-answer', {detail: {text: 'Kết quả x bằng hai'}});
    assert.equal(h.spoken[0].lang, 'vi-VN');
    assert.equal(h.spoken[0].text, 'Kết quả x bằng hai');
    h.click('nb-read-stop'); assert.equal(h.nodes['#nb-read-stop'].disabled, true);
    h.click('nb-mic-toggle');
    h.nodes['#nb-q'].maxLength = 3;
    h.sessions[0].onresult({results: [[{transcript: 'dài hơn giới hạn'}]]});
    assert.equal(h.nodes['#nb-q'].value, '');
    assert.match(h.nodes['#nb-voice-status'].textContent, /giới hạn/i);
});

test('failed speech services and a reply after leaving notebook preserve keyboard fallback', () => {
    const h = harness();
    h.nodes['#nb-read-answer'].checked = true;
    h.window.speechSynthesis.speak = () => {throw new Error('Device unavailable');};
    h.emit('ms-notebook-answer', {detail: {text: 'Answer'}});
    assert.equal(h.nodes['#nb-q'].disabled, false);
    assert.equal(h.nodes['#nb-read-stop'].disabled, true);
    const hidden = harness(); hidden.nodes['#nb-read-answer'].checked = true;
    hidden.hide();
    hidden.emit('ms-notebook-answer', {detail: {text: 'Late reply'}});
    assert.equal(hidden.spoken.length, 0);
});
