/**
 * MindSprint AI — Kanban Task Board Manager
 * Interactive 3-Column HTML5 Drag-and-Drop, Touch/Click-to-Move, and Task CRUD Synchronization
 */

import { api, showToast, escapeHtml } from './api.js';

export class KanbanBoard {
  constructor() {
    this.tasks = [];
    this.filterText = '';
    this.filterPriority = 'all';
    this.currentEditingTaskId = null;

    // Column DOM Elements
    this.columns = {
      Todo: document.getElementById('col-todo-list'),
      InProgress: document.getElementById('col-inprogress-list'),
      Completed: document.getElementById('col-completed-list')
    };

    // Counter Badges
    this.counters = {
      Todo: document.getElementById('todo-count'),
      InProgress: document.getElementById('inprogress-count'),
      Completed: document.getElementById('completed-count')
    };

    // Modal
    this.taskModal = document.getElementById('task-modal');
  }

  init() {
    this.bindBoardEvents();
    this.bindDragDropEvents();
    this.bindModalEvents();
    this.loadTasks();

    // Listen to Auth events to refresh tasks
    window.addEventListener('auth:login', () => this.loadTasks());
    window.addEventListener('auth:logout', () => this.loadTasks());
  }

  bindBoardEvents() {
    // Search input
    const searchInput = document.getElementById('kanban-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterText = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    // Priority filter
    const prioritySelect = document.getElementById('kanban-priority-filter');
    if (prioritySelect) {
      prioritySelect.addEventListener('change', (e) => {
        this.filterPriority = e.target.value;
        this.render();
      });
    }

    // Quick Add buttons in column headers
    document.querySelectorAll('.btn-add-col-task').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const status = e.currentTarget.dataset.status || 'Todo';
        this.openTaskModal(status);
      });
    });

    // Main "+ Thêm Task" button
    const btnNewTask = document.getElementById('btn-new-task');
    if (btnNewTask) {
      btnNewTask.addEventListener('click', () => this.openTaskModal('Todo'));
    }
  }

  bindDragDropEvents() {
    // Set up drag-and-drop on each column list container
    Object.entries(this.columns).forEach(([status, colElement]) => {
      if (!colElement) return;

      colElement.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        colElement.classList.add('column-drag-over');
      });

      colElement.addEventListener('dragleave', (e) => {
        // Only remove if leaving the column container itself
        if (!colElement.contains(e.relatedTarget)) {
          colElement.classList.remove('column-drag-over');
        }
      });

      colElement.addEventListener('drop', async (e) => {
        e.preventDefault();
        colElement.classList.remove('column-drag-over');

        const taskId = e.dataTransfer.getData('text/plain');
        if (!taskId) return;

        const targetStatus = status; // 'Todo' | 'InProgress' | 'Completed'
        await this.handleTaskMove(taskId, targetStatus);
      });
    });
  }

  bindModalEvents() {
    if (!this.taskModal) return;

    // Modal Close
    const closeBtn = document.getElementById('task-modal-close');
    const cancelBtn = document.getElementById('task-modal-cancel');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeTaskModal());
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeTaskModal());

    this.taskModal.addEventListener('click', (e) => {
      if (e.target === this.taskModal) this.closeTaskModal();
    });

    // Form Submit
    const form = document.getElementById('task-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCreateTask();
      });
    }
  }

  async loadTasks() {
    try {
      const data = await api.get('/api/Tasks');
      if (Array.isArray(data)) {
        this.tasks = data;
      } else {
        this.tasks = [];
      }
    } catch (err) {
      // If unauthenticated or offline, supply initial sample tasks
      if (this.tasks.length === 0) {
        this.tasks = this.getInitialSampleTasks();
      }
    }
    this.render();
  }

  getInitialSampleTasks() {
    return [
      {
        id: 'sample-1',
        title: 'Xây dựng Backend RESTful API với FastAPI',
        description: 'Phát triển các module auth, tasks, flashcard review và bulk AI generator theo đúng interface contract.',
        status: 'Completed',
        priority: 'High',
        due_date: '2026-09-28',
        created_at: new Date().toISOString()
      },
      {
        id: 'sample-2',
        title: 'Thiết kế giao diện 3D Spaced Repetition Flashcard',
        description: 'Tối ưu hiệu ứng lật thẻ 3D rotateY với CSS hardware acceleration và 4 mức đánh giá SM-2.',
        status: 'InProgress',
        priority: 'High',
        due_date: '2026-09-29',
        created_at: new Date().toISOString()
      },
      {
        id: 'sample-3',
        title: 'Tích hợp AI Flashcard Generator & Analytics',
        description: 'Cho phép người dùng tạo nhanh bộ thẻ từ ghi chú và theo dõi tỷ lệ nhớ bài Ebbinghaus.',
        status: 'Todo',
        priority: 'Medium',
        due_date: '2026-09-30',
        created_at: new Date().toISOString()
      }
    ];
  }

  render() {
    // Clear all columns
    Object.values(this.columns).forEach(col => {
      if (col) col.innerHTML = '';
    });

    // Filter tasks
    const filteredTasks = this.tasks.filter(t => {
      const matchesSearch = !this.filterText ||
        (t.title && t.title.toLowerCase().includes(this.filterText)) ||
        (t.description && t.description.toLowerCase().includes(this.filterText));

      const matchesPriority = this.filterPriority === 'all' ||
        (t.priority && t.priority.toLowerCase() === this.filterPriority.toLowerCase());

      return matchesSearch && matchesPriority;
    });

    const statusCounts = { Todo: 0, InProgress: 0, Completed: 0 };

    filteredTasks.forEach(task => {
      const normStatus = this.normalizeStatus(task.status);
      statusCounts[normStatus] = (statusCounts[normStatus] || 0) + 1;

      const card = this.createCardElement(task);
      const targetCol = this.columns[normStatus] || this.columns.Todo;
      if (targetCol) {
        targetCol.appendChild(card);
      }
    });

    // Update Counter Badges
    Object.keys(this.counters).forEach(key => {
      if (this.counters[key]) {
        this.counters[key].textContent = statusCounts[key] || 0;
      }
    });

    // Render empty placeholders if column has 0 tasks
    Object.entries(this.columns).forEach(([key, col]) => {
      if (col && col.children.length === 0) {
        col.innerHTML = `
          <div class="empty-column-placeholder">
            Không có task nào trong cột này
          </div>
        `;
      }
    });
  }

  normalizeStatus(status) {
    if (!status) return 'Todo';
    const s = String(status).toLowerCase();
    if (s.includes('progress') || s === 'inprogress') return 'InProgress';
    if (s.includes('complete') || s === 'done') return 'Completed';
    return 'Todo';
  }

  createCardElement(task) {
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.draggable = true;
    card.dataset.id = task.id;

    const priority = task.priority || 'Medium';
    const priorityClass = `badge-${priority.toLowerCase()}`;
    const priorityIcon = priority.toLowerCase() === 'high' ? '🔥' : (priority.toLowerCase() === 'medium' ? '⚡' : '🍃');

    // Determine move buttons based on current status
    const normStatus = this.normalizeStatus(task.status);
    let moveButtonsHtml = '';
    if (normStatus === 'Todo') {
      moveButtonsHtml = `<button class="btn-move btn-move-right" title="Chuyển sang Đang làm (InProgress)">→</button>`;
    } else if (normStatus === 'InProgress') {
      moveButtonsHtml = `
        <button class="btn-move btn-move-left" title="Chuyển về Chưa làm (Todo)">←</button>
        <button class="btn-move btn-move-right" title="Chuyển sang Hoàn thành (Completed)">→</button>
      `;
    } else if (normStatus === 'Completed') {
      moveButtonsHtml = `<button class="btn-move btn-move-left" title="Chuyển lại Đang làm (InProgress)">←</button>`;
    }

    const dueDateHtml = task.due_date ? `
      <span class="card-date" title="Hạn hoàn thành">
        📅 ${escapeHtml(task.due_date)}
      </span>
    ` : '<span></span>';

    card.innerHTML = `
      <div class="card-top-bar">
        <span class="badge ${priorityClass}">${priorityIcon} ${escapeHtml(priority)}</span>
        <div class="card-header-actions">
          <button class="btn-icon btn-card-edit" title="Sửa task">✏️</button>
          <button class="btn-icon btn-card-delete" title="Xóa task">🗑️</button>
        </div>
      </div>
      <h4 class="card-title">${escapeHtml(task.title)}</h4>
      ${task.description ? `<p class="card-desc">${escapeHtml(task.description)}</p>` : ''}
      <div class="card-footer">
        ${dueDateHtml}
        <div class="card-move-actions">
          ${moveButtonsHtml}
        </div>
      </div>
    `;

    // Bind Card-level Events
    this.bindCardEvents(card, task);

    return card;
  }

  bindCardEvents(card, task) {
    // HTML5 Drag Start
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', String(task.id));
      e.dataTransfer.effectAllowed = 'move';
      card.classList.add('is-dragging');
    });

    // Drag End
    card.addEventListener('dragend', () => {
      card.classList.remove('is-dragging');
    });

    // Edit Button
    const btnEdit = card.querySelector('.btn-card-edit');
    if (btnEdit) {
      btnEdit.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleEditTask(task.id);
      });
    }

    // Delete Button
    const btnDelete = card.querySelector('.btn-card-delete');
    if (btnDelete) {
      btnDelete.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleDeleteTask(task.id);
      });
    }

    // Move Left Button
    const btnMoveLeft = card.querySelector('.btn-move-left');
    if (btnMoveLeft) {
      btnMoveLeft.addEventListener('click', (e) => {
        e.stopPropagation();
        const norm = this.normalizeStatus(task.status);
        const targetStatus = norm === 'Completed' ? 'InProgress' : 'Todo';
        this.handleTaskMove(task.id, targetStatus);
      });
    }

    // Move Right Button
    const btnMoveRight = card.querySelector('.btn-move-right');
    if (btnMoveRight) {
      btnMoveRight.addEventListener('click', (e) => {
        e.stopPropagation();
        const norm = this.normalizeStatus(task.status);
        const targetStatus = norm === 'Todo' ? 'InProgress' : 'Completed';
        this.handleTaskMove(task.id, targetStatus);
      });
    }
  }

  async handleTaskMove(taskId, newStatus) {
    const task = this.tasks.find(t => String(t.id) === String(taskId));
    if (!task) return;

    const previousStatus = task.status;
    if (this.normalizeStatus(previousStatus) === this.normalizeStatus(newStatus)) {
      return;
    }

    // Optimistic UI Update
    task.status = newStatus;
    this.render();

    // Persist to Backend if not a mock sample
    if (String(taskId).startsWith('sample-')) {
      showToast(`Đã chuyển task sang "${newStatus}" (chế độ demo)`, 'success');
      return;
    }

    try {
      await api.patch(`/api/Tasks/${taskId}/status`, { status: newStatus });
      showToast(`Cập nhật trạng thái sang "${newStatus}" thành công`, 'success');
    } catch (err) {
      // Rollback on failure
      task.status = previousStatus;
      this.render();
      showToast('Lỗi cập nhật trạng thái: ' + err.message, 'error');
    }
  }

  async handleDeleteTask(taskId) {
    if (!confirm('Bạn có chắc chắn muốn xóa task này không?')) return;

    const taskIndex = this.tasks.findIndex(t => String(t.id) === String(taskId));
    if (taskIndex === -1) return;

    const removedTask = this.tasks[taskIndex];

    // Optimistic remove
    this.tasks.splice(taskIndex, 1);
    this.render();

    if (String(taskId).startsWith('sample-')) {
      showToast('Đã xóa task (demo)', 'info');
      return;
    }

    try {
      await api.delete(`/api/Tasks/${taskId}`);
      showToast('Đã xóa task thành công', 'success');
    } catch (err) {
      // Rollback
      this.tasks.splice(taskIndex, 0, removedTask);
      this.render();
      showToast('Lỗi khi xóa task: ' + err.message, 'error');
    }
  }

  openTaskModal(defaultStatus = 'Todo', task = null) {
    if (!this.taskModal) return;

    const form = document.getElementById('task-form');
    if (form) form.reset();

    const titleInput = document.getElementById('task-title');
    const descInput = document.getElementById('task-desc');
    const prioritySelect = document.getElementById('task-priority');
    const statusSelect = document.getElementById('task-status');
    const dueDateInput = document.getElementById('task-due-date');
    const modalTitle = document.getElementById('task-modal-title');
    const submitBtn = document.getElementById('task-modal-submit');

    this.currentEditingTaskId = task ? String(task.id) : null;

    if (task) {
      if (modalTitle) modalTitle.textContent = '✏️ Chỉnh Sửa Công Việc';
      if (submitBtn) submitBtn.textContent = 'Cập nhật công việc';
      if (titleInput) titleInput.value = task.title || '';
      if (descInput) descInput.value = task.description || '';
      if (prioritySelect) prioritySelect.value = task.priority || 'Medium';
      if (statusSelect) statusSelect.value = this.normalizeStatus(task.status);
      if (dueDateInput) dueDateInput.value = task.due_date || '';
    } else {
      if (modalTitle) modalTitle.textContent = '+ Tạo Công Việc Mới (Task)';
      if (submitBtn) submitBtn.textContent = 'Lưu công việc';
      if (statusSelect) statusSelect.value = defaultStatus;
    }

    this.taskModal.classList.add('active');

    if (titleInput) {
      setTimeout(() => titleInput.focus(), 100);
    }
  }

  closeTaskModal() {
    if (!this.taskModal) return;
    this.currentEditingTaskId = null;
    const form = document.getElementById('task-form');
    if (form) form.reset();
    const modalTitle = document.getElementById('task-modal-title');
    const submitBtn = document.getElementById('task-modal-submit');
    if (modalTitle) modalTitle.textContent = '+ Tạo Công Việc Mới (Task)';
    if (submitBtn) submitBtn.textContent = 'Lưu công việc';
    this.taskModal.classList.remove('active');
  }

  async handleCreateTask() {
    const titleInput = document.getElementById('task-title');
    const descInput = document.getElementById('task-desc');
    const prioritySelect = document.getElementById('task-priority');
    const statusSelect = document.getElementById('task-status');
    const dueDateInput = document.getElementById('task-due-date');

    const title = titleInput?.value.trim() || '';
    const description = descInput?.value.trim() || '';
    const priority = prioritySelect?.value || 'Medium';
    const status = statusSelect?.value || 'Todo';
    const due_date = dueDateInput?.value || null;

    if (!title) {
      showToast('Vui lòng nhập tiêu đề task', 'warning');
      return;
    }

    const payload = {
      title,
      description,
      priority,
      status,
      due_date
    };

    if (this.currentEditingTaskId) {
      const taskIndex = this.tasks.findIndex(t => String(t.id) === String(this.currentEditingTaskId));
      if (taskIndex >= 0) {
        const previousTask = this.tasks[taskIndex];
        const updatedTask = { ...previousTask, ...payload };
        this.tasks[taskIndex] = updatedTask;
        this.render();
        this.closeTaskModal();
        showToast('Cập nhật task thành công!', 'success');
        return;
      }
    }

    try {
      const newTask = await api.post('/api/Tasks', payload);
      this.tasks.unshift(newTask);
      this.render();
      this.closeTaskModal();
      showToast('Thêm task mới thành công!', 'success');
    } catch (err) {
      // If unauthenticated or backend offline, append locally
      const mockId = 'local-' + Date.now();
      const localTask = { id: mockId, ...payload, created_at: new Date().toISOString() };
      this.tasks.unshift(localTask);
      this.render();
      this.closeTaskModal();
      showToast('Đã thêm task (chế độ offline/demo)', 'info');
    }
  }

  handleEditTask(taskId) {
    const task = this.tasks.find(t => String(t.id) === String(taskId));
    if (!task) return;
    this.openTaskModal(task.status, task);
  }
}
