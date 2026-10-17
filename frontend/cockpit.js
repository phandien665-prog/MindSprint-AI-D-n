(() => {
// Keep the established feature modules as the owners of actions and data.
const sidebar = document.querySelector('.sidebar');
const container = document.querySelector('.app-container');
const home = document.querySelector('#tab-content-home');
if (sidebar && home) {
  sidebar.querySelector('.logo-icon')?.remove();
  const logo = document.createElement('img');
  Object.assign(logo, { className: 'cockpit-brand-image', src: 'assets/mindsprint-avatar-site.png', alt: '' });
  sidebar.querySelector('.logo').prepend(logo);
  const profile = document.createElement('section');
  profile.className = 'cockpit-profile';
  profile.innerHTML = '<strong id="sidebar-user-name">Khách</strong><p>Học mỗi ngày, tiến bộ một chút.</p><div id="sidebar-auth"></div>';
  sidebar.querySelector('.logo').after(profile);
  home.querySelector('.welcome-banner h2').textContent = 'Hôm nay học gì?';

  const progress = document.createElement('div');
  progress.className = 'cockpit-home-progress';
  const stats = home.querySelector('.home-stats-grid');
  stats.before(progress);
  progress.append(stats);
  const goals = document.createElement('section');
  goals.className = 'cockpit-goals';
  goals.innerHTML = '<h2>Mục tiêu hôm nay</h2><label><input type="checkbox"> Ôn lại ít nhất 1 bộ thẻ</label><label><input type="checkbox"> Làm một bài luyện tập</label><label><input type="checkbox"> Ghi chú điều mới muốn tìm hiểu</label><small>Đánh dấu mục tiêu bạn đã hoàn thành.</small>';
  progress.append(goals);
  let account = 'guest';
  const goalKey = () => `ms-account:${account}:goals:${new Date().toLocaleDateString('en-CA')}`;
  const checkboxes = [...goals.querySelectorAll('input')];
  function restoreGoals() {
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(goalKey()) || '[]'); } catch { /* Optional browser storage. */ }
    checkboxes.forEach((checkbox, index) => { checkbox.checked = saved?.[index] === true; });
  }
  goals.addEventListener('change', () => {
    try { localStorage.setItem(goalKey(), JSON.stringify(checkboxes.map(input => input.checked))); } catch { /* Optional browser storage. */ }
  });

  const dock = document.createElement('nav');
  dock.className = 'cockpit-mobile-nav';
  dock.setAttribute('aria-label', 'Điều hướng nhanh');
  function setMenu(open) {
    container.classList.toggle('cockpit-menu-open', open);
    document.querySelector('#sidebar-toggle').setAttribute('aria-expanded', String(open));
    dock.querySelector('[data-cockpit-tab="more"]').setAttribute('aria-expanded', String(open));
  }
  for (const [tab, label, icon] of [['home', 'Hôm nay', 'home'], ['flashcards', 'Thư viện', 'layer-group'], ['quiz', 'Luyện tập', 'edit'], ['kanban', 'Công việc', 'columns'], ['more', 'Khác', 'bars']]) {
    const button = document.createElement('button');
    button.type = 'button'; button.dataset.cockpitTab = tab;
    button.innerHTML = `<i class="fas fa-${icon}" aria-hidden="true"></i><span>${label}</span>`;
    button.addEventListener('click', () => {
      if (tab === 'more') { setMenu(!container.classList.contains('cockpit-menu-open')); if (container.classList.contains('cockpit-menu-open')) sidebar.querySelector('.nav-tab.active').focus(); }
      else sidebar.querySelector(`[data-tab="${tab}"]`).click();
    });
    dock.append(button);
  }
  document.body.append(dock);
  function syncDock() {
    const active = sidebar.querySelector('.nav-tab.active')?.dataset.tab;
    dock.querySelectorAll('button').forEach(button => {
      if (button.dataset.cockpitTab === active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
  }
  new MutationObserver(syncDock).observe(sidebar, { subtree: true, attributes: true, attributeFilter: ['class'] });
  sidebar.addEventListener('click', event => { if (event.target.closest('[data-tab]')) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && container.classList.contains('cockpit-menu-open')) { setMenu(false); dock.querySelector('[data-cockpit-tab="more"]').focus(); }
  });
  document.addEventListener('DOMContentLoaded', () => {
    // On mobile the drawer has its own state; preserve desktop focus-mode logic.
    document.querySelector('#sidebar-toggle').addEventListener('click', event => {
      if (matchMedia('(max-width: 768px)').matches) {
        event.stopImmediatePropagation();
        setMenu(!container.classList.contains('cockpit-menu-open'));
      }
    }, true);
    window.MindSprintAuth.onAuthChange(user => { account = user?.id ?? 'guest'; restoreGoals(); });
    account = window.MindSprintAuth.getCurrentUser()?.id ?? 'guest';
    restoreGoals(); syncDock(); setMenu(false);
  });
}

})();
