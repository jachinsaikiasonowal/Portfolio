/* ═══════════════════════════════════════════════════════════════
   script.js — Jachin Saikia Sonowal Portfolio
   ───────────────────────────────────────────────────────────────
   SECTIONS:
   1.  JS-READY CLASS
   2.  REVEAL ANIMATIONS (IntersectionObserver)
   3.  LOADER
   4.  CUSTOM CURSOR
   5.  CURSOR TRAIL
   6.  NAV SCROLL STATE
   7.  MOBILE NAV
   8.  ACTIVE NAV HIGHLIGHT
   9.  TEXT SCRAMBLE (hero name)
   10. COUNTER ROLL ANIMATION
   11. EXPERIENCE ACCORDION
   12. PARALLAX ORBS
   13. PORTFOLIO CARD TILT (3D)
   14. MAGNETIC BUTTONS
   15. STAGGER REVEAL (grid children)
   16. SCROLL PROGRESS BAR
═══════════════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────────────────────
   1. JS-READY CLASS
   Add immediately so CSS reveal transitions activate
───────────────────────────────────────────────────────────────*/
document.documentElement.classList.add('js-ready');


/* ─────────────────────────────────────────────────────────────
   2. REVEAL ANIMATIONS
   - Uses opacity + translateY only (bulletproof, no clip-path)
   - Fires the instant 1% of element enters viewport
   - Nuclear fallback: reveals everything after 4s
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
  }, { threshold: 0.01, rootMargin: '0px 0px 80px 0px' });

  els.forEach(function(el) {
    var rect = el.getBoundingClientRect();
    // Already visible in viewport? reveal right away
    if (rect.top < window.innerHeight + 80) {
      setTimeout(function() { revealEl(el); }, 80);
    } else {
      revealObserver.observe(el);
    }
  });

  // Nuclear fallback: reveal everything after 4s regardless
  setTimeout(function() {
    document.querySelectorAll('.reveal, .reveal-side').forEach(function(el) {
      revealEl(el);
    });
  }, 4000);
}


/* ─────────────────────────────────────────────────────────────
   3. LOADER
   Multiple fallbacks to guarantee it always fires
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
}

// Primary: window load
window.addEventListener('load', function() { setTimeout(doLoader, 900); });
// Fallback 1: DOMContentLoaded + 600ms
document.addEventListener('DOMContentLoaded', function() { setTimeout(doLoader, 600); });
// Fallback 2: Hard timeout at 2s
setTimeout(doLoader, 2000);


/* ─────────────────────────────────────────────────────────────
   4. CUSTOM CURSOR
   Dot follows mouse exactly. Ring follows with easing.
───────────────────────────────────────────────────────────────*/
var cur  = document.getElementById('cursor');
var ring = document.getElementById('cursor-ring');
var mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', function(e) {
  mx = e.clientX;
  my = e.clientY;
});

function animateCursor() {
  if (cur) {
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  }
  if (ring) {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hide cursor when it leaves the window
document.addEventListener('mouseleave', function() {
  if (cur)  cur.style.opacity = '0';
  if (ring) ring.style.opacity = '0';
});
document.addEventListener('mouseenter', function() {
  if (cur)  cur.style.opacity = '1';
  if (ring) ring.style.opacity = '1';
});


/* ─────────────────────────────────────────────────────────────
   5. CURSOR TRAIL
   Six diminishing ghost dots that follow the cursor
───────────────────────────────────────────────────────────────*/
(function() {
  var TRAIL_COUNT = 7;
  var trail = [];
  var positions = [];

  for (var i = 0; i < TRAIL_COUNT; i++) {
    var size = (4.5 - i * 0.5);
    var dot  = document.createElement('div');
    dot.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'border-radius:50%',
      'z-index:2147483640',
      'width:'  + size + 'px',
      'height:' + size + 'px',
      'background:rgba(201,168,76,' + (0.3 - i * 0.04) + ')',
      'transform:translate(-50%,-50%)',
      'top:0',
      'left:0',
      'will-change:left,top'
    ].join(';');
    document.body.appendChild(dot);
    trail.push(dot);
    positions.push({ x: 0, y: 0 });
  }

  var tmx = 0, tmy = 0;
  document.addEventListener('mousemove', function(e) { tmx = e.clientX; tmy = e.clientY; });

  function animTrail() {
    positions[0].x += (tmx - positions[0].x) * 0.3;
    positions[0].y += (tmy - positions[0].y) * 0.3;
    for (var j = 1; j < TRAIL_COUNT; j++) {
      positions[j].x += (positions[j-1].x - positions[j].x) * 0.42;
      positions[j].y += (positions[j-1].y - positions[j].y) * 0.42;
    }
    for (var k = 0; k < TRAIL_COUNT; k++) {
      trail[k].style.left = positions[k].x + 'px';
      trail[k].style.top  = positions[k].y + 'px';
    }
    requestAnimationFrame(animTrail);
  }
  animTrail();
})();


/* ─────────────────────────────────────────────────────────────
   6. NAV SCROLL STATE
───────────────────────────────────────────────────────────────*/
window.addEventListener('scroll', function() {
  var nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ─────────────────────────────────────────────────────────────
   7. MOBILE NAV TOGGLE
───────────────────────────────────────────────────────────────*/
var mobToggle = document.getElementById('mob-toggle');
var mobNav    = document.getElementById('mob-nav');

if (mobToggle && mobNav) {
  mobToggle.addEventListener('click', function() {
    var isOpen = mobNav.classList.toggle('open');
    mobToggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

function closeMob() {
  if (mobNav) mobNav.classList.remove('open');
  if (mobToggle) mobToggle.classList.remove('open');
  document.body.style.overflow = '';
}


/* ─────────────────────────────────────────────────────────────
   8. ACTIVE NAV HIGHLIGHT
   Highlights the nav link matching the current section
───────────────────────────────────────────────────────────────*/
(function() {
  var sections = document.querySelectorAll('section[id], div[id]');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function onScroll() {
    var scrollY = window.scrollY + 140;
    var current = '';
    sections.forEach(function(sec) {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });
    navLinks.forEach(function(a) {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ─────────────────────────────────────────────────────────────
   9. TEXT SCRAMBLE — hero name matrix effect on load
───────────────────────────────────────────────────────────────*/
var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&';

function scramble(el, target, duration) {
  var start = null;
  var len = target.length;

  function step(ts) {
    if (!start) start = ts;
    var progress = Math.min((ts - start) / duration, 1);
    var revealed = Math.floor(progress * len);
    var result = '';

    for (var i = 0; i < len; i++) {
      if (i < revealed) {
        result += target[i];
      } else {
        result += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    }

    el.textContent = result;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(step);
}

function startScramble() {
  var nameEl = document.getElementById('scramble-name');
  if (nameEl) {
    setTimeout(function() { scramble(nameEl, 'JACHIN', 1400); }, 250);
  }
}


/* ─────────────────────────────────────────────────────────────
   10. COUNTER ROLL ANIMATION
   Numbers count up with cubic easing when scrolled into view
───────────────────────────────────────────────────────────────*/
function animateCounter(el) {
  var target   = parseInt(el.dataset.target, 10);
  var prefix   = el.dataset.prefix  || '';
  var suffix   = el.dataset.suffix  || '';
  var duration = 1800;
  var start    = null;

  function step(ts) {
    if (!start) start = ts;
    var progress = Math.min((ts - start) / duration, 1);
    // Cubic ease-out
    var eased = 1 - Math.pow(1 - progress, 3);
    var val   = Math.floor(eased * target);
    // Separate '+' from the display suffix
    var cleanSuf = suffix.replace('+', '');
    var plus     = suffix.indexOf('+') !== -1 ? '+' : '';

    el.innerHTML = prefix + val + '<em>' + cleanSuf + '</em>' + plus;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.innerHTML = prefix + target + '<em>' + suffix + '</em>';
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
  }, { threshold: 0.25 });

  document.querySelectorAll('[data-target]').forEach(function(el) {
    cIO.observe(el);
  });
}


/* ─────────────────────────────────────────────────────────────
   11. EXPERIENCE ACCORDION
   Only one item open at a time. Click again to close.
───────────────────────────────────────────────────────────────*/
function toggleExp(el) {
  var isOpen = el.classList.contains('open');
  // Close all open items
  document.querySelectorAll('.exp-item.open').forEach(function(i) {
    i.classList.remove('open');
  });
  // Open clicked item (unless it was already open)
  if (!isOpen) el.classList.add('open');
}


/* ─────────────────────────────────────────────────────────────
   12. PARALLAX ORBS — subtle depth movement on scroll
───────────────────────────────────────────────────────────────*/
window.addEventListener('scroll', function() {
  var y = window.scrollY;
  document.querySelectorAll('.orb').forEach(function(orb, i) {
    var speed = i === 0 ? -0.07 : 0.05;
    orb.style.transform = 'translateY(' + (y * speed) + 'px) scale(1)';
  });
}, { passive: true });


/* ─────────────────────────────────────────────────────────────
   13. PORTFOLIO CARD TILT — 3D perspective mouse-follow
───────────────────────────────────────────────────────────────*/
function initTilt() {
  document.querySelectorAll('.pcard').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var r  = card.getBoundingClientRect();
      var x  = ((e.clientX - r.left)  / r.width  - 0.5) * 12;
      var y  = ((e.clientY - r.top)   / r.height - 0.5) * -12;
      card.style.transform = 'perspective(700px) rotateY(' + x + 'deg) rotateX(' + y + 'deg) translateY(-6px)';
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s';
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   14. MAGNETIC BUTTONS — subtle cursor attraction on hover
───────────────────────────────────────────────────────────────*/
document.querySelectorAll('.btn-gold, .btn-ghost, .nav-hire').forEach(function(btn) {
  btn.addEventListener('mousemove', function(e) {
    var r  = btn.getBoundingClientRect();
    var dx = (e.clientX - (r.left + r.width  / 2)) * 0.2;
    var dy = (e.clientY - (r.top  + r.height / 2)) * 0.2;
    btn.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
  });
  btn.addEventListener('mouseleave', function() {
    btn.style.transform = '';
  });
});


/* ─────────────────────────────────────────────────────────────
   15. STAGGER REVEAL
   Grid children animate in sequence, not all at once
───────────────────────────────────────────────────────────────*/
(function() {
  var grids = document.querySelectorAll(
    '.services-grid, .skills-grid, .certs-grid, .tgrid, .edu-grid, .case-grid'
  );
  grids.forEach(function(grid) {
    var children = grid.children;
    for (var i = 0; i < children.length; i++) {
      children[i].style.transitionDelay = (i * 0.045) + 's';
    }
  });
})();


/* ─────────────────────────────────────────────────────────────
   16. SCROLL PROGRESS BAR
   Thin gold line at the very top showing scroll progress
───────────────────────────────────────────────────────────────*/
(function() {
  var bar = document.createElement('div');
  bar.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'height:2px',
    'background:linear-gradient(to right,#C9A84C,#E8C96A)',
    'z-index:10001',
    'width:0%',
    'transition:width 0.1s linear',
    'pointer-events:none'
  ].join(';');
  document.body.appendChild(bar);

  window.addEventListener('scroll', function() {
    var scrollTop  = window.scrollY;
    var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    var pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();
