async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || 'Không kết nối được với máy chủ.');
    error.status = response.status;
    throw error;
  }
  return payload;
}

export function fetchPetProgress(petId) {
  return request(`/api/pet/progress?petId=${encodeURIComponent(petId)}`, { method: 'GET', headers: {} });
}

export function recordPetEvent(petId, event, mood = 'neutral') {
  return request('/api/pet/progress', {
    method: 'POST',
    body: JSON.stringify({ petId, event, mood }),
  });
}

export function sendPetChat(petId, messages, requestId) {
  return request('/api/pet/chat', {
    method: 'POST',
    headers: { 'X-Request-Id': requestId },
    body: JSON.stringify({ petId, messages }),
  });
}
