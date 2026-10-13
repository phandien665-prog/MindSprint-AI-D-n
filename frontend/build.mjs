import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, 'dist');
const apiBase = String(process.env.API_BASE ?? '').trim().replace(/\/+$/, '');

if (process.env.VERCEL && !apiBase) {
    throw new Error('Set API_BASE in the Vercel project to the HTTPS URL of the Render backend.');
}
if (apiBase) {
    const url = new URL(apiBase);
    if (process.env.VERCEL && url.protocol !== 'https:') {
        throw new Error('API_BASE must use HTTPS on Vercel to avoid mixed-content requests.');
    }
}

const ignored = new Set(['.git', '.vercel', 'node_modules', 'dist', 'design-reference']);
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (ignored.has(entry.name) || entry.name.startsWith('.env') ||
        ['build.mjs', 'package.json', 'package-lock.json', 'vercel.json'].includes(entry.name)) continue;
    fs.cpSync(path.join(root, entry.name), path.join(output, entry.name), {
        recursive: true,
        filter(source) {
            const relative = path.relative(root, source);
            return !relative.split(path.sep).some(segment => ignored.has(segment) || segment.startsWith('.env'));
        }
    });
}

fs.writeFileSync(
    path.join(output, 'runtime-config.js'),
    `window.MINDSPRINT_CONFIG = Object.freeze({ apiBase: ${JSON.stringify(apiBase)} });\n`,
    'utf8'
);
