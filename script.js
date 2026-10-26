/**
 * Fazle Rabbi - Portfolio JavaScript
 * Modern, vanilla ES6+ script for interactive features:
 * - Theme toggle (Light/Dark mode) with localStorage & system preference
 * - Dynamic typing effect for subtitle
 * - Sticky navbar & mobile navigation menu
 * - Active link highlighting on scroll (Scrollspy)
 * - Skills category filtering
 * - Copy email to clipboard with Toast notification
 * - Contact form client-side handling
 * - Back to top button
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypingEffect();
  initMobileNav();
  initScrollspy();
  initSkillFilters();
  initCopyEmail();
  initContactForm();
  initBackToTop();
  initBrandColorInteraction();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  updateThemeIcon();

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon();
  });

  // Listen for system theme changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      updateThemeIcon();
    }
  });
}

function updateThemeIcon() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const currentTheme = document.documentElement.getAttribute('data-theme');
  const sunIcon = themeToggleBtn.querySelector('.icon-sun');
  const moonIcon = themeToggleBtn.querySelector('.icon-moon');

  if (currentTheme === 'dark') {
    if (sunIcon) sunIcon.style.display = 'block';
    if (moonIcon) moonIcon.style.display = 'none';
    themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
  } else {
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
    themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
  }
}

/* ==========================================================================
   2. Dynamic Typing / Rotating Tagline
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const phrases = [
    'CSE Student @ East West University',
    'Passionate about Artificial Intelligence (AI)',
    'Current Focus: JS, Web Apps, Node.js & AI',
    'Learned CSS & Building Modern Web Apps',
    'C, C++ and Java Programmer'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 70;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at the end of phrase
      isDeleting = true;
      typingSpeed = 1800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
    mobileToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking on any nav link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu if clicking outside
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('active') &&
      !navMenu.contains(e.target) &&
      !mobileToggle.contains(e.target)
    ) {
      navMenu.classList.remove('active');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   4. Scrollspy & Active Navigation Link
   ========================================================================== */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   5. Interactive Skills Filter
   ========================================================================== */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCategories = document.querySelectorAll('.skill-group');

  if (filterBtns.length === 0 || skillCategories.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCategories.forEach((category) => {
        const categoryType = category.getAttribute('data-category');
        if (filterValue === 'all' || categoryType === filterValue) {
          category.style.display = 'block';
          category.classList.remove('fade-out');
          category.classList.add('fade-in');
        } else {
          category.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. Copy Email to Clipboard & Toast
   ========================================================================== */
function initCopyEmail() {
  const copyButtons = document.querySelectorAll('.btn-copy-email');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'frkrabbi6@gmail.com';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email)
          .then(() => showToast(`Copied ${email} to clipboard!`))
          .catch(() => fallbackCopy(email));
      } else {
        fallbackCopy(email);
      }
    });
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${text} to clipboard!`);
    } catch (err) {
      showToast(`Email: ${text}`);
    }
    document.body.removeChild(tempInput);
  }
}

function showToast(message) {
  let toast = document.getElementById('portfolio-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portfolio-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  if (toast.timeoutId) {
    clearTimeout(toast.timeoutId);
  }

  toast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   7. Contact Form Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#form-name')?.value.trim();
    const email = form.querySelector('#form-email')?.value.trim();
    const subject = form.querySelector('#form-subject')?.value.trim() || 'Portfolio Inquiry';
    const message = form.querySelector('#form-message')?.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.');
      return;
    }

    // Open user's email client with pre-filled content
    const mailtoUrl = `mailto:frkrabbi6@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Hi Fazle Rabbi,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    window.location.href = mailtoUrl;
    showToast('Opening your email client...');
    form.reset();
  });
}

/* ==========================================================================
   8. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   9. Brand Accent Color Interaction
   ========================================================================== */
function initBrandColorInteraction() {
  const brandCodes = document.getElementById('brand-codes');
  if (!brandCodes) return;

  const colorPalettes = [
    'linear-gradient(135deg, #2563eb, #7c3aed, #ec4899, #f97316, #10b981, #06b6d4, #2563eb)',
    'linear-gradient(135deg, #00f5ff, #7928ca, #ff0080, #00f5ff)',
    'linear-gradient(135deg, #10b981, #06b6d4, #3b82f6, #10b981)',
    'linear-gradient(135deg, #f59e0b, #ef4444, #ec4899, #f59e0b)',
    'linear-gradient(135deg, #8b5cf6, #d946ef, #3b82f6, #8b5cf6)'
  ];

  let currentPaletteIndex = 0;

  brandCodes.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    currentPaletteIndex = (currentPaletteIndex + 1) % colorPalettes.length;
    brandCodes.style.backgroundImage = colorPalettes[currentPaletteIndex];
    brandCodes.style.webkitBackgroundClip = 'text';
    brandCodes.style.webkitTextFillColor = 'transparent';

    brandCodes.style.transform = 'scale(1.2) rotate(4deg)';
    setTimeout(() => {
      brandCodes.style.transform = '';
    }, 250);
  });
}
