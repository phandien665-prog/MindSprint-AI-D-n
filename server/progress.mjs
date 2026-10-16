const EVENT_REWARDS = {
  pet: { xp: 2, affection: 2 },
  chat: { xp: 5, affection: 1 },
  walk: { xp: 1, affection: 0 },
  jump: { xp: 2, affection: 0 },
  wave: { xp: 1, affection: 1 },
  happy: { xp: 1, affection: 0 },
  sad: { xp: 0, affection: 0 },
};
const VALID_MOODS = new Set(['neutral', 'happy', 'sad']);

export function isValidPetId(value) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function defaultProgress() {
  return { level: 1, xp: 0, affection: 0, mood: 'neutral', interactionCount: 0, lastInteractionAt: null, saved: false };
}

function mapRow(row, saved = true) {
  return {
    level: Number(row.level),
    xp: Number(row.xp),
    affection: Number(row.affection),
    mood: VALID_MOODS.has(row.mood) ? row.mood : 'neutral',
    interactionCount: Number(row.interaction_count),
    lastInteractionAt: row.last_interaction_at ? new Date(row.last_interaction_at).toISOString() : null,
    saved,
  };
}

export async function readPetProgress(pool, petId) {
  const [rows] = await pool.execute(
    'SELECT level, xp, affection, mood, interaction_count, last_interaction_at FROM pet_progress WHERE pet_id = ?',
    [petId],
  );
  return rows.length ? mapRow(rows[0]) : defaultProgress();
}

export async function recordPetEvent(pool, petId, event, mood = 'neutral') {
  const reward = EVENT_REWARDS[event];
  if (!reward) throw new TypeError('Unsupported pet event');
  const safeMood = VALID_MOODS.has(mood) ? mood : 'neutral';
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      "INSERT IGNORE INTO pet_progress (pet_id, level, xp, affection, mood, interaction_count) VALUES (?, 1, 0, 0, 'neutral', 0)",
      [petId],
    );
    const [rows] = await connection.execute(
      'SELECT level, xp, affection, mood, interaction_count, last_interaction_at FROM pet_progress WHERE pet_id = ? FOR UPDATE',
      [petId],
    );
    const current = rows[0];
    const xp = Number(current.xp) + reward.xp;
    const level = Math.floor(xp / 80) + 1;
    const affection = Math.min(1000, Number(current.affection) + reward.affection);
    const interactionCount = Number(current.interaction_count) + 1;
    await connection.execute(
      'UPDATE pet_progress SET level = ?, xp = ?, affection = ?, mood = ?, interaction_count = ?, last_interaction_at = CURRENT_TIMESTAMP WHERE pet_id = ?',
      [level, xp, affection, safeMood, interactionCount, petId],
    );
    const [updated] = await connection.execute(
      'SELECT level, xp, affection, mood, interaction_count, last_interaction_at FROM pet_progress WHERE pet_id = ?',
      [petId],
    );
    await connection.commit();
    return mapRow(updated[0]);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
