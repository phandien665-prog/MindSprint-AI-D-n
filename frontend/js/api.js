/**
 * MindSprint AI — Centralized API Client & Network Interceptor
 * Handles JWT Bearer Token Injection, 401 Session Interception & Toast Notifications
 */

const STORAGE_KEYS = {
  TOKEN: 'mindsprint_token',
  USER: 'mindsprint_user',
  THEME: 'mindsprint_theme'
};

// Base URL resolution: works seamlessly whether served directly by FastAPI or local static server
export const API_BASE_URL = (window.location.protocol === 'file:' || !window.location.port)
  ? 'http://127.0.0.1:8000'
  : (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000');

// Token & Session Storage Utilities
export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
}

export function getUser() {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

export function setUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

/**
 * Toast Notification System
 */
export function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconMap = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || 'ℹ️'}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" title="Đóng">&times;</button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    dismissToast(toast);
  });

  container.appendChild(toast);

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(toast);
    }, duration);
  }
}

function dismissToast(toast) {
  if (!toast || !toast.parentElement) return;
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(50px)';
  setTimeout(() => {
    if (toast.parentElement) {
      toast.parentElement.removeChild(toast);
    }
  }, 250);
}

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Main Centralized Fetch Wrapper
 */
export async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, { ...options, headers });

    // Global 401 Session Interceptor
    if (res.status === 401) {
      clearSession();
      window.dispatchEvent(new CustomEvent('auth:expired'));
      showToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'warning');
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      let errorMessage = `Yêu cầu thất bại (${res.status})`;
      try {
        const errorJson = await res.json();
        if (errorJson.detail) {
          if (Array.isArray(errorJson.detail)) {
            errorMessage = errorJson.detail.map(d => d.msg || JSON.stringify(d)).join(', ');
          } else {
            errorMessage = errorJson.detail;
          }
        } else if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch (e) {
        // Not a JSON response
      }
      throw new Error(errorMessage);
    }

    if (res.status === 204) {
      return {};
    }

    return await res.json();
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      console.warn(`[API Error] ${endpoint}:`, error.message);
    }
    throw error;
  }
}

/**
 * Exported Convenience Methods
 */
export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' })
};
