import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from './report.mjs';
import {buildReview} from './review.mjs';

function campaigns() {
    return ['source', 'tutor', 'hint'].map(group => ({group,
        manifest: {baseline: {fixtureRevision: fixture.revision, sourceCommit: '0'.repeat(40), model: 'synthetic-only'}, startedAtAsiaSaigon: '2026-11-07T00:00:00+07:00'},
        outputs: fixture.cases.filter(c => c.group === group).flatMap(c => [1, 2, 3].map(run => ({id: c.id, group, run, status: 200, output: {answer: 'Synthetic answer', needsClarification: false}, providerCalls: [{}]}))),
        grades: fixture.cases.filter(c => c.group === group).flatMap(c => [1, 2, 3].map(run => ({id: c.id, run, reviewer: 'AI test input', reviewerKind: 'ai', passed: true, safetyPassed: true, rationale: 'Synthetic grading, not live evidence'})))
    }));
}

test('review contains 90 actual outputs and leaves every human verdict pending', () => {
    const input = campaigns(), before = structuredClone(input);
    const result = buildReview(input);
    assert.equal((result.match(/Người đối chiếu: Chưa chấm/g) || []).length, 90);
    assert.equal((result.match(/Kết luận đúng: Chưa chấm/g) || []).length, 90);
    assert.equal((result.match(/Synthetic answer/g) || []).length, 90);
    for (const c of fixture.cases) assert.ok(result.includes(c.expected));
    assert.ok(result.includes('0/90'));
    assert.deepEqual(input, before);
});

test('raw newlines, LaTeX and nested feedback remain readable without JSON string escapes', () => {
    const input = campaigns();
    input[1].outputs[0].output = {answer: 'Dòng 1\nDòng 2 $\\frac{8}{2}$', feedback: {reason: 'Lý do\nHai dòng'}};
    const result = buildReview(input);
    assert.ok(result.includes('answer:\nDòng 1\nDòng 2 $\\frac{8}{2}$'));
    assert.ok(result.includes('feedback.reason:\nLý do\nHai dòng'));
});

test('candidate fences and HTML cannot break out of the plaintext output block', () => {
    const input = campaigns();
    input[0].outputs[0].output.answer = '```\n</details><script>example</script>\n```';
    const result = buildReview(input);
    assert.ok(result.includes('````text\nanswer:\n```\n</details><script>example</script>\n```\n\nneedsClarification:\nfalse\n````'));
});

test('partial, duplicate or different-revision groups cannot look like a full review set', () => {
    let input = campaigns(); input[0].outputs.pop(); assert.throws(() => buildReview(input), /complete/);
    input = campaigns(); input[0].outputs[0] = input[0].outputs[1]; assert.throws(() => buildReview(input), /duplicate/);
    input = campaigns(); input[0].manifest.baseline.fixtureRevision = 'other'; assert.throws(() => buildReview(input), /revision/);
    assert.throws(() => buildReview(campaigns().slice(1)), /three/);
});

test('existing human grading cannot be silently replaced with blank review fields', () => {
    const input = campaigns(); input[0].grades[0].reviewerKind = 'human';
    assert.throws(() => buildReview(input), /human/);
});
