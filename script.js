class ModernPortfolio {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initScrollAnimations();
    this.initCursorFollower();
    this.initNavProgress();
    this.initStatsCounter();
    this.initSkillBars();
    this.initSmoothScrolling();
    this.initFormValidation();
    this.initLazyLoading();
    this.initAccessibility();
  }

  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.preloadCriticalResources();
      this.optimizeInitialRender();
    });

    window.addEventListener('scroll', this.debounce(this.handleScroll.bind(this), 16));
    window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    window.addEventListener('load', this.handleLoad.bind(this));

    document.addEventListener('keydown', this.handleKeydown.bind(this));
    
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.initParallaxEffects();
    }
  }


  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          this.scrollObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-text');
    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${index * 0.1}s`;
      this.scrollObserver.observe(element);
    });
  }

  initCursorFollower() {
    if (!window.matchMedia('(hover: hover)').matches) return;

    const cursor = document.querySelector('.cursor-follower');
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateCursor = () => {
      const distX = mouseX - cursorX;
      const distY = mouseY - cursorY;
      
      cursorX += distX * 0.1;
      cursorY += distY * 0.1;
      
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-category');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform += ' scale(1.5)';
        cursor.style.mixBlendMode = 'exclusion';
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
        cursor.style.mixBlendMode = 'difference';
      });
    });
  }

  initNavProgress() {
    const progressBar = document.querySelector('.nav-progress');
    if (!progressBar) return;

    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      progressBar.style.width = `${scrollPercent}%`;
    };

    window.addEventListener('scroll', this.throttle(updateProgress, 16));
  }

  initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateNumber(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
      statsObserver.observe(stat);
    });
  }

  animateNumber(element) {
    const target = parseInt(element.dataset.count);
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const startTime = performance.now();

    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      current = Math.floor(target * this.easeOutCubic(progress));
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(updateNumber);
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progress = entry.target.dataset.progress;
          setTimeout(() => {
            entry.target.style.width = `${progress}%`;
          }, 200);
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
      skillObserver.observe(bar);
    });
  }

  initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  initFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    
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

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        this.submitForm(form);
      }
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    this.clearFieldError(field);

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    } else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'field-error';
      field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    
    field.style.borderColor = 'var(--secondary-color)';
  }

  clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  async submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.showNotification('Message sent successfully!', 'success');
      form.reset();
      
    } catch (error) {
      this.showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? 'var(--accent-color)' : 'var(--secondary-color)'};
      color: white;
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform var(--transition-normal);
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }


  handleScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const scrolled = window.pageYOffset;
    
    if (scrolled > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  handleResize() {
    this.updateViewportHeight();
  }

  handleLoad() {
    document.body.classList.add('loaded');
    this.initIntersectionObservers();
  }

  handleKeydown(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  }

  initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.floating-shapes .shape');
    
    const handleParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${rate * speed}px) rotate(${rate * 0.1}deg)`;
      });
    };

    window.addEventListener('scroll', this.throttle(handleParallax, 16));
  }

  initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  initAccessibility() {
    document.querySelectorAll('button, a, [tabindex]').forEach(element => {
      if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
        console.warn('Interactive element missing accessible label:', element);
      }
    });

  }

  initIntersectionObservers() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
          
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
          });
          
          if (navLink) {
            navLink.classList.add('active');
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('section[id]').forEach(section => {
      sectionObserver.observe(section);
    });
  }

  updateViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  preloadCriticalResources() {
    const criticalImages = document.querySelectorAll('img[loading="eager"]');
    criticalImages.forEach(img => {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = img.src;
      document.head.appendChild(preloadLink);
    });
  }

  optimizeInitialRender() {
    document.fonts.ready.then(() => {
      document.body.classList.add('fonts-loaded');
    });

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.initNonCriticalFeatures();
      });
    } else {
      setTimeout(() => {
        this.initNonCriticalFeatures();
      }, 1000);
    }
  }

  initNonCriticalFeatures() {
    this.initServiceWorker();
    this.initAnalytics();
  }

  initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }

  initAnalytics() {
    console.log('Analytics initialized');
  }
}

const additionalStyles = `
  .field-error {
    color: var(--secondary-color);
    font-size: var(--font-size-sm);
    margin-top: 0.25rem;
    display: block;
  }
  
  .keyboard-nav *:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .floating-shapes .shape {
      animation: none !important;
    }
    
    .skill-progress::after {
      animation: none !important;
    }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

new ModernPortfolio();