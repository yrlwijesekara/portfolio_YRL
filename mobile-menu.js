// Simple Sidebar Menu
class SimpleSidebarMenu {
    constructor() {
        this.init();
    }

    init() {
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
        }
    }

    setupEventListeners() {
        // Toggle sidebar on hamburger click
        this.navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleSidebar();
        });

        // Handle navigation link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close sidebar and navigate
                this.closeSidebar();
            });
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navMenu.classList.contains('sidebar-open') && 
                !this.navToggle.contains(e.target) && 
                !this.navMenu.contains(e.target)) {
                this.closeSidebar();
            }
        });
    }

    toggleSidebar() {
        if (this.navMenu.classList.contains('sidebar-open')) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        this.navMenu.classList.add('sidebar-open');
        this.menuIcon.className = 'bi bi-x-lg';
        document.body.classList.add('sidebar-active');
    }

    closeSidebar() {
        this.navMenu.classList.remove('sidebar-open');
        this.menuIcon.className = 'bi bi-list';
        document.body.classList.remove('sidebar-active');
    }
}

// Initialize simple sidebar menu
new SimpleSidebarMenu();