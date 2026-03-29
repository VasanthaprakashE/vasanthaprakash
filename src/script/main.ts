import '../styles/main.css';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Blogs } from './components/Blogs';
import { Contact } from './components/Contact';
import { WelcomeModal } from './components/WelcomeModal';
import { AnalyticsService } from './services/AnalyticsService';
import { ContentService } from './services/ContentService';
import { StorageService } from './services/StorageService';
import { Helpers } from './utils/helpers';

class PortfolioApp {
    private appContainer: HTMLElement;
    private navbar: Navbar;
    private hero: Hero;
    private about: About;
    private experience: Experience;
    private projects: Projects;
    private blogs: Blogs;
    private contact: Contact;
    private welcomeModal: WelcomeModal;
    private analytics: AnalyticsService;
    private contentService: ContentService;

    constructor() {
        this.appContainer = document.getElementById('app') || document.body;
        this.contentService = ContentService.getInstance();
        this.navbar = new Navbar();
        this.hero = new Hero();
        this.about = new About();
        this.experience = new Experience();
        this.projects = new Projects();
        this.blogs = new Blogs();
        this.contact = new Contact();
        this.welcomeModal = new WelcomeModal();
        this.analytics = AnalyticsService.getInstance();
        
        this.init();
    }

    private async init(): Promise<void> {
        this.render();
        this.setupEventListeners();
        this.setupScrollHandlers();
        this.trackAnalytics();
        this.checkForExistingVisitor();
        this.loadDynamicContent();
    }

    private render(): void {
        // Clear container
        this.appContainer.innerHTML = '';
        
        // Append all components
        this.appContainer.appendChild(this.navbar.render());
        this.appContainer.appendChild(this.hero.render());
        this.appContainer.appendChild(this.about.render());
        this.appContainer.appendChild(this.experience.render());
        this.appContainer.appendChild(this.projects.render());
        this.appContainer.appendChild(this.blogs.render());
        this.appContainer.appendChild(this.contact.render());
        
        // Add footer
        this.appContainer.appendChild(this.createFooter());
        
        // Add back to top button
        this.appContainer.appendChild(this.createBackToTopButton());
        
        // Add welcome modal
        this.appContainer.appendChild(this.welcomeModal.render());
    }

    private createFooter(): HTMLElement {
        const footer = document.createElement('div');
        footer.className = 'footer';
        footer.innerHTML = `
            <div class="footer-content">
                <p>© ${new Date().getFullYear()} Vasanthaprakash E | VP DataLab — Transforming raw data into clear reports, dashboards, and decisions.</p>
                <div class="footer-links">
                    <a href="#" data-section="privacy">Privacy Policy</a>
                    <a href="#" data-section="terms">Terms of Use</a>
                </div>
            </div>
        `;
        
        const links = footer.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                Helpers.showToast('Coming soon!');
            });
        });
        
        return footer;
    }

    private createBackToTopButton(): HTMLElement {
        const button = document.createElement('button');
        button.className = 'back-to-top';
        button.id = 'backToTop';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        return button;
    }

    private setupEventListeners(): void {
        // Handle scroll for back to top button visibility
        window.addEventListener('scroll', () => {
            const backToTop = document.getElementById('backToTop');
            if (backToTop) {
                if (window.scrollY > 300) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            }
        });

        // Handle escape key for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.querySelector<HTMLElement>('.modal-overlay');
                if (modal && modal.style.display === 'flex') {
                    modal.style.display = 'none';
                }
            }
        });
    }

    private setupScrollHandlers(): void {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateNavbarOnScroll();
                    this.updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    private updateNavbarOnScroll(): void {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    private updateActiveSection(): void {
        const sections = ['hero', 'about', 'experience', 'projects', 'blogs', 'contact'];
        const scrollPosition = window.scrollY + 100;
        
        for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const offsetTop = element.offsetTop;
                const offsetBottom = offsetTop + element.offsetHeight;
                
                if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                    this.updateActiveNavLink(section);
                    break;
                }
            }
        }
    }

    private updateActiveNavLink(sectionId: string): void {
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
        navLinks.forEach(link => {
            const linkSection = link.getAttribute('data-section');
            if (linkSection === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    private trackAnalytics(): void {
        this.analytics.trackPageView('Home');
        
        // Track section views when they come into viewport
        const sections = ['about', 'experience', 'projects', 'blogs', 'contact'];
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.analytics.trackEvent('Section View', entry.target.id);
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) observer.observe(section);
        });
        
        // Track time on page
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            this.analytics.trackEvent('Session', 'Time Spent', `${timeSpent} seconds`);
        });
    }

    private checkForExistingVisitor(): void {
        const existingVisitor = StorageService.getData<{name: string, timestamp: string}>('visitorData_backup');
        if (existingVisitor && existingVisitor.name) {
            // Update greeting for returning visitor
            this.hero.updateGreeting(existingVisitor.name);
        }
    }

    private async loadDynamicContent(): Promise<void> {
        try {
            // Try to load from localStorage first (admin panel updates)
            const localProjects = localStorage.getItem('projects_data');
            const localBlogs = localStorage.getItem('blogs_data');
            
            if (localProjects || localBlogs) {
                await this.contentService.refreshContent();
                // Re-render components with new content
                this.refreshComponents();
            }
        } catch (error) {
            console.error('Failed to load dynamic content:', error);
        }
    }

    private refreshComponents(): void {
        // Refresh components that depend on content
        const newProjects = new Projects();
        const newBlogs = new Blogs();
        const newAbout = new About();
        
        const projectsSection = document.getElementById('projects');
        const blogsSection = document.getElementById('blogs');
        const aboutSection = document.getElementById('about');
        
        if (projectsSection && projectsSection.parentNode) {
            projectsSection.parentNode.replaceChild(newProjects.render(), projectsSection);
        }
        
        if (blogsSection && blogsSection.parentNode) {
            blogsSection.parentNode.replaceChild(newBlogs.render(), blogsSection);
        }
        
        if (aboutSection && aboutSection.parentNode) {
            aboutSection.parentNode.replaceChild(newAbout.render(), aboutSection);
        }
    }
}

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PortfolioApp();
    });
} else {
    new PortfolioApp();
}