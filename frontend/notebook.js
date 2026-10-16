// Sổ tay AI - các tính năng học tập kiểu NotebookLM:
// nguồn tài liệu (dán/PDF/TXT/URL), hỏi đáp có trích dẫn, tóm tắt, study guide, FAQ,
// timeline, mind map, flashcard, trắc nghiệm, audio overview, ghi chú.
(function () {
    const pane = document.getElementById('tab-content-notebook');
    const api = window.MindSprintApi;
    const auth = window.MindSprintAuth;
    if (!pane || !api || !auth) return;

    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const $ = (sel) => pane.querySelector(sel);

    const emptyWork = () => ({question: '', submission: '', hints: [], revealed: false});
    const emptyState = () => ({ notebooks: [], nb: null, sources: [], notes: [], history: [], tutorHistory: [], chatMode: 'source', tutorStyle: 'steps', tutorTask: 'solve', work: emptyWork(), drafts: {source: '', tutor: ''}, quiz: null, audio: null, lastText: null, lastTitle: '', lastCards: null });
    const state = emptyState();
    let workspaceVersion = 0;
    let notebookRequest = 0;
    let chatPending = false;
    let studioPending = false;
    let workVersion = 0;
    const MAX_FILE = 10 * 1024 * 1024;

    // ---------- helpers ----------
    const srcTitle = (n) => (state.sources[Number(n) - 1] || {}).title || 'Nguồn ' + n;

    function md(src) {
        return window.MindSprintText.markdown(src, srcTitle);
    }
    function busy(btn, on) { if (btn) { btn.disabled = on; btn.style.opacity = on ? 0.6 : 1; } }
    function aiError(error) {
        let message = error.message || 'AI chưa xử lý được yêu cầu. Vui lòng thử lại.';
        const seconds = Number(error.retryAfterSeconds);
        if (error.code === 'ai_rate_limited' && seconds > 0) {
            const wait = seconds >= 3600 ? Math.ceil(seconds / 3600) + ' giờ' : Math.ceil(seconds / 60) + ' phút';
            message += ` Thời gian chờ dự kiến: ${wait}.`;
        }
        return `<span>${esc(message)}</span>`;
    }
    async function run(btn, fn) {
        busy(btn, true);
        if (btn?.dataset.act === 'add-url') showUrlFeedback('Đang tải và đọc nguồn từ URL...');
        try { return await fn(); } catch (e) {
            if (btn?.dataset.act === 'add-url') {
                if (!btn.isConnected) return;
                const blocked = /^Trang trả về lỗi 403\b/.test(e.message || '');
                const redirected = /^Trang trả về lỗi 30[12378]\b/.test(e.message || '');
                const message = blocked
                    ? 'Trang nguồn từ chối cho Sổ tay AI tải nội dung (403). Trang có thể yêu cầu đăng nhập hoặc chặn truy cập tự động.'
                    : redirected
                        ? 'Đường dẫn này chuyển sang một trang khác. Mở đường dẫn trong trình duyệt rồi thử URL cuối cùng trên thanh địa chỉ.'
                        : e.message || 'Không tải được nội dung từ URL. Vui lòng thử lại.';
                showUrlFeedback(message, true, e.status !== 401);
            } else if (btn?.dataset.act === 'add-file') {
                if (!btn.isConnected) return;
                showFileFeedback(e.message || 'Không tải được file. Vui lòng thử lại.');
            } else window.MindSprintDialogs.alert(e.message || 'Có lỗi xảy ra');
        } finally { busy(btn, false); }
    }
    function showUrlFeedback(message, error = false, alternatives = false) {
        const feedback = $('#nb-url-feedback');
        if (!feedback) return;
        feedback.hidden = !message;
        feedback.classList.toggle('is-error', error);
        $('#nb-url').setAttribute('aria-invalid', String(error));
        feedback.innerHTML = `<p>${esc(message)}</p>${alternatives ? `<p class="nb-muted">Bạn vẫn có thể mở trang để sao chép nội dung rồi dán vào sổ tay, hoặc tải tài liệu và thêm bằng file.</p>
            <div class="nb-url-alternatives"><button class="btn btn-secondary" type="button" data-ui-act="focus-paste">Dán văn bản</button><button class="btn btn-secondary" type="button" data-ui-act="focus-upload">Tải file</button></div>` : ''}`;
    }
    function validateUrl() {
        const input = $('#nb-url');
        const value = input.value.trim();
        let message = '';
        try {
            const url = new URL(value);
            if (!/^https?:\/\//i.test(value) || !['http:', 'https:'].includes(url.protocol) || !url.hostname) throw new Error();
        } catch {
            message = 'Nhập URL hợp lệ bắt đầu bằng http:// hoặc https://.';
        }
        showUrlFeedback(message, !!message);
        return !message;
    }
    function showFileFeedback(message) {
        const feedback = $('#nb-file-feedback');
        if (!feedback) return;
        feedback.textContent = message;
        feedback.hidden = !message;
        feedback.classList.toggle('is-error', !!message);
        $('#nb-file').setAttribute('aria-invalid', String(!!message));
    }
    function validateFile() {
        const file = $('#nb-file').files[0];
        const message = !file ? 'Hãy chọn một file.'
            : !/\.(jpe?g|png|webp|pdf|txt|md|csv)$/i.test(file.name) ? 'Chỉ hỗ trợ JPG, PNG, WebP, PDF, TXT, MD, CSV.'
            : !file.size ? 'Tệp không được trống.'
            : file.size > MAX_FILE ? 'File tối đa 10 MB (10.485.760 byte).'
            : '';
        showFileFeedback(message);
        return !message;
    }
    function ensureLoggedIn() {
        if (auth.isLoggedIn()) return true;
        const status = $('#nb-status');
        status.textContent = 'Nhấn avatar ở góc trên bên phải để đăng nhập và lưu dữ liệu sổ tay.';
        status.hidden = false;
        return false;
    }

    // ---------- render: giao diện chính ----------
    function renderMain() {
        pane.innerHTML = `
        <header class="main-header">
            <div class="header-info"><h1>Sổ tay AI</h1><p>Hỏi đáp theo tài liệu hoặc cùng gia sư giải bài tập, củng cố kiến thức.</p></div>
        </header>
        <p id="nb-status" class="nb-err" role="status" hidden></p>
        <div class="nb-layout">
            <section class="nb-col nb-sources glass-panel">
                <h3><span>Sổ tay & Nguồn</span><button class="nb-source-toggle nb-icon-btn" type="button" data-ui-act="toggle-sources" aria-label="Thu gọn khung nguồn" title="Thu gọn khung nguồn" aria-expanded="true" aria-controls="nb-source-content"><i class="fas fa-chevron-left" aria-hidden="true"></i></button></h3>
                <div class="nb-source-rail">
                    <button class="nb-source-toggle nb-icon-btn" type="button" data-ui-act="toggle-sources" aria-label="Mở khung nguồn" title="Mở khung nguồn" aria-expanded="false" aria-controls="nb-source-content"><i class="fas fa-chevron-right" aria-hidden="true"></i></button>
                    <button class="nb-icon-btn" type="button" data-ui-act="open-source-dialog" aria-label="Thêm nguồn" title="Thêm nguồn"><i class="fas fa-plus" aria-hidden="true"></i></button>
                    <span class="nb-rail-label">Nguồn</span><span class="nb-rail-count" data-source-count>0</span>
                </div>
                <div class="nb-source-content" id="nb-source-content">
                <label class="nb-notebook-label" for="nb-select">Sổ tay đang mở</label>
                <div class="nb-row">
                    <select id="nb-select">${state.notebooks.map(n => `<option value="${n.id}" ${state.nb && n.id === state.nb.id ? 'selected' : ''}>${esc(n.title)}</option>`).join('')}</select>
                    <button class="nb-icon-btn" data-act="nb-new" title="Sổ tay mới" aria-label="Tạo sổ tay mới"><i class="fas fa-plus" aria-hidden="true"></i></button>
                    <button class="nb-icon-btn" data-act="nb-del" title="Xóa sổ tay" aria-label="Xóa sổ tay đang mở"><i class="fas fa-trash-alt" aria-hidden="true"></i></button>
                </div>
                <button class="nb-add-source-btn" type="button" data-ui-act="open-source-dialog"><i class="fas fa-plus" aria-hidden="true"></i> Thêm nguồn</button>
                <div class="nb-source-list-heading"><span>Nguồn tài liệu</span><span data-source-count>0</span></div>
                <div id="nb-source-list"></div>
                </div>
            </section>

            <section class="nb-col nb-chat glass-panel">
                <div class="nb-chat-header">
                    <div class="nb-mode-switch" role="radiogroup" aria-label="Chế độ hỏi đáp">
                        <button type="button" class="nb-mode-btn" role="radio" aria-checked="true" data-chat-mode="source">Theo nguồn</button>
                        <button type="button" class="nb-mode-btn" role="radio" aria-checked="false" tabindex="-1" data-chat-mode="tutor">Gia sư</button>
                    </div>
                    <h3 id="nb-chat-title">Hỏi đáp theo nguồn</h3>
                    <button id="nb-source-add" class="nb-chip" type="button" data-ui-act="open-source-dialog" title="Thêm ảnh/tài liệu vào nguồn">Thêm nguồn</button>
                    <button class="nb-chip nb-expand-chat" type="button" data-ui-act="toggle-chat-expanded" aria-pressed="false"><i class="fas fa-expand" aria-hidden="true"></i> <span>Mở rộng</span></button>
                </div>
                <div class="nb-tutor-controls" id="nb-tutor-controls" hidden>
                    <div class="nb-tutor-style" role="radiogroup" aria-label="Hoạt động Gia sư">
                        <button type="button" role="radio" aria-checked="true" data-tutor-task="solve">Giải bài</button>
                        <button type="button" role="radio" aria-checked="false" tabindex="-1" data-tutor-task="check">Kiểm tra bài làm</button>
                        <button type="button" role="radio" aria-checked="false" tabindex="-1" data-tutor-task="practice">Tự luyện</button>
                    </div>
                    <div class="nb-tutor-style" role="radiogroup" aria-label="Cách giải">
                        <span>Cách giải</span>
                        <button type="button" role="radio" aria-checked="true" data-tutor-style="steps">Từng bước</button>
                        <button type="button" role="radio" aria-checked="false" tabindex="-1" data-tutor-style="brief">Ngắn gọn</button>
                    </div>
                    <button type="button" class="nb-chip" data-act="tutor-new">Bài mới</button>
                </div>
                <div id="nb-tutor-work" class="nb-tutor-work" hidden>
                    <label for="nb-problem">Đề bài</label>
                    <textarea id="nb-problem" class="nb-input" rows="3" maxlength="10000" placeholder="Nhập đề hoặc chỉ rõ câu trong tài liệu…">${esc(state.work.question)}</textarea>
                    <div id="nb-submission-field">
                        <label for="nb-submission">Bài làm của bạn</label>
                        <textarea id="nb-submission" class="nb-input" rows="5" maxlength="10000" placeholder="Nhập các bước đã làm; có thể sửa và gửi lại…">${esc(state.work.submission)}</textarea>
                    </div>
                    <p class="nb-muted" id="nb-check-help">Gia sư đối chiếu bài làm, giải thích lỗi đầu tiên và hướng dẫn sửa. Nhận xét không kèm điểm số.</p>
                    <button type="button" class="btn btn-primary" data-act="tutor-check">Kiểm tra bài làm</button>
                    <div id="nb-work-messages" class="nb-messages" role="log" aria-label="Nhận xét bài làm" aria-live="polite"></div>
                    <div id="nb-practice-controls" hidden>
                        <p class="nb-muted">Mức 1: kiến thức · Mức 2: hướng xử lý · Mức 3: bước tiếp theo. Bạn chủ động chọn khi muốn xem lời giải.</p>
                        <p id="nb-hint-progress" role="status" aria-live="polite"></p>
                        <div class="nb-row">
                            <button type="button" class="btn btn-primary" data-act="tutor-hint">Gợi ý tiếp</button>
                            <button type="button" class="btn btn-secondary" data-act="tutor-solution">Xem lời giải</button>
                        </div>
                    </div>
                    <div id="nb-practice-messages" class="nb-messages" role="log" aria-label="Gợi ý tự luyện" aria-live="polite" hidden></div>
                </div>
                <div class="nb-welcome">
                    <div class="welcome-orb" aria-hidden="true"></div>
                    <h2>Bạn muốn khám phá điều gì từ tài liệu?</h2>
                    <p>Cùng AI đọc hiểu, kết nối kiến thức và chuẩn bị cho lần ôn tập tiếp theo.</p>
                </div>
                <div class="nb-messages" id="nb-messages" role="log" aria-label="Hội thoại theo nguồn" aria-live="polite"></div>
                <div class="nb-messages" id="nb-tutor-messages" role="log" aria-label="Hội thoại Gia sư" aria-live="polite" hidden></div>
                <p class="nb-tutor-help" id="nb-tutor-help" hidden></p>
                <div class="nb-quick-actions" aria-label="Thao tác AI nhanh" data-source-only>
                    <button class="nb-chip" type="button" data-act="suggest"><i class="fas fa-lightbulb" aria-hidden="true"></i> Gợi ý câu hỏi</button>
                    <button class="nb-chip" type="button" data-gen="summary"><i class="fas fa-file-alt" aria-hidden="true"></i> Tóm tắt</button>
                    <button class="nb-chip" type="button" data-gen="flashcards"><i class="fas fa-layer-group" aria-hidden="true"></i> Flashcard</button>
                    <button class="nb-chip" type="button" data-gen="quiz"><i class="fas fa-edit" aria-hidden="true"></i> Trắc nghiệm</button>
                </div>
                <div class="nb-suggest" id="nb-suggest" data-source-only></div>
                <div class="nb-composer">
                    <textarea class="nb-input" id="nb-q" aria-label="Câu hỏi về tài liệu" rows="1" placeholder="Bạn muốn hỏi gì về tài liệu của mình?" maxlength="1000"></textarea>
                    <div class="nb-composer-footer">
                        <button class="nb-icon-btn" type="button" data-ui-act="focus-upload" aria-label="Mở phần tải tài liệu" title="Thêm tài liệu" data-source-only><i class="fas fa-plus" aria-hidden="true"></i></button>
                        <span id="nb-composer-hint">Hỏi đáp dựa trên nguồn của bạn</span>
                        <button class="btn btn-primary" data-act="send" aria-label="Gửi câu hỏi">Gửi câu hỏi <i class="fas fa-arrow-right" aria-hidden="true"></i></button>
                    </div>
                </div>
            </section>

            <section class="nb-col nb-studio glass-panel">
                <h3 data-source-only><i class="fas fa-magic"></i> Studio</h3>
                <div class="nb-studio-grid" data-source-only>
                    <button data-gen="summary"><i class="fas fa-file-alt" aria-hidden="true"></i><span>Tóm tắt</span><small>Nắm nhanh các ý chính</small></button>
                    <button data-gen="studyguide"><i class="fas fa-graduation-cap" aria-hidden="true"></i><span>Study guide</span><small>Lập hướng dẫn ôn tập</small></button>
                    <button data-gen="faq"><i class="fas fa-question-circle" aria-hidden="true"></i><span>FAQ</span><small>Giải đáp điều cần nhớ</small></button>
                    <button data-gen="timeline"><i class="fas fa-stream" aria-hidden="true"></i><span>Timeline</span><small>Kết nối các mốc sự kiện</small></button>
                    <button data-gen="mindmap"><i class="fas fa-project-diagram" aria-hidden="true"></i><span>Mind map</span><small>Hệ thống hóa kiến thức</small></button>
                    <button data-gen="flashcards"><i class="fas fa-layer-group" aria-hidden="true"></i><span>Flashcard</span><small>Ghi nhớ qua bộ thẻ</small></button>
                    <button data-gen="quiz"><i class="fas fa-edit" aria-hidden="true"></i><span>Trắc nghiệm</span><small>Kiểm tra điều đã hiểu</small></button>
                    <button data-gen="audio"><i class="fas fa-podcast" aria-hidden="true"></i><span>Audio overview</span><small>Nghe lại nội dung học</small></button>
                </div>
                <div class="nb-studio-results">
                <section class="nb-result-panel" aria-label="Kết quả Studio" data-source-only>
                <input class="nb-input" id="nb-focus" type="text" placeholder="Trọng tâm (tuỳ chọn), vd: chương 3" maxlength="200" autocomplete="off">
                <div id="nb-studio-status" role="status" hidden></div>
                <div class="nb-out" id="nb-out"><div class="nb-muted">Kết quả sẽ hiển thị ở đây.</div></div>
                </section>
                <section class="nb-notes-panel" aria-label="Ghi chú đã lưu">
                <h3><i class="fas fa-sticky-note"></i> Ghi chú</h3>
                <div id="nb-notes"></div>
                <section id="nb-tutor-note" class="nb-out" aria-label="Nội dung ghi chú" hidden></section>
                </section>
                </div>
            </section>
        </div>
        <dialog class="nb-source-dialog" id="nb-add-source-dialog" aria-labelledby="nb-source-dialog-title" aria-describedby="nb-source-dialog-description">
            <div class="nb-source-dialog-header">
                <div><h2 id="nb-source-dialog-title">Thêm nguồn cho sổ tay</h2><p id="nb-source-dialog-description">Nguồn được lưu trong sổ tay, dùng chung cho Theo nguồn và Gia sư. Tổng ảnh/PDF tối đa 10 MB; AI đọc tệp khi bạn hỏi.</p></div>
                <button class="nb-icon-btn" type="button" data-ui-act="close-source-dialog" aria-label="Đóng hộp thêm nguồn"><i class="fas fa-times" aria-hidden="true"></i></button>
            </div>
            <div class="nb-source-methods" role="tablist" aria-label="Cách thêm nguồn">
                <button type="button" role="tab" id="nb-method-file" aria-controls="nb-panel-file" aria-selected="true" data-ui-act="source-method" data-source-kind="file"><i class="fas fa-file-upload" aria-hidden="true"></i> Tải tệp lên</button>
                <button type="button" role="tab" id="nb-method-url" aria-controls="nb-panel-url" aria-selected="false" tabindex="-1" data-ui-act="source-method" data-source-kind="url"><i class="fas fa-link" aria-hidden="true"></i> Trang web</button>
                <button type="button" role="tab" id="nb-method-text" aria-controls="nb-panel-text" aria-selected="false" tabindex="-1" data-ui-act="source-method" data-source-kind="text"><i class="fas fa-paste" aria-hidden="true"></i> Dán văn bản</button>
            </div>
            <section id="nb-panel-file" role="tabpanel" aria-labelledby="nb-method-file">
                <div class="nb-file-dropzone" id="nb-file-dropzone">
                    <i class="fas fa-cloud-upload-alt" aria-hidden="true"></i>
                    <strong>Kéo và thả tài liệu vào đây</strong>
                    <span>JPG, PNG, WebP, PDF, TXT, MD hoặc CSV · tối đa 10 MB; PDF tối đa 20 trang</span>
                    <button class="btn btn-secondary" type="button" data-ui-act="pick-source-file" aria-describedby="nb-file-feedback">Chọn tệp</button>
                    <input type="file" id="nb-file" accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.md,.csv" aria-label="Chọn tài liệu để tải lên" aria-describedby="nb-file-feedback" hidden>
                </div>
                <div class="nb-url-feedback" id="nb-file-feedback" role="status" aria-live="polite" aria-atomic="true" hidden></div>
                <p class="nb-file-selection" id="nb-file-selection" role="status" aria-live="polite">Chưa chọn tệp.</p>
                <div class="nb-source-dialog-actions"><button class="btn btn-primary" type="button" data-act="add-file">Tải lên</button></div>
            </section>
            <section id="nb-panel-url" role="tabpanel" aria-labelledby="nb-method-url" hidden>
                <label for="nb-url">Đường dẫn trang nguồn</label>
                <input class="nb-validation-input" type="url" id="nb-url" placeholder="https://..." aria-describedby="nb-url-hint nb-url-feedback">
                <p class="nb-muted nb-url-hint" id="nb-url-hint">Hỗ trợ web, PDF có chữ, DOCX/PPTX/XLSX, TXT/MD/CSV và JSON/XML/RSS. Dùng URL công khai; một số trang yêu cầu đăng nhập hoặc chặn tải tự động.</p>
                <div class="nb-url-feedback" id="nb-url-feedback" role="status" aria-live="polite" aria-atomic="true" hidden></div>
                <div class="nb-source-dialog-actions"><button class="btn btn-primary" type="button" data-act="add-url">Thêm trang web</button></div>
            </section>
            <section id="nb-panel-text" role="tabpanel" aria-labelledby="nb-method-text" hidden>
                <label for="nb-txt-title">Tiêu đề (tùy chọn)</label><input type="text" id="nb-txt-title" placeholder="Ví dụ: Ghi chú chương 1" maxlength="100">
                <label for="nb-txt-body">Nội dung tài liệu</label><textarea id="nb-txt-body" rows="6" placeholder="Dán nội dung bài giảng, ghi chú..." aria-describedby="nb-text-hint"></textarea>
                <p class="nb-muted" id="nb-text-hint">Nội dung tối thiểu 20 ký tự.</p>
                <div class="nb-source-dialog-actions"><button class="btn btn-primary" type="button" data-act="add-text">Thêm văn bản</button></div>
            </section>
        </dialog>`;
        renderSources(); renderNotes(); setChatMode(state.chatMode);
        pane.dispatchEvent(new Event('ms-notebook-rendered'));
    }

    function setChatMode(mode) {
        if (chatPending || !['source', 'tutor'].includes(mode)) return;
        if (state.chatMode !== mode) state.drafts[state.chatMode] = $('#nb-q').value;
        state.chatMode = mode;
        const tutor = mode === 'tutor';
        pane.querySelectorAll('[data-chat-mode]').forEach(button => {
            const selected = button.dataset.chatMode === mode;
            button.setAttribute('aria-checked', String(selected)); button.tabIndex = selected ? 0 : -1;
        });
        pane.querySelectorAll('[data-source-only]').forEach(element => { element.hidden = tutor; });
        $('#nb-tutor-controls').hidden = !tutor;
        $('#nb-tutor-help').hidden = !tutor;
        $('#nb-tutor-note').hidden = true;
        $('#nb-messages').hidden = tutor; $('#nb-tutor-messages').hidden = !tutor;
        $('#nb-chat-title').textContent = tutor ? 'Gia sư AI' : 'Hỏi đáp theo nguồn';
        $('.nb-welcome h2').textContent = tutor ? 'Bạn muốn giải bài tập nào?' : 'Bạn muốn khám phá điều gì từ tài liệu?';
        $('.nb-welcome p').textContent = tutor ? 'Cùng tìm cách giải, hiểu từng bước và hỏi lại điều chưa rõ.' : 'Cùng AI đọc hiểu, kết nối kiến thức và chuẩn bị cho lần ôn tập tiếp theo.';
        $('#nb-q').placeholder = tutor ? 'Nhập đề hoặc hỏi về tệp, ví dụ: Giải câu 1…' : 'Bạn muốn hỏi gì về tài liệu của mình?';
        $('#nb-q').setAttribute('aria-label', tutor ? 'Đề bài hoặc câu hỏi cho Gia sư' : 'Câu hỏi về tài liệu');
        $('#nb-q').maxLength = tutor ? 10000 : 1000;
        $('#nb-q').value = state.drafts[mode];
        $('#nb-composer-hint').textContent = tutor ? 'Enter để gửi · Shift+Enter xuống dòng' : 'Hỏi đáp dựa trên nguồn của bạn';
        syncTutorStyle();
        syncTutorTask();
    }

    function syncTutorTask() {
        const work = state.chatMode === 'tutor' && state.tutorTask !== 'solve';
        pane.querySelectorAll('[data-tutor-task]').forEach(button => {
            const selected = button.dataset.tutorTask === state.tutorTask;
            button.setAttribute('aria-checked', String(selected)); button.tabIndex = selected ? 0 : -1;
        });
        $('#nb-tutor-work').hidden = !work;
        $('.nb-composer').hidden = work;
        $('.nb-tutor-style[aria-label="Cách giải"]').hidden = work;
        $('#nb-tutor-messages').hidden = state.chatMode !== 'tutor' || work;
        const practice = state.tutorTask === 'practice';
        ['#nb-submission-field', '#nb-check-help', '[data-act="tutor-check"]', '#nb-work-messages'].forEach(sel => { $(sel).hidden = practice; });
        $('#nb-practice-controls').hidden = !practice; $('#nb-practice-messages').hidden = !practice;
        syncWorkButtons();
    }

    function syncWorkButtons() {
        const level = state.work.hints.length;
        const blocked = chatPending;
        $('[data-act="send"]').disabled = chatPending || (state.chatMode === 'tutor' && blocked);
        $('[data-act="tutor-check"]').disabled = blocked;
        $('[data-act="tutor-hint"]').disabled = blocked || level >= 3 || state.work.revealed;
        $('[data-act="tutor-solution"]').disabled = blocked || state.work.revealed;
        $('#nb-hint-progress').textContent = state.work.revealed ? 'Đã mở lời giải. Đổi đề hoặc chọn Bài mới để tự luyện tiếp.' : `Đã mở ${level}/3 mức gợi ý.`;
        $('[data-act="tutor-hint"]').textContent = level >= 3 ? 'Đã mở đủ gợi ý' : `Gợi ý tiếp · Mức ${level + 1}`;
    }

    function syncTutorStyle() {
        pane.querySelectorAll('[data-tutor-style]').forEach(button => {
            const selected = button.dataset.tutorStyle === state.tutorStyle;
            button.setAttribute('aria-checked', String(selected)); button.tabIndex = selected ? 0 : -1;
        });
    }

    function tutorContext() {
        const turns = state.tutorHistory;
        const history = turns.length > 12 ? [turns[0], ...turns.slice(-11)] : [...turns];
        while (history.length > 1 && history.reduce((length, turn) => length + turn.text.length, 0) > 40000) history.splice(1, 1);
        return history;
    }

    function renderSources() {
        const el = $('#nb-source-list'); if (!el) return;
        el.innerHTML = state.sources.length
            ? state.sources.map((s, i) => `<div class="nb-source"><span class="nb-src-n">${i + 1}</span>
                <i class="fas ${s.type === 'image' ? 'fa-file-image' : s.type === 'pdf' ? 'fa-file-pdf' : s.type === 'url' ? 'fa-link' : 'fa-file-alt'}"></i>
                <span class="nb-src-t" title="${esc(s.title)}">${esc(s.title)}</span>
                <button class="nb-icon-btn" data-act="src-del" data-id="${s.id}" title="Xóa nguồn" aria-label="Xóa nguồn ${esc(s.title)}"><i class="fas fa-times" aria-hidden="true"></i></button></div>`).join('')
            : '<div class="nb-source-empty"><i class="far fa-file-alt" aria-hidden="true"></i><strong>Chưa có tài liệu</strong><p>Thêm tệp, trang web hoặc văn bản để bắt đầu khám phá kiến thức.</p><button type="button" class="nb-empty-add" data-ui-act="open-source-dialog">Thêm nguồn đầu tiên</button></div>';
        pane.querySelectorAll('[data-source-count]').forEach(count => { count.textContent = state.sources.length; });
        const tutorHelp = $('#nb-tutor-help');
        if (tutorHelp) tutorHelp.textContent = state.sources.length
            ? `Gia sư đọc ${state.sources.length} nguồn trong sổ tay này. Bạn có thể hỏi “Giải câu 1” hoặc nhập đề khác.`
            : 'Nhập đề bài trực tiếp hoặc thêm ảnh/tài liệu vào nguồn; Theo nguồn và Gia sư cùng đọc được.';
        pane.dispatchEvent(new Event('ms-notebook-sources-rendered'));
    }
    function renderNotes() {
        const el = $('#nb-notes'); if (!el) return;
        el.innerHTML = state.notes.length
            ? state.notes.map(n => `<div class="nb-note"><span data-act="note-open" data-id="${n.id}" title="${esc(n.title)}">${esc(n.title)}</span>
                <button class="nb-icon-btn" data-act="note-del" data-id="${n.id}"><i class="fas fa-trash-alt"></i></button></div>`).join('')
            : '<div class="nb-muted">Chưa có ghi chú. Lưu câu trả lời hoặc tài liệu từ Studio.</div>';
    }

    // ---------- dữ liệu ----------
    function resetWorkspace() {
        workspaceVersion++;
        notebookRequest++;
        chatPending = false; studioPending = false;
        stopAudio();
        Object.assign(state, emptyState());
        renderMain();
    }

    async function loadNotebook(id) {
        const version = workspaceVersion;
        const request = ++notebookRequest;
        const notebook = state.notebooks.find(n => n.id === Number(id)) || null;
        if (!notebook) return false;
        const [sources, notes] = await Promise.all([api.nbSources(notebook.id), api.nbNotes(notebook.id)]);
        if (version !== workspaceVersion || request !== notebookRequest || !auth.isLoggedIn()) return false;
        state.nb = notebook;
        workspaceVersion++;
        chatPending = false; studioPending = false;
        state.history = [];
        state.tutorHistory = [];
        state.work = emptyWork(); workVersion++;
        state.drafts = {source: '', tutor: ''};
        state.sources = sources;
        state.notes = notes;
        return true;
    }

    async function start() {
        const version = workspaceVersion;
        if (!auth.isLoggedIn()) {
            resetWorkspace();
            return;
        }
        try {
            let notebooks = await api.nbList();
            if (version !== workspaceVersion || !auth.isLoggedIn()) return;
            if (!notebooks.length) notebooks = [await api.nbCreate('Sổ tay đầu tiên')];
            if (version !== workspaceVersion || !auth.isLoggedIn()) return;
            state.notebooks = notebooks;
            if (!await loadNotebook(state.nb ? state.nb.id : notebooks[0].id)) return;
            renderMain();
        } catch (e) {
            if (version !== workspaceVersion) return;
            if (e.message?.includes('401') || e.message?.includes('hết hạn')) {
                resetWorkspace();
            } else {
                window.MindSprintDialogs.alert(e.message || 'Có lỗi xảy ra');
            }
        }
    }
    async function refreshSources() {
        const version = workspaceVersion, id = state.nb.id;
        const sources = await api.nbSources(id);
        if (version === workspaceVersion && state.nb?.id === id) {
            const removed = state.sources.some(previous => !sources.some(source => source.id === previous.id));
            if (!removed) { state.sources = sources; renderSources(); return; }
            state.drafts[state.chatMode] = $('#nb-q').value;
            workspaceVersion++; workVersion++; chatPending = false; studioPending = false;
            state.sources = sources; state.history = []; state.tutorHistory = [];
            state.work.hints = []; state.work.revealed = false;
            state.lastText = null; state.lastCards = null; state.quiz = null; state.audio = null;
            stopAudio(); renderMain();
        }
    }
    async function refreshNotes() {
        const version = workspaceVersion, id = state.nb.id;
        const notes = await api.nbNotes(id);
        if (version === workspaceVersion && state.nb?.id === id) { state.notes = notes; renderNotes(); }
    }

    // ---------- chat ----------
    function addMsg(role, html, mode = 'source') {
        const box = $(mode === 'practice' ? '#nb-practice-messages' : mode === 'work' ? '#nb-work-messages' : mode === 'tutor' ? '#nb-tutor-messages' : '#nb-messages');
        if (box.querySelector('.nb-muted') && box.children.length === 1) box.innerHTML = '';
        const d = document.createElement('div'); d.className = 'nb-msg ' + (role === 'user' ? 'user' : 'bot'); d.innerHTML = html;
        box.appendChild(d); box.scrollTop = box.scrollHeight; return d;
    }
    async function sendQuestion(q, btn, mode = state.chatMode, style = state.tutorStyle) {
        if (chatPending) return;
        if (!ensureLoggedIn() || !state.nb) return;
        q = (q || '').trim(); if (!q) return;
        if (mode === 'source' && !state.sources.length) return window.MindSprintDialogs.alert('Hãy thêm ít nhất một nguồn trước.');
        const version = workspaceVersion, notebookId = state.nb.id;
        chatPending = true;
        $('#nb-q').value = '';
        state.drafts[mode] = '';
        addMsg('user', md(q), mode);
        const wait = addMsg('bot', `<span class="nb-muted" role="status"><span class="nb-loading-dots" aria-hidden="true"><i></i><i></i><i></i></span> ${mode === 'tutor' ? 'Gia sư đang tìm cách giải…' : 'Đang đọc nguồn...'}</span>`, mode);
        busy(btn, true);
        busy($('[data-act="send"]'), true);
        busy($('#nb-q'), true);
        pane.querySelectorAll('[data-chat-mode], [data-tutor-style], [data-tutor-task], [data-act="tutor-new"]').forEach(button => busy(button, true));
        syncWorkButtons();
        try {
            const r = mode === 'tutor'
                ? await api.nbTutor(notebookId, q, style, tutorContext())
                : await api.nbChat(notebookId, q, state.history);
            if (version !== workspaceVersion || state.nb?.id !== notebookId) return;
            const history = mode === 'tutor' ? state.tutorHistory : state.history;
            history.push({ role: 'user', text: q }, { role: 'assistant', text: r.answer });
            if (mode === 'tutor' && history.length > 48) state.tutorHistory = [history[0], ...history.slice(-47)];
            wait.innerHTML = md(r.answer) +
                `<button class="nb-icon-btn" data-act="save-answer" style="margin-top:var(--space-sm)"><i class="fas fa-bookmark"></i> Lưu ghi chú</button>`;
            wait.dataset.raw = r.answer; wait.dataset.q = q;
        } catch (e) {
            if (version !== workspaceVersion || state.nb?.id !== notebookId) return;
            wait.innerHTML = `<div class="nb-ai-error" role="status">${aiError(e)}
                <button class="btn btn-secondary" data-act="retry-chat" data-q="${esc(q)}" data-mode="${esc(mode)}" data-style="${esc(style)}">Thử lại câu hỏi</button></div>`;
        } finally {
            if (version === workspaceVersion) {
                chatPending = false; busy(btn, false);
                busy($('[data-act="send"]'), false); busy($('#nb-q'), false);
                pane.querySelectorAll('[data-chat-mode], [data-tutor-style], [data-tutor-task], [data-act="tutor-new"]').forEach(button => busy(button, false));
                syncWorkButtons();
            }
        }
    }

    async function sendTutorWork(action) {
        if (chatPending || !ensureLoggedIn() || !state.nb) return;
        const question = state.work.question.trim(), submission = state.work.submission.trim();
        if (!question || (action === 'check' && !submission)) return window.MindSprintDialogs.alert(action === 'check' ? 'Hãy nhập đề bài và bài làm riêng trước khi kiểm tra.' : 'Hãy nhập đề bài cần tự luyện.');
        if (action === 'hint' && (state.work.hints.length >= 3 || state.work.revealed)) return;
        if (action === 'solution' && state.work.revealed) return;
        const version = workspaceVersion, revision = workVersion, id = state.nb.id;
        chatPending = true;
        const controls = '[data-chat-mode], [data-tutor-task], [data-tutor-style], [data-act="tutor-new"], [data-act="tutor-check"], [data-act="tutor-hint"], [data-act="tutor-solution"]';
        pane.querySelectorAll(controls).forEach(button => busy(button, true));
        syncWorkButtons();
        const hintLevel = state.work.hints.length + 1;
        const label = action === 'check' ? 'Nhận xét bài làm' : action === 'hint' ? 'Gợi ý mức ' + hintLevel : 'Lời giải đầy đủ';
        const wait = addMsg('bot', `<span role="status">Đang chuẩn bị ${label.toLowerCase()}…</span>`, action === 'check' ? 'work' : 'practice');
        try {
            const payload = action === 'check' ? {question, action, submission} : action === 'hint'
                ? {question, action, hintLevel, history: state.work.hints.map(text => ({role: 'assistant', text}))} : {question, action, style: state.tutorStyle};
            const reply = await api.nbTutorWork(id, payload);
            if (version !== workspaceVersion || revision !== workVersion || state.nb?.id !== id) return;
            const feedback = reply.feedback;
            const labels = {correct: 'Bài làm đúng', incorrect: 'Cần sửa bài làm', incomplete: 'Bài làm chưa hoàn chỉnh', needs_clarification: 'Cần làm rõ đề'};
            const types = {calculation: 'Tính toán', reasoning: 'Lập luận / phương pháp', missing_step: 'Thiếu bước'};
            const text = action === 'check' ? `### ${labels[feedback.status]}\n\n${feedback.firstErrorStep ? 'Bước cần xem lại: ' + feedback.firstErrorStep + '\n\n' : ''}${types[feedback.errorType] ? 'Loại lỗi: ' + types[feedback.errorType] + '\n\n' : ''}**Lý do:** ${feedback.reason}\n\n**Hướng tiếp theo:** ${feedback.suggestion}\n\n${reply.answer}` : `### ${reply.needsClarification ? 'Cần làm rõ đề' : label}\n\n${reply.answer}`;
            if (action === 'hint' && !reply.needsClarification) state.work.hints.push(reply.answer);
            if (action === 'solution' && !reply.needsClarification) state.work.revealed = true;
            wait.innerHTML = md(text) + '<button type="button" class="nb-icon-btn" data-act="save-answer">Lưu ghi chú</button>';
            wait.dataset.raw = `Đề bài: ${question}\n\n${action === 'check' ? 'Bài làm: ' + submission + '\n\n' : ''}${text}`; wait.dataset.q = label + ': ' + question;
        } catch (error) {
            if (version !== workspaceVersion || revision !== workVersion) return;
            wait.innerHTML = `<div class="nb-ai-error" role="status">${aiError(error)}<p>Đề và bài làm được giữ nguyên. Bạn có thể bấm lại để thử tiếp.</p></div>`;
        } finally {
            if (version === workspaceVersion) {
                chatPending = false;
                pane.querySelectorAll(controls).forEach(button => busy(button, false));
                syncWorkButtons();
            }
        }
    }

    // ---------- Studio ----------
    async function generate(type, btn) {
        if (studioPending || !ensureLoggedIn() || !state.nb) return;
        if (!state.sources.length) return window.MindSprintDialogs.alert('Hãy thêm ít nhất một nguồn trước.');
        stopAudio();
        const version = workspaceVersion, notebookId = state.nb.id;
        const out = $('#nb-out'), status = $('#nb-studio-status');
        const previous = { lastText: state.lastText, lastCards: state.lastCards, lastTitle: state.lastTitle, quiz: state.quiz, audio: state.audio };
        status.hidden = false;
        status.className = 'nb-muted';
        status.innerHTML = '<span class="nb-loading-dots" aria-hidden="true"><i></i><i></i><i></i></span> AI đang tạo, tự thử lại nếu dịch vụ bận...';
        studioPending = true;
        pane.querySelectorAll('[data-gen], [data-act="retry-generate"]').forEach(button => busy(button, true));
        try {
            const r = await api.nbGenerate(notebookId, type, $('#nb-focus').value.trim(), 10);
            if (version !== workspaceVersion || state.nb?.id !== notebookId) return;
            status.hidden = true;
            state.lastText = null; state.lastCards = null;
            const label = btn.textContent.trim();
            if (!r.isJson) {
                state.lastText = r.content; state.lastTitle = label;
                out.innerHTML = md(r.content) + saveBtn();
            } else if (type === 'timeline') {
                out.innerHTML = `<div class="nb-tl">${r.content.map(e => `<div><strong>${esc(e.when)}</strong><br>${esc(e.event)}</div>`).join('')}</div>`;
            } else if (type === 'mindmap') {
                out.innerHTML = `<div class="nb-tree"><details open><summary><strong>${esc(r.content.title)}</strong></summary>${tree(r.content.children)}</details></div>`;
            } else if (type === 'flashcards') {
                state.lastCards = r.content;
                out.innerHTML = r.content.map(c => `<div class="nb-card"><strong>${esc(c.question)}</strong><br>${esc(c.answer)}${c.example ? `<br><span class="nb-muted">${esc(c.example)}</span>` : ''}</div>`).join('') +
                    `<button class="btn btn-primary" data-act="save-cards"><i class="fas fa-save"></i> Lưu vào Thư viện thẻ</button>`;
            } else if (type === 'quiz') {
                state.quiz = { items: r.content, score: 0, done: 0 };
                out.innerHTML = quizHtml();
            } else if (type === 'audio') {
                state.audio = r.content;
                out.innerHTML = `<div class="nb-row" style="margin-bottom:var(--space-sm)"><button class="btn btn-primary" data-act="audio-play"><i class="fas fa-play"></i> Phát</button>
                    <button class="btn btn-secondary" data-act="audio-stop"><i class="fas fa-stop"></i> Dừng</button></div>` +
                    r.content.map((l, i) => `<div class="nb-audio-line" id="nb-al-${i}"><strong>${l.speaker === 'B' ? 'B' : 'A'}:</strong> ${esc(l.text)}</div>`).join('') +
                    `<p class="nb-muted">Dùng giọng đọc có sẵn của trình duyệt (Web Speech).</p>`;
            }
        } catch (e) {
            if (version !== workspaceVersion || state.nb?.id !== notebookId) return;
            Object.assign(state, previous);
            status.hidden = false;
            status.className = 'nb-ai-error';
            status.innerHTML = aiError(e) + `<button class="btn btn-secondary" data-act="retry-generate" data-type="${esc(type)}">Thử lại</button>`;
        } finally {
            if (version === workspaceVersion) {
                studioPending = false;
                pane.querySelectorAll('[data-gen], [data-act="retry-generate"]').forEach(button => busy(button, false));
            }
        }
    }
    const saveBtn = () => `<button class="nb-icon-btn" data-act="save-text"><i class="fas fa-bookmark"></i> Lưu ghi chú</button>`;
    function tree(nodes) {
        if (!nodes || !nodes.length) return '';
        return '<ul>' + nodes.map(n => n.children && n.children.length
            ? `<li><details open><summary>${esc(n.title)}</summary>${tree(n.children)}</details></li>` : `<li>${esc(n.title)}</li>`).join('') + '</ul>';
    }
    function quizHtml() {
        const q = state.quiz;
        return q.items.map((it, i) => `<div class="nb-card" data-qi="${i}"><strong>${i + 1}. ${esc(it.question)}</strong>` +
            it.options.map((o, j) => `<button class="nb-opt" data-act="quiz-pick" data-q="${i}" data-o="${j}">${esc(o)}</button>`).join('') +
            `<div class="nb-muted" data-exp="${i}"></div></div>`).join('') + `<div id="nb-quiz-score" class="nb-muted"></div>`;
    }
    function pickAnswer(btn) {
        const i = +btn.dataset.q, j = +btn.dataset.o, it = state.quiz.items[i];
        const card = btn.closest('.nb-card'); if (card.dataset.done) return; card.dataset.done = '1';
        card.querySelectorAll('.nb-opt').forEach((b, k) => { b.disabled = true; if (k === it.correctIndex) b.classList.add('ok'); else if (k === j) b.classList.add('bad'); });
        card.querySelector('[data-exp]').textContent = it.explanation || '';
        state.quiz.done++; if (j === it.correctIndex) state.quiz.score++;
        if (state.quiz.done === state.quiz.items.length) $('#nb-quiz-score').innerHTML = `<strong>Kết quả: ${state.quiz.score}/${state.quiz.items.length}</strong>`;
    }

    // ---------- Audio overview ----------
    function stopAudio() { if ('speechSynthesis' in window) speechSynthesis.cancel(); document.querySelectorAll('.nb-audio-line.on').forEach(e => e.classList.remove('on')); }
    function playAudio() {
        if (!('speechSynthesis' in window)) return window.MindSprintDialogs.alert('Trình duyệt không hỗ trợ đọc giọng nói.');
        stopAudio();
        const vi = speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith('vi'));
        (state.audio || []).forEach((l, i) => {
            const u = new SpeechSynthesisUtterance(l.text);
            u.lang = 'vi-VN'; u.rate = 1;
            const b = l.speaker === 'B';
            if (vi.length) u.voice = vi[b && vi.length > 1 ? 1 : 0];
            u.pitch = b ? 1.3 : 0.9;
            u.onstart = () => { document.querySelectorAll('.nb-audio-line.on').forEach(e => e.classList.remove('on')); const el = document.getElementById('nb-al-' + i); if (el) { el.classList.add('on'); el.scrollIntoView({ block: 'nearest' }); } };
            speechSynthesis.speak(u);
        });
    }

    // ---------- sự kiện (ủy quyền) ----------
    pane.addEventListener('click', async (e) => {
        const modeButton = e.target.closest('[data-chat-mode]');
        if (modeButton) return setChatMode(modeButton.dataset.chatMode);
        const taskButton = e.target.closest('[data-tutor-task]');
        if (taskButton && !chatPending) { state.tutorTask = taskButton.dataset.tutorTask; syncTutorTask(); return; }
        const styleButton = e.target.closest('[data-tutor-style]');
        if (styleButton && !chatPending) { state.tutorStyle = styleButton.dataset.tutorStyle; syncTutorStyle(); return; }
        const gen = e.target.closest('[data-gen]');
        const el = e.target.closest('[data-act]');
        if (!gen && !el) return;
        if (!ensureLoggedIn()) return;
        if (gen) return generate(gen.dataset.gen, gen);
        const act = el.dataset.act;
        if (act !== 'nb-new' && !state.nb) return;
        if (act === 'retry-chat') return sendQuestion(el.dataset.q, el, el.dataset.mode || 'source', el.dataset.style || state.tutorStyle);
        if (act === 'tutor-check') return sendTutorWork('check');
        if (act === 'tutor-hint') return sendTutorWork('hint');
        if (act === 'tutor-solution') return sendTutorWork('solution');
        if (act === 'tutor-new') {
            if (chatPending) return;
            const version = workspaceVersion;
            if ((state.tutorHistory.length || state.work.question) && !await window.MindSprintDialogs.confirm('Bắt đầu bài mới sẽ xóa hội thoại Gia sư đang hiển thị. Ghi chú đã lưu vẫn được giữ.', {title: 'Bắt đầu bài mới', confirmText: 'Bài mới'})) return;
            if (version !== workspaceVersion) return;
            state.tutorHistory = []; state.drafts.tutor = '';
            state.work = emptyWork(); workVersion++;
            $('#nb-problem').value = ''; $('#nb-submission').value = ''; $('#nb-work-messages').replaceChildren();
            $('#nb-practice-messages').replaceChildren(); syncWorkButtons();
            $('#nb-tutor-messages').replaceChildren(); $('#nb-q').value = ''; $('#nb-q').focus();
            return;
        }
        if (act === 'retry-generate') return generate(el.dataset.type, pane.querySelector(`[data-gen="${el.dataset.type}"]`));
        if (act === 'nb-new') {
            const version = workspaceVersion;
            return window.MindSprintDialogs.prompt('Tên sổ tay', {
                title: 'Tạo sổ tay mới', placeholder: 'Ví dụ: Đại số tuyến tính',
                confirmText: 'Tạo sổ tay', loadingText: 'Đang tạo…',
                onSubmit: async title => {
                    if (version !== workspaceVersion || !auth.isLoggedIn()) throw new Error('Sổ tay đang mở đã thay đổi. Vui lòng mở lại hộp tạo sổ tay.');
                    const n = await api.nbCreate(title);
                    if (version !== workspaceVersion || !auth.isLoggedIn()) return;
                    state.notebooks.unshift(n); await loadNotebook(n.id); renderMain();
                }
            });
        }
        if (act === 'nb-del') {
            const version = workspaceVersion;
            if (!state.nb || !await window.MindSprintDialogs.confirm(`Xóa sổ tay "${state.nb.title}" và toàn bộ nguồn, ghi chú?`, {title: 'Xóa sổ tay', confirmText: 'Xóa sổ tay'})) return;
            if (version !== workspaceVersion || !auth.isLoggedIn()) return;
            return run(el, async () => { await api.nbDelete(state.nb.id); state.notebooks = state.notebooks.filter(n => n.id !== state.nb.id); state.nb = null; await start(); });
        }
        if (act === 'add-text') {
            const title = $('#nb-txt-title').value.trim(), text = $('#nb-txt-body').value.trim();
            if (text.length < 20) return window.MindSprintDialogs.alert('Nội dung quá ngắn (tối thiểu 20 ký tự).');
            return run(el, async () => { await api.nbAddText(state.nb.id, title, text); $('#nb-txt-body').value = ''; $('#nb-txt-title').value = ''; await refreshSources(); });
        }
        if (act === 'add-file') {
            if (!validateFile()) { $('[data-ui-act="pick-source-file"]').focus(); return; }
            const f = $('#nb-file').files[0];
            const version = workspaceVersion, id = state.nb.id;
            return run(el, async () => {
                await api.nbAddFile(id, f);
                if (version !== workspaceVersion || state.nb?.id !== id) return;
                $('#nb-file').value = ''; showFileFeedback(''); await refreshSources();
                $('#nb-add-source-dialog').close();
                $('#nb-source-add').focus();
            });
        }
        if (act === 'add-url') {
            if (!validateUrl()) { $('#nb-url').focus(); return; }
            const u = $('#nb-url').value.trim();
            return run(el, async () => { await api.nbAddUrl(state.nb.id, u); $('#nb-url').value = ''; await refreshSources(); showUrlFeedback('Đã thêm nguồn từ URL.'); });
        }
        if (act === 'src-del') return run(el, async () => { await api.nbDeleteSource(state.nb.id, el.dataset.id); await refreshSources(); });
        if (act === 'send') return sendQuestion($('#nb-q').value, el);
        if (act === 'suggest') {
            if (!state.sources.length) return window.MindSprintDialogs.alert('Hãy thêm ít nhất một nguồn trước.');
            return run(el, async () => {
                const qs = await api.nbSuggestions(state.nb.id);
                $('#nb-suggest').innerHTML = qs.map(q => `<button class="nb-chip" title="${esc(q)}" data-act="ask" data-q="${esc(q)}">${esc(q)}</button>`).join('');
            });
        }
        if (act === 'ask') return sendQuestion(el.dataset.q, el);
        if (act === 'save-answer') {
            const m = el.closest('.nb-msg');
            return run(el, async () => { await api.nbAddNote(state.nb.id, m.dataset.q.slice(0, 80), m.dataset.raw); await refreshNotes(); });
        }
        if (act === 'save-text') return run(el, async () => { await api.nbAddNote(state.nb.id, state.lastTitle, state.lastText); await refreshNotes(); });
        if (act === 'save-cards') return run(el, async () => {
            const r = await api.nbSaveCards(state.nb.id, state.lastCards);
            window.dispatchEvent(new Event('ms-library-changed'));
            window.MindSprintDialogs.alert(`Đã lưu ${r.saved} thẻ vào Thư viện (chủ đề "${state.nb.title}").`, {title: 'Đã lưu thẻ', tone: 'success'});
        });
        if (act === 'quiz-pick') return pickAnswer(el);
        if (act === 'audio-play') return playAudio();
        if (act === 'audio-stop') return stopAudio();
        if (act === 'note-open') {
            const n = state.notes.find(x => x.id === +el.dataset.id);
            if (n && state.chatMode === 'tutor') {
                const view = $('#nb-tutor-note');
                view.innerHTML = `<button type="button" class="nb-chip" data-act="note-close">Đóng ghi chú</button><h4>${esc(n.title)}</h4>` + md(n.content);
                view.hidden = false;
            } else if (n) $('#nb-out').innerHTML = `<h4>${esc(n.title)}</h4>` + md(n.content);
        }
        if (act === 'note-close') $('#nb-tutor-note').hidden = true;
        if (act === 'note-del') return run(el, async () => { await api.nbDeleteNote(state.nb.id, el.dataset.id); await refreshNotes(); });
    });

    pane.addEventListener('change', (e) => {
        if (e.target.id === 'nb-file') validateFile();
        if (e.target.id === 'nb-select' && e.target.value && ensureLoggedIn()) run(null, async () => { stopAudio(); await loadNotebook(e.target.value); renderMain(); });
    });
    pane.addEventListener('input', (e) => {
        if (e.target.id === 'nb-url') validateUrl();
        if (!['nb-problem', 'nb-submission'].includes(e.target.id)) return;
        workVersion++;
        if (e.target.id === 'nb-problem') {
            state.work = {...emptyWork(), question: e.target.value, submission: state.work.submission};
            $('#nb-practice-messages').replaceChildren(); syncWorkButtons();
        } else state.work.submission = e.target.value;
        $('#nb-work-messages').replaceChildren();
    });
pane.addEventListener('keydown', (e) => {
        const radio = e.target.closest('[data-chat-mode], [data-tutor-style], [data-tutor-task]');
        if (radio && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
            e.preventDefault();
            if (chatPending) return;
            const buttons = [...radio.parentElement.querySelectorAll('[role="radio"]')];
            const index = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length - 1 : (buttons.indexOf(radio) + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
            buttons[index].click(); buttons[index].focus();
        }
        if (e.target.id === 'nb-q' && e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); sendQuestion(e.target.value, pane.querySelector('[data-act="send"]')); }
    });

    // ---------- auth change listener ----------
    renderMain();
    auth.onAuthChange((user) => {
        resetWorkspace();
        if (user) {
            return start();
        }
    });
})();
