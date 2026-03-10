/* ============================================================
   Omkar Khandalkar Portfolio — script.js
   ============================================================ */

'use strict';

/* ── Nav: Scroll shadow + mobile toggle ──────────────────── */
const navWrapper = document.querySelector('.nav-wrapper');
const navToggle  = document.querySelector('.nav-toggle');
const navLinks   = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navWrapper.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

// Close mobile nav on link click
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navWrapper.contains(e.target)) {
    navLinks?.classList.remove('open');
    navToggle?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});

/* ── Scroll-to-top FAB ──────────────────────────────────── */
const scrollToTopBtn = document.querySelector('.scroll-to-top');

window.addEventListener('scroll', () => {
  scrollToTopBtn?.classList.toggle('visible', window.scrollY > 300);
}, { passive: true });

scrollToTopBtn?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

/* ── Active nav link on scroll ───────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.classList.toggle('active-nav', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ── Scroll-reveal ───────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger children
      const delay = entry.target.dataset.delay || 0;
      entry.target.style.transitionDelay = `${delay}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Batch-add reveal classes with stagger to child elements
function initReveal() {
  const targets = document.querySelectorAll([
    '.hero-badge', '.hero-name', '.hero-title-row',
    '.hero-slogan', '.hero-philosophy', '.hero-ctas', '.hero-stats',
    '.about-left', '.about-right',
    '.timeline-item',
    '.cs-card',
    '.content-block',
    '.gallery-item',
    '.contact-headline', '.contact-sub', '.contact-links',
  ].join(', '));

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    // stagger siblings
    const siblings = el.parentElement?.querySelectorAll(':scope > .reveal');
    if (siblings) {
      let idx = Array.from(siblings).indexOf(el);
      el.dataset.delay = idx * 80;
    }
    revealObserver.observe(el);
  });
}

/* ── Case Study Expand/Collapse ──────────────────────────── */
function initCaseStudies() {
  const expandBtns = document.querySelectorAll('.cs-expand-btn');

  expandBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const detailId = btn.getAttribute('aria-controls');
      const detail   = document.getElementById(detailId);
      if (!detail) return;

      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others first
      expandBtns.forEach(otherBtn => {
        if (otherBtn !== btn) {
          const otherId   = otherBtn.getAttribute('aria-controls');
          const otherDet  = document.getElementById(otherId);
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherDet) {
            otherDet.classList.remove('open');
            otherDet.hidden = true;
          }
        }
      });

      // Toggle current
      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        detail.classList.remove('open');
        detail.hidden = true;
      } else {
        btn.setAttribute('aria-expanded', 'true');
        detail.hidden = false;
        // Trigger reflow so CSS transitions work
        detail.offsetHeight; // eslint-disable-line
        detail.classList.add('open');

        // Scroll into view smoothly
        setTimeout(() => {
          detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });
  });
}

/* ── Playground Tabs ─────────────────────────────────────── */
function initTabs() {
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('aria-controls');

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => {
        p.classList.remove('active');
        p.hidden = true;
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(targetId);
      if (panel) {
        panel.hidden = false;
        panel.classList.add('active');
      }
    });

    // Keyboard navigation
    btn.addEventListener('keydown', (e) => {
      const btns = Array.from(tabBtns);
      const idx  = btns.indexOf(btn);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        btns[(idx + 1) % btns.length].focus();
        btns[(idx + 1) % btns.length].click();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        btns[(idx - 1 + btns.length) % btns.length].focus();
        btns[(idx - 1 + btns.length) % btns.length].click();
      }
    });
  });
}

/* ── Hero name hover effect ──────────────────────────────── */
function initHeroEffect() {
  const last = document.querySelector('.hero-name-last');
  if (!last) return;

  last.addEventListener('mouseenter', () => {
    last.style.color = 'var(--accent)';
    last.style.webkitTextStroke = '0px';
  });
  last.addEventListener('mouseleave', () => {
    last.style.color = '';
    last.style.webkitTextStroke = '';
  });
}

/* ── Smooth anchor scroll offset ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCaseStudies();
  initTabs();
  initHeroEffect();

  // Set first tab panel visible
  const firstPanel = document.querySelector('.tab-panel');
  if (firstPanel) firstPanel.hidden = false;
});
