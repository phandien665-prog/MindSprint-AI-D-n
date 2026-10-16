/* Hallmark · pre-emit critique: P5 H5 E4 S5 R5 V4.
 * App dialogs replace browser prompts without overriding synchronous browser APIs.
 */
(function () {
    const dialog = document.getElementById('app-dialog');
    if (!dialog) return;
    const form = dialog.querySelector('form');
    const title = document.getElementById('app-dialog-title');
    const message = document.getElementById('app-dialog-message');
    const field = document.getElementById('app-dialog-field');
    const label = document.getElementById('app-dialog-label');
    const input = document.getElementById('app-dialog-input');
    const error = document.getElementById('app-dialog-error');
    const submit = document.getElementById('app-dialog-submit');
    const cancel = document.getElementById('app-dialog-cancel');
    const close = document.getElementById('app-dialog-close');
    const queue = [];
    let active = null;

    function busy(on) {
        dialog.setAttribute('aria-busy', String(on));
        [input, submit, cancel, close].forEach(element => { element.disabled = on; });
        submit.textContent = on ? active.options.loadingText || 'Đang xử lý…' : active.options.confirmText || (active.kind === 'alert' ? 'Đã hiểu' : 'Xác nhận');
    }

    function finish(value) {
        if (!active) return;
        const entry = active;
        active = null;
        if (dialog.open) dialog.close();
        if (entry.opener?.isConnected && !entry.opener.disabled) entry.opener.focus({preventScroll: true});
        entry.resolve(value);
        setTimeout(showNext, 0);
    }

    function dismiss() {
        if (dialog.getAttribute('aria-busy') === 'true') return;
        const value = active?.kind === 'confirm'
            ? (Object.hasOwn(active.options, 'dismissValue') ? active.options.dismissValue : false) : null;
        finish(value);
    }

    function showNext() {
        if (active || !queue.length) return;
        active = queue.shift();
        const {kind, text, options} = active;
        title.textContent = options.title || (kind === 'prompt' ? 'Nhập thông tin' : kind === 'confirm' ? 'Xác nhận thao tác' : 'Thông báo');
        message.textContent = kind === 'prompt' ? options.description || '' : text;
        message.hidden = !message.textContent;
        field.hidden = kind !== 'prompt';
        label.textContent = options.label || text;
        input.value = options.defaultValue || '';
        input.maxLength = options.maxLength || 200;
        input.placeholder = options.placeholder || '';
        error.textContent = '';
        error.hidden = true;
        input.removeAttribute('aria-invalid');
        dialog.dataset.tone = options.tone || (kind === 'confirm' ? 'warning' : 'info');
        cancel.hidden = kind === 'alert';
        cancel.textContent = options.cancelText || 'Hủy';
        busy(false);
        dialog.showModal();
        (kind === 'prompt' ? input : kind === 'confirm' ? cancel : submit).focus({preventScroll: true});
        if (kind === 'prompt') input.select();
    }

    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (!active || submit.disabled) return;
        const entry = active;
        const value = entry.kind === 'prompt' ? input.value.trim() : entry.kind === 'confirm' ? true : undefined;
        if (entry.kind === 'prompt' && !value) {
            error.textContent = 'Vui lòng nhập ' + label.textContent.toLocaleLowerCase('vi').replace(/:$/, '') + '.';
            error.hidden = false;
            input.setAttribute('aria-invalid', 'true');
            input.focus();
            return;
        }
        if (entry.options.onSubmit) {
            busy(true);
            error.hidden = true;
            try {
                await entry.options.onSubmit(value);
                if (active !== entry) return;
            } catch (reason) {
                if (active !== entry) return;
                busy(false);
                error.textContent = reason.message || 'Chưa thực hiện được. Vui lòng thử lại.';
                error.hidden = false;
                (entry.kind === 'prompt' ? input : submit).focus();
                return;
            }
        }
        finish(value);
    });
    input.addEventListener('input', () => { input.removeAttribute('aria-invalid'); error.hidden = true; });
    cancel.addEventListener('click', () => { if (!cancel.disabled) finish(active?.kind === 'confirm' ? false : null); });
    close.addEventListener('click', dismiss);
    dialog.addEventListener('cancel', event => { event.preventDefault(); dismiss(); });
    dialog.addEventListener('keydown', event => {
        if (event.key !== 'Tab') return;
        const controls = [...dialog.querySelectorAll('button, input')].filter(element => !element.disabled && element.getClientRects().length);
        if (!controls.length) { event.preventDefault(); return; }
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    dialog.addEventListener('click', event => {
        const box = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dismiss();
    });
    dialog.addEventListener('close', () => { if (!dialog.open && active) finish(active.kind === 'confirm' ? false : null); });

    function open(kind, text, options = {}) {
        return new Promise(resolve => {
            queue.push({kind, text: String(text ?? ''), options, resolve, opener: document.activeElement});
            showNext();
        });
    }
    window.MindSprintDialogs = Object.freeze({
        alert: (text, options) => open('alert', text, options),
        confirm: (text, options) => open('confirm', text, options),
        prompt: (text, options) => open('prompt', text, options)
    });
    window.MindSprintAuth?.onAuthChange(() => {
        queue.splice(0).forEach(entry => entry.resolve(entry.kind === 'confirm' ? false : null));
        if (active) finish(active.kind === 'confirm' ? false : null);
    });
})();
