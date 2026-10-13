const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const katex = require('../frontend/vendor/katex/katex.min.js');

function renderer() {
    const window = { katex };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../frontend/text-renderer.js'), 'utf8'), {
        window, document: { addEventListener() {} }
    });
    return window.MindSprintText;
}

test('Vietnamese answer renders an inverse matrix and both source citation formats', () => {
    const html = renderer().markdown('Trình bày ma trận nghịch đảo $A^{-1}$ [S1] và [2].', number => 'Tài liệu ' + number);
    assert.match(html, /Trình bày ma trận nghịch đảo/);
    assert.match(html, /class="katex"/);
    assert.match(html, /<msup>/);
    assert.match(html, /title="Tài liệu 1">1<\/sup>/);
    assert.match(html, /title="Tài liệu 2">2<\/sup>/);
});

test('multiline matrices stay intact with brackets, subscripts and line breaks', () => {
    const html = renderer().markdown(String.raw`## Ma trận
$$
\begin{bmatrix}
a_{1} & 2 \\
3 & 4
\end{bmatrix}
$$
Kết luận [1].`);
    assert.match(html, /<h4>Ma trận<\/h4>/);
    assert.match(html, /class="katex-display"/);
    assert.match(html, /<mtable/);
    assert.doesNotMatch(html, /katex-error/);
    assert.equal((html.match(/class="nb-cite"/g) || []).length, 1);
});

test('all common formula delimiters render fractions and exponents', () => {
    const html = renderer().markdown(String.raw`$x^2$ và \(\frac{1}{2}\)
\[\sqrt{x}\]
$$y_1$$`);
    assert.equal((html.match(/class="katex"/g) || []).length, 4);
    assert.equal((html.match(/class="katex-display"/g) || []).length, 2);
    assert.doesNotMatch(html, /katex-error/);
});

test('code and untrusted HTML stay literal while normal math still renders', () => {
    const html = renderer().markdown('`$x^2$ [1]`\n```js\nconst price = "$x$";\n```\n<img src=x onerror=alert(1)>\n$x^2$');
    assert.match(html, /<code>\$x\^2\$ \[1\]<\/code>/);
    assert.match(html, /<pre><code>const price/);
    assert.match(html, /&lt;img/);
    assert.doesNotMatch(html, /<img/);
    assert.equal((html.match(/class="katex"/g) || []).length, 1);
    const unsafe = renderer().markdown(String.raw`$\href{javascript:alert(1)}{click}$`);
    assert.doesNotMatch(unsafe, /<a\s/);
});

test('malformed formulas and escaped dollars do not break the rest of the answer', () => {
    const html = renderer().markdown(String.raw`Giá \$10. Công thức $\frac{$.
**Vẫn đọc được** [S1].`);
    assert.match(html, /Giá \\\$10/);
    assert.match(html, /katex-error/);
    assert.match(html, /<strong>Vẫn đọc được<\/strong>/);
    assert.match(html, /class="nb-cite"/);
});
