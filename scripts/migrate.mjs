import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { closeDatabasePool, getDatabasePool } from '../server/db.mjs';

const version = '001_pet_progress';
const migrationPath = resolve('migrations/001_pet_progress.sql');
const pool = getDatabasePool();
let connection;

try {
  connection = await pool.getConnection();
  await connection.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(64) NOT NULL PRIMARY KEY,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  const [rows] = await connection.execute('SELECT version FROM schema_migrations WHERE version = ?', [version]);
  if (rows.length) {
    console.log(`${version}: already applied`);
  } else {
    const sql = await readFile(migrationPath, 'utf8');
    const statements = sql.split(';').map(statement => statement.trim()).filter(Boolean);
    for (const statement of statements) await connection.query(statement);
    await connection.execute('INSERT INTO schema_migrations (version) VALUES (?)', [version]);
    console.log(`${version}: applied`);
  }
} finally {
  connection?.release();
  await closeDatabasePool();
}
