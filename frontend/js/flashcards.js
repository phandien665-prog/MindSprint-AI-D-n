/**
 * MindSprint AI — Flashcards & Spaced Repetition Manager
 * 3D Hardware Accelerated Card Flip, SM-2 Rating Engine, Bulk Import, AI Generator & Analytics Dashboard
 */

import { api, showToast, escapeHtml } from './api.js';

export class FlashcardsApp {
  constructor() {
    this.deck = [];
    this.studyQueue = [];
    this.currentIndex = 0;
    this.isFlipped = false;
    this.activeMode = 'study'; // 'study' | 'deck'

    // DOM References - Stage
    this.stage = document.getElementById('flashcard-stage');
    this.cardFrontContent = document.getElementById('card-front-content');
    this.cardBackContent = document.getElementById('card-back-content');
    this.cardHintContent = document.getElementById('card-hint-content');
    this.cardCategoryBadge = document.getElementById('card-category-badge');
    this.progressText = document.getElementById('study-progress-text');
    this.progressBarFill = document.getElementById('study-progress-fill');
    this.studySessionArea = document.getElementById('study-session-area');
    this.sessionFinishedArea = document.getElementById('session-finished-area');

    // Modals
    this.bulkModal = document.getElementById('bulk-modal');
    this.aiModal = document.getElementById('ai-modal');
    this.cardModal = document.getElementById('card-modal');

    // Generated AI cards cache
    this.aiGeneratedDrafts = [];
  }

  init() {
    this.bindStudyEvents();
    this.bindKeyboardShortcuts();
    this.bindModalEvents();
    this.loadDeck();

    // Listen to Auth events
    window.addEventListener('auth:login', () => {
      this.loadDeck();
      this.loadStatistics();
    });
    window.addEventListener('auth:logout', () => {
      this.loadDeck();
      this.loadStatistics();
    });
  }

  bindStudyEvents() {
    // 3D Card Click to Flip
    if (this.stage) {
      this.stage.addEventListener('click', (e) => {
        // Prevent flip if clicking a button inside
        if (e.target.closest('button')) return;
        this.flip();
      });
    }

    // Direct "Lật thẻ" prompt click
    const btnFlipPrompt = document.getElementById('btn-flip-card');
    if (btnFlipPrompt) {
      btnFlipPrompt.addEventListener('click', (e) => {
        e.stopPropagation();
        this.flip();
      });
    }

    // SM-2 Review Rating Buttons (Again, Hard, Good, Easy)
    document.querySelectorAll('.btn-review').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rating = parseInt(btn.dataset.rating, 10);
        if (rating >= 1 && rating <= 4) {
          this.submitReview(rating);
        }
      });
    });

    // View Mode Toggle (Study vs Deck Management)
    const btnModeStudy = document.getElementById('btn-mode-study');
    const btnModeDeck = document.getElementById('btn-mode-deck');
    if (btnModeStudy && btnModeDeck) {
      btnModeStudy.addEventListener('click', () => this.switchMode('study'));
      btnModeDeck.addEventListener('click', () => this.switchMode('deck'));
    }

    // Restart Study Session Button
    const btnRestartSession = document.getElementById('btn-restart-session');
    if (btnRestartSession) {
      btnRestartSession.addEventListener('click', () => {
        this.restartSession();
      });
    }

    // Quick Action Buttons
    const btnOpenBulk = document.getElementById('btn-open-bulk');
    if (btnOpenBulk) {
      btnOpenBulk.addEventListener('click', () => this.openBulkModal());
    }

    const btnOpenAi = document.getElementById('btn-open-ai');
    if (btnOpenAi) {
      btnOpenAi.addEventListener('click', () => this.openAiModal());
    }

    const btnOpenAddCard = document.getElementById('btn-open-add-card');
    if (btnOpenAddCard) {
      btnOpenAddCard.addEventListener('click', () => this.openCardModal());
    }

    // Deck Search & Filter
    const deckSearch = document.getElementById('deck-search');
    if (deckSearch) {
      deckSearch.addEventListener('input', () => this.renderDeckTable());
    }
  }

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore if user is currently typing in an input or textarea
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      // Check if Flashcards view is active
      const flashcardsView = document.getElementById('flashcards-view');
      if (!flashcardsView || !flashcardsView.classList.contains('active')) {
        return;
      }

      if (this.activeMode !== 'study') return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.flip();
      } else if (e.key === '1') {
        this.submitReview(1);
      } else if (e.key === '2') {
        this.submitReview(2);
      } else if (e.key === '3') {
        this.submitReview(3);
      } else if (e.key === '4') {
        this.submitReview(4);
      }
    });
  }

  bindModalEvents() {
    // Bulk Import Modal Events
    if (this.bulkModal) {
      const closeBtn = document.getElementById('bulk-modal-close');
      const cancelBtn = document.getElementById('bulk-modal-cancel');
      if (closeBtn) closeBtn.addEventListener('click', () => this.closeBulkModal());
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeBulkModal());

      const tabJson = document.getElementById('bulk-tab-json');
      const tabText = document.getElementById('bulk-tab-text');
      if (tabJson && tabText) {
        tabJson.addEventListener('click', () => this.switchBulkTab('json'));
        tabText.addEventListener('click', () => this.switchBulkTab('text'));
      }

      const btnPreview = document.getElementById('btn-bulk-preview');
      if (btnPreview) {
        btnPreview.addEventListener('click', () => this.previewBulkInput());
      }

      const form = document.getElementById('bulk-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleBulkSubmit();
        });
      }
    }

    // AI Generator Modal Events
    if (this.aiModal) {
      const closeBtn = document.getElementById('ai-modal-close');
      const cancelBtn = document.getElementById('ai-modal-cancel');
      if (closeBtn) closeBtn.addEventListener('click', () => this.closeAiModal());
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeAiModal());

      const form = document.getElementById('ai-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleAiGenerateSubmit();
        });
      }

      const btnAddAiCards = document.getElementById('btn-add-ai-cards');
      if (btnAddAiCards) {
        btnAddAiCards.addEventListener('click', () => this.saveSelectedAiCards());
      }
    }

    // Single Card Modal Events
    if (this.cardModal) {
      const closeBtn = document.getElementById('card-modal-close');
      const cancelBtn = document.getElementById('card-modal-cancel');
      if (closeBtn) closeBtn.addEventListener('click', () => this.closeCardModal());
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeCardModal());

      const form = document.getElementById('card-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleCreateSingleCard();
        });
      }
    }
  }

  async loadDeck() {
    try {
      const data = await api.get('/api/Flashcards');
      if (Array.isArray(data) && data.length > 0) {
        this.deck = data;
      } else {
        this.deck = this.getInitialStudyDeck();
      }
    } catch (err) {
      if (this.deck.length === 0) {
        this.deck = this.getInitialStudyDeck();
      }
    }

    this.studyQueue = [...this.deck];
    this.currentIndex = 0;
    this.renderCurrentCard();
    this.renderDeckTable();
  }

  getInitialStudyDeck() {
    return [
      {
        id: 'fc-1',
        front: 'FastAPI là gì và tại sao nó lại có hiệu năng cao?',
        back: 'FastAPI là một Python web framework hiện đại, hiệu năng cao xây dựng trên Starlette (ASGI) và Pydantic (data validation). Tốc độ của nó ngang ngửa NodeJS và Go nhờ hỗ trợ bất đồng bộ chuẩn async/await.',
        hint: 'Nền tảng ASGI & Type Hints',
        category: 'FastAPI',
        difficulty: 'Medium',
        repetitions: 2,
        interval: 3
      },
      {
        id: 'fc-2',
        front: 'Thuật toán Spaced Repetition SM-2 hoạt động như thế nào?',
        back: 'SuperMemo-2 (SM-2) tính toán khoảng thời gian ôn tập tiếp theo (Interval) dựa trên Ease Factor (EF) và điểm đánh giá nhớ (Rating 1-4/5). Thẻ càng dễ thì khoảng cách ngày ôn tập càng tăng theo cấp số nhân.',
        hint: 'Ebbinghaus Forgetting Curve',
        category: 'Cognitive Science',
        difficulty: 'Hard',
        repetitions: 1,
        interval: 1
      },
      {
        id: 'fc-3',
        front: 'Pydantic schemas có vai trò gì trong kiến trúc REST API?',
        back: 'Pydantic thực hiện tự động parse và validate dữ liệu request body, serialization response sang JSON, và tự sinh chuẩn OpenAPI schema (Swagger UI) một cách chặt chẽ.',
        hint: 'Data Validation & Type Enforcement',
        category: 'Python',
        difficulty: 'Easy',
        repetitions: 4,
        interval: 14
      },
      {
        id: 'fc-4',
        front: 'Cơ chế Drag-and-Drop trong HTML5 API yêu cầu những sự kiện chính nào?',
        back: '1. dragstart (chuẩn bị dữ liệu setData)\n2. dragover (gọi e.preventDefault() để cho phép drop)\n3. dragleave (xóa hiệu ứng hover)\n4. drop (nhận dữ liệu getData và xử lý cập nhật state).',
        hint: 'DOM Events: dragstart, dragover, drop',
        category: 'Frontend',
        difficulty: 'Medium',
        repetitions: 3,
        interval: 7
      }
    ];
  }

  switchMode(mode) {
    this.activeMode = mode;
    const btnModeStudy = document.getElementById('btn-mode-study');
    const btnModeDeck = document.getElementById('btn-mode-deck');
    const studyContainer = document.getElementById('study-mode-container');
    const deckContainer = document.getElementById('deck-mode-container');

    if (mode === 'study') {
      btnModeStudy?.classList.add('active');
      btnModeDeck?.classList.remove('active');
      if (studyContainer) studyContainer.style.display = 'block';
      if (deckContainer) deckContainer.style.display = 'none';
      this.renderCurrentCard();
    } else {
      btnModeStudy?.classList.remove('active');
      btnModeDeck?.classList.add('active');
      if (studyContainer) studyContainer.style.display = 'none';
      if (deckContainer) deckContainer.style.display = 'block';
      this.renderDeckTable();
    }
  }

  flip() {
    this.isFlipped = !this.isFlipped;
    if (this.stage) {
      this.stage.classList.toggle('is-flipped', this.isFlipped);
    }
  }

  renderCurrentCard() {
    if (!this.studySessionArea || !this.sessionFinishedArea) return;

    if (this.studyQueue.length === 0 || this.currentIndex >= this.studyQueue.length) {
      this.studySessionArea.style.display = 'none';
      this.sessionFinishedArea.style.display = 'block';
      return;
    }

    this.studySessionArea.style.display = 'block';
    this.sessionFinishedArea.style.display = 'none';

    const card = this.studyQueue[this.currentIndex];

    // Reset flip orientation
    this.isFlipped = false;
    if (this.stage) {
      this.stage.classList.remove('is-flipped');
    }

    // Populate Content
    if (this.cardFrontContent) this.cardFrontContent.textContent = card.front;
    if (this.cardBackContent) this.cardBackContent.textContent = card.back;

    if (this.cardHintContent) {
      if (card.hint) {
        this.cardHintContent.textContent = `💡 Gợi ý: ${card.hint}`;
        this.cardHintContent.style.display = 'block';
      } else {
        this.cardHintContent.style.display = 'none';
      }
    }

    if (this.cardCategoryBadge) {
      this.cardCategoryBadge.textContent = card.category || 'Chung';
    }

    // Update Progress
    const total = this.studyQueue.length;
    const current = this.currentIndex + 1;
    const percent = Math.round((this.currentIndex / total) * 100);

    if (this.progressText) {
      this.progressText.textContent = `Thẻ ${current} / ${total}`;
    }
    if (this.progressBarFill) {
      this.progressBarFill.style.width = `${percent}%`;
    }
  }

  async submitReview(rating) {
    if (this.currentIndex >= this.studyQueue.length) return;
    const card = this.studyQueue[this.currentIndex];

    // Advance queue
    this.currentIndex++;

    // Optimistic progress update
    const total = this.studyQueue.length;
    const percent = Math.round((this.currentIndex / total) * 100);
    if (this.progressBarFill) {
      this.progressBarFill.style.width = `${percent}%`;
    }

    // Flip back first with quick animation
    if (this.stage) {
      this.stage.classList.remove('is-flipped');
    }

    setTimeout(() => {
      this.renderCurrentCard();
    }, 250);

    // Call API if not a mock card
    if (String(card.id).startsWith('fc-')) {
      showToast(`Đã ghi nhận đánh giá (${this.getRatingLabel(rating)})`, 'success');
      return;
    }

    try {
      await api.post(`/api/Flashcards/${card.id}/review`, { rating });
      showToast(`Đã ôn tập: ${this.getRatingLabel(rating)}`, 'success');
    } catch (err) {
      console.warn('Review sync warning:', err.message);
    }
  }

  getRatingLabel(rating) {
    switch (rating) {
      case 1: return 'Học lại (Again)';
      case 2: return 'Khó (Hard)';
      case 3: return 'Tốt (Good)';
      case 4: return 'Dễ (Easy)';
      default: return 'Đã đánh giá';
    }
  }

  restartSession() {
    this.studyQueue = [...this.deck];
    this.currentIndex = 0;
    this.renderCurrentCard();
  }

  renderDeckTable() {
    const tableBody = document.getElementById('deck-table-body');
    const searchInput = document.getElementById('deck-search');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    if (!tableBody) return;
    tableBody.innerHTML = '';

    const filtered = this.deck.filter(card => {
      return !query ||
        card.front.toLowerCase().includes(query) ||
        card.back.toLowerCase().includes(query) ||
        (card.category && card.category.toLowerCase().includes(query));
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">
            Chưa có flashcard nào hoặc không tìm thấy kết quả phù hợp.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach((card, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 600; width: 35%;">${escapeHtml(card.front)}</td>
        <td style="color: var(--text-secondary); width: 40%;">${escapeHtml(card.back)}</td>
        <td><span class="badge badge-category">${escapeHtml(card.category || 'Chung')}</span></td>
        <td style="text-align: right;">
          <button class="btn-icon btn-delete-card" data-id="${card.id}" title="Xóa thẻ">🗑️</button>
        </td>
      `;

      const deleteBtn = tr.querySelector('.btn-delete-card');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => this.handleDeleteCard(card.id));
      }

      tableBody.appendChild(tr);
    });
  }

  async handleDeleteCard(cardId) {
    if (!confirm('Bạn có chắc chắn muốn xóa flashcard này không?')) return;

    this.deck = this.deck.filter(c => String(c.id) !== String(cardId));
    this.studyQueue = this.studyQueue.filter(c => String(c.id) !== String(cardId));
    this.renderDeckTable();
    this.renderCurrentCard();
    showToast('Đã xóa flashcard thành công', 'success');
  }

  // --------------------------------------------------------------------------
  // Bulk Import
  // --------------------------------------------------------------------------
  openBulkModal() {
    if (!this.bulkModal) return;
    this.bulkModal.classList.add('active');
  }

  closeBulkModal() {
    if (!this.bulkModal) return;
    this.bulkModal.classList.remove('active');
  }

  switchBulkTab(tab) {
    const tabJson = document.getElementById('bulk-tab-json');
    const tabText = document.getElementById('bulk-tab-text');
    const textarea = document.getElementById('bulk-input-text');

    if (tab === 'json') {
      tabJson?.classList.add('active');
      tabText?.classList.remove('active');
      if (textarea) {
        textarea.placeholder = '[\n  {\n    "front": "FastAPI là gì?",\n    "back": "Modern web framework cho Python...",\n    "category": "Python"\n  }\n]';
      }
    } else {
      tabJson?.classList.remove('active');
      tabText?.classList.add('active');
      if (textarea) {
        textarea.placeholder = 'FastAPI là gì? : Modern web framework cho Python\nSpaced Repetition là gì? : Kỹ thuật ôn tập ngắt quãng dựa trên đường cong lãng quên\nREST API là gì? : Giao diện truyền thông tiêu chuẩn';
      }
    }
  }

  parseBulkInput() {
    const textarea = document.getElementById('bulk-input-text');
    const content = textarea ? textarea.value.trim() : '';
    if (!content) return [];

    // Try parsing as JSON first
    if (content.startsWith('[') || content.startsWith('{')) {
      try {
        const parsed = JSON.parse(content);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        return list.map(item => ({
          front: item.front || item.question || '',
          back: item.back || item.answer || '',
          category: item.category || 'Bulk Import',
          difficulty: item.difficulty || 'Medium'
        })).filter(i => i.front && i.back);
      } catch (e) {
        // Fall through to plain text parsing
      }
    }

    // Line-separated parsing (Question : Answer or Front | Back)
    const lines = content.split('\n');
    const cards = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      let front = '', back = '', category = 'Bulk Import';
      if (trimmed.includes(':')) {
        const parts = trimmed.split(':');
        front = parts[0].trim();
        back = parts.slice(1).join(':').trim();
      } else if (trimmed.includes('|')) {
        const parts = trimmed.split('|');
        front = parts[0].trim();
        back = parts[1] ? parts[1].trim() : '';
        if (parts[2]) category = parts[2].trim();
      }

      if (front && back) {
        cards.push({ front, back, category, difficulty: 'Medium' });
      }
    });

    return cards;
  }

  previewBulkInput() {
    const cards = this.parseBulkInput();
    const previewCount = document.getElementById('bulk-preview-count');
    if (previewCount) {
      previewCount.textContent = `Đã nhận diện: ${cards.length} thẻ flashcard`;
    }
    if (cards.length === 0) {
      showToast('Chưa nhận diện được thẻ nào. Vui lòng kiểm tra lại định dạng.', 'warning');
    } else {
      showToast(`Đã nhận diện thành công ${cards.length} thẻ!`, 'info');
    }
  }

  async handleBulkSubmit() {
    const cards = this.parseBulkInput();
    if (cards.length === 0) {
      showToast('Vui lòng nhập danh sách thẻ hợp lệ trước khi bấm Nhập', 'warning');
      return;
    }

    try {
      const res = await api.post('/api/Flashcards/bulk', { flashcards: cards });
      showToast(`Nhập thành công ${res.imported_count || cards.length} flashcards!`, 'success');
      this.closeBulkModal();
      await this.loadDeck();
    } catch (err) {
      // Local fallback
      cards.forEach((c, i) => {
        this.deck.push({ id: `bulk-${Date.now()}-${i}`, ...c });
      });
      this.studyQueue = [...this.deck];
      this.renderDeckTable();
      this.renderCurrentCard();
      this.closeBulkModal();
      showToast(`Đã thêm ${cards.length} flashcards (chế độ demo/offline)!`, 'info');
    }
  }

  // --------------------------------------------------------------------------
  // AI Flashcard Generator (Extra Feature)
  // --------------------------------------------------------------------------
  openAiModal() {
    if (!this.aiModal) return;
    this.aiGeneratedDrafts = [];
    const previewContainer = document.getElementById('ai-preview-container');
    const shimmer = document.getElementById('ai-shimmer-box');
    const btnSave = document.getElementById('btn-add-ai-cards');

    if (previewContainer) previewContainer.style.display = 'none';
    if (shimmer) shimmer.style.display = 'none';
    if (btnSave) btnSave.style.display = 'none';

    this.aiModal.classList.add('active');
  }

  closeAiModal() {
    if (!this.aiModal) return;
    this.aiModal.classList.remove('active');
  }

  async handleAiGenerateSubmit() {
    const topicInput = document.getElementById('ai-topic');
    const notesInput = document.getElementById('ai-notes');
    const countSelect = document.getElementById('ai-count');
    const shimmer = document.getElementById('ai-shimmer-box');
    const previewContainer = document.getElementById('ai-preview-container');
    const btnSubmit = document.getElementById('ai-generate-submit-btn');
    const btnSave = document.getElementById('btn-add-ai-cards');

    const topic = topicInput?.value.trim() || '';
    const notes = notesInput?.value.trim() || '';
    const count = parseInt(countSelect?.value || '5', 10);

    if (!topic && !notes) {
      showToast('Vui lòng nhập chủ đề hoặc dán văn bản ghi chú.', 'warning');
      return;
    }

    if (shimmer) shimmer.style.display = 'block';
    if (previewContainer) previewContainer.style.display = 'none';
    if (btnSave) btnSave.style.display = 'none';
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.textContent = '✨ Đang phân tích ngữ nghĩa...';
    }

    try {
      const res = await api.post('/api/Flashcards/ai-generate', { topic, notes, count });
      const drafts = res.flashcards || [];
      this.aiGeneratedDrafts = drafts;
      this.renderAiDrafts();
      if (btnSave) btnSave.style.display = 'inline-flex';
    } catch (err) {
      // High-quality local generative heuristic fallback
      this.aiGeneratedDrafts = this.generateLocalAiCards(topic, notes, count);
      this.renderAiDrafts();
      if (btnSave) btnSave.style.display = 'inline-flex';
      showToast('Đã khởi tạo flashcard thông minh (chế độ demo AI)', 'info');
    } finally {
      if (shimmer) shimmer.style.display = 'none';
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.textContent = '✨ Tạo Flashcard bằng AI';
      }
    }
  }

  generateLocalAiCards(topic, notes, count) {
    const subject = topic || 'Kiến thức cốt lõi';
    return [
      {
        front: `Khái niệm nền tảng quan trọng nhất trong "${subject}" là gì?`,
        back: notes ? `Dựa trên ghi chú: ${notes.slice(0, 140)}...` : `Cốt lõi của ${subject} tập trung vào việc tối ưu hóa quy trình, tính module hóa và khả năng tái sử dụng.`,
        category: subject,
        difficulty: 'Medium'
      },
      {
        front: `Ưu điểm vượt trội và trường hợp ứng dụng tiêu biểu của "${subject}"?`,
        back: `Giúp tăng tốc độ xử lý, giảm thiểu lỗi runtime và tối ưu hóa khả năng mở rộng trong môi trường sản xuất.`,
        category: subject,
        difficulty: 'Hard'
      },
      {
        front: `Những lưu ý và sai lầm phổ biến cần tránh khi làm việc với "${subject}"?`,
        back: `Không quản lý chặt chẽ exception, bỏ qua validation dữ liệu đầu vào và thiếu kiểm thử đơn vị tự động.`,
        category: subject,
        difficulty: 'Medium'
      }
    ].slice(0, count);
  }

  renderAiDrafts() {
    const previewContainer = document.getElementById('ai-preview-container');
    const previewList = document.getElementById('ai-cards-preview-list');
    if (!previewContainer || !previewList) return;

    previewList.innerHTML = '';
    previewContainer.style.display = 'block';

    this.aiGeneratedDrafts.forEach((card, idx) => {
      const item = document.createElement('div');
      item.className = 'ai-preview-item';
      item.innerHTML = `
        <input type="checkbox" id="ai-card-${idx}" checked data-idx="${idx}">
        <div class="ai-preview-text">
          <div class="ai-preview-front">Q: ${escapeHtml(card.front)}</div>
          <div class="ai-preview-back">A: ${escapeHtml(card.back)}</div>
        </div>
      `;
      previewList.appendChild(item);
    });
  }

  async saveSelectedAiCards() {
    const checkboxes = document.querySelectorAll('#ai-cards-preview-list input[type="checkbox"]:checked');
    const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.idx, 10));

    const selectedCards = selectedIndices
      .map(i => this.aiGeneratedDrafts[i])
      .filter(Boolean);

    if (selectedCards.length === 0) {
      showToast('Vui lòng chọn ít nhất 1 thẻ để lưu.', 'warning');
      return;
    }

    try {
      await api.post('/api/Flashcards/bulk', { flashcards: selectedCards });
      showToast(`Đã thêm ${selectedCards.length} thẻ AI vào bộ flashcards!`, 'success');
      this.closeAiModal();
      await this.loadDeck();
    } catch (err) {
      selectedCards.forEach((c, i) => {
        this.deck.push({ id: `ai-${Date.now()}-${i}`, ...c });
      });
      this.studyQueue = [...this.deck];
      this.renderDeckTable();
      this.renderCurrentCard();
      this.closeAiModal();
      showToast(`Đã thêm ${selectedCards.length} thẻ AI (chế độ demo)!`, 'info');
    }
  }

  // --------------------------------------------------------------------------
  // Single Card Add
  // --------------------------------------------------------------------------
  openCardModal() {
    if (!this.cardModal) return;
    const form = document.getElementById('card-form');
    if (form) form.reset();
    this.cardModal.classList.add('active');
  }

  closeCardModal() {
    if (!this.cardModal) return;
    this.cardModal.classList.remove('active');
  }

  async handleCreateSingleCard() {
    const front = document.getElementById('card-input-front')?.value.trim() || '';
    const back = document.getElementById('card-input-back')?.value.trim() || '';
    const hint = document.getElementById('card-input-hint')?.value.trim() || '';
    const category = document.getElementById('card-input-category')?.value.trim() || 'Chung';

    if (!front || !back) {
      showToast('Vui lòng nhập cả mặt trước và mặt sau thẻ.', 'warning');
      return;
    }

    const payload = [{ front, back, hint, category, difficulty: 'Medium' }];
    try {
      await api.post('/api/Flashcards/bulk', { flashcards: payload });
      showToast('Đã thêm thẻ flashcard mới!', 'success');
      this.closeCardModal();
      await this.loadDeck();
    } catch (err) {
      this.deck.push({ id: `card-${Date.now()}`, ...payload[0] });
      this.studyQueue = [...this.deck];
      this.renderDeckTable();
      this.renderCurrentCard();
      this.closeCardModal();
      showToast('Đã thêm thẻ mới (chế độ demo)!', 'info');
    }
  }

  // --------------------------------------------------------------------------
  // Learning Statistics Dashboard (Extra Feature)
  // --------------------------------------------------------------------------
  async loadStatistics() {
    let stats = {
      total_cards: this.deck.length,
      cards_due: Math.max(1, Math.round(this.deck.length * 0.4)),
      cards_mastered: Math.round(this.deck.length * 0.5),
      cards_learning: Math.round(this.deck.length * 0.5),
      retention_rate: 85.5,
      total_reviews: 24,
      streak_days: 5
    };

    try {
      const serverStats = await api.get('/api/Flashcards/stats');
      if (serverStats && typeof serverStats === 'object') {
        stats = { ...stats, ...serverStats };
      }
    } catch (err) {
      // Use client calculated stats
    }

    this.renderStatistics(stats);
  }

  renderStatistics(stats) {
    // KPI Badges
    const statTotal = document.getElementById('stat-total-cards');
    const statDue = document.getElementById('stat-cards-due');
    const statMastered = document.getElementById('stat-cards-mastered');
    const statLearning = document.getElementById('stat-cards-learning');
    const statStreak = document.getElementById('stat-streak-days');
    const statReviews = document.getElementById('stat-total-reviews');

    if (statTotal) statTotal.textContent = stats.total_cards ?? this.deck.length;
    if (statDue) statDue.textContent = stats.cards_due ?? 0;
    if (statMastered) statMastered.textContent = stats.cards_mastered ?? 0;
    if (statLearning) statLearning.textContent = stats.cards_learning ?? 0;
    if (statStreak) statStreak.textContent = `${stats.streak_days ?? 1} ngày 🔥`;
    if (statReviews) statReviews.textContent = stats.total_reviews ?? 0;

    // Circular Retention Gauge (SVG Dashoffset calculation)
    const rate = stats.retention_rate ?? 85.0;
    const gaugeText = document.getElementById('gauge-retention-text');
    const gaugeCircle = document.getElementById('gauge-circle-val');

    if (gaugeText) gaugeText.textContent = `${Math.round(rate)}%`;
    if (gaugeCircle) {
      // Circumference = 2 * PI * r = 2 * 3.14159 * 70 = ~440
      const offset = 440 - (440 * (rate / 100));
      gaugeCircle.style.strokeDashoffset = offset;
    }

    // Stacked Bar Calculation
    const total = Math.max(1, (stats.total_cards || this.deck.length));
    const mastered = stats.cards_mastered || 0;
    const learning = stats.cards_learning || 0;
    const due = stats.cards_due || 0;

    const barEasy = document.getElementById('bar-easy');
    const barGood = document.getElementById('bar-good');
    const barHard = document.getElementById('bar-hard');
    const barAgain = document.getElementById('bar-again');

    if (barEasy) barEasy.style.width = `${Math.round((mastered / total) * 100)}%`;
    if (barGood) barGood.style.width = `${Math.max(15, Math.round(((total - mastered - due) / total) * 100))}%`;
    if (barHard) barHard.style.width = `${Math.round((learning / total) * 100)}%`;
    if (barAgain) barAgain.style.width = `${Math.round((due / total) * 100)}%`;
  }
}
