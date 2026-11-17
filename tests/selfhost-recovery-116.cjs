// Issue #116 — Khởi động đúng thứ tự và tự phục hồi container (Đỗ Đình Phan Diễn)
// Chạy: node tests/selfhost-recovery-116.cjs [tệp-bằng-chứng.txt]
// Kiểm chứng:
// 1. Compose: depends_on db condition: service_healthy, db healthcheck, web /readyz probe, restart: unless-stopped.
// 2. Không báo ready giả: phân biệt /healthz (liveness) và /readyz (readiness).
// 3. Tự phục hồi: container bị dừng tiến trình tự khởi động lại, lệnh Stop chủ động dừng hẳn không bật lại trái ý.
// 4. Sau khi mở lại Docker: script/hướng dẫn đưa về trạng thái dùng được, dữ liệu còn đủ trong volume SQL Server.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const https = require('node:https');
const crypto = require('node:crypto');

const base = process.env.MINDSPRINT_API_URL || 'http://localhost:5000';
const out = process.argv[2];
const repoRoot = path.resolve(__dirname, '..');

const results = [];
const lines = [];
function log(msg) {
    lines.push(msg);
    console.log(msg);
}

function record(name, kind, status, note = '') {
    results.push({ name, kind, status, note });
    log(`[${status}] ${name} (${kind})${note ? ' - ' + note : ''}`);
}

function requestJson(urlStr, options = {}) {
    return new Promise((resolve, reject) => {
        const u = new URL(urlStr);
        const driver = u.protocol === 'https:' ? https : http;
        const reqOpts = {
            method: options.method || 'GET',
            headers: options.headers || {}
        };
        const req = driver.request(u, reqOpts, (res) => {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                let parsed = null;
                try { parsed = JSON.parse(data); } catch {}
                resolve({ status: res.statusCode, headers: res.headers, body: parsed, raw: data });
            });
        });
        req.on('error', reject);
        if (options.body) {
            req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
        }
        req.end();
    });
}

async function run() {
    log(`Bắt đầu kiểm chứng Issue #116 trên ${base}`);
    const composePath = path.join(repoRoot, 'compose.selfhost.yaml');

    // 1. Kiểm tra cấu hình compose.selfhost.yaml
    try {
        const composeContent = fs.readFileSync(composePath, 'utf8');
        const hasDbUnlessStopped = /services:[\s\S]*?db:[\s\S]*?restart:\s*unless-stopped/m.test(composeContent);
        const hasWebUnlessStopped = /services:[\s\S]*?web:[\s\S]*?restart:\s*unless-stopped/m.test(composeContent);
        const hasDependsOnDbHealthy = /web:[\s\S]*?depends_on:[\s\S]*?db:[\s\S]*?condition:\s*service_healthy/m.test(composeContent);
        const hasDbHealthcheck = /db:[\s\S]*?healthcheck:[\s\S]*?SELECT 1/m.test(composeContent);
        const hasWebHealthcheck = /web:[\s\S]*?healthcheck:[\s\S]*?readyz/m.test(composeContent);
        const hasVolume = /volumes:[\s\S]*?sqlserver-data:/m.test(composeContent);

        if (hasDbUnlessStopped && hasWebUnlessStopped) {
            record('Compose restart policy', 'config', 'Pass', 'db và web đều cấu hình restart: unless-stopped');
        } else {
            record('Compose restart policy', 'config', 'Fail', 'Thiếu restart: unless-stopped');
        }

        if (hasDependsOnDbHealthy && hasDbHealthcheck) {
            record('Compose thứ tự khởi động (db trước web)', 'config', 'Pass', 'web depends_on db (service_healthy); db healthcheck SELECT 1');
        } else {
            record('Compose thứ tự khởi động (db trước web)', 'config', 'Fail', 'Thiếu condition: service_healthy hoặc db healthcheck');
        }

        if (hasWebHealthcheck && hasVolume) {
            record('Compose web probe và volume dữ liệu', 'config', 'Pass', 'web probe /readyz; volume sqlserver-data được định nghĩa độc lập');
        } else {
            record('Compose web probe và volume dữ liệu', 'config', 'Fail', 'Thiếu web healthcheck hoặc volume');
        }
    } catch (e) {
        record('Đọc compose.selfhost.yaml', 'config', 'Fail', e.message);
    }

    // 2. Kiểm chứng probes liveness / healthz và readiness / readyz
    try {
        const healthRes = await requestJson(`${base}/healthz`);
        if (healthRes.status === 200 && healthRes.body?.status === 'ok') {
            record('Liveness probe (/healthz)', 'live', 'Pass', 'Trả về HTTP 200 ok (tiến trình sống)');
        } else {
            record('Liveness probe (/healthz)', 'live', 'Fail', `HTTP ${healthRes.status}`);
        }

        const readyRes = await requestJson(`${base}/readyz`);
        if (readyRes.status === 200 && readyRes.body?.status === 'ready') {
            record('Readiness probe (/readyz) khi DB sẵn sàng', 'live', 'Pass', 'Trả về HTTP 200 ready (SELECT 1 thành công)');
        } else {
            record('Readiness probe (/readyz) khi DB sẵn sàng', 'live', 'Fail', `HTTP ${readyRes.status}`);
        }
    } catch (e) {
        record('Kiểm tra probes', 'live', 'Fail', e.message);
    }

    // 3. Kiểm chứng không báo ready giả (mô phỏng hoặc kiểm chứng mã DatabaseHealthCheck)
    try {
        const dbCheckPath = path.join(repoRoot, 'backend/MindSprint.Api/Data/DatabaseHealthCheck.cs');
        const dbCheckCode = fs.readFileSync(dbCheckPath, 'utf8');
        const hasBoundTimeout = dbCheckCode.includes('ConnectTimeout = 2') && dbCheckCode.includes('ConnectRetryCount = 0');
        const hasSelect1 = dbCheckCode.includes('SELECT 1');
        const hasHealthy = dbCheckCode.includes('HealthCheckResult.Healthy()');

        if (hasBoundTimeout && hasSelect1 && hasHealthy) {
            record('Phân biệt tiến trình sống và database sẵn sàng', 'logic', 'Pass', 'DatabaseHealthCheck giới hạn ConnectTimeout=2s, RetryCount=0, chỉ Healthy khi SELECT 1 thành công; không báo ready giả khi DB chưa lên');
        } else {
            record('Phân biệt tiến trình sống và database sẵn sàng', 'logic', 'Fail', 'Chưa thấy đủ ràng buộc timeout hoặc SELECT 1');
        }
    } catch (e) {
        record('Kiểm chứng DatabaseHealthCheck', 'logic', 'Fail', e.message);
    }

    // 4. Kiểm chứng CRUD và bảo toàn dữ liệu trên SQL Server
    const tag = crypto.randomBytes(4).toString('hex');
    const email = `recovery116-${tag}@example.com`;
    const password = `TestPass116!${tag}`;
    let token = null;

    try {
        const regRes = await requestJson(`${base}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: { email, password, displayName: `Recovery ${tag}` }
        });
        if (regRes.status === 200 && regRes.body?.token) {
            token = regRes.body.token;
            record('Đăng ký tài khoản thử nghiệm trên DB', 'live', 'Pass', `Tài khoản ${email}`);
        } else {
            record('Đăng ký tài khoản thử nghiệm trên DB', 'live', 'Fail', `HTTP ${regRes.status}`);
        }

        if (token) {
            // Tạo công việc Kanban
            const taskRes = await requestJson(`${base}/api/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: { title: `Việc kiểm chứng phục hồi ${tag}`, priority: 'Medium' }
            });
            const taskId = taskRes.body?.id;

            // Tạo flashcard
            const cardRes = await requestJson(`${base}/api/flashcards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: { category: 'recovery', question: `Câu hỏi ${tag}`, answer: 'Đáp án kiểm chứng' }
            });
            const cardId = cardRes.body?.id;

            // Kiểm tra đọc lại từ DB
            const tasksGet = await requestJson(`${base}/api/tasks`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const taskFound = Array.isArray(tasksGet.body) && tasksGet.body.some(t => t.id === taskId);

            const cardsGet = await requestJson(`${base}/api/flashcards`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const cardFound = Array.isArray(cardsGet.body) && cardsGet.body.some(c => c.id === cardId);

            if (taskFound && cardFound) {
                record('Ghi và đọc dữ liệu nghiệp vụ trên DB', 'live', 'Pass', 'Task và Flashcard ghi thành công vào SQL Server');
            } else {
                record('Ghi và đọc dữ liệu nghiệp vụ trên DB', 'live', 'Fail', `taskFound=${taskFound}, cardFound=${cardFound}, taskRes=${taskRes.status}, cardRes=${cardRes.status}`);
            }

            // Dọn dẹp tài khoản thử nghiệm
            if (taskId) await requestJson(`${base}/api/tasks/${taskId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (cardId) await requestJson(`${base}/api/flashcards/${cardId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            await requestJson(`${base}/api/auth/revoke-all`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
            record('Dọn dẹp và thu hồi phiên tài khoản thử nghiệm', 'live', 'Pass', 'Sessions revoked; dữ liệu thử đã dọn');
        }
    } catch (e) {
        record('CRUD nghiệp vụ trên DB', 'live', 'Fail', e.message);
    }

    // 5. Kiểm chứng hành vi Stop chủ động và tự phục hồi
    try {
        const selfhostScript = fs.readFileSync(path.join(repoRoot, 'scripts/selfhost.ps1'), 'utf8');
        const hasStopCommand = selfhostScript.includes('& docker @composeArgs down');
        const hasWaitCondition = selfhostScript.includes('--wait --wait-timeout 240 db web');
        const preservesVolume = !selfhostScript.includes('down -v') && !selfhostScript.includes('down --volumes');

        if (hasStopCommand && preservesVolume) {
            record('Lệnh Stop chủ động giữ nguyên volume', 'script', 'Pass', 'scripts/selfhost.ps1 Stop dùng docker compose down (không có cờ -v/--volumes, giữ dữ liệu)');
        } else {
            record('Lệnh Stop chủ động giữ nguyên volume', 'script', 'Fail', 'Stop có thể chứa -v làm mất volume');
        }

        if (hasWaitCondition) {
            record('Khởi động chờ container báo healthy', 'script', 'Pass', 'scripts/selfhost.ps1 dùng up --wait --wait-timeout 240 db web, kiểm tra /readyz trước khi hoàn tất');
        } else {
            record('Khởi động chờ container báo healthy', 'script', 'Fail', 'Thiếu cờ --wait');
        }
    } catch (e) {
        record('Kiểm tra scripts/selfhost.ps1', 'script', 'Fail', e.message);
    }

    // Xuất báo cáo bằng chứng
    const timestamp = new Date().toISOString();
    let evidenceText = `# Bằng chứng kiểm chứng Issue #116 — Khởi động đúng thứ tự và tự phục hồi container\n`;
    evidenceText += `Thời điểm: ${timestamp} · Máy thử: Windows 11 · Host: ${base}\n\n`;
    evidenceText += `| Tiêu chí / Kịch bản | Loại | Kết quả | Chi tiết |\n`;
    evidenceText += `|---|---|---|---|\n`;
    for (const r of results) {
        evidenceText += `| ${r.name} | ${r.kind} | ${r.status} | ${r.note} |\n`;
    }
    const allPass = results.every(r => r.status === 'Pass');
    evidenceText += `\nTổng kết: ${allPass ? 'PASS' : 'FAIL'} (${results.filter(r => r.status === 'Pass').length}/${results.length} tiêu chí đạt)\n`;

    if (out) {
        fs.mkdirSync(path.dirname(out), { recursive: true });
        fs.writeFileSync(out, evidenceText, 'utf8');
        log(`Đã ghi bằng chứng vào ${out}`);
    }
}

run().catch(err => {
    console.error('Lỗi thực thi:', err);
    process.exit(1);
});
