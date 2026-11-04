// Test Suite for Issue #44 (NFR-03) on Live Production:
// Backend: https://mindsprint-api-zyur.onrender.com
const test = require('node:test');
const assert = require('node:assert/strict');

const API = process.env.LIVE_API || 'https://mindsprint-api-zyur.onrender.com';

test('Live Issue #44 (NFR-03): Authentication, Anti-IDOR Matrix & Concurrency on Live Render API', { timeout: 120000 }, async () => {
    console.log(`\n================================================================================`);
    console.log(`   LIVE VERIFICATION — ISSUE #44 (NFR-03): AUTH & ISOLATION                   `);
    console.log(`================================================================================`);
    console.log(`Target: ${API}\n`);

    const ts = Date.now();
    const emailA = `live-a-${ts}@test.mindsprint.vn`;
    const emailB = `live-b-${ts}@test.mindsprint.vn`;
    const passwordA = 'PassAlice123!';
    const passwordB = 'PassBob123!';

    // --- 1. Registration & Authentication ---
    console.log('[1/5] Testing User Registration & Password Validation on Live API...');
    
    // Register User A
    const regResA = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailA, password: passwordA, displayName: 'Alice Live' })
    });
    assert.equal(regResA.status, 200, 'User A registration should succeed (200)');
    const authA = await regResA.json();
    assert.ok(authA.token && authA.refreshToken, 'Should issue JWT and RefreshToken');
    console.log('  [PASS] User A registered successfully');

    // Duplicate registration should be rejected
    const dupRes = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailA, password: passwordA, displayName: 'Alice Dup' })
    });
    assert.equal(dupRes.status, 409, 'Duplicate email must return 409 Conflict');
    console.log('  [PASS] Duplicate email registration rejected (409 Conflict)');

    // Wrong password login
    const wrongLogin = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailA, password: 'WrongPassword999!' })
    });
    assert.equal(wrongLogin.status, 401, 'Wrong password must return 401 Unauthorized');
    console.log('  [PASS] Wrong password rejected (401 Unauthorized)');

    // Register User B
    const regResB = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailB, password: passwordB, displayName: 'Bob Live' })
    });
    assert.equal(regResB.status, 200, 'User B registration should succeed');
    const authB = await regResB.json();
    console.log('  [PASS] User B registered successfully');

    const headersA = { 'Authorization': `Bearer ${authA.token}`, 'Content-Type': 'application/json' };
    const headersB = { 'Authorization': `Bearer ${authB.token}`, 'Content-Type': 'application/json' };

    // --- 2. JWT Security & Tampering ---
    console.log('\n[2/5] Testing JWT Tampering & Unauthenticated Access on Live API...');
    
    // Unauthenticated request
    const unauthRes = await fetch(`${API}/api/tasks`);
    assert.equal(unauthRes.status, 401, 'Unauthenticated request must return 401');
    console.log('  [PASS] Unauthenticated request rejected (401)');

    // Tampered token (attacker signature)
    const forgedToken = authA.token.slice(0, -10) + 'ABCDEFGHIJ';
    const tamperedRes = await fetch(`${API}/api/tasks`, {
        headers: { 'Authorization': `Bearer ${forgedToken}` }
    });
    assert.equal(tamperedRes.status, 401, 'Tampered token must return 401');
    console.log('  [PASS] Tampered JWT signature rejected (401)');

    // --- 3. Anti-IDOR Matrix (User B attacking User A's resources) ---
    console.log('\n[3/5] Testing Anti-IDOR Matrix (Tasks, Flashcards, Notebooks, Study)...');

    // 3.1 Tasks (Kanban)
    const taskResA = await fetch(`${API}/api/tasks`, {
        method: 'POST',
        headers: headersA,
        body: JSON.stringify({ title: 'Alice Secret Task', description: 'Classified', status: 0 })
    });
    assert.equal(taskResA.status, 200);
    const taskA = await taskResA.json();

    // User B tries to get tasks -> should not see taskA
    const tasksBRes = await fetch(`${API}/api/tasks`, { headers: headersB });
    const tasksB = await tasksBRes.json();
    assert.ok(!tasksB.some(t => t.id === taskA.id), 'User B must not see User A task');
    console.log('  [PASS] Tasks: User B cannot see User A private task');

    // User B tries to update taskA
    const updateTaskB = await fetch(`${API}/api/tasks/${taskA.id}`, {
        method: 'PUT',
        headers: headersB,
        body: JSON.stringify({ title: 'Hacked by Bob', description: 'Attack', status: 1 })
    });
    assert.equal(updateTaskB.status, 404, 'User B editing User A task must return 404');
    console.log('  [PASS] Tasks: User B editing User A task returns 404');

    // User B tries to move taskA
    const moveTaskB = await fetch(`${API}/api/tasks/${taskA.id}/move`, {
        method: 'PATCH',
        headers: headersB,
        body: JSON.stringify({ status: 2, position: 0 })
    });
    assert.equal(moveTaskB.status, 404, 'User B moving User A task must return 404');
    console.log('  [PASS] Tasks: User B moving User A task returns 404');

    // User B tries to delete taskA
    const delTaskB = await fetch(`${API}/api/tasks/${taskA.id}`, {
        method: 'DELETE',
        headers: headersB
    });
    assert.equal(delTaskB.status, 404, 'User B deleting User A task must return 404');
    console.log('  [PASS] Tasks: User B deleting User A task returns 404');

    // 3.2 Flashcards
    const cardResA = await fetch(`${API}/api/flashcards`, {
        method: 'POST',
        headers: headersA,
        body: JSON.stringify({
            category: 'programming',
            subCategory: 'security',
            question: 'Alice Secret Question',
            answer: 'Alice Secret Answer'
        })
    });
    assert.equal(cardResA.status, 200);
    const cardA = await cardResA.json();
    const cardIdA = cardA.id || cardA.externalId;

    // User B gets cards -> should not see cardA
    const cardsBRes = await fetch(`${API}/api/flashcards`, { headers: headersB });
    const cardsB = await cardsBRes.json();
    assert.ok(!cardsB.some(c => (c.id || c.externalId) === cardIdA), 'User B must not see User A private flashcard');
    console.log('  [PASS] Flashcards: User B cannot see User A private card');

    // User B tries to update cardA
    const updateCardB = await fetch(`${API}/api/flashcards/${cardIdA}`, {
        method: 'PUT',
        headers: headersB,
        body: JSON.stringify({ question: 'Hacked', answer: 'Hacked', category: 'all' })
    });
    assert.equal(updateCardB.status, 404, 'User B editing User A card must return 404');
    console.log('  [PASS] Flashcards: User B editing User A card returns 404');

    // User B tries to delete cardA
    const delCardB = await fetch(`${API}/api/flashcards/${cardIdA}`, {
        method: 'DELETE',
        headers: headersB
    });
    assert.equal(delCardB.status, 404, 'User B deleting User A card must return 404');
    console.log('  [PASS] Flashcards: User B deleting User A card returns 404');

    // 3.3 Notebooks
    const nbResA = await fetch(`${API}/api/notebooks`, {
        method: 'POST',
        headers: headersA,
        body: JSON.stringify({ title: 'Alice Secret Notebook' })
    });
    assert.equal(nbResA.status, 200);
    const nbA = await nbResA.json();

    // User B lists notebooks -> should not see nbA
    const nbsBRes = await fetch(`${API}/api/notebooks`, { headers: headersB });
    const nbsB = await nbsBRes.json();
    assert.ok(!nbsB.some(n => n.id === nbA.id), 'User B must not see User A notebook');
    console.log('  [PASS] Notebooks: User B cannot see User A notebook');

    // User B tries to inspect sources of nbA
    const srcB = await fetch(`${API}/api/notebooks/${nbA.id}/sources`, { headers: headersB });
    assert.equal(srcB.status, 404, 'User B inspecting User A sources must return 404');
    console.log('  [PASS] Notebooks: User B inspecting User A sources returns 404');

    // User B tries to delete nbA
    const delNbB = await fetch(`${API}/api/notebooks/${nbA.id}`, { method: 'DELETE', headers: headersB });
    assert.equal(delNbB.status, 404, 'User B deleting User A notebook must return 404');
    console.log('  [PASS] Notebooks: User B deleting User A notebook returns 404');

    // 3.4 Study Stats Isolation
    const streakBRes = await fetch(`${API}/api/study/streak`, { headers: headersB });
    assert.equal(streakBRes.status, 200);
    const streakB = await streakBRes.json();
    assert.equal(streakB.currentStreak, 0, 'User B must have isolated 0 streak');
    console.log('  [PASS] Study Stats: User B streak is strictly isolated');

    // --- 4. Refresh Token Rotation & Concurrency on Live DB ---
    console.log('\n[4/5] Testing Refresh Token Rotation & Concurrency Protection...');

    // Single rotation
    const rotRes = await fetch(`${API}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: authA.refreshToken })
    });
    assert.equal(rotRes.status, 200, 'Valid refresh token must rotate successfully (200)');
    const newAuthA = await rotRes.json();
    assert.ok(newAuthA.token && newAuthA.refreshToken);
    console.log('  [PASS] Token rotation succeeded, issued new tokens');

    // Replay attack with old token
    const replayRes = await fetch(`${API}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: authA.refreshToken })
    });
    assert.equal(replayRes.status, 401, 'Replaying revoked refresh token must return 401');
    console.log('  [PASS] Replay of revoked refresh token rejected (401)');

    // Concurrency: 10 parallel requests rotating the exact same active refresh token
    console.log('  Testing Concurrency: 10 parallel requests rotating same refresh token...');
    const curRefresh = newAuthA.refreshToken;
    const concurrentRotations = await Promise.all(
        Array.from({ length: 10 }, () =>
            fetch(`${API}/api/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: curRefresh })
            }).then(r => r.status)
        )
    );

    const successCount = concurrentRotations.filter(s => s === 200).length;
    const rejectedCount = concurrentRotations.filter(s => s === 401).length;
    console.log(`  Parallel Results: ${successCount} succeeded, ${rejectedCount} rejected`);
    assert.equal(successCount, 1, `Exactly 1 concurrent request should succeed, got ${successCount}`);
    assert.equal(rejectedCount, 9, `Exactly 9 concurrent requests should be rejected, got ${rejectedCount}`);
    console.log('  [PASS] Concurrency Protection verified on Live PostgreSQL (Atomic ExecuteUpdate)');

    // --- 5. Google Auth Config Check ---
    console.log('\n[5/5] Checking Google Auth Configuration on Live API...');
    const gConfigRes = await fetch(`${API}/api/auth/google/config`);
    assert.equal(gConfigRes.status, 200);
    const gConfig = await gConfigRes.json();
    assert.ok(gConfig !== null && typeof gConfig.enabled === 'boolean');
    assert.ok(!JSON.stringify(gConfig).includes('Secret'), 'Must never expose Google client secret');
    console.log(`  [PASS] Google Auth public config verified (enabled: ${gConfig.enabled})`);

    console.log(`\n================================================================================`);
    console.log(`   ALL LIVE ISSUE #44 (NFR-03) TESTS PASSED ON RENDER + POSTGRESQL!            `);
    console.log(`================================================================================`);
});
