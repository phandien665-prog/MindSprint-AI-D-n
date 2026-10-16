import express from 'express';
import { createServer as createHttpServer } from 'node:http';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { closeDatabasePool, getDatabasePool } from './server/db.mjs';
import { isValidPetId, readPetProgress, recordPetEvent } from './server/progress.mjs';
import { generatePetReply, validateConversation } from './server/llm.mjs';

const app = express();
const httpServer = createHttpServer(app);
const isProduction = process.env.NODE_ENV === 'production';
const root = fileURLToPath(new URL('.', import.meta.url));
const staticRoot = resolve(root, 'dist');
const chatRate = new Map();
const idempotencyCache = new Map();
app.disable('x-powered-by');
app.use(express.json({ limit: '24kb', strict: true }));

function allowChat(ip) {
  const now = Date.now();
  let item = chatRate.get(ip);
  if (!item || now - item.startedAt > 60_000) item = { startedAt: now, count: 0 };
  item.count += 1;
  chatRate.set(ip, item);
  if (chatRate.size > 5000) {
    for (const [key, value] of chatRate) if (now - value.startedAt > 60_000) chatRate.delete(key);
  }
  return item.count <= 20;
}

function validatePetRequest(body) {
  return body && isValidPetId(body.petId);
}

app.get('/_app/health', async (_request, response) => {
  try {
    await getDatabasePool().query('SELECT 1');
    response.status(200).json({ ok: true });
  } catch (error) {
    console.error('[health]', error.code || 'database_unavailable');
    response.status(503).json({ ok: false, error: 'Service not ready' });
  }
});

app.get('/api/pet/progress', async (request, response) => {
  const petId = String(request.query.petId || '');
  if (!isValidPetId(petId)) return response.status(400).json({ error: 'Mã pet không hợp lệ.' });
  try {
    const progress = await readPetProgress(getDatabasePool(), petId);
    return response.json({ progress });
  } catch (error) {
    console.error('[progress:read]', error.code || 'database_error');
    return response.status(503).json({ error: 'Chưa tải được tiến trình pet. Thử tải lại sau nhé.' });
  }
});

app.post('/api/pet/progress', async (request, response) => {
  if (!validatePetRequest(request.body)) return response.status(400).json({ error: 'Mã pet không hợp lệ.' });
  const { petId, event, mood } = request.body;
  if (!['pet', 'walk', 'jump', 'wave', 'happy', 'sad'].includes(event)) return response.status(400).json({ error: 'Hành động pet không hợp lệ.' });
  try {
    const progress = await recordPetEvent(getDatabasePool(), petId, event, mood);
    return response.json({ progress });
  } catch (error) {
    console.error('[progress:write]', error.code || 'database_error');
    return response.status(503).json({ error: 'Chưa lưu được tiến trình. Thử lại sau nhé.' });
  }
});

app.post('/api/pet/chat', async (request, response) => {
  const body = request.body || {};
  if (!validatePetRequest(body)) return response.status(400).json({ error: 'Mã pet không hợp lệ.' });
  const validated = validateConversation(body.messages);
  if (!validated.ok) return response.status(400).json({ error: validated.error });
  const ip = request.socket.remoteAddress || 'unknown';
  if (!allowChat(ip)) return response.status(429).json({ error: 'Mình cần nghỉ một chút nhé. Anh thử lại sau một phút.' });

  const requestId = String(request.get('X-Request-Id') || '');
  const cacheKey = /^[0-9a-f-]{36}$/i.test(requestId) ? `${body.petId}:${requestId}` : '';
  const now = Date.now();
  for (const [key, entry] of idempotencyCache) if (entry.expiresAt <= now) idempotencyCache.delete(key);
  if (cacheKey && idempotencyCache.has(cacheKey)) return response.json(idempotencyCache.get(cacheKey).payload);

  try {
    const { reply, mood } = await generatePetReply(validated.messages);
    let progress = null;
    let progressSaved = false;
    try {
      progress = await recordPetEvent(getDatabasePool(), body.petId, 'chat', mood);
      progressSaved = true;
    } catch (error) {
      console.error('[progress:chat]', error.code || 'database_error');
    }
    const payload = { reply, mood, progress, progressSaved };
    if (cacheKey) idempotencyCache.set(cacheKey, { expiresAt: now + 120_000, payload });
    return response.json(payload);
  } catch (error) {
    console.error('[pet:chat]', error.code || 'ai_request_failed');
    const status = error.code === 'AI_NOT_CONFIGURED' ? 503 : 502;
    return response.status(status).json({ error: 'Mầm chưa gọi được AI lúc này. Tin nhắn vẫn còn ở đây, anh có thể thử lại.' });
  }
});

app.use((error, _request, response, next) => {
  if (response.headersSent) return next(error);
  if (error?.type === 'entity.too.large') return response.status(413).json({ error: 'Tin nhắn gửi lên quá lớn.' });
  console.error('[server]', error.code || 'request_error');
  return response.status(500).json({ error: 'Có lỗi nhỏ ở phía máy chủ. Thử lại nhé.' });
});

if (isProduction) {
  app.use(express.static(staticRoot, { index: false, maxAge: '1h' }));
  app.use((request, response, next) => {
    if (request.method === 'GET' && request.accepts('html') && !request.path.startsWith('/api/') && !request.path.startsWith('/_app/')) {
      return response.sendFile(resolve(staticRoot, 'index.html'));
    }
    return next();
  });
  app.use((_request, response) => response.status(404).json({ error: 'Không tìm thấy tài nguyên.' }));
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    configFile: resolve(root, 'vite.config.js'),
    appType: 'spa',
    server: { middlewareMode: true, hmr: { server: httpServer } },
  });
  app.use(vite.middlewares);
}

const port = Number(process.env.PORT) || 3000;
httpServer.listen(port, '0.0.0.0', () => console.log(`MindSprintAI listening on ${port}`));

async function shutdown() {
  httpServer.close(async () => {
    await closeDatabasePool().catch(() => {});
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 8000).unref();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
