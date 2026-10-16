const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1200;
const MOOD_TAG = /^\s*\[mood:(neutral|happy|sad)\]\s*/i;

export function validateConversation(input) {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_MESSAGES) {
    return { ok: false, error: 'Hãy gửi một câu hỏi để bắt đầu nhé.' };
  }
  const messages = [];
  for (const item of input) {
    if (!item || !['user', 'assistant'].includes(item.role) || typeof item.content !== 'string') {
      return { ok: false, error: 'Tin nhắn không đúng định dạng.' };
    }
    const content = item.content.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
    if (!content || content.length > MAX_MESSAGE_LENGTH) {
      return { ok: false, error: 'Mỗi tin nhắn cần có nội dung và không dài quá 1.200 ký tự.' };
    }
    messages.push({ role: item.role, content });
  }
  if (messages.at(-1)?.role !== 'user') return { ok: false, error: 'Hãy gửi câu hỏi mới nhất của bạn.' };
  return { ok: true, messages };
}

function textFromContent(content) {
  if (typeof content === 'string') return content.trim();
  if (Array.isArray(content)) return content.filter(part => part?.type === 'text' && typeof part.text === 'string').map(part => part.text).join('\n').trim();
  return '';
}

export async function generatePetReply(messages) {
  const baseUrl = process.env.MANUS_API_URL;
  const apiKey = process.env.MANUS_API_KEY;
  if (!baseUrl || !apiKey) {
    const error = new Error('Manus AI service is not configured');
    error.code = 'AI_NOT_CONFIGURED';
    throw error;
  }
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: 'Bạn là Mầm, một pet đồng hành học tập đáng yêu, ấm áp và tôn trọng người dùng. Hãy trả lời bằng tiếng Việt tự nhiên, ngắn gọn (1–3 câu), hữu ích; khi phù hợp, gợi ý bước học nhỏ tiếp theo. Không phán xét, không bịa mình đã đọc tài liệu của người dùng. Nếu người dùng đang buồn hoặc căng thẳng, hãy phản hồi dịu dàng. Bắt đầu câu trả lời bằng đúng một thẻ [mood:neutral], [mood:happy] hoặc [mood:sad], trên cùng dòng, rồi viết nội dung trả lời.',
        },
        ...messages,
      ],
      max_tokens: 220,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(30_000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.error) {
    const error = new Error('Manus AI request failed');
    error.code = `AI_HTTP_${response.status || 502}`;
    throw error;
  }
  const raw = textFromContent(payload?.choices?.[0]?.message?.content);
  if (!raw) {
    const error = new Error('Manus AI returned no response text');
    error.code = 'AI_EMPTY_RESPONSE';
    throw error;
  }
  const match = raw.match(MOOD_TAG);
  const mood = match?.[1]?.toLowerCase() || 'neutral';
  const reply = raw.replace(MOOD_TAG, '').trim();
  if (!reply) {
    const error = new Error('Manus AI returned no usable response text');
    error.code = 'AI_EMPTY_RESPONSE';
    throw error;
  }
  return { reply, mood: ['neutral', 'happy', 'sad'].includes(mood) ? mood : 'neutral' };
}
