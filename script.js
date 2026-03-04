/* ═══════════════════════════════════════════════════════════
   JACHIN SONOWAL — Portfolio Script
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════
     CUSTOM CURSOR
  ══════════════════════════════════════════════ */
  const curDot  = document.getElementById('cur-dot');
  const curRing = document.getElementById('cur-ring');

  if (curDot && curRing) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    // Track mouse position
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      // Dot snaps immediately
      curDot.style.left = mx + 'px';
      curDot.style.top  = my + 'px';
    });

    // Ring follows with smooth lag
    (function animRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      curRing.style.left = rx + 'px';
      curRing.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();

    // Hover states: use body class for CSS-driven transitions
    // Interactive elements
    const interactiveSelectors = 'a, button, .btn, .contact-link, .nav-cta, label, input, textarea, select, [role="button"]';
    document.addEventListener('mouseover', e => {
      const target = e.target.closest(interactiveSelectors);
      const card   = e.target.closest('.promptops-card');
      const caseCard = e.target.closest('.case-card:not(.promptops-card)');

      document.body.classList.remove('cursor-hover', 'cursor-card', 'cursor-purple');

      if (card) {
        document.body.classList.add('cursor-purple');
      } else if (caseCard) {
        document.body.classList.add('cursor-card');
      } else if (target) {
        document.body.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover', 'cursor-card', 'cursor-purple');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      curDot.style.opacity  = '0';
      curRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      curDot.style.opacity  = '1';
      curRing.style.opacity = '1';
    });
  }

  /* ══════════════════════════════════════════════
     CURSOR TRAIL
  ══════════════════════════════════════════════ */
  const TRAIL_COUNT = 5;
  const trailEls = [];
  const trailPos = Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 }));
  let trailMx = 0, trailMy = 0;

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const d = document.createElement('div');
    const size = 3.5 - i * 0.45;
    d.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'border-radius:50%',
      'z-index:99990',
      `width:${size}px`,
      `height:${size}px`,
      `background:rgba(59,130,246,${(0.18 - i * 0.03).toFixed(2)})`,
      'transform:translate(-50%,-50%)',
      'top:0', 'left:0',
    ].join(';');
    document.body.appendChild(d);
    trailEls.push(d);
  }

  document.addEventListener('mousemove', e => { trailMx = e.clientX; trailMy = e.clientY; });

  (function animTrail() {
    trailPos[0].x += (trailMx - trailPos[0].x) * 0.4;
    trailPos[0].y += (trailMy - trailPos[0].y) * 0.4;
    for (let i = 1; i < TRAIL_COUNT; i++) {
      trailPos[i].x += (trailPos[i - 1].x - trailPos[i].x) * 0.5;
      trailPos[i].y += (trailPos[i - 1].y - trailPos[i].y) * 0.5;
    }
    trailEls.forEach((el, i) => {
      el.style.left = trailPos[i].x + 'px';
      el.style.top  = trailPos[i].y + 'px';
    });
    requestAnimationFrame(animTrail);
  })();

  /* ══════════════════════════════════════════════
     SCROLL PROGRESS
  ══════════════════════════════════════════════ */
  const scrollBar = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    if (!scrollBar) return;
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  /* ══════════════════════════════════════════════
     NAV: SCROLL STATE + ACTIVE LINKS
  ══════════════════════════════════════════════ */
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id], div[id]');

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active link based on section in view
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 140) currentId = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('nav-active', a.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ══════════════════════════════════════════════
     MOBILE NAV
  ══════════════════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('open');
    document.body.style.overflow = mobileNav?.classList.contains('open') ? 'hidden' : '';
  });

  function closeMobileNav() {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.closeMobileNav = closeMobileNav;

  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

  /* ══════════════════════════════════════════════
     COUNTER ANIMATION
  ══════════════════════════════════════════════ */
  function animateCount(el) {
    const raw    = el.dataset.raw || el.textContent.trim();
    el.dataset.raw = raw; // Cache original

    const match = raw.match(/^([₹$]?)(\d[\d,.]*)(\D*)$/);
    if (!match) return;

    const prefix = match[1];
    const numStr = match[2].replace(/,/g, '');
    const suffix = match[3];
    const target = parseFloat(numStr);
    if (isNaN(target) || target === 0) return;

    const duration  = 1700;
    const startTime = performance.now();

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);
      const formatted = raw.includes(',') ? current.toLocaleString() : current;
      el.textContent = prefix + formatted + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = raw; // Restore exact original
      }
    }
    requestAnimationFrame(step);
  }

  /* ══════════════════════════════════════════════
     INTERSECTION OBSERVER — FADE IN
  ══════════════════════════════════════════════ */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px 50px 0px' });

  document.querySelectorAll('.fade-in').forEach((el, i) => {
    el.dataset.delay = (i % 6) * 65;
    fadeObserver.observe(el);
  });

  document.querySelectorAll('.slide-in').forEach(el => fadeObserver.observe(el));

  /* ── IMPACT STRIP COUNTER ── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-counter]').forEach(el => animateCount(el));
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const impactStrip = document.getElementById('impact-strip');
  if (impactStrip) counterObserver.observe(impactStrip);

  /* ── RESULT METRIC COUNTERS ── */
  const resultObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.result-metric').forEach(el => {
          setTimeout(() => animateCount(el), 180);
        });
        resultObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.results-grid').forEach(el => resultObserver.observe(el));

  /* ══════════════════════════════════════════════
     TAB SWITCHING
  ══════════════════════════════════════════════ */
  function switchTab(btn, panelId) {
    const card = btn.closest('.case-card');
    if (!card) return;

    card.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    card.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');

    const panel = document.getElementById(panelId);
    if (panel) {
      panel.classList.add('active');
      // Re-animate metrics if they haven't been animated
      panel.querySelectorAll('.result-metric').forEach(el => {
        setTimeout(() => animateCount(el), 130);
      });
    }
  }
  window.switchTab = switchTab; // Expose for inline onclick handlers

  /* ══════════════════════════════════════════════
     MAGNETIC BUTTONS
  ══════════════════════════════════════════════ */
  function initMagneticBtns() {
    document.querySelectorAll('.btn, .contact-link, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r  = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) * 0.12;
        const dy = (e.clientY - (r.top  + r.height / 2)) * 0.12;
        btn.style.setProperty('--mx', dx + 'px');
        btn.style.setProperty('--my', dy + 'px');
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }
  initMagneticBtns();

  /* ══════════════════════════════════════════════
     PARALLAX — HERO GLOW ON MOUSEMOVE
  ══════════════════════════════════════════════ */
  const hero = document.getElementById('hero');
  hero?.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const cx   = (e.clientX - rect.left) / rect.width  - 0.5;
    const cy   = (e.clientY - rect.top)  / rect.height - 0.5;
    hero.style.setProperty('--gx', cx * 40 + 'px');
    hero.style.setProperty('--gy', cy * 40 + 'px');
  });

  /* ══════════════════════════════════════════════
     KEYBOARD ACCESSIBILITY
  ══════════════════════════════════════════════ */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileNav();
  });

})();
