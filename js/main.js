(function () {
  'use strict';

  const cfg = window.GET_CONFIG || {};
  const header = document.getElementById('header');
  const progressFill = document.getElementById('progress-fill');
  const progressLinks = document.querySelectorAll('.progress-list a');
  const sections = document.querySelectorAll('.section[data-section-index]');
  const processSection = document.getElementById('process');
  const processSteps = document.querySelectorAll('.process-step');
  const processTrackFill = document.getElementById('process-track-fill');
  const parallaxBgs = document.querySelectorAll('.parallax-bg img');
  const ikigai = document.getElementById('ikigai');

  // Init i18n first
  if (window.GET_I18N) window.GET_I18N.initI18n();

  // Theme toggle (dark default, light optional)
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  function applyTheme(theme) {
    const isLight = theme === 'light';
    if (isLight) root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    localStorage.setItem('get-theme', isLight ? 'light' : 'dark');
    themeToggle?.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    if (window.GET_I18N) {
      const label = window.GET_I18N.T[window.GET_LANG || 'en']?.theme?.toggle || 'Toggle color theme';
      themeToggle?.setAttribute('aria-label', label);
    }
  }

  applyTheme(localStorage.getItem('get-theme') === 'light' ? 'light' : 'dark');
  themeToggle?.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });

  // Africa reach map
  const reachMapEl = document.getElementById('reach-map');
  const reachTooltip = document.getElementById('reach-map-tooltip');
  let reachMapSvg = null;

  function getCountryLabel(code) {
    const dict = window.GET_I18N?.T[window.GET_LANG || 'en'];
    const idx = dict?.countryCodes?.indexOf(code);
    return idx >= 0 ? dict.countries[idx] : code;
  }

  function highlightReachCountry(code) {
    if (!reachMapSvg) return;
    reachMapEl?.classList.toggle('is-hovering', Boolean(code));
    reachMapSvg.querySelectorAll('.map-country--active').forEach((path) => {
      path.classList.toggle('is-highlighted', path.dataset.id === code);
    });
    document.querySelectorAll('.reach-legend-item').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.country === code);
    });
    if (reachTooltip) {
      if (code) {
        reachTooltip.textContent = getCountryLabel(code);
        reachTooltip.hidden = false;
      } else {
        reachTooltip.textContent = '';
        reachTooltip.hidden = true;
      }
    }
  }

  function bindReachLegend() {
    document.querySelectorAll('.reach-legend-item').forEach((btn) => {
      btn.addEventListener('mouseenter', () => highlightReachCountry(btn.dataset.country));
      btn.addEventListener('mouseleave', () => highlightReachCountry(null));
      btn.addEventListener('focus', () => highlightReachCountry(btn.dataset.country));
      btn.addEventListener('blur', () => highlightReachCountry(null));
    });
  }

  function bindReachMapPaths() {
    if (!reachMapSvg) return;
    reachMapSvg.querySelectorAll('.map-country--active').forEach((path) => {
      path.addEventListener('mouseenter', () => highlightReachCountry(path.dataset.id));
      path.addEventListener('mouseleave', () => highlightReachCountry(null));
      path.addEventListener('focus', () => highlightReachCountry(path.dataset.id));
      path.addEventListener('blur', () => highlightReachCountry(null));
      path.setAttribute('tabindex', '0');
      path.setAttribute('role', 'button');
    });
  }

  async function initReachMap() {
    if (!reachMapEl) return;
    try {
      const res = await fetch('assets/maps/africa-reach.svg');
      if (!res.ok) return;
      const text = await res.text();
      const wrap = document.createElement('div');
      wrap.innerHTML = text.trim();
      reachMapSvg = wrap.querySelector('svg');
      if (!reachMapSvg) return;
      reachMapSvg.removeAttribute('aria-hidden');
      const sr = reachMapEl.querySelector('.sr-only');
      reachMapEl.insertBefore(reachMapSvg, sr?.nextSibling || null);
      bindReachMapPaths();
      bindReachLegend();
    } catch (_) { /* map is decorative enhancement */ }
  }

  initReachMap();
  window.addEventListener('get-countries-updated', bindReachLegend);

  const emailLink = document.getElementById('contact-email-link');
  if (emailLink && cfg.email) {
    emailLink.href = `mailto:${cfg.email}`;
    emailLink.textContent = cfg.email;
  }

  const whatsappBtn = document.getElementById('contact-whatsapp');
  if (whatsappBtn && cfg.whatsapp) {
    const msg = encodeURIComponent('Hello GET Consult, I would like to discuss a project.');
    whatsappBtn.href = `https://wa.me/${cfg.whatsapp.replace(/\D/g, '')}?text=${msg}`;
    whatsappBtn.classList.remove('hidden');
  }

  // Image fallbacks
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => {
      if (img.dataset.fallback) img.src = img.dataset.fallback;
    }, { once: true });
    if (img.complete && img.naturalWidth === 0 && img.dataset.fallback) {
      img.src = img.dataset.fallback;
    }
  });

  // Scroll reveal
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // Headline animation
  const headlineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          headlineObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  document.querySelectorAll('.headline-animate').forEach((el) => headlineObserver.observe(el));

  // Hero headline on load
  requestAnimationFrame(() => {
    document.querySelector('.section-hero .headline-animate')?.classList.add('visible');
  });

  // Ikigai pulse when in view
  if (ikigai) {
    const ikigaiObserver = new IntersectionObserver(
      ([entry]) => {
        ikigai.classList.toggle('ikigai--active', entry.isIntersecting);
      },
      { threshold: 0.4 }
    );
    ikigaiObserver.observe(ikigai);
  }

  // Years in operation since founding year
  const foundingYear = cfg.foundingYear || 2018;
  const yearsOperating = Math.max(new Date().getFullYear() - foundingYear, 1);
  document.querySelectorAll('.metric-value[data-founded]').forEach((el) => {
    el.dataset.target = String(yearsOperating);
  });

  // Metric counters (each grid animates independently)
  const animatedMetricGrids = new Set();
  const metricObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || animatedMetricGrids.has(entry.target)) return;
        animatedMetricGrids.add(entry.target);
        entry.target.querySelectorAll('.metric-value[data-target]').forEach((el) => {
          const target = parseInt(el.dataset.target, 10);
          const duration = 1600;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
        metricObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );
  document.querySelectorAll('.metrics-grid').forEach((grid) => metricObserver.observe(grid));

  // Mobile menu (portal to body so backdrop-filter on header does not clip the drawer)
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const headerMenu = document.getElementById('header-menu');
  const menuBackdrop = document.getElementById('menu-backdrop');
  const headerInner = document.querySelector('.header-inner');
  const menuHome = headerMenu && headerInner && menuToggle
    ? { parent: headerInner, toggle: menuToggle }
    : null;

  function isMobileMenu() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function placeMobileMenu() {
    if (!headerMenu || !menuBackdrop || !menuHome) return;
    if (isMobileMenu()) {
      if (headerMenu.parentElement !== document.body) {
        document.body.appendChild(menuBackdrop);
        document.body.appendChild(headerMenu);
        headerMenu.classList.add('is-portaled');
      }
    } else {
      setMenuOpen(false);
      headerMenu.classList.remove('is-portaled');
      if (headerMenu.parentElement !== menuHome.parent) {
        menuHome.toggle.insertAdjacentElement('afterend', headerMenu);
      }
      headerMenu.removeAttribute('aria-hidden');
    }
  }

  function setMenuOpen(open) {
    document.body.classList.toggle('menu-open', open);
    menuToggle?.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (isMobileMenu()) {
      headerMenu?.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (menuBackdrop) {
        menuBackdrop.hidden = !open;
        menuBackdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
      }
    } else {
      headerMenu?.removeAttribute('aria-hidden');
      if (menuBackdrop) menuBackdrop.hidden = true;
    }
  }

  placeMobileMenu();
  if (isMobileMenu()) headerMenu?.setAttribute('aria-hidden', 'true');

  menuToggle?.addEventListener('click', () => {
    if (isMobileMenu()) placeMobileMenu();
    setMenuOpen(!document.body.classList.contains('menu-open'));
  });
  menuClose?.addEventListener('click', () => setMenuOpen(false));
  menuBackdrop?.addEventListener('click', () => setMenuOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenuOpen(false);
  });
  window.addEventListener('resize', placeMobileMenu);

  function contactMsg(key) {
    return window.GET_I18N?.T[window.GET_LANG || 'en']?.contact?.[key] || '';
  }

  async function sendContactEmail(payload) {
    if (cfg.formspree) {
      const res = await fetch(`https://formspree.io/f/${cfg.formspree}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return true;
    }

    const api = cfg.contactApi || '/api/contact.php';
    try {
      const res = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return true;
    } catch (_) { /* try fallback */ }

    const to = cfg.email || 'contact@get-consult.com';
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        company: payload.company,
        message: payload.message,
        _subject: `GET Consult — ${payload.company || payload.name}`,
        _template: 'table',
        _captcha: 'false',
      }),
    });
    return res.ok;
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      setMenuOpen(false);
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 100;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const company = document.getElementById('company').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const submitBtn = contactForm.querySelector('.form-submit');
      const defaultLabel = contactMsg('submit') || 'Send Inquiry';

      submitBtn.disabled = true;
      submitBtn.textContent = contactMsg('sending') || 'Sending…';

      try {
        const ok = await sendContactEmail({ name, company, email, message });
        if (ok) {
          contactForm.reset();
          submitBtn.textContent = contactMsg('sent') || 'Message sent';
          setTimeout(() => {
            submitBtn.textContent = defaultLabel;
            submitBtn.disabled = false;
          }, 3000);
          return;
        }
      } catch (_) { /* show error below */ }

      submitBtn.textContent = contactMsg('error') || 'Could not send';
      setTimeout(() => {
        submitBtn.textContent = defaultLabel;
        submitBtn.disabled = false;
      }, 4000);
    });
  }

  let ticking = false;

  function updateOnScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? scrollY / docHeight : 0;

    header.classList.toggle('is-scrolled', scrollY > 80);

    if (progressFill) progressFill.style.height = `${scrollProgress * 100}%`;

    const offset = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 100) + 120;
    let activeId = sections[0]?.id;
    sections.forEach((section) => {
      if (section.offsetTop - offset <= scrollY) activeId = section.id;
    });
    progressLinks.forEach((link) => link.classList.toggle('active', link.dataset.section === activeId));

    parallaxBgs.forEach((img) => {
      const wrap = img.closest('.parallax-bg');
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const shift = (rect.top + rect.height / 2 - window.innerHeight / 2) * 0.06;
      img.style.transform = `translate3d(0, ${shift}px, 0) scale(1.06)`;
    });

    if (processSection && processSteps.length) {
      const rect = processSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.65 && rect.bottom > window.innerHeight * 0.25;
      if (inView) {
        const localProgress = Math.min(Math.max((window.innerHeight * 0.5 - rect.top) / rect.height, 0), 1);
        const activeStep = Math.min(Math.ceil(localProgress * 5) || 1, 5);
        processSteps.forEach((step) => {
          step.classList.toggle('active', parseInt(step.dataset.step, 10) <= activeStep);
        });
        if (processTrackFill) processTrackFill.style.width = `${((activeStep - 1) / 4) * 100}%`;
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }, { passive: true });

  updateOnScroll();
})();
