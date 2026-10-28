// Voice is an optional input method; notebook.js still owns sending and account state.
(function () {
    const pane = document.getElementById('tab-content-notebook');
    const auth = window.MindSprintAuth;
    if (!pane || !auth) return;
    const $ = selector => pane.querySelector(selector);
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const synthesis = window.speechSynthesis;
    const canRead = !!synthesis && !!window.SpeechSynthesisUtterance;
    let recognition = null, reading = null;

    function status(text, show = true) {
        const node = $('#nb-voice-status'); if (node) node.textContent = text;
        const options = $('#nb-voice-options'); if (options && show) options.open = true;
    }
    function micState(listening) {
        const button = $('#nb-mic-toggle');
        if (!button) return;
        button.textContent = listening ? 'Dừng nghe' : 'Nhập bằng giọng nói';
        button.setAttribute('aria-pressed', String(listening));
    }
    function stopReading() {
        reading = null;
        if (canRead) synthesis.cancel();
        const button = $('#nb-read-stop'); if (button) button.disabled = true;
    }
    function stopListening() {
        const current = recognition;
        recognition = null; // Ignore callbacks from a previous notebook/account.
        try { current?.abort(); } catch { /* The browser may already have stopped. */ }
        micState(false);
    }
    function suspend() {
        const active = recognition || reading;
        stopListening(); stopReading();
        if (active) status('Đã dừng nghe/đọc. Bạn vẫn có thể gõ bằng bàn phím.');
    }
    function setup() {
        suspend();
        const mic = $('#nb-mic-toggle'), read = $('#nb-read-answer');
        if (!mic || !read) return;
        mic.disabled = !Recognition;
        read.disabled = !canRead;
        status(!Recognition ? 'Trình duyệt chưa hỗ trợ nhận giọng nói. Hãy gõ bằng bàn phím.'
            : 'Bấm micro để nói tiếng Việt; kiểm tra/chỉnh câu trong ô rồi bấm Gửi. Trình duyệt có thể gửi âm thanh tới dịch vụ nhận diện và cần mạng.', false);
    }
    function startListening() {
        const input = $('#nb-q');
        if (recognition) { stopListening(); status('Đã dừng nghe. Kiểm tra/chỉnh câu trước khi gửi.'); return; }
        if (!Recognition || !auth.isLoggedIn() || !input || input.disabled) {
            status('Đăng nhập và chờ câu trả lời hiện tại; bạn vẫn có thể gõ bằng bàn phím.'); return;
        }
        stopReading();
        let current;
        try { current = new Recognition(); }
        catch { status('Dịch vụ micro chưa sẵn sàng. Bạn vẫn có thể gõ bằng bàn phím.'); return; }
        const draft = input.value;
        recognition = current;
        current.lang = 'vi-VN'; current.continuous = false; current.interimResults = false;
        current.onstart = () => {
            if (recognition !== current) return;
            micState(true); status('Đang nghe tiếng Việt… Bấm Dừng nghe để hủy.');
        };
        current.onresult = event => {
            if (recognition !== current || !auth.isLoggedIn() || input !== $('#nb-q') || input.disabled) return;
            const text = Array.from(event.results, result => result[0].transcript).join(' ').trim();
            stopListening();
            if (!text) { status('Chưa nhận được lời nói. Bạn có thể thử lại hoặc gõ bằng bàn phím.'); return; }
            // Do not overwrite edits made after listening began, including programmatic changes.
            if (input.value !== draft) { status('Ô nhập đã thay đổi; giữ bản bạn đang gõ.'); return; }
            const value = draft + (draft && !/\s$/.test(draft) ? ' ' : '') + text;
            if (input.maxLength > 0 && value.length > input.maxLength) {
                const preview = $('#nb-voice-preview');
                if (preview) { preview.textContent = text; preview.hidden = false; }
                status('Câu nhận diện vượt giới hạn ô nhập. Hãy rút ngắn hoặc gõ bằng bàn phím.'); return;
            }
            input.value = value;
            input.dispatchEvent(new Event('input', {bubbles: true}));
            input.focus(); status('Đã nhận câu. Hãy kiểm tra/chỉnh văn bản rồi bấm Gửi câu hỏi.');
        };
        current.onerror = event => {
            if (recognition !== current) return;
            stopListening();
            const messages = {
                'not-allowed': 'Quyền micro bị từ chối.', 'service-not-allowed': 'Dịch vụ nhận diện không được phép.',
                'audio-capture': 'Không tìm thấy micro.', 'no-speech': 'Chưa nhận được lời nói.',
                'network': 'Kết nối nhận diện bị lỗi.', 'language-not-supported': 'Dịch vụ chưa hỗ trợ tiếng Việt.'
            };
            status((messages[event.error] || 'Chưa nhận diện được giọng nói.') + ' Hãy thử lại hoặc gõ bằng bàn phím.');
        };
        current.onend = () => {
            if (recognition !== current) return;
            recognition = null; micState(false);
            status('Đã dừng nghe. Nếu chưa có câu, thử lại hoặc gõ bằng bàn phím.');
        };
        const preview = $('#nb-voice-preview'); if (preview) preview.hidden = true;
        try { micState(true); current.start(); }
        catch { stopListening(); status('Không mở được micro. Hãy thử lại hoặc gõ bằng bàn phím.'); }
    }
    pane.addEventListener('click', event => {
        if (event.target.closest('#nb-mic-toggle')) startListening();
        if (event.target.closest('#nb-read-stop')) { stopReading(); status('Đã dừng đọc câu trả lời.'); }
    });
    pane.addEventListener('change', event => {
        if (event.target.id === 'nb-read-answer' && !event.target.checked) stopReading();
        if (event.target.id === 'nb-select') suspend();
    });
    pane.addEventListener('input', event => { if (event.target.id === 'nb-q' && recognition) suspend(); });
    pane.addEventListener('ms-notebook-rendered', setup);
    pane.addEventListener('ms-notebook-reset', suspend);
    pane.addEventListener('ms-notebook-suspend', suspend);
    pane.addEventListener('ms-notebook-answer', event => {
        if (!canRead || !auth.isLoggedIn() || !pane.classList.contains('active') || !$('#nb-read-answer')?.checked || document.hidden) return;
        stopListening(); stopReading();
        try {
            const utterance = new window.SpeechSynthesisUtterance(event.detail.text);
            reading = utterance; utterance.lang = 'vi-VN';
            const vi = synthesis.getVoices().find(voice => voice.lang.toLowerCase().startsWith('vi'));
            if (vi) utterance.voice = vi;
            utterance.onend = utterance.onerror = () => { if (reading === utterance) stopReading(); };
            $('#nb-read-stop').disabled = false; synthesis.speak(utterance);
        }
        catch { stopReading(); status('Không đọc được câu trả lời; bạn vẫn có thể xem văn bản.'); }
    });
    document.addEventListener('click', event => {
        const tab = event.target.closest('[data-tab]');
        if (tab && tab.dataset.tab !== 'notebook') suspend();
        if (event.target.closest('[data-ui-act="toggle-chat-expanded"]') && pane.classList.contains('is-chat-expanded')) suspend();
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) suspend(); });
    if (window.MutationObserver) new window.MutationObserver(() => {
        if (!pane.classList.contains('active')) suspend();
    }).observe(pane, {attributes: true, attributeFilter: ['class']});
    window.addEventListener?.('pagehide', suspend);
    auth.onAuthChange(() => { suspend(); const read = $('#nb-read-answer'); if (read) read.checked = false; });
})();
