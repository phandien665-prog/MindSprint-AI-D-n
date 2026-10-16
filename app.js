const app = document.querySelector('#app');

const iconPaths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  library: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  practice: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 7h8M8 11h6"/>',
  notebook: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v19H6.5A2.5 2.5 0 0 1 4 18.5z"/><path d="M8 7h8M8 11h8M8 15h5M2 6h4M2 12h4M2 18h4"/>',
  chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/><path d="M17 9h2v2"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/>',
  board: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 0 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 0 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V2a1.7 1.7 0 0 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 0 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2 2.9Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  play: '<path d="m8 5 12 7-12 7z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m18 6-12 12M6 6l12 12"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/><path d="m16 8 5-5"/>',
  flame: '<path d="M8 14s-1.5 0-2-2c-2 2-2 5.5 0 7.5a8 8 0 0 0 12 0c3-3 1.5-7.5-1.5-11-.5 3-2.5 3.5-2.5 3.5s.5-4-4-9c-.5 4-3 5-2 11Z"/>',
  spark: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z"/>',
  filter: '<path d="M4 6h16M7 12h10m-7 6h4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  upload: '<path d="M12 16V4m-4 4 4-4 4 4"/><path d="M4 16v4h16v-4"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
  download: '<path d="M12 4v12m-5-5 5 5 5-5"/><path d="M4 20h16"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 0 1 4.8 1c0 1.5-2.4 2-2.4 3.5M12 17h.01"/>',
};
const icon = (name, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.spark}</svg>`;

const navGroups = [
  { label: 'Học tập', items: [['home', 'Trang chủ', 'home'], ['library', 'Thư viện', 'library'], ['practice', 'Luyện tập', 'practice'], ['notebook', 'Sổ tay AI', 'notebook']] },
  { label: 'Tổ chức', items: [['chart', 'Tổng quan', 'overview'], ['calendar', 'Lịch học', 'calendar'], ['board', 'Công việc', 'tasks']] },
  { label: 'Ứng dụng', items: [['settings', 'Cài đặt', 'settings']] },
];
const pageTitles = { home: 'Trang chủ', library: 'Thư viện', practice: 'Luyện tập', notebook: 'Sổ tay AI', overview: 'Tổng quan', calendar: 'Lịch học', tasks: 'Công việc', settings: 'Cài đặt' };
const categories = ['Tất cả', 'Tiếng Anh', 'Marketing', 'Phát triển bản thân', 'Kiến thức chung'];
const decks = [
  { id: 'english', title: 'Từ vựng giao tiếp', category: 'Tiếng Anh', count: 70, mastery: 28, color: 0, cards: [{ q: 'How are you holding up?', a: 'Dạo này bạn thế nào? / Bạn vẫn ổn chứ? Dùng khi muốn hỏi thăm ai đó đang trải qua giai đoạn khó khăn.' }, { q: 'Could you walk me through it?', a: 'Bạn có thể giải thích từng bước cho tôi được không?' }, { q: 'That sounds like a plan.', a: 'Nghe có vẻ là một kế hoạch hay đấy.' }, { q: 'I’ll keep you posted.', a: 'Tôi sẽ cập nhật cho bạn khi có tin mới.' }] },
  { id: 'marketing', title: 'Marketing căn bản', category: 'Marketing', count: 62, mastery: 42, color: 1, cards: [{ q: 'Marketing mix gồm những yếu tố nào?', a: 'Mô hình 4P gồm Product (sản phẩm), Price (giá), Place (phân phối) và Promotion (xúc tiến).' }, { q: 'Customer persona là gì?', a: 'Chân dung khách hàng mục tiêu được xây dựng từ dữ liệu, nhu cầu, động lực và hành vi.' }, { q: 'Một insight tốt cần có gì?', a: 'Một sự thật ngầm hiểu có ý nghĩa, tạo được kết nối cảm xúc và mở ra hướng hành động.' }] },
  { id: 'product', title: 'Tư duy sản phẩm', category: 'Phát triển bản thân', count: 58, mastery: 16, color: 2, cards: [{ q: 'Product-market fit là gì?', a: 'Mức độ sản phẩm đáp ứng nhu cầu thị trường đủ tốt để khách hàng chủ động sử dụng và giới thiệu.' }, { q: 'MVP nên kiểm chứng điều gì?', a: 'Giả thuyết quan trọng nhất về giá trị sản phẩm, với lượng công sức tối thiểu.' }, { q: 'North Star Metric có vai trò gì?', a: 'Tập trung đội ngũ vào giá trị cốt lõi mà sản phẩm mang lại cho khách hàng theo thời gian.' }] },
  { id: 'finance', title: 'Tài chính cá nhân', category: 'Kiến thức chung', count: 45, mastery: 54, color: 3, cards: [{ q: 'Quỹ khẩn cấp dùng để làm gì?', a: 'Trang trải chi phí thiết yếu khi có biến cố hoặc thu nhập bị gián đoạn.' }, { q: 'Lãi kép là gì?', a: 'Lãi được tính trên cả vốn gốc lẫn phần lãi đã tích lũy từ các kỳ trước.' }] },
  { id: 'writing', title: 'Viết nội dung rõ ràng', category: 'Kiến thức chung', count: 36, mastery: 9, color: 4, cards: [{ q: 'Một đoạn văn dễ đọc nên bắt đầu thế nào?', a: 'Nêu ý chính trước, sau đó bổ sung lý do, bằng chứng hoặc ví dụ.' }, { q: 'Khi nào nên dùng câu ngắn?', a: 'Khi cần nhấn mạnh một ý hoặc giúp người đọc theo kịp thông tin phức tạp.' }] },
  { id: 'focus', title: 'Thói quen tập trung', category: 'Phát triển bản thân', count: 28, mastery: 34, color: 0, cards: [{ q: 'Pomodoro cơ bản thường kéo dài bao lâu?', a: '25 phút tập trung, sau đó nghỉ ngắn khoảng 5 phút; có thể điều chỉnh theo công việc.' }, { q: 'Một cách giảm xao nhãng trước khi học?', a: 'Để điện thoại ngoài tầm với và đóng các tab không liên quan.' }] },
];
const initialTasks = [
  { id: 1, title: 'Ôn lại từ vựng tiếng Anh', category: 'Tiếng Anh', priority: 'Ưu tiên cao', status: 'todo', date: 'Hôm nay' },
  { id: 2, title: 'Hoàn thành bộ thẻ Marketing', category: 'Marketing', priority: 'Bình thường', status: 'todo', date: 'Hôm nay' },
  { id: 3, title: 'Đọc ghi chú về product-market fit', category: 'Sản phẩm', priority: 'Bình thường', status: 'doing', date: 'Hôm nay' },
  { id: 4, title: 'Lên kế hoạch học tuần mới', category: 'Cá nhân', priority: 'Ưu tiên cao', status: 'done', date: 'Hôm qua' },
];
const state = {
  page: 'home',
  search: '',
  librarySearch: '',
  category: 'Tất cả',
  activeDeck: 'english',
  cardIndex: 0,
  flipped: false,
  practiceDone: false,
  checkedGoals: [false, false, false],
  tasks: initialTasks.map(task => ({ ...task })),
  selectedDay: 18,
  extraSessions: [],
  weekOffset: 0,
  notes: [],
  settings: { reminders: true, srs: true, sounds: false, compact: false },
};

function getDeck(id = state.activeDeck) { return decks.find(deck => deck.id === id) || decks[0]; }
function pageNavButton(item) { const [symbol, label, key] = item; return `<button class="nav-link ${state.page === key ? 'active' : ''}" data-page="${key}" ${state.page === key ? 'aria-current="page"' : ''}>${icon(symbol, 18)}<span>${label}</span></button>`; }
function renderShell() {
  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar" id="sidebar" aria-label="Điều hướng chính">
        <a class="brand" href="#" data-page="home" aria-label="MindSprintAI — Trang chủ"><img class="brand-avatar" src="/assets/mindsprint-avatar-site.png" alt="" /><span class="brand-name">MindSprintAI</span></a>
        <div class="guest-card"><div class="guest-row"><div class="avatar">K</div><div><div class="guest-name">Khách</div><div class="guest-hint">Bản trải nghiệm cá nhân</div></div></div></div>
        ${navGroups.map(group => `<div class="nav-group"><div class="nav-label">${group.label}</div>${group.items.map(pageNavButton).join('')}</div>`).join('')}
        <div class="sidebar-spacer"></div>
        <div class="sidebar-note"><div class="note-icon">${icon('spark', 18)}</div><p>Học đều mỗi ngày, tiến bộ theo cách của riêng bạn.</p></div>
        <div class="sidebar-foot"><span>MindSprintAI · Demo</span><button data-page="settings">${icon('help', 15)} Trợ giúp</button></div>
      </aside>
      <div class="mobile-backdrop" id="mobileBackdrop"></div>
      <section class="workspace">
        <header class="topbar">
          <button class="icon-button mobile-menu" data-action="toggle-menu" aria-label="Mở điều hướng">${icon('menu', 19)}</button>
          <label class="search-wrap">${icon('search', 18)}<input id="globalSearch" type="search" placeholder="Tìm trang hoặc bộ thẻ..." value="${escapeHtml(state.search)}" aria-label="Tìm trang hoặc bộ thẻ" /></label>
          <div class="topbar-actions"><button class="icon-button" data-action="notifications" aria-label="Thông báo">${icon('bell', 18)}<i class="notification-dot"></i></button><button class="profile-button" data-action="profile" aria-label="Tài khoản khách"><span class="avatar">K</span><span class="profile-meta"><span class="profile-name">Khách</span><span class="profile-sub">Đang xem bản demo</span></span>${icon('down', 14)}</button></div>
        </header>
        <main class="content" id="mainContent" tabindex="-1"></main>
      </section>
      <nav class="mobile-dock" aria-label="Điều hướng nhanh"><button class="dock-link ${state.page === 'home' ? 'active' : ''}" data-page="home">${icon('home', 18)}<span>Hôm nay</span></button><button class="dock-link ${state.page === 'library' ? 'active' : ''}" data-page="library">${icon('library', 18)}<span>Thư viện</span></button><button class="dock-link ${state.page === 'practice' ? 'active' : ''}" data-page="practice">${icon('practice', 18)}<span>Luyện tập</span></button><button class="dock-link ${state.page === 'tasks' ? 'active' : ''}" data-page="tasks">${icon('board', 18)}<span>Công việc</span></button><button class="dock-link" data-action="toggle-menu">${icon('more', 18)}<span>Khác</span></button></nav>
      <div id="modalRoot"></div>
      <div id="toastRoot" aria-live="polite"></div>
    </div>`;
  renderPage();
}
function initializePet() {
  const wrap = document.querySelector('#petBuddyWrap');
  const pet = document.querySelector('#petBuddy');
  const hint = document.querySelector('#petHint');
  if (!wrap || !pet || !hint) return;
  const positionKey = 'mindsprint-pet-position';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let drag = null;
  let suppressClick = false;
  let isHovered = false;
  let isFocused = false;
  let autoTimer = null;
  let walkTimer = null;
  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
  function placePet(left, top, persist = false) {
    const rect = wrap.getBoundingClientRect();
    const x = clamp(left, 8, Math.max(8, window.innerWidth - rect.width - 8));
    const y = clamp(top, 8, Math.max(8, window.innerHeight - rect.height - 8));
    wrap.style.left = `${x}px`;
    wrap.style.top = `${y}px`;
    wrap.style.right = 'auto';
    wrap.style.bottom = 'auto';
    if (persist) {
      try { localStorage.setItem(positionKey, JSON.stringify({ x, y })); } catch (_) { /* local storage can be unavailable */ }
    }
  }
  function placeHint() {
    const rect = wrap.getBoundingClientRect();
    hint.hidden = false;
    hint.style.left = '0px';
    hint.style.top = '0px';
    const bubble = hint.getBoundingClientRect();
    const left = clamp(rect.left + rect.width / 2 - bubble.width / 2, 12, Math.max(12, window.innerWidth - bubble.width - 12));
    let top = rect.top - bubble.height - 12;
    if (top < 12 && rect.bottom + bubble.height + 12 < window.innerHeight) top = rect.bottom + 12;
    hint.style.left = `${left}px`;
    hint.style.top = `${top}px`;
  }
  function stopAutoMovement() {
    window.clearTimeout(autoTimer);
    window.clearTimeout(walkTimer);
    autoTimer = null;
    walkTimer = null;
    const rect = wrap.getBoundingClientRect();
    wrap.style.transition = 'none';
    wrap.classList.remove('is-walking');
    placePet(rect.left, rect.top, true);
    window.requestAnimationFrame(() => { wrap.style.transition = ''; });
  }
  function scheduleAutoMovement(delay = 1700) {
    window.clearTimeout(autoTimer);
    if (reducedMotion.matches || document.hidden || drag || isHovered || isFocused) return;
    autoTimer = window.setTimeout(startAutoMovement, delay);
  }
  function startAutoMovement() {
    if (reducedMotion.matches || document.hidden || drag || isHovered || isFocused || wrap.classList.contains('is-walking')) return;
    hint.hidden = true;
    const rect = wrap.getBoundingClientRect();
    const margin = 12;
    const minX = margin;
    const maxX = Math.max(minX, window.innerWidth - rect.width - margin);
    const minY = Math.min(82, Math.max(margin, window.innerHeight - rect.height - margin));
    const bottomSafe = window.innerWidth <= 1100 ? 88 : margin;
    const maxY = Math.max(minY, window.innerHeight - rect.height - bottomSafe);
    let targetX = rect.left;
    let targetY = rect.top;
    let distance = 0;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      targetX = minX + Math.random() * (maxX - minX);
      targetY = minY + Math.random() * (maxY - minY);
      distance = Math.hypot(targetX - rect.left, targetY - rect.top);
      if (distance > 230) break;
    }
    if (distance < 90) { scheduleAutoMovement(1200); return; }
    const duration = clamp(Math.round(distance * 3.6), 3000, 8500);
    placePet(rect.left, rect.top);
    wrap.classList.toggle('facing-left', targetX < rect.left - 8);
    wrap.classList.add('is-walking');
    wrap.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
    window.requestAnimationFrame(() => placePet(targetX, targetY));
    walkTimer = window.setTimeout(() => {
      if (!wrap.isConnected || !wrap.classList.contains('is-walking')) return;
      wrap.classList.remove('is-walking');
      wrap.style.transition = '';
      const finalRect = wrap.getBoundingClientRect();
      placePet(finalRect.left, finalRect.top, true);
      scheduleAutoMovement(1500 + Math.random() * 2200);
    }, duration + 60);
  }
  try {
    const saved = JSON.parse(localStorage.getItem(positionKey) || 'null');
    if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) placePet(saved.x, saved.y);
  } catch (_) { /* use the default bottom-right position */ }
  pet.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    stopAutoMovement();
    const rect = wrap.getBoundingClientRect();
    drag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, left: rect.left, top: rect.top, moved: false };
    pet.classList.add('is-dragging');
    try { pet.setPointerCapture(event.pointerId); } catch (_) { /* pointer capture may be unavailable */ }
  });
  window.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;
    event.preventDefault();
    placePet(drag.left + dx, drag.top + dy);
  }, { passive: false });
  function finishDrag(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const moved = drag.moved;
    drag = null;
    pet.classList.remove('is-dragging');
    if (moved) {
      const rect = wrap.getBoundingClientRect();
      placePet(rect.left, rect.top, true);
      suppressClick = true;
      window.setTimeout(() => { suppressClick = false; }, 500);
    }
    scheduleAutoMovement(1900);
  }
  window.addEventListener('pointerup', finishDrag);
  window.addEventListener('pointercancel', finishDrag);
  pet.addEventListener('keydown', event => {
    const step = 24;
    const moves = { ArrowUp: [0, -step], ArrowDown: [0, step], ArrowLeft: [-step, 0], ArrowRight: [step, 0] };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    stopAutoMovement();
    const rect = wrap.getBoundingClientRect();
    placePet(rect.left + move[0], rect.top + move[1], true);
    scheduleAutoMovement(1900);
  });
  pet.addEventListener('click', () => {
    if (suppressClick) { suppressClick = false; return; }
    if (!hint.hidden) hint.hidden = true;
    else placeHint();
    scheduleAutoMovement(2800);
  });
  pet.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return;
    isHovered = true;
    stopAutoMovement();
  });
  pet.addEventListener('pointerleave', event => {
    if (event.pointerType === 'touch') return;
    isHovered = false;
    scheduleAutoMovement(1300);
  });
  pet.addEventListener('focus', () => { isFocused = true; stopAutoMovement(); });
  pet.addEventListener('blur', () => { isFocused = false; scheduleAutoMovement(1400); });
  document.addEventListener('pointerdown', event => {
    if (!wrap.contains(event.target)) hint.hidden = true;
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoMovement();
    else scheduleAutoMovement(1200);
  });
  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches) stopAutoMovement();
    else scheduleAutoMovement(1200);
  });
  window.addEventListener('resize', () => {
    stopAutoMovement();
    if (wrap.style.left && wrap.style.top) placePet(parseFloat(wrap.style.left), parseFloat(wrap.style.top), true);
    if (!hint.hidden) placeHint();
    scheduleAutoMovement(1500);
  });
  scheduleAutoMovement(2000);
}
function escapeHtml(value = '') { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
function pageHeader(title, subtitle, action = '') { return `<div class="page-heading"><div><p class="eyebrow">MindSprintAI · Study Cockpit</p><h1>${title}</h1><p>${subtitle}</p></div>${action}</div>`; }
function footer() { return `<div class="page-footer"><strong>${icon('spark', 13)} Một chút tiến bộ mỗi ngày.</strong> Đây là bản demo; thao tác chỉ thay đổi dữ liệu trong phiên xem hiện tại.</div>`; }
function renderPage() {
  document.querySelectorAll('.nav-link').forEach(button => { button.classList.toggle('active', button.dataset.page === state.page); if (button.dataset.page === state.page) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current'); });
  document.querySelectorAll('.dock-link[data-page]').forEach(button => button.classList.toggle('active', button.dataset.page === state.page));
  const main = document.querySelector('#mainContent');
  if (!main) return;
  const views = { home: homeView, library: libraryView, practice: practiceView, notebook: notebookView, overview: overviewView, calendar: calendarView, tasks: tasksView, settings: settingsView };
  main.innerHTML = `${views[state.page] ? views[state.page]() : homeView()}${footer()}`;
  document.title = `${pageTitles[state.page] || 'Trang chủ'} — MindSprintAI`;
}
function deckCard(deck, actions = true) {
  return `<article class="deck-card tone-${deck.color % 5}" data-deck-card="${deck.id}"><div class="deck-card-top"><span class="deck-symbol">${icon(deck.category === 'Tiếng Anh' ? 'book' : deck.category === 'Marketing' ? 'chart' : 'spark', 17)}</span><span class="deck-category">${escapeHtml(deck.category)}</span></div><h3>${escapeHtml(deck.title)}</h3><div class="deck-meta"><span>${deck.count} thẻ học</span><span>${deck.mastery}% đã nhớ</span></div><div class="deck-progress"><span style="width:${deck.mastery}%"></span></div>${actions ? `<div class="deck-card-actions"><button class="btn btn-outline" data-action="view-deck" data-deck="${deck.id}">Xem bộ thẻ</button><button class="btn btn-primary" data-action="practice" data-deck="${deck.id}">${icon('play', 13)} Luyện tập</button></div>` : ''}</article>`;
}
function homeView() {
  const completed = state.checkedGoals.filter(Boolean).length;
  const percent = Math.round((completed / state.checkedGoals.length) * 100);
  const recommended = [decks[0], decks[1], decks[2]];
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 11 ? 'sáng' : hour < 13 ? 'trưa' : hour < 18 ? 'chiều' : 'tối';
  const weekday = new Intl.DateTimeFormat('vi-VN', { weekday: 'long' }).format(now);
  const date = new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'long' }).format(now);
  const dateLabel = `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} · ${date}`;
  return `<div class="welcome-line"><div><h1>Chào buổi ${greeting}, Khách</h1><p>Mỗi ngày một chút tiến bộ — hôm nay mình học gì nhỉ?</p></div><span class="small muted">${icon('sun', 15)} ${dateLabel}</span></div>
    <section class="hero"><div class="hero-copy"><p class="eyebrow">Mỗi ngày, một chút tiến bộ</p><h2>Hôm nay học gì?</h2><p>Ôn lại một bộ thẻ, kiểm tra điều đã nhớ, rồi ghi chú điều muốn tìm hiểu.</p><div class="hero-actions"><button class="btn btn-primary" data-action="practice" data-deck="english">${icon('play', 15)} Bắt đầu học 15 phút</button><button class="btn btn-outline" data-action="new-deck">${icon('plus', 17)} Tạo bộ thẻ</button></div></div></section>
    <div class="home-grid">
      <section class="panel progress-panel"><div class="panel-title-row"><h2>Tiến độ hôm nay</h2><span class="small muted">Mục tiêu: 15 phút</span></div><div class="progress-content"><div class="progress-ring" style="--progress:${percent}%"><div class="ring-inner"><strong>${percent}%</strong><span>Hoàn thành</span></div></div><div class="metric"><div class="metric-label">${icon('flame', 17)} Chuỗi học</div><div class="metric-value">4 ngày</div></div><div class="metric"><div class="metric-label">${icon('library', 17)} Thẻ đã ôn</div><div class="metric-value">12</div></div><div class="metric"><div class="metric-label">${icon('target', 17)} Độ chính xác</div><div class="metric-value">86%</div></div></div></section>
      <section class="panel goals-panel"><div class="goal-head"><h2>Mục tiêu hôm nay</h2><span>${completed}/${state.checkedGoals.length} xong</span></div><div class="goal-list">${['Ôn lại ít nhất 1 bộ thẻ', 'Làm một bài kiểm tra nhanh', 'Ghi chú điều muốn tìm hiểu'].map((label, i) => `<label class="goal-item ${state.checkedGoals[i] ? 'done' : ''}"><input type="checkbox" data-action="toggle-goal" data-index="${i}" ${state.checkedGoals[i] ? 'checked' : ''} /><span>${label}</span></label>`).join('')}</div><button class="btn btn-coral" data-action="practice" data-deck="english">${icon('play', 14)} Bắt đầu ngay ${icon('arrow', 15)}</button></section>
    </div>
    <div class="section-header"><h2>Tiếp tục học</h2><button class="text-link" data-page="library">Xem tất cả ${icon('chevron', 15)}</button></div><section class="deck-grid">${recommended.map(deck => deckCard(deck, true)).join('')}</section>
    <div class="section-header"><h2>Lối tắt của bạn</h2></div><section class="stats-grid"><button class="panel stat-card shortcut-card" data-page="notebook"><div class="stat-top"><span>Sổ tay AI</span><span class="stat-icon">${icon('spark', 16)}</span></div><strong>Hỏi từ tài liệu</strong><div class="trend">Ghi chú và câu trả lời mẫu</div></button><button class="panel stat-card shortcut-card" data-page="calendar"><div class="stat-top"><span>Lịch học</span><span class="stat-icon">${icon('calendar', 16)}</span></div><strong>15 phút hôm nay</strong><div class="trend">Xem lịch học của bạn</div></button><button class="panel stat-card shortcut-card" data-page="tasks"><div class="stat-top"><span>Công việc</span><span class="stat-icon">${icon('board', 16)}</span></div><strong>${state.tasks.filter(task => task.status !== 'done').length} việc cần làm</strong><div class="trend">Tiến từng bước nhỏ</div></button><button class="panel stat-card shortcut-card" data-page="overview"><div class="stat-top"><span>Tổng quan</span><span class="stat-icon">${icon('chart', 16)}</span></div><strong>Xem tiến độ</strong><div class="trend">Một tuần học vừa qua</div></button></section>`;
}
function libraryView() {
  const shown = decks.filter(deck => state.category === 'Tất cả' || deck.category === state.category);
  const headingAction = `<button class="btn btn-primary" data-action="new-deck">${icon('plus', 16)} Tạo bộ thẻ mới</button>`;
  return `${pageHeader('Thư viện bộ thẻ', 'Sắp xếp kiến thức thành những bộ thẻ dễ nhớ, dễ ôn.', headingAction)}
    <div class="toolbar"><label class="field-search">${icon('search', 17)}<input id="librarySearch" type="search" placeholder="Tìm theo tên bộ thẻ..." value="${escapeHtml(state.librarySearch)}" aria-label="Tìm bộ thẻ" /></label><button class="btn btn-outline" data-action="toggle-srs">${icon('clock', 16)} Ôn cách quãng <span class="small">${state.settings.srs ? 'Đang bật' : 'Đang tắt'}</span></button></div>
    <div class="chips">${categories.map(category => `<button class="chip ${state.category === category ? 'active' : ''}" data-action="category" data-category="${category}">${category}</button>`).join('')}</div>
    <div class="panel panel-pad" style="margin-bottom:18px"><div class="panel-title-row"><div><h2>Học từ vựng và ý tưởng</h2><p class="small muted" style="margin:5px 0 0">${shown.length} bộ thẻ · Dữ liệu demo cục bộ</p></div>${icon('filter', 18)}</div><section class="deck-list" id="deckList">${shown.map(deck => deckCard(deck, true)).join('')}</section><div class="empty-state" id="emptyDecks">${icon('search', 24)}<strong>Chưa tìm thấy bộ thẻ</strong><p>Thử từ khóa khác hoặc chọn một danh mục khác nhé.</p></div></div>`;
}
function practiceView() {
  const deck = getDeck();
  if (state.practiceDone) return `<div class="practice-wrap panel practice-summary"><span class="summary-mark">${icon('check', 29)}</span><h2>Buổi ôn tập hoàn tất!</h2><p>Bạn vừa ôn ${deck.cards.length} thẻ trong bộ “${escapeHtml(deck.title)}”. Mỗi lần ôn là một bước tiến.</p><button class="btn btn-primary" data-action="restart-practice">${icon('play', 15)} Ôn lại bộ thẻ</button> <button class="btn btn-outline" data-page="library">Về thư viện</button></div>`;
  const card = deck.cards[Math.min(state.cardIndex, deck.cards.length - 1)];
  const progress = Math.round(((state.cardIndex + (state.flipped ? .5 : 0)) / deck.cards.length) * 100);
  return `${pageHeader('Luyện tập', `Ôn bộ “${escapeHtml(deck.title)}” · ${deck.cards.length} thẻ mẫu`, `<button class="btn btn-outline" data-page="library">${icon('library', 15)} Đổi bộ thẻ</button>`)}
    <div class="practice-wrap"><div class="practice-topline"><span class="small muted">Thẻ ${state.cardIndex + 1} / ${deck.cards.length}</span><div id="practiceProgress" class="practice-progress" role="progressbar" aria-label="Tiến độ luyện tập" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><span id="practiceProgressFill" style="width:${progress}%"></span></div><span id="practiceProgressValue" class="small muted">${progress}%</span></div>
    <article class="practice-card ${state.flipped ? 'is-flipped' : ''}" data-action="flip-card" tabindex="0" role="button" aria-label="Lật thẻ" aria-pressed="${state.flipped}"><div class="practice-card-inner">
      <div class="practice-face practice-face--front" aria-hidden="${state.flipped ? 'true' : 'false'}"><div class="card-count">${escapeHtml(deck.category)}</div><h2>${escapeHtml(card.q)}</h2><p>Hãy thử nhớ lại trước khi xem đáp án.</p><div class="tap-hint">${icon('target', 14)} Chạm vào thẻ để lật thẻ</div></div>
      <div class="practice-face practice-face--back" aria-hidden="${state.flipped ? 'false' : 'true'}"><div class="card-count">Gợi ý & đáp án</div><h2>${escapeHtml(card.a)}</h2><p>${state.cardIndex === 0 ? 'Mẹo ghi nhớ: thử tự diễn đạt lại bằng lời của mình.' : 'Hãy liên hệ khái niệm này với một ví dụ bạn từng gặp.'}</p><div class="tap-hint">${icon('target', 14)} Chạm vào thẻ để xem câu hỏi</div></div>
    </div></article>
    <div class="practice-controls"><button class="btn btn-outline" data-action="practice-prev" ${state.cardIndex === 0 ? 'disabled' : ''}>${icon('chevron', 14)} Câu trước</button><button class="btn btn-primary" data-action="flip-card">${icon('book', 15)} ${state.flipped ? 'Xem lại câu hỏi' : 'Lật thẻ xem đáp án'}</button><button class="btn btn-outline" data-action="practice-next">Câu tiếp ${icon('arrow', 14)}</button></div>
    <div class="rating-row" ${state.flipped ? '' : 'hidden'}><button class="btn btn-outline" data-action="rate" data-rating="again">${icon('edit', 14)} Chưa nhớ</button><button class="btn btn-outline" data-action="rate" data-rating="hard">Khó</button><button class="btn btn-outline" data-action="rate" data-rating="good">Đã nhớ</button><button class="btn btn-primary" data-action="rate" data-rating="easy">Dễ</button></div></div>`;
}
function notebookView() {
  const messages = state.notes.map(message => `<div class="chat-message ${message.role}">${escapeHtml(message.text)}${message.role === 'assistant' ? '<small>Trả lời minh họa · Nguồn mẫu: Ghi chú học tập</small>' : ''}</div>`).join('');
  return `${pageHeader('Sổ tay AI', 'Gom ghi chú, đặt câu hỏi và biến kiến thức thành tài liệu ôn tập.', '<span class="chip active">Chế độ demo</span>')}
    <div class="notebook-layout"><aside class="panel source-panel"><h2>${icon('file', 17)} Sổ tay & nguồn</h2><div class="source-empty">${icon('book', 19)}<br />Chưa có tài liệu nào.<br />Hãy thử các nguồn mẫu bên dưới.</div><div class="source-actions"><button data-action="demo-source">${icon('edit', 15)} Ghi chú mẫu</button><button data-action="demo-source">${icon('upload', 15)} Tải tệp (demo)</button><button data-action="demo-source">${icon('link', 15)} Thêm từ URL (demo)</button></div></aside>
    <section class="panel notebook-chat"><div class="notebook-intro"><div class="ai-orb">${icon('spark', 24)}</div><h2>${state.notes.length ? 'Cùng làm rõ điều bạn đang học' : 'Bạn muốn khám phá điều gì?'}</h2><p>${state.notes.length ? 'Các câu trả lời dưới đây là nội dung mẫu chạy cục bộ.' : 'Thử một câu hỏi gợi ý hoặc nhập thắc mắc của bạn. Bản demo không kết nối AI thật.'}</p></div>
      ${!state.notes.length ? `<div class="prompt-row"><button class="prompt-chip" data-action="prompt" data-prompt="Tóm tắt ý chính trong ghi chú mẫu">${icon('spark', 13)} Tóm tắt</button><button class="prompt-chip" data-action="prompt" data-prompt="Tạo flashcard từ ghi chú mẫu">${icon('library', 13)} Flashcard</button><button class="prompt-chip" data-action="prompt" data-prompt="Đặt câu hỏi kiểm tra kiến thức">${icon('help', 13)} Trắc nghiệm</button></div>` : ''}
      <div class="chat-log" id="chatLog">${messages}</div><form class="chat-form" id="chatForm"><textarea name="question" placeholder="Bạn muốn hỏi gì về nội dung mình đang học?" aria-label="Câu hỏi của bạn" required></textarea><button class="btn btn-coral" type="submit">Gửi câu hỏi ${icon('arrow', 14)}</button></form><div class="chat-footnote">Câu trả lời mẫu được tạo ngay trong giao diện — không có nội dung nào được gửi đi.</div>
    </section></div>`;
}
function overviewView() {
  const bars = [38, 54, 31, 71, 48, 82, 60];
  const second = [22, 35, 28, 41, 33, 50, 40];
  return `${pageHeader('Tổng quan', 'Nhìn lại nhịp học và những tiến bộ nhỏ của bạn.', '<button class="btn btn-outline" data-action="overview-range">7 ngày qua ' + icon('down', 14) + '</button>')}
    <div class="stats-grid"><article class="panel stat-card"><div class="stat-top"><span>Chuỗi học hiện tại</span><span class="stat-icon">${icon('flame', 16)}</span></div><strong>4 ngày</strong><div class="trend">${icon('arrow', 12)} Thêm 1 ngày so với tuần trước</div></article><article class="panel stat-card"><div class="stat-top"><span>Thẻ đã ôn</span><span class="stat-icon">${icon('library', 16)}</span></div><strong>86</strong><div class="trend">${icon('arrow', 12)} 12 thẻ hôm nay</div></article><article class="panel stat-card"><div class="stat-top"><span>Độ chính xác</span><span class="stat-icon">${icon('target', 16)}</span></div><strong>86%</strong><div class="trend">Đang tiến bộ đều đặn</div></article><article class="panel stat-card"><div class="stat-top"><span>Thời gian học</span><span class="stat-icon">${icon('clock', 16)}</span></div><strong>3g 25p</strong><div class="trend">Trong 7 ngày qua</div></article></div>
    <div class="analytics-grid"><section class="panel chart-panel"><div class="panel-title-row"><div><h2>Nhịp học trong tuần</h2><p class="small muted" style="margin:5px 0 0">Phút học mỗi ngày · dữ liệu minh họa</p></div>${icon('chart', 18)}</div><div class="bar-chart">${bars.map((height, i) => `<div class="bar-group"><div class="bar-pair"><span class="bar" style="height:${height}%"></span><span class="bar secondary" style="height:${second[i]}%"></span></div><span class="bar-day">${['T2','T3','T4','T5','T6','T7','CN'][i]}</span></div>`).join('')}</div><div class="legend"><span><i></i> Học mới</span><span><i class="legend-secondary"></i> Ôn tập</span></div></section>
    <section class="panel chart-panel"><div class="panel-title-row"><div><h2>Phân bổ kiến thức</h2><p class="small muted" style="margin:5px 0 0">Theo danh mục bộ thẻ</p></div>${icon('target', 18)}</div><div class="category-bars">${[['Tiếng Anh', 78, '78%'], ['Marketing', 54, '54%'], ['Phát triển bản thân', 42, '42%'], ['Kiến thức chung', 31, '31%']].map(([label, width, value]) => `<div class="category-line"><span>${label}</span><div class="category-track"><span style="width:${width}%"></span></div><strong>${value}</strong></div>`).join('')}</div></section></div>`;
}
function calendarView() {
  const date = new Date(2026, 9, 15 + state.weekOffset * 7);
  const monday = new Date(date); monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
  const monthTitle = days[3].toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  const weekday = ['T2','T3','T4','T5','T6','T7','CN'];
  const events = { 15: [{ time: '09:00', title: 'Ôn từ vựng giao tiếp', meta: '15 phút · Tiếng Anh' }, { time: '16:30', title: 'Đọc ghi chú sản phẩm', meta: '20 phút · Sổ tay AI' }], 16: [{ time: '10:30', title: 'Bộ thẻ Marketing căn bản', meta: '15 phút · Marketing' }], 18: [{ time: '09:30', title: 'Luyện tập nhanh', meta: '10 phút · Từ vựng' }] };
  const selected = state.selectedDay;
  const selectedEvents = [...(events[selected] || []), ...state.extraSessions.filter(item => item.day === selected)];
  return `${pageHeader('Lịch học', 'Tạo nhịp học nhẹ nhàng, đều đặn theo thời gian của bạn.', '<button class="btn btn-primary" data-action="add-session">' + icon('plus', 16) + ' Thêm phiên học</button>')}
    <div class="calendar-layout"><section class="panel calendar-panel"><div class="calendar-head"><h2>${monthTitle}</h2><div class="calendar-controls"><button data-action="week-prev" aria-label="Tuần trước">${icon('chevron', 15)}</button><button data-action="week-next" aria-label="Tuần sau">${icon('arrow', 15)}</button></div></div><div class="week-grid">${days.map((day, i) => { const number = day.getDate(); const hasEvent = Boolean(events[number]) || state.extraSessions.some(item => item.day === number); return `<button class="week-day ${selected === number ? 'selected' : ''} ${number === 15 ? 'today' : ''}" data-action="calendar-day" data-day="${number}"><span class="day-name">${weekday[i]}</span><span class="day-number">${number}</span><span class="day-dots">${hasEvent ? '<i></i>' : ''}</span></button>`; }).join('')}</div><div class="page-footer" style="margin-top:18px">${icon('clock', 14)} Tuần học được hiển thị theo lịch mẫu; anh có thể chọn từng ngày để xem kế hoạch.</div></section>
    <section class="panel calendar-list"><h2>Kế hoạch ngày ${selected}</h2><p class="small muted" style="margin:5px 0 0">${selectedEvents.length ? `${selectedEvents.length} phiên học đã lên lịch` : 'Chưa có phiên học nào'}</p>${selectedEvents.length ? `<div class="session-list">${selectedEvents.map(item => `<article class="session-item"><div class="session-time">${item.time}</div><div><h3>${item.title}</h3><p>${item.meta}</p></div></article>`).join('')}</div>` : `<div class="no-sessions" style="margin-top:17px">${icon('calendar', 20)}<br />Ngày này chưa có lịch học.<br />Bấm “Thêm phiên học” để thêm một kế hoạch mẫu.</div>`}<button class="btn btn-outline" style="width:100%;margin-top:14px" data-action="add-session">${icon('plus', 15)} Thêm phiên học</button></section></div>`;
}
function taskCard(task) {
  const next = task.status === 'todo' ? ['doing', 'Bắt đầu'] : task.status === 'doing' ? ['done', 'Hoàn thành'] : ['todo', 'Làm lại'];
  return `<article class="task-card"><h3>${escapeHtml(task.title)}</h3><p>${escapeHtml(task.date)}</p><div class="task-tags"><span class="task-tag">${escapeHtml(task.category)}</span><span class="task-tag ${task.priority === 'Ưu tiên cao' ? 'priority' : ''}">${escapeHtml(task.priority)}</span></div><div class="task-actions"><button data-action="move-task" data-id="${task.id}" data-status="${next[0]}">${task.status === 'done' ? icon('edit', 12) : icon('check', 12)} ${next[1]}</button><button data-action="delete-task" data-id="${task.id}" aria-label="Xóa công việc">${icon('close', 13)}</button></div></article>`;
}
function tasksView() {
  const columns = [['todo', 'Chưa bắt đầu', ''], ['doing', 'Đang làm', 'doing'], ['done', 'Hoàn thành', 'done']];
  return `${pageHeader('Công việc', 'Sắp xếp việc cần làm, theo dõi tiến độ và hoàn thành từng bước.', '<button class="btn btn-primary" data-action="new-task">' + icon('plus', 16) + ' Thêm công việc</button>')}
    <div class="kanban-toolbar"><label class="kanban-search">${icon('search', 16)}<input id="taskSearch" type="search" placeholder="Tìm công việc..." aria-label="Tìm công việc" /></label><button class="btn btn-outline" data-action="sort-tasks">${icon('filter', 15)} Tất cả mức ưu tiên ${icon('down', 13)}</button></div>
    <div class="kanban-board">${columns.map(([key, title, tone]) => { const list = state.tasks.filter(task => task.status === key); return `<section class="kanban-column"><h2 class="column-title"><span><i class="column-dot ${tone}"></i>${title}<b class="count-pill">${list.length}</b></span><button class="icon-button btn-icon" data-action="new-task" data-status="${key}" aria-label="Thêm vào ${title}">${icon('plus', 15)}</button></h2><div class="task-stack">${list.length ? list.map(taskCard).join('') : `<div class="column-empty">Chưa có công việc nào ở đây.</div>`}</div></section>`; }).join('')}</div>`;
}
function switchRow(key, title, description) { return `<div class="setting-row"><div class="setting-copy"><strong>${title}</strong><span>${description}</span></div><button class="switch" role="switch" aria-checked="${state.settings[key]}" aria-label="${title}" data-action="toggle-setting" data-key="${key}"></button></div>`; }
function settingsView() {
  return `${pageHeader('Cài đặt', 'Điều chỉnh không gian học theo cách bạn thích.', '')}
    <div class="settings-layout"><section class="panel settings-panel"><div class="panel-title-row"><h2>Tùy chọn học tập</h2>${icon('settings', 18)}</div><div class="settings-group-title">Nhịp học</div>${switchRow('reminders', 'Nhắc nhở học tập', 'Gợi ý một khoảng thời gian học ngắn mỗi ngày.')}${switchRow('srs', 'Ôn tập cách quãng', 'Ưu tiên những thẻ bạn chưa nhớ vững.')}${switchRow('sounds', 'Âm thanh tương tác', 'Phản hồi nhẹ khi hoàn thành hoạt động.')}
      <div class="settings-group-title">Giao diện</div>${switchRow('compact', 'Chế độ gọn', 'Thu nhỏ khoảng cách giữa các thẻ.')}</section><aside class="settings-callout">${icon('spark', 22)}<h3>Góc học tập của bạn</h3><p>Cài đặt trong bản này chỉ có tác dụng khi trang đang mở. Dữ liệu không được lưu lâu dài hoặc gửi đi đâu cả.</p><button class="btn btn-outline" style="margin-top:16px" data-action="reset-demo">Đặt lại trạng thái demo</button></aside></div>`;
}

function showToast(message) {
  const root = document.querySelector('#toastRoot');
  if (!root) return;
  root.innerHTML = `<div class="toast">${escapeHtml(message)}</div>`;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => { if (root) root.innerHTML = ''; }, 2600);
}
function closeDialog() { const dialog = document.querySelector('#appDialog'); if (dialog?.open) dialog.close(); document.querySelector('#modalRoot').innerHTML = ''; }
function openDialog(title, body) {
  const root = document.querySelector('#modalRoot');
  root.innerHTML = `<dialog id="appDialog"><div class="modal-head"><h2>${title}</h2><button class="icon-button btn-icon" data-action="close-modal" aria-label="Đóng">${icon('close', 16)}</button></div><div class="modal-body">${body}</div></dialog>`;
  const dialog = root.querySelector('dialog');
  dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
  dialog.showModal();
}
function openTaskDialog(status = 'todo') {
  openDialog('Thêm công việc', `<form id="taskForm"><div class="form-field"><label for="taskTitle">Tên công việc</label><input id="taskTitle" name="title" required maxlength="90" placeholder="Ví dụ: Ôn lại 10 từ mới" /></div><div class="form-field"><label for="taskCategory">Danh mục</label><select id="taskCategory" name="category"><option>Tiếng Anh</option><option>Marketing</option><option>Sản phẩm</option><option>Cá nhân</option></select></div><div class="form-field"><label for="taskPriority">Mức ưu tiên</label><select id="taskPriority" name="priority"><option>Bình thường</option><option>Ưu tiên cao</option></select></div><div class="form-actions"><button class="btn btn-outline" type="button" data-action="close-modal">Hủy</button><button class="btn btn-primary" type="submit">Thêm việc</button></div><input type="hidden" name="status" value="${status}" /></form>`);
  document.querySelector('#taskTitle')?.focus();
}
function openDeckDialog() {
  openDialog('Tạo bộ thẻ mới', `<form id="deckForm"><div class="form-field"><label for="deckTitle">Tên bộ thẻ</label><input id="deckTitle" name="title" required maxlength="60" placeholder="Ví dụ: Từ vựng du lịch" /></div><div class="form-field"><label for="deckCategory">Danh mục</label><select id="deckCategory" name="category"><option>Tiếng Anh</option><option>Marketing</option><option>Phát triển bản thân</option><option>Kiến thức chung</option></select></div><p class="small muted">Bộ thẻ sẽ xuất hiện trong thư viện của phiên demo này.</p><div class="form-actions"><button class="btn btn-outline" type="button" data-action="close-modal">Hủy</button><button class="btn btn-primary" type="submit">Tạo bộ thẻ</button></div></form>`);
  document.querySelector('#deckTitle')?.focus();
}
function openDeckDetail(id) {
  const deck = getDeck(id);
  const first = deck.cards[0];
  openDialog(escapeHtml(deck.title), `<div class="deck-preview-card"><div class="question">Thẻ xem trước · ${escapeHtml(deck.category)}</div><h2>${escapeHtml(first.q)}</h2><p>${escapeHtml(first.a)}</p></div><div class="detail-stats" style="margin-top:13px"><div class="detail-stat"><span>Số thẻ</span><strong>${deck.count}</strong></div><div class="detail-stat"><span>Đã nhớ</span><strong>${deck.mastery}%</strong></div></div><div class="form-actions" style="margin-top:16px"><button class="btn btn-outline" data-action="close-modal">Đóng</button><button class="btn btn-primary" data-action="practice" data-deck="${deck.id}">${icon('play', 14)} Luyện bộ thẻ</button></div>`);
}
function answerQuestion(question) {
  const prompt = String(question || '').trim();
  if (!prompt) return;
  state.notes.push({ role: 'user', text: prompt });
  const answer = /flashcard|thẻ/i.test(prompt) ? 'Từ ghi chú mẫu, mình có thể tạo các thẻ hỏi–đáp ngắn. Ví dụ: “MVP kiểm chứng điều gì?” → “Giả thuyết giá trị quan trọng nhất của sản phẩm.”' : /trắc nghiệm|câu hỏi|kiểm tra/i.test(prompt) ? 'Câu hỏi mẫu: Một MVP nên giúp đội ngũ kiểm chứng điều gì trước tiên? A. Màu sắc thương hiệu · B. Giả thuyết giá trị quan trọng nhất · C. Số lượng tính năng. Đáp án gợi ý: B.' : 'Gợi ý mẫu: hãy chia ý này thành một khái niệm chính, một ví dụ thực tế và một câu hỏi tự kiểm tra. Nội dung hiện chỉ là minh họa giao diện, chưa kết nối tài liệu hay AI thật.';
  state.notes.push({ role: 'assistant', text: answer });
  renderPage();
  const log = document.querySelector('#chatLog'); if (log) log.scrollTop = log.scrollHeight;
}
function setPage(page) {
  if (!pageTitles[page]) return;
  state.page = page;
  document.querySelector('#sidebar')?.classList.remove('open');
  document.querySelector('#mobileBackdrop')?.classList.remove('show');
  renderPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function moveTask(id, status) { const task = state.tasks.find(item => item.id === Number(id)); if (task) task.status = status; renderPage(); }

function togglePracticeCard() {
  const card = document.querySelector('.practice-card');
  if (!card) return;
  state.flipped = !state.flipped;
  card.classList.toggle('is-flipped', state.flipped);
  card.setAttribute('aria-pressed', String(state.flipped));
  card.setAttribute('aria-label', state.flipped ? 'Thẻ đang hiển thị đáp án. Nhấn để xem lại câu hỏi.' : 'Thẻ đang hiển thị câu hỏi. Nhấn để xem đáp án.');
  card.querySelector('.practice-face--front')?.setAttribute('aria-hidden', String(state.flipped));
  card.querySelector('.practice-face--back')?.setAttribute('aria-hidden', String(!state.flipped));
  const deck = getDeck();
  const progress = Math.round(((state.cardIndex + (state.flipped ? .5 : 0)) / deck.cards.length) * 100);
  const progressBar = document.querySelector('#practiceProgress');
  if (progressBar) progressBar.setAttribute('aria-valuenow', String(progress));
  const progressFill = document.querySelector('#practiceProgressFill');
  if (progressFill) progressFill.style.width = `${progress}%`;
  const progressValue = document.querySelector('#practiceProgressValue');
  if (progressValue) progressValue.textContent = `${progress}%`;
  const ratingRow = document.querySelector('.rating-row');
  if (ratingRow) ratingRow.hidden = !state.flipped;
  const flipButton = document.querySelector('.practice-controls [data-action="flip-card"]');
  if (flipButton) flipButton.innerHTML = `${icon('book', 15)} ${state.flipped ? 'Xem lại câu hỏi' : 'Lật thẻ xem đáp án'}`;
}

app.addEventListener('click', event => {
  if (event.target.id === 'mobileBackdrop') { document.querySelector('#sidebar')?.classList.remove('open'); document.querySelector('#mobileBackdrop')?.classList.remove('show'); return; }
  const pageButton = event.target.closest('[data-page]');
  if (pageButton) { event.preventDefault(); setPage(pageButton.dataset.page); return; }
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'toggle-menu') {
    const sidebar = document.querySelector('#sidebar'); const backdrop = document.querySelector('#mobileBackdrop');
    sidebar.classList.toggle('open'); backdrop.classList.toggle('show');
  } else if (action === 'notifications') showToast('Chưa có thông báo mới — chúc anh học vui!');
  else if (action === 'profile') showToast('Đây là chế độ khách trong bản demo.');
  else if (action === 'practice') { state.activeDeck = button.dataset.deck || state.activeDeck; state.cardIndex = 0; state.flipped = false; state.practiceDone = false; setPage('practice'); }
  else if (action === 'flip-card') togglePracticeCard();
  else if (action === 'practice-next') { const deck = getDeck(); if (state.cardIndex < deck.cards.length - 1) { state.cardIndex += 1; state.flipped = false; renderPage(); } else { state.practiceDone = true; renderPage(); } }
  else if (action === 'practice-prev') { state.cardIndex = Math.max(0, state.cardIndex - 1); state.flipped = false; renderPage(); }
  else if (action === 'rate') { const deck = getDeck(); if (state.cardIndex < deck.cards.length - 1) { state.cardIndex += 1; state.flipped = false; renderPage(); } else { state.practiceDone = true; renderPage(); } }
  else if (action === 'restart-practice') { state.cardIndex = 0; state.flipped = false; state.practiceDone = false; renderPage(); }
  else if (action === 'toggle-goal') { const i = Number(button.dataset.index); state.checkedGoals[i] = !state.checkedGoals[i]; renderPage(); }
  else if (action === 'category') { state.category = button.dataset.category; renderPage(); }
  else if (action === 'view-deck') openDeckDetail(button.dataset.deck);
  else if (action === 'new-deck') openDeckDialog();
  else if (action === 'close-modal') closeDialog();
  else if (action === 'new-task') openTaskDialog(button.dataset.status || 'todo');
  else if (action === 'move-task') moveTask(button.dataset.id, button.dataset.status);
  else if (action === 'delete-task') { state.tasks = state.tasks.filter(task => task.id !== Number(button.dataset.id)); renderPage(); showToast('Đã xóa công việc khỏi phiên demo.'); }
  else if (action === 'toggle-setting') { const key = button.dataset.key; state.settings[key] = !state.settings[key]; button.setAttribute('aria-checked', String(state.settings[key])); }
  else if (action === 'toggle-srs') { state.settings.srs = !state.settings.srs; renderPage(); showToast(`Ôn tập cách quãng đã ${state.settings.srs ? 'bật' : 'tắt'}.`); }
  else if (action === 'calendar-day') { state.selectedDay = Number(button.dataset.day); renderPage(); }
  else if (action === 'week-prev') { state.weekOffset -= 1; renderPage(); }
  else if (action === 'week-next') { state.weekOffset += 1; renderPage(); }
  else if (action === 'add-session') openSessionDialog();
  else if (action === 'prompt') answerQuestion(button.dataset.prompt);
  else if (action === 'demo-source') showToast('Tính năng nguồn tài liệu là minh họa trong bản demo này.');
  else if (action === 'overview-range') showToast('Biểu đồ đang hiển thị dữ liệu minh họa trong 7 ngày.');
  else if (action === 'sort-tasks') showToast('Đang hiển thị mọi mức ưu tiên.');
  else if (action === 'reset-demo') { state.checkedGoals = [false, false, false]; state.tasks = initialTasks.map(task => ({ ...task })); state.settings = { reminders: true, srs: true, sounds: false, compact: false }; state.notes = []; renderPage(); showToast('Đã đặt lại dữ liệu mẫu trong phiên này.'); }
});

app.addEventListener('input', event => {
  if (event.target.id === 'globalSearch') state.search = event.target.value;
  if (event.target.id === 'librarySearch') {
    state.librarySearch = event.target.value;
    const term = state.librarySearch.trim().toLocaleLowerCase('vi');
    let visible = 0;
    document.querySelectorAll('#deckList .deck-card').forEach(card => { const deck = decks.find(item => item.id === card.dataset.deckCard); const show = Boolean(deck && deck.title.toLocaleLowerCase('vi').includes(term)); card.hidden = !show; if (show) visible += 1; });
    document.querySelector('#emptyDecks')?.classList.toggle('visible', visible === 0);
  }
  if (event.target.id === 'taskSearch') {
    const term = event.target.value.toLocaleLowerCase('vi');
    document.querySelectorAll('.task-card').forEach(card => { card.hidden = !card.textContent.toLocaleLowerCase('vi').includes(term); });
  }
});
app.addEventListener('keydown', event => {
  if (event.target.id === 'globalSearch' && event.key === 'Enter') {
    event.preventDefault(); state.librarySearch = state.search.trim(); state.category = 'Tất cả'; setPage('library');
    const input = document.querySelector('#librarySearch'); if (input) { input.value = state.librarySearch; input.dispatchEvent(new Event('input', { bubbles: true })); }
  }
  if (event.target.matches('.practice-card') && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); togglePracticeCard(); }
  if (event.key === 'Escape') { document.querySelector('#sidebar')?.classList.remove('open'); document.querySelector('#mobileBackdrop')?.classList.remove('show'); }
});
app.addEventListener('submit', event => {
  if (event.target.id === 'taskForm') {
    event.preventDefault(); const data = new FormData(event.target); const title = String(data.get('title') || '').trim(); if (!title) return;
    state.tasks.unshift({ id: Date.now(), title, category: String(data.get('category')), priority: String(data.get('priority')), status: String(data.get('status') || 'todo'), date: 'Hôm nay' }); closeDialog(); renderPage(); showToast('Đã thêm công việc vào bảng.');
  } else if (event.target.id === 'deckForm') {
    event.preventDefault(); const data = new FormData(event.target); const title = String(data.get('title') || '').trim(); if (!title) return;
    const category = String(data.get('category')); const id = `custom-${Date.now()}`;
    decks.unshift({ id, title, category, count: 0, mastery: 0, color: decks.length % 5, cards: [{ q: 'Thẻ mẫu mới', a: 'Bạn có thể thêm nội dung thẻ trong phiên bản sản phẩm đầy đủ.' }] });
    state.category = 'Tất cả'; state.librarySearch = ''; closeDialog(); setPage('library'); showToast('Đã tạo bộ thẻ mới trong phiên demo.');
  } else if (event.target.id === 'chatForm') {
    event.preventDefault(); const form = event.target; const question = new FormData(form).get('question'); form.reset(); answerQuestion(question);
  }
});

document.querySelector('#globalSearch')?.addEventListener('keydown', event => {
  if (event.key === 'Enter') { event.preventDefault(); state.search = event.currentTarget.value; state.librarySearch = state.search.trim(); state.category = 'Tất cả'; setPage('library'); const input = document.querySelector('#librarySearch'); if (input) { input.value = state.librarySearch; input.dispatchEvent(new Event('input', { bubbles: true })); } }
});
document.querySelector('#mobileBackdrop')?.addEventListener('click', () => { document.querySelector('#sidebar')?.classList.remove('open'); document.querySelector('#mobileBackdrop')?.classList.remove('show'); });
renderShell();


function openSessionDialog() {
  openDialog('Thêm phiên học', `<form id="sessionForm"><div class="form-field"><label for="sessionTitle">Tên phiên học</label><input id="sessionTitle" name="title" required maxlength="70" placeholder="Ví dụ: Ôn từ vựng giao tiếp" /></div><div class="form-field"><label for="sessionDay">Ngày trong tháng</label><input id="sessionDay" name="day" type="number" min="1" max="31" value="${state.selectedDay}" required /></div><div class="form-field"><label for="sessionTime">Giờ bắt đầu</label><input id="sessionTime" name="time" type="time" value="09:00" required /></div><div class="form-field"><label for="sessionCategory">Ghi chú</label><input id="sessionCategory" name="meta" maxlength="50" value="15 phút · Phiên học demo" /></div><div class="form-actions"><button class="btn btn-outline" type="button" data-action="close-modal">Hủy</button><button class="btn btn-primary" type="submit">Thêm vào lịch</button></div></form>`);
  document.querySelector('#sessionTitle')?.focus();
}

app.addEventListener('submit', event => {
  if (event.target.id !== 'sessionForm') return;
  event.preventDefault();
  const data = new FormData(event.target);
  const day = Number(data.get('day'));
  const title = String(data.get('title') || '').trim();
  if (!title || day < 1 || day > 31) return;
  state.extraSessions.push({ day, time: String(data.get('time') || '09:00'), title, meta: String(data.get('meta') || 'Phiên học demo') });
  state.selectedDay = day;
  closeDialog();
  renderPage();
  showToast('Đã thêm phiên học vào lịch của phiên demo.');
});
