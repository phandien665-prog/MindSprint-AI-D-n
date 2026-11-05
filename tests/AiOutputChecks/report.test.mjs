import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture, summarize } from './report.mjs';

const outputs = fixture.cases.flatMap(c => [1, 2, 3].map(run => ({ id: c.id, group: c.group, run, status: 200, providerCalls: [{}] })));
const grades = outputs.map(o => ({ id: o.id, run: o.run, reviewer: 'Human fixture test', passed: true, safetyPassed: true, rationale: 'Synthetic grading input, not model evidence' }));
test('fixture locks 30 unique cases and 10 per group', () => {
    assert.equal(new Set(fixture.cases.map(c => c.id)).size, 30);
    for (const group of ['source', 'tutor', 'hint']) assert.equal(fixture.cases.filter(c => c.group === group).length, 10);
});
test('missing outputs and ungraded rows stay Blocked', () => {
    assert.equal(summarize([], []).status, 'Blocked');
    assert.equal(summarize(outputs, []).pending, 90);
    assert.equal(summarize(outputs.slice(1), grades).status, 'Blocked');
});
test('90 manually graded successes pass without changing thresholds', () => assert.equal(summarize(outputs, grades).status, 'Pass'));
test('a group below 27/30 fails; per-run variation is reported separately', () => {
    const changed = structuredClone(grades);
    for (const index of [0, 3, 6, 9]) changed[index] = { ...changed[index], passed: false, bugUrl: 'https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/55', severity: 'P1' };
    const result = summarize(outputs, changed);
    assert.equal(result.groups[0].correct, 26);
    assert.equal(result.status, 'Fail');
});
test('exactly 27/30 satisfies the original per-group threshold', () => {
    const changed = structuredClone(grades);
    for (const index of [0, 3, 6]) changed[index] = { ...changed[index], passed: false, bugUrl: 'https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/55', severity: 'P1' };
    assert.equal(summarize(outputs, changed).status, 'Pass');
});
test('a safety failure cannot hide in the 10% quality allowance', () => {
    const changed = structuredClone(grades);
    changed[0] = { ...changed[0], safetyPassed: false, bugUrl: 'https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/55', severity: 'P1' };
    assert.equal(summarize(outputs, changed).status, 'Fail');
});
test('provider error cannot be graded as correct and failures require bug/severity', () => {
    const changed = structuredClone(outputs); changed[0].status = 502;
    const result = summarize(changed, grades);
    assert.equal(result.status, 'Blocked'); assert.equal(result.scores[0].correct, 9);
});
test('duplicate and unknown rows are rejected instead of inflating scores', () => {
    assert.throws(() => summarize([...outputs, outputs[0]], grades), /duplicate/);
    assert.throws(() => summarize(outputs, [...grades, grades[0]]), /duplicate/);
    assert.throws(() => summarize([{ id: 'S99', run: 1 }], []), /Invalid/);
});
