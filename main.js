// Enhanced Landing Page JavaScript with Form Validation and Smooth Interactions

class LandingPage {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupFormValidation();
    this.setupSmoothScrolling();
    this.setupMobileMenu();
    this.setupScrollEffects();
  }

  setupEventListeners() {
    // DOM Content Loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.animateOnLoad();
    });

    // Window scroll events
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });

    // Window resize events
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  setupFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('.form-input, .form-textarea');
    const submitButton = form.querySelector('button[type="submit"]');

    // Real-time validation
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          this.validateField(input);
        }
      });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit(form, submitButton);
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const name = field.name;
    const errorElement = document.getElementById(`${name}-error`);
    const formGroup = field.closest('.form-group');
    
    let isValid = true;
    let errorMessage = '';

    // Clear previous error state
    formGroup.classList.remove('error');
    errorElement.textContent = '';

    switch (name) {
      case 'name':
        if (!value) {
          errorMessage = 'Nome é obrigatório';
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = 'Nome deve ter pelo menos 2 caracteres';
          isValid = false;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errorMessage = 'E-mail é obrigatório';
          isValid = false;
        } else if (!emailRegex.test(value)) {
          errorMessage = 'Digite um e-mail válido';
          isValid = false;
        }
        break;

      case 'message':
        if (value && value.length < 10) {
          errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
          isValid = false;
        }
        break;
    }

    if (!isValid) {
      formGroup.classList.add('error');
      errorElement.textContent = errorMessage;
    }

    return isValid;
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('.form-input[required], .form-textarea[required]');
    let isFormValid = true;

    inputs.forEach(input => {
      const isFieldValid = this.validateField(input);
      if (!isFieldValid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  async handleFormSubmit(form, button) {
    const isValid = this.validateForm(form);
    
    if (!isValid) {
      this.showNotification('Por favor, corrija os erros no formulário.', 'error');
      return;
    }

    // Show loading state
    button.classList.add('loading');
    button.disabled = true;

    try {
      // Simulate API call
      await this.simulateFormSubmission(form);
      
      // Success
      this.showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
      form.reset();
      
      // Clear any error states
      form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });
      form.querySelectorAll('.form-error').forEach(error => {
        error.textContent = '';
      });

    } catch (error) {
      this.showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
    } finally {
      // Remove loading state
      button.classList.remove('loading');
      button.disabled = false;
    }
  }

  simulateFormSubmission(form) {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Network error'));
        }
      }, 2000);
    });
  }

  showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <span class="notification__text">${message}</span>
      <button class="notification__close" aria-label="Fechar notificação">&times;</button>
    `;

    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          max-width: 400px;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10000;
          animation: slideInFromRight 0.3s ease-out;
        }
        .notification--success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .notification--error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .notification--info {
          background: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }
        .notification__close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          margin-left: 1rem;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .notification__close:hover {
          opacity: 1;
        }
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @media (max-width: 480px) {
          .notification {
            left: 20px;
            right: 20px;
            max-width: none;
          }
        }
      `;
      document.head.appendChild(styles);
    }

    // Add to DOM
    document.body.appendChild(notification);

    // Auto dismiss after 5 seconds
    const autoClose = setTimeout(() => {
      this.closeNotification(notification);
    }, 5000);

    // Manual close
    notification.querySelector('.notification__close').addEventListener('click', () => {
      clearTimeout(autoClose);
      this.closeNotification(notification);
    });
  }

  closeNotification(notification) {
    notification.style.animation = 'slideInFromRight 0.3s ease-out reverse';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }

  setupSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (!mobileToggle || !menu) return;

    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileToggle.classList.toggle('active');
      menu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        menu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !menu.contains(e.target)) {
        mobileToggle.classList.remove('active');
        menu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  setupScrollEffects() {
    const header = document.querySelector('.header');
    
    if (!header) return;

    let lastScrollTop = 0;
    const threshold = 100;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add background to header on scroll
      if (scrollTop > threshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScrollTop = scrollTop;
    });
  }

  animateOnLoad() {
    // Animate elements when they come into view
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .stat-item, .contact-form').forEach(el => {
      observer.observe(el);
    });

    // Add animation styles
    if (!document.querySelector('#animation-styles')) {
      const styles = document.createElement('style');
      styles.id = 'animation-styles';
      styles.textContent = `
        .feature-card,
        .stat-item,
        .contact-form {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .feature-card.animate-in,
        .stat-item.animate-in,
        .contact-form.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        .feature-card:nth-child(2).animate-in {
          transition-delay: 0.1s;
        }
        .feature-card:nth-child(3).animate-in {
          transition-delay: 0.2s;
        }
        .stat-item:nth-child(2).animate-in {
          transition-delay: 0.1s;
        }
        .stat-item:nth-child(3).animate-in {
          transition-delay: 0.2s;
        }
        .header.scrolled {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        }
      `;
      document.head.appendChild(styles);
    }
  }

  handleScroll() {
    // Throttle scroll events for performance
    if (!this.scrollTimeout) {
      this.scrollTimeout = setTimeout(() => {
        this.scrollTimeout = null;
        // Additional scroll-based animations can be added here
      }, 16); // ~60fps
    }
  }

  handleResize() {
    // Handle responsive adjustments
    const menu = document.querySelector('.menu');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (window.innerWidth > 768) {
      menu?.classList.remove('active');
      mobileToggle?.classList.remove('active');
      mobileToggle?.setAttribute('aria-expanded', 'false');
    }
  }
}

// Initialize the landing page
const landingPage = new LandingPage();

// Export for potential testing or external access
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LandingPage;
}
