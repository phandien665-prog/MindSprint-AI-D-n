const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Extract cleanOcrText and extractFallbackCards from script.js for headless testing
const scriptContent = fs.readFileSync(path.join(__dirname, '../frontend/script.js'), 'utf8');

function getExtractFallbackCards() {
    // Regex extract cleanOcrText, extractFallbackCards, estimateOptimalCardCount
    const ocrFnMatch = scriptContent.match(/function cleanOcrText\([\s\S]*?\n    \}/);
    const fallbackFnMatch = scriptContent.match(/function extractFallbackCards\([\s\S]*?\n    \}/);
    const estimateFnMatch = scriptContent.match(/function estimateOptimalCardCount\([\s\S]*?\n    \}/);
    if (!ocrFnMatch || !fallbackFnMatch || !estimateFnMatch) {
        throw new Error('Could not find functions in script.js');
    }
    const fnCode = `${ocrFnMatch[0]}\n${fallbackFnMatch[0]}\n${estimateFnMatch[0]}\nreturn { cleanOcrText, extractFallbackCards, estimateOptimalCardCount };`;
    const factory = new Function(fnCode);
    return factory();
}

test('cleanOcrText cleans corrupted OCR symbols and fixes joined words', () => {
    const { cleanOcrText } = getExtractFallbackCards();
    const input = 'a£x £b và Dx = (b -a)/n cùng [x!"#,x!] và biến.Hàm số';
    const output = cleanOcrText(input);
    assert.match(output, /a ≤ x ≤ b/);
    assert.match(output, /Δx =/);
    assert.match(output, /x_\{i-1\}, x_i/);
    assert.match(output, /biến\. Hàm số/);
});

test('estimateOptimalCardCount estimates appropriate number of cards between 5 and 100', () => {
    const { estimateOptimalCardCount } = getExtractFallbackCards();
    // Short text: minimum 5
    assert.equal(estimateOptimalCardCount('Một câu ngắn.'), 5);
    // Medium text (~3200 chars)
    const mediumText = 'Định nghĩa khái niệm và công thức toán học. '.repeat(70);
    const mediumCount = estimateOptimalCardCount(mediumText);
    assert.ok(mediumCount >= 10 && mediumCount <= 25, `Expected 10-25, got ${mediumCount}`);
    // Huge book chapter (~40,000 chars)
    const hugeText = 'Chương lý thuyết nâng cao với nhiều công thức $x=1$ và định lý quan trọng. '.repeat(550);
    const hugeCount = estimateOptimalCardCount(hugeText);
    assert.ok(hugeCount >= 60 && hugeCount <= 100, `Expected 60-100, got ${hugeCount}`);
});

test('extractFallbackCards filters exercise noise and produces atomic cards', () => {
    const { extractFallbackCards } = getExtractFallbackCards();
    const sampleText = `Mục lục: Chương 1. Tích phân.
Trang 15.
Bài 1: Tính diện tích hình thang cong giới hạn bởi đường thẳng x = 1 và y = 2x.
Lời giải chi tiết: Ta áp dụng công thức để tính ra kết quả bằng 4.
Cho hàm số f(x) xác định trên [a, b] liên tục và không âm trên đoạn đó. Ta gọi hình phẳng (H) giới hạn bởi đồ thị hàm số y = f(x), trục hoành và hai đường thẳng x = a, x = b là hình thang cong.
Giả sử ta chia đoạn [a, b] thành n đoạn nhỏ bởi các điểm chia a = x0 < x1 < ... < xn = b sao cho mỗi đoạn nhỏ [x!"#,x!] có độ dài bằng nhau và bằng Dx = (b -a)/n.
Bài tập 2: Cho hàm số liên tục, hãy tính tích phân.`;

    const cards = extractFallbackCards(sampleText, 5);
    assert.ok(cards.length >= 2, 'Should create at least 2 distinct flashcards');
    
    // Check that exercise noise is filtered out
    for (const card of cards) {
        assert.doesNotMatch(card.question, /^(?:Bài \d+|Mục lục|Trang \d+|Bài tập)/i, 'Must not make questions from noise headers');
        assert.doesNotMatch(card.question, /!\"#/, 'Question must not contain raw !"# OCR error');
        assert.doesNotMatch(card.answer, /!\"#/, 'Answer must not contain raw !"# OCR error');
        assert.doesNotMatch(card.question, /£/, 'Question must not contain £ symbol');
        assert.doesNotMatch(card.answer, /£/, 'Answer must not contain £ symbol');
        assert.ok(card.answer.length <= 250, `Answer should be concise (Single Fact Principle), got ${card.answer.length} chars`);
    }

    // Check that key concept card exists
    const conceptCard = cards.find(c => c.question.toLowerCase().includes('hình thang cong'));
    assert.ok(conceptCard, 'Should have extracted a concept card for hình thang cong');
});
