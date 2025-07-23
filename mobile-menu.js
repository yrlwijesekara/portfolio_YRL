// Mobile Menu Functionality
class MobileMenu {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupMenu());
        } else {
            this.setupMenu();
        }
    }

    setupMenu() {
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.menuIcon = document.getElementById('menuIcon');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        if (this.navToggle && this.navMenu && this.menuIcon) {
            this.setupEventListeners();
            console.log('Mobile menu initialized successfully');
        } else {
            console.error('Mobile menu elements not found');
        }
    }

    setupEventListeners() {
        // Toggle menu on hamburger click
        this.navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMenu();
        });

        // Handle navigation link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Get the href attribute
                const href = link.getAttribute('href');
                
                console.log('Menu link clicked:', href);
                
                // Close the menu immediately
                this.closeMenu();
                
                // Allow natural navigation to occur
                // The browser will handle the redirect automatically
                
                // Small delay to ensure menu closes smoothly
                setTimeout(() => {
                    console.log('Navigating to:', href);
                }, 100);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navMenu.classList.contains('active') && 
                !this.navToggle.contains(e.target) && 
                !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Close menu on window resize (when switching to desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const isOpen = this.navMenu.classList.contains('active');
        
        if (isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        console.log('Opening mobile menu');
        this.navMenu.classList.add('active');
        this.menuIcon.className = 'bi bi-x-lg';
        document.body.style.overflow = 'hidden';
        this.navToggle.setAttribute('aria-expanded', 'true');
        
        // Add active class to body for additional styling if needed
        document.body.classList.add('menu-open');
    }

    closeMenu() {
        console.log('Closing mobile menu');
        this.navMenu.classList.remove('active');
        this.menuIcon.className = 'bi bi-list';
        document.body.style.overflow = '';
        this.navToggle.setAttribute('aria-expanded', 'false');
        
        // Remove active class from body
        document.body.classList.remove('menu-open');
    }
}

// Initialize mobile menu
new MobileMenu();