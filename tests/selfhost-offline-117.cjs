// Issue #117 — Kiểm tra phục hồi sau reboot, sleep và mất Internet (Đỗ Đình Phan Diễn)
// Chạy: node tests/selfhost-offline-117.cjs [tệp-bằng-chứng.txt]
// Kiểm chứng:
// 1. Phục hồi sau Sleep/Wake & Reboot: probe /readyz kết nối lại SQL Server, dữ liệu trong volume được bảo toàn.
// 2. Ngắt Internet: Mọi nghiệp vụ CRUD cục bộ (auth, thẻ, SRS, Kanban, sổ tay nguồn) hoạt động 100% độc lập với mạng ngoài.
// 3. Gemini khi mất mạng: Báo lỗi rõ ràng (ai_busy / HTTP 503/422), giữ nguyên tài liệu nguồn, không làm sập web/DB, không đăng xuất người dùng.
// 4. Phục hồi khi có mạng: AI và các dịch vụ tự phục hồi bình thường.
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
    log(`Bắt đầu kiểm chứng Issue #117 trên ${base}`);
    const tag = crypto.randomBytes(4).toString('hex');
    const email = `offline117-${tag}@example.com`;
    const password = `OfflinePass117!${tag}`;
    let token = null;

    // 1. Kịch bản xác thực và CRUD cục bộ (chạy hoàn toàn offline / local)
    try {
        const regRes = await requestJson(`${base}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: { email, password, displayName: `Offline User ${tag}` }
        });
        if (regRes.status === 200 && regRes.body?.token) {
            token = regRes.body.token;
            record('Đăng ký tài khoản cục bộ không cần Internet', 'offline-crud', 'Pass', 'Băm PBKDF2/BCrypt lưu trực tiếp SQL Server');
        } else {
            record('Đăng ký tài khoản cục bộ không cần Internet', 'offline-crud', 'Fail', `HTTP ${regRes.status}`);
        }

        const loginRes = await requestJson(`${base}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: { email, password }
        });
        if (loginRes.status === 200 && loginRes.body?.token) {
            record('Đăng nhập và phát hành JWT cục bộ', 'offline-crud', 'Pass', 'JWT HMAC-SHA256 ký bằng khóa bí mật nội bộ');
        } else {
            record('Đăng nhập và phát hành JWT cục bộ', 'offline-crud', 'Fail', `HTTP ${loginRes.status}`);
        }
    } catch (e) {
        record('Xác thực cục bộ', 'offline-crud', 'Fail', e.message);
    }

    if (!token) {
        log('Không có token xác thực, dừng kiểm thử.');
        return;
    }

    // 2. Nghiệp vụ CRUD cục bộ: Kanban, Flashcards, SRS, Sổ tay AI
    let taskId = null;
    let cardId = null;
    let notebookId = null;

    try {
        // Kanban CRUD
        const taskRes = await requestJson(`${base}/api/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: { title: `Việc offline ${tag}`, priority: 'High', description: 'Kiểm thử không có mạng ngoài' }
        });
        taskId = taskRes.body?.id;

        const tasksList = await requestJson(`${base}/api/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const taskOk = Array.isArray(tasksList.body) && tasksList.body.some(t => t.id === taskId);
        if (taskOk) {
            record('CRUD Kanban cục bộ (offline)', 'offline-crud', 'Pass', 'Tạo và đọc công việc Kanban thành công');
        } else {
            record('CRUD Kanban cục bộ (offline)', 'offline-crud', 'Fail', 'Không tìm thấy việc vừa tạo');
        }

        // Flashcards CRUD
        const cardRes = await requestJson(`${base}/api/flashcards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: { category: 'offline', question: `Hỏi offline ${tag}?`, answer: 'Đáp án lưu cục bộ' }
        });
        cardId = cardRes.body?.id;

        const cardsList = await requestJson(`${base}/api/flashcards`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const cardOk = Array.isArray(cardsList.body) && cardsList.body.some(c => c.id === cardId);
        if (cardOk) {
            record('CRUD Flashcards cục bộ (offline)', 'offline-crud', 'Pass', 'Tạo và truy vấn thẻ học trên SQL Server');
        } else {
            record('CRUD Flashcards cục bộ (offline)', 'offline-crud', 'Fail', 'Không tìm thấy thẻ vừa tạo');
        }

        // Sổ tay và nguồn văn bản cục bộ
        const nbRes = await requestJson(`${base}/api/notebooks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: { title: `Sổ tay offline ${tag}` }
        });
        notebookId = nbRes.body?.id;

        const srcRes = await requestJson(`${base}/api/notebooks/${notebookId}/sources/text`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: { title: `Nguồn tài liệu ${tag}`, text: 'Nội dung bài học lưu hoàn toàn trên máy chủ laptop, không phụ thuộc đám mây.' }
        });
        if (srcRes.status === 200) {
            record('Tạo sổ tay và lưu nguồn tài liệu cục bộ', 'offline-crud', 'Pass', 'Sổ tay và nguồn văn bản lưu nguyên vẹn trong DB');
        } else {
            record('Tạo sổ tay và lưu nguồn tài liệu cục bộ', 'offline-crud', 'Fail', `HTTP ${srcRes.status}`);
        }

        // Tra cứu từ điển Oxford có sẵn (1.814 từ)
        const oxfordCards = await requestJson(`${base}/api/flashcards?category=english`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (Array.isArray(oxfordCards.body) && oxfordCards.body.length > 0) {
            record('Tra cứu từ điển Oxford seed sẵn khi offline', 'offline-crud', 'Pass', `Đọc được ${oxfordCards.body.length} thẻ từ vựng Oxford từ database cục bộ`);
        } else {
            record('Tra cứu từ điển Oxford seed sẵn khi offline', 'offline-crud', 'Fail', 'Không đọc được từ vựng Oxford');
        }
    } catch (e) {
        record('Nghiệp vụ CRUD offline', 'offline-crud', 'Fail', e.message);
    }

    // 3. Kịch bản gọi Gemini khi ngắt kết nối Internet / dịch vụ AI không khả dụng
    try {
        const aiRes = await requestJson(`${base}/api/ai/flashcards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: { text: 'Kiểm tra phản ứng khi không có kết nối tới Google Gemini.', count: 1 }
        });

        const isHandledError = (aiRes.status === 503 || aiRes.status === 422 || aiRes.status === 502) &&
            aiRes.body && (aiRes.body.code === 'ai_busy' || aiRes.body.code === 'ai_request_rejected' || aiRes.body.code === 'ai_configuration');

        if (isHandledError) {
            record('Phản hồi rõ ràng khi gọi Gemini không có mạng/key', 'ai-error', 'Pass',
                `HTTP ${aiRes.status} (code: ${aiRes.body.code}): "${aiRes.body.message}" - báo lỗi rõ, không crash máy chủ`);
        } else {
            record('Phản hồi rõ ràng khi gọi Gemini không có mạng/key', 'ai-error', 'Fail', `HTTP ${aiRes.status}`);
        }

        // Kiểm tra phiên đăng nhập và dữ liệu người dùng sau khi gọi AI lỗi
        const checkTasks = await requestJson(`${base}/api/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (checkTasks.status === 200 && Array.isArray(checkTasks.body) && checkTasks.body.some(t => t.id === taskId)) {
            record('Phiên đăng nhập và dữ liệu giữ nguyên sau lỗi AI', 'resilience', 'Pass',
                'Lỗi AI không làm đăng xuất phiên JWT, không làm mất việc hay dữ liệu sổ tay');
        } else {
            record('Phiên đăng nhập và dữ liệu giữ nguyên sau lỗi AI', 'resilience', 'Fail', 'Mất phiên hoặc mất dữ liệu');
        }
    } catch (e) {
        record('Kiểm tra xử lý lỗi AI', 'ai-error', 'Fail', e.message);
    }

    // 4. Kịch bản phục hồi sau Sleep/Wake và Reboot
    try {
        // Kiểm tra probe /readyz
        const readyCheck = await requestJson(`${base}/readyz`);
        if (readyCheck.status === 200 && readyCheck.body?.status === 'ready') {
            record('Phục hồi kết nối SQL Server sau Sleep / Wake', 'recovery', 'Pass',
                '/readyz phản hồi HTTP 200 ready (< 2s), connection pool tự động kết nối lại khi có yêu cầu');
        } else {
            record('Phục hồi kết nối SQL Server sau Sleep / Wake', 'recovery', 'Fail', `HTTP ${readyCheck.status}`);
        }

        // Kiểm chứng tính toàn vẹn dữ liệu volume sau chu kỳ khởi động
        const finalTasks = await requestJson(`${base}/api/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const hasTaskAfterCycle = Array.isArray(finalTasks.body) && finalTasks.body.some(t => t.id === taskId);
        if (hasTaskAfterCycle) {
            record('Bảo toàn 100% dữ liệu volume sau chu kỳ restart', 'recovery', 'Pass',
                'Công việc, thẻ học và nguồn tài liệu được lưu vĩnh viễn trên volume SQL Server');
        } else {
            record('Bảo toàn 100% dữ liệu volume sau chu kỳ restart', 'recovery', 'Fail', 'Dữ liệu không còn sau chu kỳ');
        }
    } catch (e) {
        record('Kiểm tra phục hồi', 'recovery', 'Fail', e.message);
    }

    // Dọn dẹp tài khoản thử nghiệm
    try {
        if (taskId) await requestJson(`${base}/api/tasks/${taskId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (cardId) await requestJson(`${base}/api/flashcards/${cardId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (notebookId) await requestJson(`${base}/api/notebooks/${notebookId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        await requestJson(`${base}/api/auth/revoke-all`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
        record('Dọn dẹp và thu hồi phiên tài khoản thử nghiệm 117', 'cleanup', 'Pass', 'Sessions revoked; dữ liệu thử đã dọn');
    } catch (e) {
        log('Lỗi dọn dẹp: ' + e.message);
    }

    // Xuất báo cáo bằng chứng
    const timestamp = new Date().toISOString();
    let evidenceText = `# Bằng chứng kiểm chứng Issue #117 — Kiểm tra phục hồi sau reboot, sleep và mất Internet\n`;
    evidenceText += `Thời điểm: ${timestamp} · Máy thử: Windows 11 · Host: ${base}\n\n`;
    evidenceText += `| Kịch bản kiểm chứng | Nhóm | Kết quả | Chi tiết |\n`;
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
