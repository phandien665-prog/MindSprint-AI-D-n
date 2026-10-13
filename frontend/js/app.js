/**
 * MindSprint AI — Application Bootstrapper & Main Coordinator
 * Manages Tab Switching, Theme Management, Global Modals, and Lifecycle Events
 */

import { AuthManager } from './auth.js';
import { KanbanBoard } from './kanban.js';
import { FlashcardsApp } from './flashcards.js';

class MindSprintApp {
  constructor() {
    this.auth = new AuthManager();
    this.kanban = new KanbanBoard();
    this.flashcards = new FlashcardsApp();
    this.currentTheme = localStorage.getItem('mindsprint_theme') || 'dark';
    this.activeTab = 'kanban'; // 'kanban' | 'flashcards' | 'stats'
  }

  init() {
    this.initTheme();
    this.initTabs();
    this.bindGlobalShortcuts();
    this.bindHeaderActions();

    // Initialize Submodules
    this.auth.init();
    this.kanban.init();
    this.flashcards.init();

    // Auto load stats when switching to stats tab
    window.addEventListener('tab:changed', (e) => {
      if (e.detail === 'stats') {
        this.flashcards.loadStatistics();
      }
    });

    console.log('🚀 MindSprint AI frontend initialized successfully.');
  }

  initTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    this.updateThemeButtonIcon();

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('mindsprint_theme', this.currentTheme);
    this.updateThemeButtonIcon();
  }

  updateThemeButtonIcon() {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    if (this.currentTheme === 'dark') {
      btn.innerHTML = '🌙';
      btn.title = 'Chuyển sang giao diện Sáng';
    } else {
      btn.innerHTML = '☀️';
      btn.title = 'Chuyển sang giao diện Tối';
    }
  }

  initTabs() {
    const tabButtons = {
      kanban: document.getElementById('nav-tab-kanban'),
      flashcards: document.getElementById('nav-tab-flashcards'),
      stats: document.getElementById('nav-tab-stats')
    };

    const viewContainers = {
      kanban: document.getElementById('kanban-view'),
      flashcards: document.getElementById('flashcards-view'),
      stats: document.getElementById('stats-view')
    };

    const switchView = (tabKey) => {
      this.activeTab = tabKey;

      // Update Nav Button Active Classes
      Object.entries(tabButtons).forEach(([key, btn]) => {
        if (!btn) return;
        if (key === tabKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update View Containers Visibility
      Object.entries(viewContainers).forEach(([key, view]) => {
        if (!view) return;
        if (key === tabKey) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });

      window.dispatchEvent(new CustomEvent('tab:changed', { detail: tabKey }));
    };

    // Attach Click Events to Tab Buttons
    if (tabButtons.kanban) {
      tabButtons.kanban.addEventListener('click', () => switchView('kanban'));
    }
    if (tabButtons.flashcards) {
      tabButtons.flashcards.addEventListener('click', () => switchView('flashcards'));
    }
    if (tabButtons.stats) {
      tabButtons.stats.addEventListener('click', () => switchView('stats'));
    }

    // Default to Kanban view
    switchView('kanban');
  }

  bindHeaderActions() {
    // Top Header Quick Action: "+ Task"
    const headerBtnAddTask = document.getElementById('header-btn-add-task');
    if (headerBtnAddTask) {
      headerBtnAddTask.addEventListener('click', () => {
        const tabKanban = document.getElementById('nav-tab-kanban');
        if (tabKanban && !tabKanban.classList.contains('active')) {
          tabKanban.click();
        }
        this.kanban.openTaskModal('Todo');
      });
    }

    // Top Header Quick Action: "✨ AI Flashcard"
    const headerBtnAi = document.getElementById('header-btn-ai');
    if (headerBtnAi) {
      headerBtnAi.addEventListener('click', () => {
        const tabFlashcards = document.getElementById('nav-tab-flashcards');
        if (tabFlashcards && !tabFlashcards.classList.contains('active')) {
          tabFlashcards.click();
        }
        this.flashcards.openAiModal();
      });
    }

    // Top Header Quick Action: "📥 Nhập Bulk"
    const headerBtnBulk = document.getElementById('header-btn-bulk');
    if (headerBtnBulk) {
      headerBtnBulk.addEventListener('click', () => {
        const tabFlashcards = document.getElementById('nav-tab-flashcards');
        if (tabFlashcards && !tabFlashcards.classList.contains('active')) {
          tabFlashcards.click();
        }
        this.flashcards.openBulkModal();
      });
    }

    // Brand Logo Click: return to Kanban view
    const brandLogo = document.getElementById('brand-logo');
    if (brandLogo) {
      brandLogo.addEventListener('click', () => {
        const tabKanban = document.getElementById('nav-tab-kanban');
        tabKanban?.click();
      });
    }
  }

  bindGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Escape key closes any active modal
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
          modal.classList.remove('active');
        });
      }
    });
  }
}

// Global bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new MindSprintApp();
  app.init();
  window.__mindsprint__ = app;
});
