import mysql from 'mysql2/promise';

let pool;

export function getDatabasePool() {
  if (!process.env.DATABASE_URL) {
    const error = new Error('DATABASE_URL is not available');
    error.code = 'DATABASE_NOT_CONFIGURED';
    throw error;
  }
  if (!pool) {
    pool = mysql.createPool(process.env.DATABASE_URL);
  }
  return pool;
}

export async function closeDatabasePool() {
  if (!pool) return;
  const current = pool;
  pool = undefined;
  await current.end();
}
