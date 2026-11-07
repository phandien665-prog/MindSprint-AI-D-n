import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {fixture, summarize} from './report.mjs';

function fence(value) {
    const text = String(value ?? 'null');
    const ticks = '`'.repeat(Math.max(3, ...[...text.matchAll(/`+/g)].map(m => m[0].length + 1)));
    return `${ticks}text\n${text}\n${ticks}`;
}

function fields(value, prefix = '') {
    if (value !== null && typeof value === 'object') {
        const entries = Object.entries(value);
        if (entries.length) return entries.flatMap(([key, item]) => fields(item, prefix ? `${prefix}.${key}` : key));
        return [`${prefix}:\n${Array.isArray(value) ? '[]' : '{}'}`];
    }
    return [`${prefix}:\n${value === null ? 'null' : String(value)}`];
}

export function buildReview(campaigns) {
    const groups = ['source', 'tutor', 'hint'];
    if (campaigns.length !== 3 || groups.some(g => campaigns.filter(c => c.group === g).length !== 1)) throw Error('Expected exactly three groups');
    const summaries = new Map();
    for (const campaign of campaigns) {
        if (campaign.manifest.baseline.fixtureRevision !== fixture.revision) throw Error('Fixture revision differs');
        if (campaign.grades.some(g => g.reviewerKind !== 'ai')) throw Error('Existing human grades must be preserved; use their original report');
        const summary = summarize(campaign.outputs, campaign.grades, [campaign.group]);
        if (summary.outputs !== 30 || campaign.grades.length !== 30 || summary.pending || summary.untrackedFailures) throw Error('Expected a complete graded group');
        summaries.set(campaign.group, summary);
    }
    const lines = ['# Issue #55 — bản đối chiếu 90 mẫu', '',
        'Đối chiếu của con người: **0/90 — chưa ghi nhận**. Các trường bên dưới để trống; điểm AI không tự trở thành kết luận của bạn.', '',
        'Đọc đề, rubric và toàn bộ trường trả về của từng lượt. Ghi nhận đúng/sai, an toàn và lý do; nếu khác đánh giá AI thì ghi rõ ca/lượt cần sửa. Không tự đánh dấu một ca đúng khi chỉ nhận lỗi API.', '',
        '[Hồ sơ kỹ thuật đầy đủ và các chiến dịch trước](./ISSUE-55-EVIDENCE.md). Bản này chỉ bỏ log provider/bản nháp khỏi luồng đọc; giữ nguyên mọi trường của đầu ra API cuối, không sửa hoặc rút gọn câu trả lời.', '',
        '| Nhóm | Điểm AI | SHA chiến dịch | Bắt đầu Asia/Saigon |', '|---|---:|---|---|'];
    for (const group of groups) {
        const c = campaigns.find(c => c.group === group), summary = summaries.get(group);
        lines.push(`| ${group} | ${summary.groups[0].correct}/30 | ${c.manifest.baseline.sourceCommit} | ${c.manifest.startedAtAsiaSaigon} |`);
    }
    lines.push('', '## Nguồn test dùng để kiểm tra trích dẫn', '');
    fixture.sources.forEach((source, index) => lines.push(`### Nguồn ${index + 1}`, '', fence(source.title + '\n' + source.text), ''));
    for (const item of fixture.cases) {
        const campaign = campaigns.find(c => c.group === item.group);
        lines.push(`## ${item.id} — ${item.group}`, '', '**Đề bài**', '', fence(item.question), '', '**Rubric/đáp án chuẩn**', '', fence(item.expected), '');
        if (item.action) lines.push(`Chế độ: ${item.action}${item.hintLevel ? `; mức ${item.hintLevel}` : ''}.`, '');
        if (item.submission) lines.push('**Bài làm được kiểm tra**', '', fence(item.submission), '');
        for (const run of [1, 2, 3]) {
            const row = campaign.outputs.find(r => r.id === item.id && r.run === run);
            const grade = campaign.grades.find(g => g.id === item.id && g.run === run);
            lines.push(`### ${item.id} — lượt ${run}`, '', `HTTP/controller: ${row.status}.`, '', '**Toàn bộ đầu ra API cuối**', '',
                fence(fields(row.output).join('\n\n')), '',
                '<details>', '<summary>Đối chiếu AI để tham khảo sau khi đọc đầu ra</summary>', '',
                fence(fields({reviewerKind: grade.reviewerKind, passed: grade.passed, safetyPassed: grade.safetyPassed, rationale: grade.rationale, bugUrl: grade.bugUrl || null, severity: grade.severity || null}).join('\n\n')), '', '</details>', '',
                'Người đối chiếu: Chưa chấm', '', 'Kết luận đúng: Chưa chấm', '', 'Kết luận an toàn: Chưa chấm', '', 'Nhận xét: Chưa chấm', '');
        }
    }
    return lines.join('\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const [source, tutor, hint, output] = process.argv.slice(2);
    if (!source || !tutor || !hint || !output || process.argv.length !== 6) throw Error('Usage: node review.mjs <source campaign> <tutor campaign> <hint campaign> <output.md>');
    const read = (directory, name) => JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8'));
    const campaigns = ['source', 'tutor', 'hint'].map((group, index) => {
        const directory = [source, tutor, hint][index];
        const outputs = fs.readFileSync(path.join(directory, 'outputs.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse).filter(r => r.group === group);
        const ids = new Set(outputs.map(r => r.id));
        return {group, manifest: read(directory, 'manifest.json'), outputs, grades: read(directory, 'grades.json').filter(g => ids.has(g.id))};
    });
    const text = buildReview(campaigns);
    fs.writeFileSync(output, text);
    console.log(`Review guide: 90 outputs, human review 0/90; ${Buffer.byteLength(text)} bytes written to ${output}`);
}
