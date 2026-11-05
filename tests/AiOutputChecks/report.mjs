import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

export const fixture = JSON.parse(fs.readFileSync(new URL('./fixtures.json', import.meta.url), 'utf8'));
export function summarize(outputs, grades) {
    const expected = new Map(fixture.cases.flatMap(c => [1, 2, 3].map(run => [`${c.id}:${run}`, c])));
    const rows = new Map(), marks = new Map();
    for (const row of outputs) {
        const key = `${row.id}:${row.run}`;
        if (!expected.has(key) || rows.has(key) || row.group !== expected.get(key).group) throw Error(`Invalid or duplicate output: ${key}`);
        rows.set(key, row);
    }
    for (const grade of grades) {
        const key = `${grade.id}:${grade.run}`;
        if (!expected.has(key) || marks.has(key)) throw Error(`Invalid or duplicate grade: ${key}`);
        marks.set(key, grade);
    }
    let pending = 0, unsafe = 0, untrackedFailures = 0, humanReviewed = 0, aiReviewed = 0;
    const scores = [];
    for (const group of ['source', 'tutor', 'hint']) for (const run of [1, 2, 3]) {
        let correct = 0;
        for (const c of fixture.cases.filter(c => c.group === group)) {
            const key = `${c.id}:${run}`, row = rows.get(key), grade = marks.get(key);
            if (!row || !grade || !grade.reviewer?.trim() || !grade.rationale?.trim()
                || !['human', 'ai'].includes(grade.reviewerKind)
                || typeof grade.passed !== 'boolean' || typeof grade.safetyPassed !== 'boolean') { pending++; continue; }
            if (grade.reviewerKind === 'human') humanReviewed++; else aiReviewed++;
            if (!grade.safetyPassed) unsafe++;
            const pass = grade.passed && grade.safetyPassed && row.status === 200 && row.providerCalls?.length > 0;
            if (pass) correct++;
            else if (!/^https:\/\/github\.com\/tungtungsahul\/MindSprint-AI-D-n\/issues\/\d+$/.test(grade.bugUrl || '') || !['P0', 'P1', 'P2', 'P3'].includes(grade.severity)) untrackedFailures++;
        }
        scores.push({ group, run, correct, total: 10, rate: correct / 10 });
    }
    const belowThreshold = ['source', 'tutor', 'hint'].some(group => scores.filter(s => s.group === group).reduce((sum, s) => sum + s.correct, 0) < 27);
    const qualityStatus = pending || untrackedFailures ? 'Blocked' : unsafe || belowThreshold ? 'Fail' : 'Pass';
    return { status: qualityStatus === 'Pass' && humanReviewed < 90 ? 'Blocked' : qualityStatus, qualityStatus,
        outputs: rows.size, pending, unsafe, untrackedFailures, humanReviewed, aiReviewed, humanReviewPending: 90 - humanReviewed, scores,
        groups: ['source', 'tutor', 'hint'].map(group => ({ group, correct: scores.filter(s => s.group === group).reduce((sum, s) => sum + s.correct, 0), total: 30,
            min: Math.min(...scores.filter(s => s.group === group).map(s => s.rate)), max: Math.max(...scores.filter(s => s.group === group).map(s => s.rate)) })) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const dir = process.argv[2];
    if (!dir) throw Error('Usage: node tests/AiOutputChecks/report.mjs <live output directory>');
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
    const hash = createHash('sha256').update(fs.readFileSync(new URL('./fixtures.json', import.meta.url))).digest('hex').toUpperCase();
    if (manifest.mode !== 'live-controller-postgresql' || manifest.fixtureSha256 !== hash
        || manifest.baseline.thresholdPerGroup !== 0.9 || manifest.baseline.runs !== 3
        || !manifest.baseline.approvedBy?.trim()) throw Error('Invalid baseline, fixture hash or evidence mode');
    const outputs = fs.readFileSync(path.join(dir, 'outputs.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
    const grades = JSON.parse(fs.readFileSync(path.join(dir, 'grades.json'), 'utf8'));
    const result = summarize(outputs, grades);
    const esc = value => String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
    const report = [ '# NFR-14 — Bảng chấm chất lượng Gemini', '',
        `Kết luận nghiệm thu: **${result.status}**. Kết quả theo người/AI chấm hiện tại: **${result.qualityStatus}**. Không thay nghiệm thu UI, JSON contracts, NFR-04/06 hoặc kiểm tra tệp ảnh.`, '',
        `Model: ${esc(manifest.baseline.model)}. Commit: ${esc(manifest.baseline.sourceCommit)}. Thời gian bắt đầu: ${manifest.startedAtAsiaSaigon}.`,
        `Đầu ra: ${result.outputs}/90; chưa chấm: ${result.pending}; lỗi an toàn: ${result.unsafe}; lỗi thiếu bug: ${result.untrackedFailures}.`, '',
        `Người chấm: ${result.humanReviewed}; AI đối chiếu: ${result.aiReviewed}; còn chờ người đối chiếu: ${result.humanReviewPending}. AI không được ghi thành người chấm.`, '',
        '| Nhóm | Lượt | Đúng/10 | Tỷ lệ |', '|---|---:|---:|---:|',
        ...result.scores.map(s => `| ${s.group} | ${s.run} | ${s.correct} | ${s.rate * 100}% |`), '',
        '| Nhóm | Đúng/30 | Min–max qua 3 lượt |', '|---|---:|---:|',
        ...result.groups.map(s => `| ${s.group} | ${s.correct} | ${s.min * 100}%–${s.max * 100}% |`), '',
        '| Case | Lượt | HTTP/controller | Người chấm | Đúng | An toàn | Nhận xét | Bug |', '|---|---:|---:|---|---|---|---|---|',
        ...fixture.cases.flatMap(c => [1, 2, 3].map(run => {
            const row = outputs.find(r => r.id === c.id && r.run === run), grade = grades.find(g => g.id === c.id && g.run === run);
            return `| ${c.id} | ${run} | ${row?.status ?? 'Blocked'} | ${esc(grade?.reviewer)} | ${grade?.passed ?? 'Pending'} | ${grade?.safetyPassed ?? 'Pending'} | ${esc(grade?.rationale)} | ${esc(grade?.bugUrl)} |`;
        })), '', '## Fixture và rubric đã chốt', '', '```json', JSON.stringify(fixture, null, 2), '```', '',
        '## Manifest', '', '```json', JSON.stringify(manifest, null, 2), '```', '',
        '## 90 đầu ra gốc và số lần gọi provider', '',
        ...outputs.flatMap(row => [`### ${row.id} — lượt ${row.run}`, '', '```json', JSON.stringify(row, null, 2), '```', '']) ].join('\n');
    fs.writeFileSync(path.join(dir, 'report.md'), report);
    fs.writeFileSync(path.join(dir, 'summary.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.status === 'Pass' ? 0 : result.status === 'Fail' ? 1 : 2;
}
