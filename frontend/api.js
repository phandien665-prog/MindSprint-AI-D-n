// MindSprint API client - nối frontend (HTML/CSS/JS) với backend ASP.NET Core.
// Tự động thử luân chuyển cổng 5000 và 5100 nếu một trong hai đang lắng nghe.
(function () {
    const configuredApiBase = window.MINDSPRINT_CONFIG?.apiBase?.trim();
    const isLocal = ['localhost', '127.0.0.1', '::1'].includes(window.location?.hostname ?? 'localhost');
    const DEFAULT_API_BASE = configuredApiBase || (isLocal ? 'http://localhost:5000' : '');
    let API_BASE = localStorage.getItem('api-base') || DEFAULT_API_BASE;
    const TOKEN_KEY = 'ms-token';
    const USER_KEY = 'ms-user';
    const REFRESH_TOKEN_KEY = 'ms-refresh-token';
    let sessionVersion = 0;
    const sessionListeners = new Set();

    const getToken = () => localStorage.getItem(TOKEN_KEY);
    const getUser = () => {
        try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
    };
    const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
    const setTokens = (access, refresh) => {
        localStorage.setItem(TOKEN_KEY, access);
        if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
        else localStorage.removeItem(REFRESH_TOKEN_KEY);
    };
    const clearTokens = () => {
        sessionVersion++;
        refreshPromise = null;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        sessionListeners.forEach(listener => listener());
    };

    async function fetchWithFallback(path, options) {
        if (!API_BASE) throw new Error('Backend API is not configured. Set API_BASE for this deployment.');
        try {
            return await fetch(API_BASE + path, options);
        } catch {
            const altBase = API_BASE.includes(':5000')
                ? API_BASE.replace(':5000', ':5100')
                : API_BASE.includes(':5100') ? API_BASE.replace(':5100', ':5000') : null;
            if (!altBase) throw new Error('Không thể kết nối đến máy chủ backend. Hãy kiểm tra kết nối mạng.');
            try {
                const res = await fetch(altBase + path, options);
                API_BASE = altBase;
                localStorage.setItem('api-base', altBase);
                return res;
            } catch {
                throw new Error('Không thể kết nối đến máy chủ backend (cổng 5000/5100). Hãy đảm bảo backend đang chạy.');
            }
        }
    }

    let refreshPromise = null;

    function expireSession(version) {
        if (version === sessionVersion) clearTokens();
        const error = new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        error.status = 401;
        throw error;
    }

    async function responseError(res) {
        const data = await res.json().catch(() => ({}));
        const validation = data.errors ? Object.values(data.errors).flat().join(' ') : '';
        const error = new Error(data.message || validation || 'Lỗi ' + res.status);
        error.status = res.status;
        error.code = data.code;
        error.retryAfterSeconds = data.retryAfterSeconds;
        if (res.status === 409) {
            error.isConflict = true;
            error.serverData = data;
        }
        return error;
    }

    async function request(path, { method = 'GET', body, auth = true, retry = true, allowConflict = false } = {}) {
        const version = sessionVersion;
        const headers = { 'Content-Type': 'application/json' };
        if (auth && getToken()) headers.Authorization = 'Bearer ' + getToken();
        const res = await fetchWithFallback(path, { method, headers, body: body ? JSON.stringify(body) : undefined });
        if (auth && version !== sessionVersion) throw new Error('Tài khoản đã thay đổi. Vui lòng thử lại.');

        if (res.status === 401 && auth && retry && getRefreshToken()) {
            // Try to refresh token
            const newToken = await refreshAccessToken();
            if (newToken) {
                // Retry original request with new token
                return request(path, { method, body, auth, retry: false, allowConflict });
            }
            // Refresh failed, clear tokens and throw
            expireSession(version);
        }

        if (res.status === 401 && auth) {
            expireSession(version);
        }

        if (!res.ok) throw await responseError(res);
        return res.status === 204 ? null : res.json();
    }

    async function refreshAccessToken() {
        if (refreshPromise) return refreshPromise;
        const version = sessionVersion;
        const refreshToken = getRefreshToken();
        if (!refreshToken) return null;
        const pendingRefresh = (async () => {
          try {
            const res = await fetchWithFallback('/api/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken, deviceHint: navigator.userAgent })
            });

            if (!res.ok || version !== sessionVersion || refreshToken !== getRefreshToken()) return null;

            const data = await res.json();
            if (version !== sessionVersion || refreshToken !== getRefreshToken()) return null;
            setTokens(data.token, data.refreshToken);
            return data.token;
          } catch {
            return null;
          }
        })();
        refreshPromise = pendingRefresh;
        try { return await pendingRefresh; }
        finally { if (refreshPromise === pendingRefresh) refreshPromise = null; }
    }

    async function authenticate(path, payload) {
        const version = sessionVersion;
        const data = await request(path, { method: 'POST', body: payload, auth: false });
        if (version !== sessionVersion) throw new Error('Phiên đăng nhập đã thay đổi. Vui lòng thử lại.');
        sessionVersion++;
        refreshPromise = null;
        setTokens(data.token, data.refreshToken);
        if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
    }

    async function upload(path, formData) {
        const version = sessionVersion;
        let res = await fetchWithFallback(path, { method: 'POST', headers: { Authorization: 'Bearer ' + getToken() }, body: formData });
        if (version !== sessionVersion) throw new Error('Tài khoản đã thay đổi. Vui lòng thử lại.');
        if (res.status === 401) {
            const newToken = await refreshAccessToken();
            if (newToken) {
                res = await fetchWithFallback(path, { method: 'POST', headers: { Authorization: 'Bearer ' + newToken }, body: formData });
            }
            if (!newToken || res.status === 401) expireSession(version);
        }
        if (version !== sessionVersion) throw new Error('Tài khoản đã thay đổi. Vui lòng thử lại.');
        if (!res.ok) throw await responseError(res);
        return res.json();
    }

    window.MindSprintApi = {
        isLoggedIn: () => !!getToken(),
        getUser: getUser,
        getMe: () => request('/api/auth/me'),
        onSessionEnded: (listener) => { sessionListeners.add(listener); return () => sessionListeners.delete(listener); },
        getApiBase: () => API_BASE,
        login: (email, password) => authenticate('/api/auth/login', { email, password }),
        googleConfig: () => request('/api/auth/google/config', { auth: false }),
        googleChallenge: () => request('/api/auth/google/challenge', { auth: false }),
        googleLogin: (credential, nonce, existingPassword) => authenticate('/api/auth/google', { credential, nonce, existingPassword }),
        demoLogin: () => authenticate('/api/auth/demo', {}),
        register: (email, password, displayName) => authenticate('/api/auth/register', { email, password, displayName }),
        logout: () => clearTokens(),
        revokeCurrentSession: () => request('/api/auth/revoke', { method: 'POST', body: { refreshToken: getRefreshToken() }, retry: false }),
        revokeAllSessions: () => request('/api/auth/revoke-all', { method: 'POST' }),

        // Flashcards + trạng thái SRS
        getCards: () => request('/api/flashcards'),
        createCard: (c) => request('/api/flashcards', { method: 'POST', body: { externalId: String(c.id), category: c.category, subCategory: c.subCategory || null, question: c.question, answer: c.answer, example: c.example || null } }),
        updateCard: (c) => request('/api/flashcards/' + encodeURIComponent(c.id), { method: 'PUT', body: { category: c.category, subCategory: c.subCategory || null, question: c.question, answer: c.answer, example: c.example || null, version: c.version } }, { allowConflict: true }),
        deleteCard: (id, version) => request('/api/flashcards/' + encodeURIComponent(id) + (version ? '?version=' + version : ''), { method: 'DELETE' }, { allowConflict: true }),

        // Spaced Repetition: gửi kết quả ôn, server tính NextReviewDate
        review: (cardId, remembered) => request('/api/review', { method: 'POST', body: { cardId: String(cardId), remembered } }),
        getDue: () => request('/api/review/due'),

        // Kanban
        getTasks: () => request('/api/tasks'),
        createTask: (t) => request('/api/tasks', { method: 'POST', body: t }),
        updateTask: (id, t) => request('/api/tasks/' + id, { method: 'PUT', body: t }),
        moveTask: (id, status, position) => request(`/api/tasks/${id}/move`, { method: 'PATCH', body: { status, position } }),
        deleteTask: (id) => request('/api/tasks/' + id, { method: 'DELETE' }),

        // Notebook (kiểu NotebookLM)
        nbList: () => request('/api/notebooks'),
        nbCreate: (title) => request('/api/notebooks', { method: 'POST', body: { title } }),
        nbDelete: (id) => request('/api/notebooks/' + id, { method: 'DELETE' }),
        nbSources: (id) => request(`/api/notebooks/${id}/sources`),
        nbAddText: (id, title, text) => request(`/api/notebooks/${id}/sources/text`, { method: 'POST', body: { title, text } }),
        nbAddUrl: (id, url) => request(`/api/notebooks/${id}/sources/url`, { method: 'POST', body: { url } }),
        nbAddFile: (id, file) => { const f = new FormData(); f.append('file', file); return upload(`/api/notebooks/${id}/sources/file`, f); },
        nbDeleteSource: (id, sid) => request(`/api/notebooks/${id}/sources/${sid}`, { method: 'DELETE' }),
        nbChat: (id, question, history) => request(`/api/notebooks/${id}/chat`, { method: 'POST', body: { question, history } }),
        nbTutor: (id, question, style, history) => request(`/api/notebooks/${id}/tutor`, { method: 'POST', body: { question, style, history } }),
        nbTutorWork: (id, body) => request(`/api/notebooks/${id}/tutor`, { method: 'POST', body }),
        nbTutorFile: (id, file, body) => { const f = new FormData(); f.append('file', file); f.append('request', JSON.stringify(body)); return upload(`/api/notebooks/${id}/tutor/file`, f); },
        nbTutorOcr: (id, file) => { const f = new FormData(); f.append('file', file); return upload(`/api/notebooks/${id}/tutor/ocr`, f); },
        nbSuggestions: (id) => request(`/api/notebooks/${id}/suggestions`),
        nbGenerate: (id, type, focus, count) => request(`/api/notebooks/${id}/generate`, { method: 'POST', body: { type, focus, count } }),
        nbSaveCards: (id, cards) => request(`/api/notebooks/${id}/save-cards`, { method: 'POST', body: { cards } }),
        nbNotes: (id) => request(`/api/notebooks/${id}/notes`),
        nbAddNote: (id, title, content) => request(`/api/notebooks/${id}/notes`, { method: 'POST', body: { title, content } }),
        nbDeleteNote: (id, nid) => request(`/api/notebooks/${id}/notes/${nid}`, { method: 'DELETE' }),

        // Gemini
        aiFlashcards: (text, count = 10) => request('/api/ai/flashcards', { method: 'POST', body: { text, count } }),
        aiQuiz: (text, count = 10) => request('/api/ai/quiz', { method: 'POST', body: { text, count } }),
        aiExtractFile: (file) => { const f = new FormData(); f.append('file', file); return upload('/api/ai/extract-file', f); },

        // Study Stats (Issue #14)
        studyGetDays: (from, to) => {
            const params = new URLSearchParams();
            if (from) params.append('from', from);
            if (to) params.append('to', to);
            return request('/api/study/days?' + params.toString());
        },
        studyUpsertDay: (studyDate, cardsReviewed, minutesStudied) => request('/api/study/days', { method: 'POST', body: { studyDate, cardsReviewed, minutesStudied } }),
        studyGetStreak: () => request('/api/study/streak'),
        studyGetSchedule: () => request('/api/study/schedule'),
        studyCreateSchedule: (dayOfWeek, startTime, durationMinutes, label) => request('/api/study/schedule', { method: 'POST', body: { dayOfWeek, startTime, durationMinutes, label } }),
        studyUpdateSchedule: (id, dayOfWeek, startTime, durationMinutes, label) => request('/api/study/schedule/' + id, { method: 'PUT', body: { dayOfWeek, startTime, durationMinutes, label } }),
        studyToggleSchedule: (id) => request('/api/study/schedule/' + id + '/toggle', { method: 'PATCH' }),
        studyDeleteSchedule: (id) => request('/api/study/schedule/' + id, { method: 'DELETE' }),

        // Weak Areas (Issue #35)
        getWeakAreas: () => request('/api/weak-areas'),
        analyzeWeakAreas: () => request('/api/weak-areas/analyze', { method: 'POST' })
    };
})();
