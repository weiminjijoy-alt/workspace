/* ═══════════════════════════════════════════════
   Whale · Personal Workspace · Core JS
   Password gate + Bilingual toggle + Navigation
   ═══════════════════════════════════════════════ */

(function() {
  'use strict';

  // ── Password Gate ──
  const PASS_HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'; // SHA-256 of 'password' — change later
  const STORAGE_KEY = 'whale_workspace_auth';
  const SIMPLE_PASS = 'joyji'; // Simple password — easy to share

  window.WhaleAuth = {
    check: function() {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    },
    login: function(input) {
      if (input === SIMPLE_PASS) {
        sessionStorage.setItem(STORAGE_KEY, 'true');
        return true;
      }
      return false;
    },
    initGate: function() {
      const form = document.getElementById('gate-form');
      const input = document.getElementById('gate-input');
      const error = document.getElementById('gate-error');
      if (!form) return;

      // If already authenticated, redirect to dashboard
      if (this.check()) {
        window.location.href = 'dashboard.html';
        return;
      }

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (WhaleAuth.login(input.value.trim())) {
          window.location.href = 'dashboard.html';
        } else {
          error.style.display = 'block';
          input.value = '';
          input.focus();
        }
      });
    },
    guard: function() {
      // Call this on every protected page
      if (!this.check()) {
        window.location.href = 'index.html';
      }
    }
  };

  // ── Bilingual Toggle ──
  const LANG_KEY = 'whale_workspace_lang';

  window.WhaleLang = {
    current: function() {
      return localStorage.getItem(LANG_KEY) || 'en';
    },
    set: function(lang) {
      localStorage.setItem(LANG_KEY, lang);
      document.documentElement.lang = lang;
      this.updateButtons();
      this.updateContent();
    },
    toggle: function() {
      this.set(this.current() === 'en' ? 'zh' : 'en');
    },
    init: function() {
      const lang = this.current();
      document.documentElement.lang = lang;
      this.updateButtons();
      this.updateContent();

      // Bind toggle buttons
      document.querySelectorAll('.lang-toggle').forEach(function(btn) {
        btn.addEventListener('click', function() {
          WhaleLang.toggle();
        });
      });

      document.querySelectorAll('[data-lang]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          WhaleLang.set(this.getAttribute('data-lang'));
        });
      });
    },
    updateButtons: function() {
      var lang = this.current();
      document.querySelectorAll('[data-lang]').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });
    },
    updateContent: function() {
      var lang = this.current();
      document.querySelectorAll('[data-en]').forEach(function(el) {
        el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-zh');
      });
    }
  };

  // ── Navigation ──
  window.WhaleNav = {
    init: function() {
      var path = window.location.pathname.split('/').pop() || 'dashboard.html';
      document.querySelectorAll('.nav-link').forEach(function(link) {
        var href = link.getAttribute('href');
        link.classList.toggle('active', href === path);
      });
    }
  };

  // ── Auto-init ──
  document.addEventListener('DOMContentLoaded', function() {
    // Init gate if on gate page
    if (document.getElementById('gate-form')) {
      WhaleAuth.initGate();
    }
    // Init nav & lang on all other pages
    if (document.querySelector('.topnav')) {
      WhaleNav.init();
      WhaleLang.init();
    }
  });

})();
