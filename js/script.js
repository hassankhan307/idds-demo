/**
 * Institute of Digital Dental Sciences (IDDS)
 * Main Interactive Application Script (Vanilla JS)
 * Premium Medical Education Demo Platform
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initAccordion();
  initEnrollModal();
  initDemoForms();
  initCourseFilters();
  initScrollEffects();
  initScrollToTop();
});

/* ==========================================================================
   CONFIG & CONSTANTS (Easily Replace for Production)
   ========================================================================== */
const IDDS_CONFIG = {
  // Replace with official IDDS WhatsApp number in international format without + or spaces
  // e.g., "923001234567"
  WHATSAPP_NUMBER: "923000000000",
  DEFAULT_MESSAGE: encodeURIComponent("Hello IDDS! I would like to inquire about the 'Mastery in Fixed Prosthodontics' live course."),
  INSTITUTE_EMAIL: "admissions@idds-dental.edu.pk",
  INSTITUTE_LOCATION: "Lahore, Pakistan & International Virtual Faculty"
};

/* ==========================================================================
   1. Navbar State on Scroll
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. Mobile Drawer Navigation
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-menu-drawer');
  if (!toggleBtn || !drawer) return;

  const toggleMenu = (isOpen) => {
    const shouldOpen = isOpen !== undefined ? isOpen : !drawer.classList.contains('open');
    if (shouldOpen) {
      drawer.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  toggleBtn.addEventListener('click', () => toggleMenu());

  // Close when clicking any nav link inside mobile drawer
  const mobileLinks = drawer.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* ==========================================================================
   3. Interactive FAQ Accordion
   ========================================================================== */
function initAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items in the same container for clean accordion behavior
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });

  // Automatically expand the first item by default
  if (faqItems[0]) {
    faqItems[0].classList.add('active');
    const firstAns = faqItems[0].querySelector('.faq-answer');
    if (firstAns) firstAns.style.maxHeight = firstAns.scrollHeight + 30 + 'px';
  }
}

/* ==========================================================================
   4. Quick Enrollment Modal
   ========================================================================== */
function initEnrollModal() {
  const modal = document.getElementById('enrollModal');
  if (!modal) return;

  const openButtons = document.querySelectorAll('[data-open-modal="enrollModal"]');
  const closeButtons = modal.querySelectorAll('[data-close-modal]');
  const courseInput = modal.querySelector('#enrollCourseName');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const courseName = btn.getAttribute('data-course-name') || 'Mastery in Fixed Prosthodontics';
      if (courseInput) {
        courseInput.value = courseName;
      }
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. Demo Forms & Toast Alerts
   ========================================================================== */
function initDemoForms() {
  const forms = document.querySelectorAll('form[data-demo-form="true"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic validation
      const requiredInputs = form.querySelectorAll('[required]');
      let isValid = true;
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('invalid');
          isValid = false;
        } else {
          input.classList.remove('invalid');
        }
      });

      if (!isValid) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      // Close modal if open
      const parentModal = form.closest('.modal-overlay');
      if (parentModal) {
        parentModal.classList.remove('open');
        document.body.style.overflow = '';
      }

      // Show requested demo message
      showToast('Thank you! This is a demo form. In the production website, your inquiry would be submitted to IDDS.');
      form.reset();
    });
  });
}

function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 12px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: ${type === 'error' ? '#ef4444' : '#22d3ee'}; flex-shrink: 0; margin-top: 2px;">
        ${type === 'error' 
          ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' 
          : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'}
      </svg>
      <div>
        <strong style="display:block; font-size: 0.95rem; margin-bottom: 2px; color: #fff;">${type === 'error' ? 'Notice' : 'Demo Notice'}</strong>
        <p style="font-size: 0.88rem; line-height: 1.45; color: #cbd5e1; margin: 0;">${message}</p>
      </div>
    </div>
  `;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 6000);
}

/* ==========================================================================
   6. Course Filtering (For courses.html)
   ========================================================================== */
function initCourseFilters() {
  const filterButtons = document.querySelectorAll('.course-filter-btn');
  const courseCards = document.querySelectorAll('.filterable-course-card');

  if (!filterButtons.length || !courseCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterButtons.forEach(b => b.classList.add('btn-secondary'));
      
      btn.classList.add('active', 'btn-primary');
      btn.classList.remove('btn-secondary');

      const filterCategory = btn.getAttribute('data-filter');

      courseCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterCategory === 'all' || categories.includes(filterCategory)) {
          card.style.display = 'flex';
          setTimeout(() => card.classList.add('in-view'), 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. Scroll Reveal Effects
   ========================================================================== */
function initScrollEffects() {
  const elements = document.querySelectorAll('.fade-in-up');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    elements.forEach(el => el.classList.add('in-view'));
  }
}

/* ==========================================================================
   8. Scroll To Top Button
   ========================================================================== */
function initScrollToTop() {
  const topBtn = document.querySelector('.scroll-top-btn');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  }, { passive: true });

  topBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* Helper function to generate direct WhatsApp URL */
window.openIDDSWhatsApp = function(customText) {
  const text = customText ? encodeURIComponent(customText) : IDDS_CONFIG.DEFAULT_MESSAGE;
  const url = `https://wa.me/${IDDS_CONFIG.WHATSAPP_NUMBER}?text=${text}`;
  window.open(url, '_blank');
};
