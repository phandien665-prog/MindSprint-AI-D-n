// Render study content without changing the source saved in the database.
(function () {
    const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
    const mathOptions = { throwOnError: false, trust: false, strict: 'ignore', maxExpand: 1000 };
    const delimiters = [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
        { left: '$', right: '$', display: false }
    ];

    function markdown(source, citationTitle = number => 'Nguồn ' + number) {
        const tokens = [];
        // Protect multiline formulas and code before handling paragraphs or citations.
        const text = String(source ?? '').replace(
            /```[\s\S]*?```|`[^`\n]+`|(?<!\\)\$\$[\s\S]+?(?<!\\)\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|(?<![\\$])\$(?![\s$])[^$\n]+?(?<!\\)\$/g,
            match => {
                let html;
                let block = false;
                if (match.startsWith('```')) {
                    block = true;
                    html = '<pre><code>' + escapeHTML(match.slice(3, -3).replace(/^[\w+-]*\n/, '')) + '</code></pre>';
                } else if (match.startsWith('`')) {
                    html = '<code>' + escapeHTML(match.slice(1, -1)) + '</code>';
                } else {
                    const delimiter = delimiters.find(item => match.startsWith(item.left));
                    block = delimiter.display;
                    html = window.katex ? window.katex.renderToString(
                        match.slice(delimiter.left.length, -delimiter.right.length),
                        { ...mathOptions, displayMode: block }
                    ) : escapeHTML(match);
                }
                tokens.push({ html, block });
                return '\uE000' + (tokens.length - 1) + '\uE001';
            }
        );
        const inline = value => value.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(?:S)?(\d{1,2})\]/g, (match, number) =>
                `<sup class="nb-cite" title="${escapeHTML(citationTitle(number))}">${number}</sup>`);
        const out = [];
        let inList = false;
        for (const raw of escapeHTML(text).split('\n')) {
            let match;
            if ((match = raw.match(/^\s*[-*]\s+(.*)/))) {
                if (!inList) { out.push('<ul>'); inList = true; }
                out.push('<li>' + inline(match[1]) + '</li>');
                continue;
            }
            if (inList) { out.push('</ul>'); inList = false; }
            if ((match = raw.match(/^(#{1,4})\s+(.*)/))) {
                const level = match[1].length + 2;
                out.push(`<h${level}>${inline(match[2])}</h${level}>`);
            } else if (raw.trim()) {
                const standalone = raw.trim().match(/^\uE000(\d+)\uE001$/);
                out.push(standalone && tokens[Number(standalone[1])]?.block ? raw : '<p>' + inline(raw) + '</p>');
            }
        }
        if (inList) out.push('</ul>');
        return out.join('').replace(/\uE000(\d+)\uE001/g, (match, index) => tokens[Number(index)]?.html ?? match);
    }

    const contentSelector = [
        '.nb-msg', '.nb-out', '.nb-note', '.nb-src-t', '.nb-chip',
        '#card-question', '#card-answer', '#card-example',
        '#quiz-question-text', '#quiz-hint-text', '#quiz-options-grid', '#wrong-answers-tbody', '.game-card'
    ].join(',');
    const ignoredSelector = '.katex, .katex-error, code, pre, textarea, input, select, [contenteditable="true"]';

    function renderMath(element) {
        if (!window.renderMathInElement || !element || element.closest(ignoredSelector)) return;
        window.renderMathInElement(element, {
            ...mathOptions, delimiters,
            ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option', 'input', 'select'],
            ignoredClasses: ['katex', 'katex-error']
        });
    }

    function watchContent() {
        const pending = new Set();
        let scheduled = false;
        const observer = new MutationObserver(records => {
            for (const record of records) {
                const element = record.target.nodeType === 1 ? record.target : record.target.parentElement;
                if (!element || element.closest(ignoredSelector)) continue;
                const parent = element.closest(contentSelector);
                if (parent) pending.add(parent);
                for (const node of record.addedNodes || []) {
                    if (node.nodeType !== 1) continue;
                    if (node.matches(contentSelector)) pending.add(node);
                    node.querySelectorAll(contentSelector).forEach(child => pending.add(child));
                }
            }
            if (!pending.size || scheduled) return;
            scheduled = true;
            queueMicrotask(() => {
                observer.disconnect();
                try { pending.forEach(element => { if (element.isConnected) renderMath(element); }); }
                finally {
                    pending.clear(); scheduled = false;
                    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
                }
            });
        });
        document.querySelectorAll(contentSelector).forEach(renderMath);
        observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    }

    window.MindSprintText = { markdown, renderMath };
    document.addEventListener('DOMContentLoaded', watchContent);
})();
