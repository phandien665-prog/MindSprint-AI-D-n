const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const test = require('node:test');

const root = path.join(__dirname, '..');

test('notebook UI discloses Gemini data transfer', () => {
    const source = fs.readFileSync(path.join(root, 'frontend/notebook.js'), 'utf8');
    assert.match(source, /nội dung nguồn hoặc tệp bạn chọn sẽ được gửi đến Google Gemini/i);
    assert.match(source, /Tránh gửi thông tin nhạy cảm/i);
});

test('frontend build artifact excludes demo credentials and local auth client', () => {
    const legacyAuth = fs.readFileSync(path.join(root, 'frontend/js/auth.js'), 'utf8');
    assert.doesNotMatch(legacyAuth, /MindSprint\d{3}!/);
    assert.doesNotMatch(legacyAuth, /handleDemoLogin|demoPass/);

    const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'mindsprint-nfr05-'));
    const frontend = path.join(root, 'frontend');
    const copyRoot = path.join(temporaryRoot, 'frontend');
    fs.cpSync(frontend, copyRoot, {
        recursive: true,
        filter(source) {
            const relative = path.relative(frontend, source).split(path.sep);
            return !relative.some(segment => ['.git', '.vercel', 'node_modules', 'dist', 'design-reference'].includes(segment));
        }
    });
    try {
        const result = spawnSync(process.execPath, ['build.mjs'], {
            cwd: copyRoot,
            encoding: 'utf8',
            env: {...process.env, VERCEL: '1', API_BASE: 'https://api.example.test'}
        });
        assert.equal(result.status, 0, result.stderr || result.stdout);
        const artifact = path.join(copyRoot, 'dist');
        assert.equal(fs.existsSync(path.join(artifact, 'js/auth.js')), false);
        const contents = [];
        const visit = directory => {
            for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
                const file = path.join(directory, entry.name);
                if (entry.isDirectory()) visit(file);
                else if (!/\.(png|jpe?g|gif|webp|ico|woff2?)$/i.test(entry.name)) contents.push(fs.readFileSync(file, 'utf8'));
            }
        };
        visit(artifact);
        const bundle = contents.join('\n');
        assert.doesNotMatch(bundle, /MindSprint\d{3}!/);
        assert.equal(bundle.includes('YOUR_GEMINI_API_KEY_HERE'), false);
        assert.doesNotMatch(bundle, /AIza[0-9A-Za-z_-]{35}/);
        assert.doesNotMatch(bundle, /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/);
    } finally {
        fs.rmSync(temporaryRoot, {recursive: true, force: true});
    }
});