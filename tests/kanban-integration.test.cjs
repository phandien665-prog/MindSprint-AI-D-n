const test = require('node:test');
const assert = require('node:assert/strict');
const base = process.env.MINDSPRINT_TEST_API;

test('Kanban stores edits, priorities, dates and moves under the shared account', {skip: !base}, async () => {
    const accounts = [];
    const request = async (route, account, method = 'GET', body) => {
        const response = await fetch(base + route, {
            method, headers: {'Content-Type': 'application/json', ...(account ? {Authorization: 'Bearer ' + account.token} : {})},
            body: body === undefined ? undefined : JSON.stringify(body)
        });
        return {status: response.status, data: response.status === 204 ? null : await response.json().catch(() => null)};
    };
    try {
        for (let index = 0; index < 2; index++) {
            const result = await request('/api/auth/register', null, 'POST', {
                email: `kanban-qa-${crypto.randomUUID()}@example.test`, password: 'Kanban-Test-2026!', displayName: 'Kanban QA'
            });
            assert.equal(result.status, 200);
            accounts.push(result.data);
        }
        const [owner, other] = accounts;
        const created = await request('/api/tasks', owner, 'POST', {
            title: '  Ôn tập đại số  ', description: 'Ma trận nghịch đảo', priority: 'High', status: 2, dueDate: '2030-01-02T00:00:00'
        });
        assert.equal(created.status, 200);
        const id = created.data.id;
        assert.equal(created.data.title, 'Ôn tập đại số');
        assert.equal(created.data.status, 2);
        assert.equal(created.data.priority, 'High');
        assert.match(created.data.dueDate, /^2030-01-02/);

        const edited = await request(`/api/tasks/${id}`, owner, 'PUT', {
            title: 'Ôn tập chương 3', description: 'Đã chỉnh sửa', priority: 'Low', status: 1, dueDate: null
        });
        assert.equal(edited.status, 200);
        const persisted = (await request('/api/tasks', owner)).data.find(task => task.id === id);
        assert.equal(persisted.title, 'Ôn tập chương 3');
        assert.equal(persisted.priority, 'Low');
        assert.equal(persisted.status, 1);
        assert.equal(persisted.dueDate, null);

        const second = await request('/api/tasks', owner, 'POST', {title: 'Second task', status: 1});
        const third = await request('/api/tasks', owner, 'POST', {title: 'Third task', status: 1});
        assert.equal((await request(`/api/tasks/${third.data.id}/move`, owner, 'PATCH', {status: 1, position: 0})).status, 200);
        let tasks = (await request('/api/tasks', owner)).data;
        assert.deepEqual(tasks.map(task => task.id), [third.data.id, id, second.data.id]);
        assert.deepEqual(tasks.map(task => task.position), [0, 1, 2]);
        await request(`/api/tasks/${id}/move`, owner, 'PATCH', {status: 0, position: 0});
        tasks = (await request('/api/tasks', owner)).data;
        assert.deepEqual(tasks.filter(task => task.status === 1).map(task => task.position), [0, 1]);

        assert.equal((await request('/api/tasks', null)).status, 401);
        assert.deepEqual((await request('/api/tasks', other)).data, []);
        assert.equal((await request(`/api/tasks/${id}`, other, 'PUT', {title: 'Forbidden edit'})).status, 404);
        assert.equal((await request(`/api/tasks/${id}/move`, other, 'PATCH', {status: 2, position: 0})).status, 404);
        assert.equal((await request(`/api/tasks/${id}`, other, 'DELETE')).status, 404);
        for (const payload of [{title: ' '}, {title: 'bad', priority: 'Extreme'}, {title: 'bad', status: 9}]) {
            assert.equal((await request('/api/tasks', owner, 'POST', payload)).status, 400);
        }
        assert.equal((await request(`/api/tasks/${id}/move`, owner, 'PATCH', {status: 1, position: -1})).status, 400);
        assert.equal((await request(`/api/tasks/${id}`, owner, 'DELETE')).status, 204);
        assert.ok(!(await request('/api/tasks', owner)).data.some(task => task.id === id));
    } finally {
        // Only remove tasks belonging to the fresh accounts created by this test.
        for (const account of accounts) {
            const tasks = await request('/api/tasks', account);
            for (const task of tasks.data || []) await request(`/api/tasks/${task.id}`, account, 'DELETE');
            await request('/api/auth/revoke-all', account, 'POST');
        }
    }
});
