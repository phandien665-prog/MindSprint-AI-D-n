// Display-only workspace chrome; existing authentication and tab actions own data.
(function () {
    const search = document.getElementById('workspace-search');
    const results = document.getElementById('workspace-search-results');
    const auth = window.MindSprintAuth;
    if (!search || !results || !auth) return;

    const account = document.getElementById('header-account');
    const accountWrapper = document.getElementById('header-account-wrapper');
    const accountMenu = document.getElementById('header-account-menu');
    const avatar = document.getElementById('header-avatar');
    const avatarFile = document.getElementById('header-avatar-file');
    const changeAvatar = document.getElementById('header-change-avatar');
    const resetAvatar = document.getElementById('header-reset-avatar');
    const avatarStatus = document.getElementById('header-avatar-status');
    let avatarRevision = 0;

    function avatarKey(user) {
        return user?.id != null ? `ms-account:${user.id}:avatar` : null;
    }
    function readAvatar(user) {
        try {
            const value = localStorage.getItem(avatarKey(user));
            // Only our resized raster images are rendered; never accept SVG or remote URLs.
            return value?.length < 300000 && /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(value) ? value : null;
        } catch { return null; }
    }
    function renderAvatar(user) {
        const name = user?.displayName || user?.email || 'Khách';
        const imageData = user ? readAvatar(user) : null;
        avatar.replaceChildren();
        if (imageData) {
            const image = document.createElement('img');
            image.alt = '';
            image.src = imageData;
            image.addEventListener('error', () => {
                if (avatar.contains(image)) avatar.textContent = Array.from(name.trim())[0]?.toLocaleUpperCase('vi') || 'K';
            }, {once: true});
            avatar.append(image);
        } else {
            avatar.textContent = Array.from(name.trim())[0]?.toLocaleUpperCase('vi') || 'K';
        }
        resetAvatar.hidden = !imageData;
    }
    function closeAccountMenu(restoreFocus = false) {
        accountMenu.hidden = true;
        account.setAttribute('aria-expanded', 'false');
        if (restoreFocus) account.focus();
    }
    function showAvatarStatus(message) {
        avatarStatus.textContent = message;
        avatarStatus.hidden = !message;
    }
    function renderHeaderUser(user) {
        closeSearch();
        closeAccountMenu();
        avatarRevision++;
        avatarFile.value = '';
        changeAvatar.disabled = false;
        resetAvatar.disabled = false;
        showAvatarStatus('');
        const name = user?.displayName || user?.email || 'Khách';
        document.getElementById('header-user-name').textContent = name;
        document.getElementById('header-user-email').textContent = user?.email || 'Đăng nhập để lưu tiến độ';
        renderAvatar(user);
        account.setAttribute('aria-label', user ? 'Tùy chọn tài khoản của ' + name : 'Đăng nhập');
    }
    renderHeaderUser(auth.getCurrentUser());
    auth.onAuthChange(renderHeaderUser);
    auth.ready.then(() => renderHeaderUser(auth.getCurrentUser()));

    account.addEventListener('click', () => {
        if (!auth.isLoggedIn()) { auth.renderAuthModal(); return; }
        if (!accountMenu.hidden) { closeAccountMenu(); return; }
        closeSearch();
        accountMenu.hidden = false;
        account.setAttribute('aria-expanded', 'true');
        changeAvatar.focus();
    });
    document.addEventListener('click', event => {
        if (!accountWrapper.contains(event.target)) closeAccountMenu();
    });
    document.addEventListener('focusin', event => {
        if (!accountWrapper.contains(event.target)) closeAccountMenu();
    });
    accountWrapper.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !accountMenu.hidden) {
            event.preventDefault();
            closeAccountMenu(true);
        }
    });
    document.getElementById('header-logout').addEventListener('click', async () => {
        closeAccountMenu(true);
        await auth.logout();
    });
    changeAvatar.addEventListener('click', () => {
        avatarFile.value = '';
        avatarFile.click();
    });
    resetAvatar.addEventListener('click', () => {
        const user = auth.getCurrentUser();
        if (!auth.isLoggedIn() || !avatarKey(user)) return;
        try {
            localStorage.removeItem(avatarKey(user));
            renderAvatar(user);
            showAvatarStatus('Đã dùng ảnh đại diện mặc định.');
            changeAvatar.focus();
        } catch { showAvatarStatus('Không thể lưu thay đổi. Hãy kiểm tra dung lượng hoặc quyền lưu trữ của trình duyệt.'); }
    });
    avatarFile.addEventListener('change', async () => {
        const file = avatarFile.files?.[0];
        const user = auth.getCurrentUser();
        const key = avatarKey(user);
        if (!file || !auth.isLoggedIn() || !key) return;
        const revision = ++avatarRevision;
        const isCurrent = () => revision === avatarRevision && auth.isLoggedIn() && key === avatarKey(auth.getCurrentUser());
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            showAvatarStatus('Vui lòng chọn ảnh JPG, PNG hoặc WebP.');
            avatarFile.value = '';
            return;
        }
        if (!file.size || file.size > 5 * 1024 * 1024) {
            showAvatarStatus('Ảnh phải có dung lượng từ 1 byte đến 5 MB.');
            avatarFile.value = '';
            return;
        }
        changeAvatar.disabled = true;
        resetAvatar.disabled = true;
        showAvatarStatus('Đang xử lý ảnh đại diện…');
        let objectUrl;
        try {
            objectUrl = URL.createObjectURL(file);
            const image = new Image();
            image.src = objectUrl;
            await image.decode();
            if (!isCurrent()) return;
            if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 20000000) {
                throw new Error('Ảnh quá lớn. Vui lòng chọn ảnh dưới 20 megapixel.');
            }
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = 256;
            const context = canvas.getContext('2d');
            context.fillStyle = '#FFFFFF';
            context.fillRect(0, 0, 256, 256);
            const side = Math.min(image.naturalWidth, image.naturalHeight);
            context.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, 0, 0, 256, 256);
            localStorage.setItem(key, canvas.toDataURL('image/jpeg', .85));
            renderAvatar(user);
            showAvatarStatus('Đã đổi ảnh đại diện.');
        } catch (error) {
            if (isCurrent()) showAvatarStatus(error.name === 'QuotaExceededError' || error.name === 'SecurityError'
                ? 'Không thể lưu ảnh. Hãy kiểm tra dung lượng hoặc quyền lưu trữ của trình duyệt.'
                : error.message.startsWith('Ảnh quá lớn') ? error.message : 'Không đọc được ảnh này. Vui lòng chọn một ảnh khác.');
        } finally {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            if (isCurrent()) {
                changeAvatar.disabled = false;
                resetAvatar.disabled = false;
                avatarFile.value = '';
            }
        }
    });
    document.getElementById('header-mail').addEventListener('click', () => document.querySelector('.sidebar [data-tab=notebook]').click());
    document.getElementById('header-notifications').addEventListener('click', () => document.querySelector('.sidebar [data-tab=timetable]').click());
    const notebookPane = document.getElementById('tab-content-notebook');
    const compactSources = matchMedia('(max-width: 1100px)');
    let sourcesCollapsed = compactSources.matches;
    let sourceDialogTrigger = null;

    function syncSourcePanel() {
        const layout = notebookPane.querySelector('.nb-layout');
        const sources = notebookPane.querySelector('.nb-sources');
        if (!layout || !sources) return;
        layout.classList.toggle('is-sources-collapsed', sourcesCollapsed);
        sources.classList.toggle('is-expanded', !sourcesCollapsed);
        sources.querySelectorAll('.nb-source-toggle').forEach(button => {
            button.setAttribute('aria-expanded', String(!sourcesCollapsed));
        });
    }
    function selectSourceMethod(kind, focusField = false) {
        const dialog = document.getElementById('nb-add-source-dialog');
        if (!dialog || !['file', 'url', 'text'].includes(kind)) return;
        for (const method of ['file', 'url', 'text']) {
            const selected = method === kind;
            const tab = dialog.querySelector('#nb-method-' + method);
            tab.setAttribute('aria-selected', String(selected));
            tab.tabIndex = selected ? 0 : -1;
            dialog.querySelector('#nb-panel-' + method).hidden = !selected;
        }
        if (focusField) dialog.querySelector(kind === 'file' ? '[data-ui-act="pick-source-file"]' : kind === 'url' ? '#nb-url' : '#nb-txt-body').focus();
    }
    function openSourceDialog(kind = 'file', trigger) {
        if (!auth.isLoggedIn()) { auth.renderAuthModal(); return; }
        const dialog = document.getElementById('nb-add-source-dialog');
        if (!dialog) return;
        if (!dialog.dataset.uiBound) {
            dialog.dataset.uiBound = 'true';
            dialog.addEventListener('close', () => {
                if (sourceDialogTrigger?.isConnected && sourceDialogTrigger.getClientRects().length) sourceDialogTrigger.focus();
                sourceDialogTrigger = null;
            });
            dialog.addEventListener('click', event => {
                if (event.target !== dialog) return;
                const bounds = dialog.getBoundingClientRect();
                if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
            });
        }
        if (!dialog.open) { sourceDialogTrigger = trigger; dialog.showModal(); }
        selectSourceMethod(kind, true);
    }
    syncSourcePanel();
    notebookPane.addEventListener('ms-notebook-rendered', syncSourcePanel);
    compactSources.addEventListener('change', event => { sourcesCollapsed = event.matches; syncSourcePanel(); });
    document.querySelector('.sidebar').addEventListener('click', event => {
        if (event.target.closest('[data-tab]')?.dataset.tab !== 'notebook') document.getElementById('nb-add-source-dialog')?.close();
    });
    notebookPane.addEventListener('click', event => {
        const action = event.target.closest('[data-ui-act]')?.dataset.uiAct;
        const trigger = event.target.closest('[data-ui-act]');
        if (action === 'toggle-sources') {
            sourcesCollapsed = !sourcesCollapsed;
            syncSourcePanel();
            notebookPane.querySelector(sourcesCollapsed ? '.nb-source-rail .nb-source-toggle' : '.nb-sources > h3 .nb-source-toggle').focus();
        }
        if (action === 'open-source-dialog') openSourceDialog('file', trigger);
        if (action === 'close-source-dialog') document.getElementById('nb-add-source-dialog').close();
        if (action === 'source-method') selectSourceMethod(trigger.dataset.sourceKind);
        if (action === 'pick-source-file') document.getElementById('nb-file').click();
        if (action === 'focus-upload' || action === 'focus-paste') {
            openSourceDialog(action === 'focus-paste' ? 'text' : 'file', trigger);
        }
    });
    notebookPane.addEventListener('keydown', event => {
        const tab = event.target.closest('[role="tab"][data-source-kind]');
        if (!tab || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const tabs = [...tab.parentElement.querySelectorAll('[role="tab"]')];
        const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (tabs.indexOf(tab) + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        selectSourceMethod(tabs[index].dataset.sourceKind);
        tabs[index].focus();
    });
    function renderSelectedSourceFile() {
        const file = document.getElementById('nb-file')?.files?.[0];
        const selection = document.getElementById('nb-file-selection');
        if (!selection) return;
        const invalid = file && (!/\.(pdf|txt|md|csv)$/i.test(file.name) || file.size > 10 * 1024 * 1024);
        selection.classList.toggle('is-error', Boolean(invalid));
        selection.dataset.state = invalid ? 'error' : 'default';
        selection.textContent = !file ? 'Chưa chọn tệp.' : invalid ? 'Chọn tệp PDF, TXT, MD hoặc CSV không quá 10 MB.' : file.name + ' · ' + (file.size / 1024).toLocaleString('vi', {maximumFractionDigits: 1}) + ' KB';
        selection.dataset.hasFile = String(Boolean(file));
    }
    notebookPane.addEventListener('change', event => { if (event.target.id === 'nb-file') renderSelectedSourceFile(); });
    notebookPane.addEventListener('ms-notebook-sources-rendered', () => {
        const selection = document.getElementById('nb-file-selection');
        if (selection?.dataset.hasFile === 'true' && !document.getElementById('nb-file').value) {
            selection.classList.remove('is-error');
            selection.dataset.state = 'success';
            selection.textContent = 'Đã thêm tệp vào sổ tay.';
            selection.dataset.hasFile = 'false';
        }
    });
    notebookPane.addEventListener('dragover', event => {
        const zone = event.target.closest('#nb-file-dropzone');
        if (!zone || !Array.from(event.dataTransfer.types).includes('Files')) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        zone.classList.add('is-dragover');
    });
    notebookPane.addEventListener('dragleave', event => {
        const zone = event.target.closest('#nb-file-dropzone');
        if (zone && !zone.contains(event.relatedTarget)) zone.classList.remove('is-dragover');
    });
    notebookPane.addEventListener('drop', event => {
        const zone = event.target.closest('#nb-file-dropzone');
        if (!zone) return;
        event.preventDefault();
        zone.classList.remove('is-dragover');
        const file = event.dataTransfer.files[0];
        if (!file || document.querySelector('#nb-panel-file [data-act="add-file"]').disabled) return;
        const transfer = new DataTransfer();
        transfer.items.add(file);
        const input = document.getElementById('nb-file');
        input.files = transfer.files;
        input.dispatchEvent(new Event('change', {bubbles: true}));
    });

    function closeSearch() {
        results.hidden = true;
        search.setAttribute('aria-expanded', 'false');
    }
    search.addEventListener('input', () => {
        const query = search.value.trim().toLocaleLowerCase('vi');
        results.replaceChildren();
        if (!query) { closeSearch(); return; }
        const targets = [...document.querySelectorAll('.sidebar .nav-tab, .deck-card, .suggestion-card')]
            .filter(target => target.textContent.toLocaleLowerCase('vi').includes(query)).slice(0, 8);
        for (const target of targets) {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = target.querySelector('h3, h4')?.textContent || target.textContent.trim();
            button.addEventListener('click', () => {
                closeSearch();
                if (target.matches('.nav-tab')) { target.click(); target.focus(); }
                else {
                    const tab = target.closest('.tab-pane').id.replace('tab-content-', '');
                    document.querySelector('.sidebar [data-tab=' + tab + ']').click();
                    const studyButton = target.querySelector('.view-deck-btn');
                    if (studyButton) studyButton.click();
                    else target.click();
                }
            });
            results.append(button);
        }
        if (!targets.length) {
            const empty = document.createElement('p');
            empty.textContent = 'Không tìm thấy trang hoặc bộ thẻ đang hiển thị.';
            results.append(empty);
        }
        results.hidden = false;
        search.setAttribute('aria-expanded', 'true');
    });
    search.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeSearch();
        if (event.key === 'ArrowDown' && !results.hidden) { event.preventDefault(); results.querySelector('button')?.focus(); }
        if (event.key === 'Enter' && !results.hidden) { event.preventDefault(); results.querySelector('button')?.click(); }
    });
    results.addEventListener('keydown', event => {
        const buttons = [...results.querySelectorAll('button')];
        const index = buttons.indexOf(document.activeElement);
        if (event.key === 'Escape') { closeSearch(); search.focus(); }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            buttons[(index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length]?.focus();
        }
    });
    document.addEventListener('click', event => { if (!event.target.closest('.workspace-search')) closeSearch(); });
    document.querySelector('.workspace-search').addEventListener('focusout', event => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeSearch();
    });

    // One short acknowledgement on every click, including repeated decisions.
    for (const id of ['btn-remember', 'btn-forget']) {
        document.getElementById(id)?.addEventListener('click', event => {
            if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            event.currentTarget.animate([{transform:'scale(1)'},{transform:'scale(1.05)'},{transform:'scale(1)'}], {duration:150,easing:'ease-out'});
        });
    }
})();
