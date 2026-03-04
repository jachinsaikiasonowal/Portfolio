/* ═══════════════════════════════════════════════════════════════
   script.js — Jachin Saikia Sonowal Portfolio (Enhanced)
   ───────────────────────────────────────────────────────────────
   SECTIONS:
   1.  JS READY CLASS
   2.  REVEAL ANIMATIONS
   3.  LOADER
   4.  CUSTOM CURSOR — fixed for nav and all interactive elements
   5.  NAV SCROLL STATE
   6.  TEXT SCRAMBLE
   7.  COUNTER ANIMATION
   8.  EXPERIENCE ACCORDION
   9.  CASE STUDY ACCORDION
   10. PARALLAX ORBS
   11. PORTFOLIO CARD TILT
   12. ACTIVE NAV HIGHLIGHT
═══════════════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────────────────────
   1. JS READY CLASS
───────────────────────────────────────────────────────────────*/
document.documentElement.classList.add('js-ready');


/* ─────────────────────────────────────────────────────────────
   2. REVEAL ANIMATIONS
───────────────────────────────────────────────────────────────*/
var revealObserver = null;

function revealEl(el) {
  el.classList.add('in');
}

function initReveal() {
  var els = document.querySelectorAll('.reveal, .reveal-side');

  revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        revealEl(entry.target);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px 60px 0px' });

  els.forEach(function(el) {
    var rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 60) {
      setTimeout(function() { revealEl(el); }, 80);
    } else {
      revealObserver.observe(el);
    }
  });

  // Nuclear fallback — reveal everything after 4s
  setTimeout(function() {
    document.querySelectorAll('.reveal, .reveal-side').forEach(function(el) {
      revealEl(el);
    });
  }, 4000);
}


/* ─────────────────────────────────────────────────────────────
   3. LOADER
───────────────────────────────────────────────────────────────*/
var loaderFired = false;

function doLoader() {
  if (loaderFired) return;
  loaderFired = true;
  var loader = document.getElementById('loader');
  if (loader) loader.classList.add('done');
  initReveal();
  startScramble();
  initCounters();
  initTilt();
  initActiveNav();
}

window.addEventListener('load', function() { setTimeout(doLoader, 900); });
document.addEventListener('DOMContentLoaded', function() { setTimeout(doLoader, 500); });
setTimeout(doLoader, 1800); // Hard fallback


/* ─────────────────────────────────────────────────────────────
   4. CUSTOM CURSOR — properly tracks all elements including nav
───────────────────────────────────────────────────────────────*/
var cur  = document.getElementById('cursor');
var ring = document.getElementById('cursor-ring');
var mx = window.innerWidth / 2;
var my = window.innerHeight / 2;
var rx = mx, ry = my;
var cursorVisible = false;

// Track mouse globally — no element interferes
document.addEventListener('mousemove', function(e) {
  mx = e.clientX;
  my = e.clientY;
  if (!cursorVisible) {
    cursorVisible = true;
    if (cur)  { cur.style.opacity  = '1'; }
    if (ring) { ring.style.opacity = '1'; }
  }
});

// Hide when leaving window
document.addEventListener('mouseleave', function() {
  if (cur)  cur.style.opacity  = '0';
  if (ring) ring.style.opacity = '0';
  cursorVisible = false;
});

// Smooth cursor animation loop
function animateCursor() {
  if (cur) {
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  }
  if (ring) {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover state — applied to body class for CSS efficiency
var hoverTargets = 'a, button, .exp-item, .pcard, .svc, .vcard, .cs-card, .hchip, .achip, .ccard, .ecard, .tcard, .stag, .m-item';

document.addEventListener('mouseover', function(e) {
  if (e.target.closest(hoverTargets)) {
    document.body.classList.add('cursor-hover');
  }
});

document.addEventListener('mouseout', function(e) {
  if (e.target.closest(hoverTargets)) {
    document.body.classList.remove('cursor-hover');
  }
});

// Click pulse
document.addEventListener('mousedown', function() {
  document.body.classList.add('cursor-click');
});
document.addEventListener('mouseup', function() {
  document.body.classList.remove('cursor-click');
});


/* ─────────────────────────────────────────────────────────────
   5. NAV SCROLL STATE
───────────────────────────────────────────────────────────────*/
window.addEventListener('scroll', function() {
  var nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ─────────────────────────────────────────────────────────────
   6. TEXT SCRAMBLE — hero name
───────────────────────────────────────────────────────────────*/
var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function scramble(el, target, duration) {
  var start = null;
  var len = target.length;
  function step(ts) {
    if (!start) start = ts;
    var progress = Math.min((ts - start) / duration, 1);
    var revealed = Math.floor(progress * len);
    var result = '';
    for (var i = 0; i < len; i++) {
      if (i < revealed) result += target[i];
      else result += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    el.textContent = result;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

function startScramble() {
  var nameEl = document.getElementById('scramble-name');
  if (nameEl) setTimeout(function() { scramble(nameEl, 'JACHIN', 1200); }, 200);
}


/* ─────────────────────────────────────────────────────────────
   7. COUNTER ROLL ANIMATION
───────────────────────────────────────────────────────────────*/
function animateCounter(el) {
  var target   = parseInt(el.dataset.target);
  var prefix   = el.dataset.prefix  || '';
  var suffix   = el.dataset.suffix  || '';
  var duration = 1600;
  var start    = null;

  function step(ts) {
    if (!start) start = ts;
    var progress = Math.min((ts - start) / duration, 1);
    var eased    = 1 - Math.pow(1 - progress, 3);
    var val      = Math.floor(eased * target);

    // Handle suffix formatting
    var hasDollar = prefix === '$';
    var hasK      = suffix.indexOf('K') !== -1;
    var hasPlus   = suffix.indexOf('+') !== -1;

    if (hasK) {
      el.innerHTML = prefix + val + '<em>K+</em>';
    } else if (hasPlus) {
      el.innerHTML = prefix + val + '<em>+</em>';
    } else {
      el.innerHTML = prefix + val + '<em>' + suffix + '</em>';
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      if (hasK) el.innerHTML = prefix + target + '<em>K+</em>';
      else if (hasPlus) el.innerHTML = prefix + target + '<em>+</em>';
      else el.innerHTML = prefix + target + '<em>' + suffix + '</em>';
    }
  }
  requestAnimationFrame(step);
}

function initCounters() {
  var cIO = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && e.target.dataset.target) {
        animateCounter(e.target);
        cIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-target]').forEach(function(el) { cIO.observe(el); });
}


/* ─────────────────────────────────────────────────────────────
   8. EXPERIENCE ACCORDION
───────────────────────────────────────────────────────────────*/
function toggleExp(el) {
  var isOpen = el.classList.contains('open');
  // Close all
  document.querySelectorAll('.exp-item.open').forEach(function(i) {
    i.classList.remove('open');
  });
  // Open clicked if it was closed
  if (!isOpen) el.classList.add('open');
}


/* ─────────────────────────────────────────────────────────────
   9. CASE STUDY ACCORDION
───────────────────────────────────────────────────────────────*/
function toggleCS(el) {
  var isOpen = el.classList.contains('open');
  // Close all
  document.querySelectorAll('.cs-card.open').forEach(function(i) {
    i.classList.remove('open');
  });
  // Open clicked if it was closed
  if (!isOpen) {
    el.classList.add('open');
    // Smooth scroll so header stays visible
    setTimeout(function() {
      var rect = el.getBoundingClientRect();
      if (rect.top < 80) {
        window.scrollBy({ top: rect.top - 100, behavior: 'smooth' });
      }
    }, 100);
  }
}


/* ─────────────────────────────────────────────────────────────
   10. PARALLAX ORBS
───────────────────────────────────────────────────────────────*/
window.addEventListener('scroll', function() {
  var y = window.scrollY;
  document.querySelectorAll('.orb').forEach(function(orb, i) {
    orb.style.transform = 'translateY(' + (y * (i === 0 ? -0.08 : 0.06)) + 'px) scale(1)';
  });
}, { passive: true });


/* ─────────────────────────────────────────────────────────────
   11. PORTFOLIO CARD TILT — 3D mouse-follow
───────────────────────────────────────────────────────────────*/
function initTilt() {
  document.querySelectorAll('.pcard').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var r = card.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
      var y = ((e.clientY - r.top)  / r.height - 0.5) * -10;
      card.style.transform = 'perspective(600px) rotateY(' + x + 'deg) rotateX(' + y + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   12. ACTIVE NAV LINK HIGHLIGHT on scroll
───────────────────────────────────────────────────────────────*/
function initActiveNav() {
  var sections = document.querySelectorAll('section[id], div[id="metrics"], div[id="strip"]');
  var navLinks = document.querySelectorAll('.nav-links a');

  var sIO = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navLinks.forEach(function(link) {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = 'var(--white)';
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(function(s) { sIO.observe(s); });
}
