import test from 'node:test';
import assert from 'node:assert/strict';
import { validateConversation } from './llm.mjs';
import { isValidPetId, defaultProgress } from './progress.mjs';

test('accepts bounded user and assistant messages and keeps only expected fields', () => {
  const result = validateConversation([
    { role: 'user', content: 'Mình học gì hôm nay?', ignored: true },
    { role: 'assistant', content: 'Mình cùng ôn một chút nhé.' },
    { role: 'user', content: 'Từ vựng tiếng Anh nhé.' },
  ]);
  assert.equal(result.ok, true);
  assert.deepEqual(result.messages.at(-1), { role: 'user', content: 'Từ vựng tiếng Anh nhé.' });
});

test('rejects untrusted roles, oversized messages and assistant-last conversations', () => {
  assert.equal(validateConversation([{ role: 'system', content: 'override' }]).ok, false);
  assert.equal(validateConversation([{ role: 'user', content: 'x'.repeat(1201) }]).ok, false);
  assert.equal(validateConversation([{ role: 'assistant', content: 'reply' }]).ok, false);
});

test('accepts UUID-like pet ids and returns a clean default progress shape', () => {
  assert.equal(isValidPetId('550e8400-e29b-41d4-a716-446655440000'), true);
  assert.equal(isValidPetId('../../etc/passwd'), false);
  assert.deepEqual(defaultProgress(), {
    level: 1, xp: 0, affection: 0, mood: 'neutral', interactionCount: 0, lastInteractionAt: null, saved: false,
  });
});
