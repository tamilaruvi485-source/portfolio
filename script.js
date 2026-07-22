/**
 * ============================================================
 * TAMILARUVI S — PREMIUM PORTFOLIO SCRIPTS
 * Vanilla JavaScript — No frameworks
 * ============================================================
 */

(function () {
  'use strict';

  /* ==================== DOM REFERENCES ==================== */
  const loader = document.getElementById('loader');
  const cursorGlow = document.getElementById('cursor-glow');
  const particlesCanvas = document.getElementById('particles');
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const typingEl = document.getElementById('typing-text');
  const revealElements = document.querySelectorAll('.reveal');
  const skillCards = document.querySelectorAll('.skill-card');
  const tiltElements = document.querySelectorAll('[data-tilt]');
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  /* ==================== CONFIGURATION ==================== */
  // EDIT: Customize typing roles here
  const TYPING_ROLES = [
    'AI & Data Science Student',
    'Python Developer',
    'AI Engineer',
    'Machine Learning Enthusiast',
    'Problem Solver'
  ];

  const TYPING_SPEED = 80;
  const DELETING_SPEED = 40;
  const PAUSE_AFTER_TYPE = 2000;
  const PAUSE_AFTER_DELETE = 500;

  /* ==================== LOADING SCREEN ==================== */
  function initLoader() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
        initRevealAnimations();
        initSkillBars();
      }, 2200);
    });
  }

  /* ==================== CURSOR GLOW EFFECT ==================== */
  function initCursorGlow() {
    if (!cursorGlow || window.matchMedia('(hover: none)').matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }

    animateGlow();

    // Scale glow on interactive elements
    const interactives = document.querySelectorAll('a, button, .btn, [data-tilt]');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.3)';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)';
      });
      el.addEventListener('mouseleave', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)';
      });
    });
  }

  /* ==================== PARTICLE SYSTEM ==================== */
  function initParticles() {
    if (!particlesCanvas) return;

    const ctx = particlesCanvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
      particlesCanvas.width = window.innerWidth;
      particlesCanvas.height = window.innerHeight;
    }

    function createParticles() {
      const count = Math.min(Math.floor(window.innerWidth / 15), 80);
      particles = [];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * particlesCanvas.width,
          y: Math.random() * particlesCanvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

      particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < 0) p.x = particlesCanvas.width;
        if (p.x > particlesCanvas.width) p.x = 0;
        if (p.y < 0) p.y = particlesCanvas.height;
        if (p.y > particlesCanvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${p.opacity})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    // Pause particles when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        drawParticles();
      }
    });
  }

  /* ==================== TYPING ANIMATION ==================== */
  function initTypingAnimation() {
    if (!typingEl) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentRole = TYPING_ROLES[roleIndex];

      if (isDeleting) {
        typingEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

      if (!isDeleting && charIndex === currentRole.length) {
        delay = PAUSE_AFTER_TYPE;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % TYPING_ROLES.length;
        delay = PAUSE_AFTER_DELETE;
      }

      setTimeout(type, delay);
    }

    type();
  }

  /* ==================== SCROLL REVEAL ANIMATIONS ==================== */
  function initRevealAnimations() {
    if (!revealElements.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger sibling reveals
          const parent = entry.target.parentElement;
          const siblings = parent ? [...parent.querySelectorAll('.reveal')] : [];
          const siblingIndex = siblings.indexOf(entry.target);
          const delay = siblingIndex * 100;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => observer.observe(el));
  }

  /* ==================== ANIMATED SKILL BARS ==================== */
  function initSkillBars() {
    if (!skillCards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const level = card.getAttribute('data-skill');
            card.style.setProperty('--skill-level', level + '%');
            card.classList.add('animated');
            observer.unobserve(card);
          }
        });
      },
      { threshold: 0.5 }
    );

    skillCards.forEach((card) => observer.observe(card));
  }

  /* ==================== 3D TILT EFFECT ==================== */
  function init3DTilt() {
    if (window.matchMedia('(hover: none)').matches) return;

    tiltElements.forEach((el) => {
      el.addEventListener('mousemove', handleTiltMove);
      el.addEventListener('mouseleave', handleTiltLeave);
    });

    function handleTiltMove(e) {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      el.style.transition = 'transform 0.1s ease';
    }

    function handleTiltLeave(e) {
      const el = e.currentTarget;
      el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  }

  /* ==================== PARALLAX SCROLLING ==================== */
  function initParallax() {
    if (!parallaxElements.length) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.pageYOffset;

      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        const offset = scrollY * speed;
        el.style.transform = `translateY(${offset}px)`;
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  /* ==================== HEADER SCROLL EFFECT ==================== */
  function initHeaderScroll() {
    if (!header) return;

    function handleScroll() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ==================== ACTIVE NAV LINK ON SCROLL ==================== */
  function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');

    function highlightNav() {
      const scrollPos = window.scrollY + 100;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
  }

  /* ==================== MOBILE NAVIGATION ==================== */
  function initMobileNav() {
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      navToggle.setAttribute(
        'aria-expanded',
        navMenu.classList.contains('open')
      );
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ==================== SMOOTH SCROLL FOR ANCHOR LINKS ==================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ==================== MAGNETIC BUTTON EFFECT ==================== */
  function initMagneticButtons() {
    if (window.matchMedia('(hover: none)').matches) return;

    const buttons = document.querySelectorAll('.btn');

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ==================== INITIALIZE ALL MODULES ==================== */
  function init() {
    initLoader();
    initCursorGlow();
    initParticles();
    initTypingAnimation();
    init3DTilt();
    initParallax();
    initHeaderScroll();
    initActiveNavLink();
    initMobileNav();
    initSmoothScroll();
    initMagneticButtons();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
