/**
 * MindSprint AI — Authentication Manager
 * Handles Login/Register Modals, JWT Lifecycle, /api/Auth/me Profile Sync, and Session State
 */

import { api, getToken, setToken, getUser, setUser, clearSession, showToast, escapeHtml } from './api.js';

export class AuthManager {
  constructor() {
    this.currentUser = null;
    this.authModal = null;
    this.isLoginTab = true;
  }

  init() {
    this.authModal = document.getElementById('auth-modal');
    this.bindEvents();
    this.checkSession();

    // Listen to global 401 expired event from api.js
    window.addEventListener('auth:expired', () => {
      this.currentUser = null;
      this.renderNavbar();
      this.openAuthModal(true);
    });
  }

  bindEvents() {
    // Nav Login / Profile Buttons
    const btnOpenAuth = document.getElementById('btn-nav-login');
    if (btnOpenAuth) {
      btnOpenAuth.addEventListener('click', () => this.openAuthModal(true));
    }

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => this.logout());
    }

    // Modal Tabs (Login vs Register)
    const tabLoginBtn = document.getElementById('auth-tab-login');
    const tabRegisterBtn = document.getElementById('auth-tab-register');
    if (tabLoginBtn && tabRegisterBtn) {
      tabLoginBtn.addEventListener('click', () => this.switchTab(true));
      tabRegisterBtn.addEventListener('click', () => this.switchTab(false));
    }

    // Modal Close
    const closeBtn = document.getElementById('auth-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeAuthModal());
    }

    // Overlay Click to close
    if (this.authModal) {
      this.authModal.addEventListener('click', (e) => {
        if (e.target === this.authModal) {
          this.closeAuthModal();
        }
      });
    }

    // Form Submit
    const authForm = document.getElementById('auth-form');
    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    // Quick Demo Account Button
    const btnDemo = document.getElementById('btn-demo-login');
    if (btnDemo) {
      btnDemo.addEventListener('click', () => this.handleDemoLogin());
    }
  }

  async checkSession() {
    const token = getToken();
    if (!token) {
      this.currentUser = null;
      this.renderNavbar();
      return;
    }

    try {
      // Validate token with /api/Auth/me
      const user = await api.get('/api/Auth/me');
      this.currentUser = user;
      setUser(user);
      this.renderNavbar();
      window.dispatchEvent(new CustomEvent('auth:login', { detail: user }));
    } catch (err) {
      // Invalid/expired token
      clearSession();
      this.currentUser = null;
      this.renderNavbar();
    }
  }

  switchTab(isLogin) {
    this.isLoginTab = isLogin;
    const tabLoginBtn = document.getElementById('auth-tab-login');
    const tabRegisterBtn = document.getElementById('auth-tab-register');
    const emailGroup = document.getElementById('auth-email-group');
    const confirmPassGroup = document.getElementById('auth-confirm-password-group');
    const submitBtn = document.getElementById('auth-submit-btn');
    const modalTitle = document.getElementById('auth-modal-title');
    const errorBanner = document.getElementById('auth-error-banner');

    if (errorBanner) {
      errorBanner.classList.remove('visible');
      errorBanner.textContent = '';
    }

    if (isLogin) {
      tabLoginBtn?.classList.add('active');
      tabRegisterBtn?.classList.remove('active');
      if (emailGroup) emailGroup.style.display = 'none';
      if (confirmPassGroup) confirmPassGroup.style.display = 'none';
      if (submitBtn) submitBtn.textContent = 'Đăng nhập';
      if (modalTitle) modalTitle.textContent = 'Đăng nhập tài khoản';
    } else {
      tabLoginBtn?.classList.remove('active');
      tabRegisterBtn?.classList.add('active');
      if (emailGroup) emailGroup.style.display = 'block';
      if (confirmPassGroup) confirmPassGroup.style.display = 'block';
      if (submitBtn) submitBtn.textContent = 'Tạo tài khoản mới';
      if (modalTitle) modalTitle.textContent = 'Đăng ký tài khoản';
    }
  }

  openAuthModal(defaultToLogin = true) {
    if (!this.authModal) return;
    this.switchTab(defaultToLogin);
    this.authModal.classList.add('active');

    const usernameInput = document.getElementById('auth-username');
    if (usernameInput) {
      setTimeout(() => usernameInput.focus(), 100);
    }
  }

  closeAuthModal() {
    if (!this.authModal) return;
    this.authModal.classList.remove('active');
  }

  async handleSubmit() {
    const usernameInput = document.getElementById('auth-username');
    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');
    const confirmPassInput = document.getElementById('auth-confirm-password');
    const errorBanner = document.getElementById('auth-error-banner');
    const submitBtn = document.getElementById('auth-submit-btn');

    const username = usernameInput?.value.trim() || '';
    const password = passwordInput?.value || '';
    const email = emailInput?.value.trim() || '';
    const confirmPass = confirmPassInput?.value || '';

    // Frontend Form Validations
    if (!username || username.length < 3) {
      this.showFormError('Tên người dùng phải có ít nhất 3 ký tự.');
      return;
    }

    if (!password || password.length < 6) {
      this.showFormError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (!this.isLoginTab) {
      if (!email || !email.includes('@')) {
        this.showFormError('Vui lòng nhập địa chỉ email hợp lệ.');
        return;
      }
      if (password !== confirmPass) {
        this.showFormError('Mật khẩu xác nhận không khớp.');
        return;
      }
    }

    // Clear previous errors
    if (errorBanner) {
      errorBanner.classList.remove('visible');
      errorBanner.textContent = '';
    }

    const origBtnText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang xử lý...';
    }

    try {
      if (this.isLoginTab) {
        // Login Request
        await this.login(username, password);
      } else {
        // Register Request
        await this.register(username, email, password);
      }
    } catch (err) {
      this.showFormError(err.message || 'Thao tác không thành công. Vui lòng thử lại.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = origBtnText;
      }
    }
  }

  showFormError(message) {
    const errorBanner = document.getElementById('auth-error-banner');
    if (errorBanner) {
      errorBanner.textContent = message;
      errorBanner.classList.add('visible');
    } else {
      showToast(message, 'error');
    }
  }

  async login(username, password) {
    const res = await api.post('/api/Auth/login', { username, password });
    if (!res.access_token) {
      throw new Error('Không nhận được token xác thực.');
    }

    setToken(res.access_token);
    
    // If backend returns user object directly, use it, otherwise fetch /api/Auth/me
    let user = res.user;
    if (!user) {
      user = await api.get('/api/Auth/me');
    }

    this.currentUser = user;
    setUser(user);
    this.renderNavbar();
    this.closeAuthModal();

    showToast(`Chào mừng trở lại, ${user.username}!`, 'success');
    window.dispatchEvent(new CustomEvent('auth:login', { detail: user }));
  }

  async register(username, email, password) {
    await api.post('/api/Auth/register', { username, email, password });
    showToast('Tạo tài khoản thành công! Đang tự động đăng nhập...', 'success');
    // Automatically log in after registration
    await this.login(username, password);
  }

  async handleDemoLogin() {
    // Try logging in with demo account, or auto-create it if it doesn't exist
    const demoUser = 'demo_user';
    const demoPass = 'MindSprint123!';
    const demoEmail = 'demo@mindsprint.ai';

    try {
      await this.login(demoUser, demoPass);
    } catch (err) {
      // If login failed, try registering demo user first
      try {
        await api.post('/api/Auth/register', { username: demoUser, email: demoEmail, password: demoPass });
        await this.login(demoUser, demoPass);
      } catch (regErr) {
        this.showFormError('Không thể khởi tạo tài khoản Demo: ' + regErr.message);
      }
    }
  }

  logout() {
    clearSession();
    this.currentUser = null;
    this.renderNavbar();
    showToast('Đã đăng xuất thành công.', 'info');
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }

  renderNavbar() {
    const userBadge = document.getElementById('user-profile-badge');
    const btnNavLogin = document.getElementById('btn-nav-login');
    const avatarCircle = document.getElementById('user-avatar-circle');
    const displayName = document.getElementById('user-display-name');

    if (this.currentUser) {
      if (userBadge) userBadge.style.display = 'flex';
      if (btnNavLogin) btnNavLogin.style.display = 'none';

      const initial = (this.currentUser.username || 'U')[0].toUpperCase();
      if (avatarCircle) avatarCircle.textContent = initial;
      if (displayName) displayName.textContent = this.currentUser.username;
    } else {
      if (userBadge) userBadge.style.display = 'none';
      if (btnNavLogin) btnNavLogin.style.display = 'inline-flex';
    }
  }

  isAuthenticated() {
    return !!this.currentUser && !!getToken();
  }
}
