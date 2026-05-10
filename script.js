/* ========================= */
/* THEME TOGGLE */
/* ========================= */

function toggleTheme() {

    const body = document.body;
    const icon = document.getElementById("theme-icon");

    body.classList.toggle("light-mode");

    if (body.classList.contains("light-mode")) {

        localStorage.setItem("theme", "light");

        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");

    } else {

        localStorage.setItem("theme", "dark");

        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");

    }

}


/* ========================= */
/* LOAD SAVED THEME */
/* ========================= */

document.addEventListener("DOMContentLoaded", function () {

    const savedTheme = localStorage.getItem("theme");
    const icon = document.getElementById("theme-icon");

    if (savedTheme === "light") {

        document.body.classList.add("light-mode");

        if (icon) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        }

    }

});


/* ========================= */
/* INTRO SIGNATURE ANIMATION */
/* ========================= */

/* INTRO ANIMATION ONLY ON FIRST LOAD */

/* INTRO ANIMATION CONTROL */

window.addEventListener("load", function () {

    const intro = document.getElementById("intro");

    // detect if page loaded by refresh
    const isReload =
        performance.getEntriesByType("navigation")[0].type === "reload";

    // detect if coming from another page
    const isFirstVisit = !sessionStorage.getItem("visited");

    if (isFirstVisit || isReload) {

        // mark visited
        sessionStorage.setItem("visited", "true");

        // show animation
        setTimeout(function () {

            intro.style.opacity = "0";

            setTimeout(function () {

                intro.style.display = "none";

            }, 800);

        }, 2500);

    } else {

        // skip animation
        intro.style.display = "none";

    }

});

function toggleTheme() {
  const body = document.body;
  const icon = document.querySelector('#theme-icon i');
  body.classList.toggle('light-mode');
  if (body.classList.contains('light-mode')) {
    localStorage.setItem('theme', 'light');
    if (icon) { icon.classList.replace('fa-moon', 'fa-sun'); }
  } else {
    localStorage.setItem('theme', 'dark');
    if (icon) { icon.classList.replace('fa-sun', 'fa-moon'); }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme');
  const icon = document.querySelector('#theme-icon i');
  if (saved === 'light') {
    document.body.classList.add('light-mode');
    if (icon) { icon.classList.replace('fa-moon', 'fa-sun'); }
  }
});

/* === PARTICLE SYSTEM === */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '108,99,255' : Math.random() > 0.5 ? '255,77,166' : '0,212,255'
    };
  }

  for (let i = 0; i < 80; i++) particles.push(createParticle());

  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      // mouse repulsion
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        p.x += (dx / dist) * 1.5;
        p.y += (dy / dist) * 1.5;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
      ctx.fill();

      // connect nearby
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx2 = p.x - q.x, dy2 = p.y - q.y;
        const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (d2 < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(108,99,255,${0.08 * (1 - d2 / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* === CUSTOM CURSOR === */
(function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  document.querySelectorAll('a, button, .proj-card, .work-item, .contact-card-3d, .tech-pill')
    .forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
})();

/* === INTRO ANIMATION === */
window.addEventListener('load', () => {
  const intro = document.getElementById('intro');
  if (!intro) return;

  const isFirst = !sessionStorage.getItem('visited');
  const isReload = performance.getEntriesByType('navigation')[0]?.type === 'reload';

  if (isFirst || isReload) {
    sessionStorage.setItem('visited', 'true');
    setTimeout(() => {
      intro.style.transition = 'opacity 0.8s ease';
      intro.style.opacity = '0';
      setTimeout(() => { intro.style.display = 'none'; }, 800);
    }, 2500);
  } else {
    intro.style.display = 'none';
  }
});

/* === TYPING ANIMATION === */
(function initTyping() {
  const el = document.getElementById('typing');
  if (!el) return;
  const words = ['Java Developer', 'Full Stack Engineer', 'MCA Student', 'Problem Solver', 'React Developer'];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    let delay = deleting ? 60 : 100;
    if (!deleting && ci > word.length) { deleting = true; delay = 1500; }
    else if (deleting && ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; delay = 400; }
    setTimeout(type, delay);
  }
  type();
})();

/* === NAVBAR SCROLL EFFECT === */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
})();

/* === SCROLL REVEAL === */
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-scroll], .about-block-3d, .tl-item, .work-item, .contact-card-3d').forEach(el => {
    observer.observe(el);
  });

  // stagger about blocks
  document.querySelectorAll('.about-block-3d').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.15) + 's';
  });
})();

/* === 3D CARD TILT === */
(function initTilt() {
  function applyTilt(cards, intensity = 10) {
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const rx = ((e.clientY - cy) / rect.height) * intensity;
        const ry = -((e.clientX - cx) / rect.width) * intensity;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  applyTilt(document.querySelectorAll('.proj-card'));
  applyTilt(document.querySelectorAll('.contact-card-3d'), 8);
  applyTilt(document.querySelectorAll('.about-block-3d'), 4);
})();

/* === MOBILE NAV === */
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
})();

/* === ACTIVE NAV LINK === */
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* === SMOOTH SCROLL === */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
window.addEventListener("load", () => {
    const intro = document.getElementById("intro");

    setTimeout(() => {
        intro.style.opacity = "0";

        setTimeout(() => {
            intro.style.display = "none";
        }, 500);

    }, 2000);
});
