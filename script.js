/**
 * VAIBHAV SENGAR — PORTFOLIO JAVASCRIPT
 * Features:
 * - Cinematic Loading Sequence
 * - Minimal Custom Cursor System with Magnetic Interactions
 * - Hero Portrait Subtle Parallax
 * - Scroll Progress Indicator
 * - Scroll-triggered Observer Reveals
 * - Dynamic Active Nav Section Tracking
 * - Mobile Navigation Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const preloader = document.getElementById('preloader');
  const preloaderCounter = document.getElementById('preloaderCounter');
  const preloaderBarFill = document.getElementById('preloaderBarFill');
  const scrollProgress = document.getElementById('scrollProgress');
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const heroPortrait = document.getElementById('heroPortrait');
  const heroPortraitContainer = document.getElementById('heroPortraitContainer');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navItems = document.querySelectorAll('.nav-item');
  const revealElements = document.querySelectorAll('[data-scroll-reveal]');
  const magneticElements = document.querySelectorAll('[data-magnetic]');

  /* ------------------------------------------------------------------------
     1. CINEMATIC PRELOADER SEQUENCE
     ------------------------------------------------------------------------ */
  let progress = 0;
  const startTime = performance.now();
  const duration = 400; // ms

  function updatePreloader(currentTime) {
    const elapsed = currentTime - startTime;
    progress = Math.min(Math.round((elapsed / duration) * 100), 100);

    if (preloaderCounter) {
      preloaderCounter.textContent = progress < 10 ? `0${progress}%` : `${progress}%`;
    }
    if (preloaderBarFill) {
      preloaderBarFill.style.width = `${progress}%`;
    }

    if (progress < 100) {
      requestAnimationFrame(updatePreloader);
    } else {
      if (preloader) {
        preloader.classList.add('loaded');
      }
      document.body.classList.add('hero-animated');
    }
  }

  requestAnimationFrame(updatePreloader);

  /* ------------------------------------------------------------------------
     2. SCROLL PROGRESS BAR
     ------------------------------------------------------------------------ */
  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight > 0 && scrollProgress) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = `${scrollPercent}%`;
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  /* ------------------------------------------------------------------------
     3. INTERSECTION OBSERVER FOR SCROLL REVEALS
     ------------------------------------------------------------------------ */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ------------------------------------------------------------------------
     4. ACTIVE NAVIGATION TRACKING
     ------------------------------------------------------------------------ */
  const trackedSections = document.querySelectorAll('section[id]');
  
  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    trackedSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 180;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navItems.forEach(item => {
          if (item.getAttribute('data-nav') === sectionId) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ------------------------------------------------------------------------
     5. HERO PORTRAIT MOUSE PARALLAX
     ------------------------------------------------------------------------ */
  if (heroPortrait && heroPortraitContainer) {
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isHoveringHero = false;

    heroPortraitContainer.addEventListener('mouseenter', () => {
      isHoveringHero = true;
    });

    heroPortraitContainer.addEventListener('mouseleave', () => {
      isHoveringHero = false;
      targetX = 0;
      targetY = 0;
    });

    heroPortraitContainer.addEventListener('mousemove', (e) => {
      const rect = heroPortraitContainer.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Restrained parallax range (12px max movement)
      targetX = (x / rect.width) * 16;
      targetY = (y / rect.height) * 12;
    });

    function renderParallax() {
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;

      if (heroPortrait) {
        heroPortrait.style.transform = `scale(1.03) translate3d(${mouseX.toFixed(2)}px, ${mouseY.toFixed(2)}px, 0)`;
      }

      requestAnimationFrame(renderParallax);
    }

    renderParallax();
  }

  /* ------------------------------------------------------------------------
     6. CUSTOM CURSOR & MAGNETIC INTERACTIONS
     ------------------------------------------------------------------------ */
  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    window.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      cursorDot.style.left = `${mousePos.x}px`;
      cursorDot.style.top = `${mousePos.y}px`;
    }, { passive: true });

    function renderCursor() {
      ringPos.x += (mousePos.x - ringPos.x) * 0.16;
      ringPos.y += (mousePos.y - ringPos.y) * 0.16;
      cursorRing.style.left = `${ringPos.x}px`;
      cursorRing.style.top = `${ringPos.y}px`;

      requestAnimationFrame(renderCursor);
    }

    renderCursor();

    // Hover effect on interactable targets
    const interactables = document.querySelectorAll('a, button, input, .project-card, .exp-pill, .mini-project-card');
    interactables.forEach(target => {
      target.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      target.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });

    // Subtle Magnetic Attraction on magnetic elements
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.22;
        const deltaY = (e.clientY - centerY) * 0.22;

        el.style.transform = `translate(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. MOBILE NAVIGATION TOGGLE
     ------------------------------------------------------------------------ */
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. SMOOTH SCROLL ANCHOR OVERRIDE
     ------------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Console Brand Signature
  console.log(
    '%c VAIBHAV SENGAR // PORTFOLIO 2026 %c \nComputer Science Major & Builder\nhttps://github.com/VAIBHAV-SENGAR-Git',
    'background: #0066ff; color: #ffffff; font-weight: bold; padding: 4px 10px; border-radius: 2px;',
    'color: #8b929c;'
  );
});
