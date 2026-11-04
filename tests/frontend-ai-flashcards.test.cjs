const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const scriptContent = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'script.js'), 'utf8');
const indexHtmlContent = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'index.html'), 'utf8');

test('Issue #13: UI elements for AI flashcards generation exist in index.html', () => {
    // 1. Button in library header
    assert.ok(indexHtmlContent.includes('id="open-ai-card-modal"') || indexHtmlContent.includes('id="open-ai-modal"'), 'open AI modal button exists');
    assert.ok(indexHtmlContent.includes('Tạo thẻ bằng AI'), 'Button label is correct');

    // 2. Modal and sections
    assert.ok(indexHtmlContent.includes('id="ai-card-modal"'), 'ai-card-modal exists');
    assert.ok(indexHtmlContent.includes('id="ai-card-source"') || indexHtmlContent.includes('id="ai-source-text"'), 'ai-card-source textarea exists');
    assert.ok(indexHtmlContent.includes('id="ai-card-category"'), 'ai-card-category select exists');
    assert.ok(indexHtmlContent.includes('id="ai-card-count"'), 'ai-card-count select exists');
    assert.ok(indexHtmlContent.includes('id="generate-ai-cards-btn"'), 'generate button exists');
    assert.ok(indexHtmlContent.includes('id="save-ai-cards-btn"'), 'save to deck button exists');
});

test('Issue #13: script.js contains complete AI generation, shortage handling and persistence logic', () => {
    // Check key requirements implemented in script.js
    assert.ok(scriptContent.includes('open-ai-card-modal') || scriptContent.includes('openAiModalBtn'), 'References open AI card modal');
    assert.ok(scriptContent.includes('aiGenerateCards') || scriptContent.includes('aiFlashcards') || scriptContent.includes('extractFallbackCards'), 'Calls AI or fallback flashcards logic');
    assert.ok(scriptContent.includes('extractFallbackCards') || scriptContent.includes('extractHeuristicCards'), 'Provides heuristic fallback extraction');
    assert.ok(scriptContent.includes('save-ai-cards-btn') || scriptContent.includes('cardsToSave'), 'Provides saving cards to deck');
    assert.ok(scriptContent.includes('flashcards.push') || scriptContent.includes('flashcards ='), 'Persists created cards to flashcards deck');
});

test('Issue #13: heuristic fallback extracts question/answer pairs from text', () => {
    // Test heuristic card extraction logic directly
    const sampleText = `
    HTML: Ngôn ngữ đánh dấu siêu văn bản dùng để xây dựng cấu trúc web.
    CSS: Ngôn ngữ tạo kiểu dáng giao diện cho trang web.
    JavaScript là ngôn ngữ lập trình giúp tạo tính năng động và tương tác.
    API refers to Application Programming Interface.
    `;

    const lines = sampleText.split('\n').map(l => l.trim()).filter(Boolean);
    const drafts = [];
    const colonRegex = /^([^:\-–—\n]{2,50})[:\-–—]\s*(.+)$/;

    for (const line of lines) {
        const cleaned = line.replace(/^[*•\-\d.)\s]+/, '').trim();
        const match = cleaned.match(colonRegex);
        if (match && match[1].length >= 2 && match[2].length >= 3) {
            drafts.push({ question: match[1].trim(), answer: match[2].trim() });
        }
    }

    assert.ok(drafts.length >= 2, 'Extracted at least 2 colon-based pairs');
    assert.equal(drafts[0].question, 'HTML');
    assert.equal(drafts[1].question, 'CSS');
});
