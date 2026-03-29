import { Helpers } from '../utils/helpers';

export class Navbar {
    private element: HTMLElement;

    constructor() {
        this.element = this.createNavbar();
    }

    private createNavbar(): HTMLElement {
        const nav = document.createElement('nav');
        nav.className = 'navbar';
        nav.id = 'navbar';
        
        nav.innerHTML = `
            <div class="nav-container">
                <a class="logo" href="#" id="logoLink">
                    <div class="logo-wrapper">
                        <div class="logo-circle">
                            <img src="assets/images/logo.png" 
                                 alt="VP DataLab" 
                                 class="logo-image"
                                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'45\' height=\'45\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%2314B8A6\'/%3E%3Ctext x=\'50\' y=\'67\' font-size=\'40\' text-anchor=\'middle\' fill=\'white\' font-family=\'Arial\'%3EVP%3C/text%3E%3C/svg%3E'">
                        </div>
                        <div class="logo-text">
                            <span class="logo-main">Vasanthaprakash</span>
                            <span class="logo-tagline">Data Analytics</span>
                        </div>
                    </div>
                </a>
                <div class="nav-links">
                    <a data-section="about">About</a>
                    <a data-section="experience">Experience</a>
                    <a data-section="projects">Projects</a>
                    <a data-section="blogs">Blogs</a>
                    <a data-section="contact">Contact</a>
                    <button class="nav-btn" id="resumeBtn">Resume</button>
                </div>
                <div class="mobile-menu-btn" id="mobileMenuBtn">
                    <i class="fas fa-bars"></i>
                </div>
            </div>
            <div class="mobile-nav-links" id="mobileNavLinks">
                <a data-section="about">About</a>
                <a data-section="experience">Experience</a>
                <a data-section="projects">Projects</a>
                <a data-section="blogs">Blogs</a>
                <a data-section="contact">Contact</a>
                <button class="nav-btn" id="mobileResumeBtn">Resume</button>
            </div>
        `;

        this.attachEventListeners(nav);
        return nav;
    }

    private attachEventListeners(nav: HTMLElement): void {
        // Desktop navigation
        const links = nav.querySelectorAll('.nav-links a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                if (section) {
                    Helpers.scrollToSection(section);
                    this.closeMobileMenu();
                }
            });
        });

        // Mobile navigation
        const mobileLinks = nav.querySelectorAll('.mobile-nav-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                if (section) {
                    Helpers.scrollToSection(section);
                    this.closeMobileMenu();
                }
            });
        });

        const logoLink = nav.querySelector('#logoLink');
        if (logoLink) {
            logoLink.addEventListener('click', (e) => {
                e.preventDefault();
                Helpers.scrollToSection('hero');
                this.closeMobileMenu();
            });
        }

        const resumeBtn = nav.querySelector('#resumeBtn');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => {
                Helpers.showToast('📄 Resume download feature coming soon!');
            });
        }

        const mobileResumeBtn = nav.querySelector('#mobileResumeBtn');
        if (mobileResumeBtn) {
            mobileResumeBtn.addEventListener('click', () => {
                Helpers.showToast('📄 Resume download feature coming soon!');
                this.closeMobileMenu();
            });
        }

        const mobileMenuBtn = nav.querySelector('#mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    }

    private toggleMobileMenu(): void {
        const mobileNav = this.element.querySelector('#mobileNavLinks');
        if (mobileNav) {
            mobileNav.classList.toggle('show');
        }
    }

    private closeMobileMenu(): void {
        const mobileNav = this.element.querySelector('#mobileNavLinks');
        if (mobileNav) {
            mobileNav.classList.remove('show');
        }
    }

    render(): HTMLElement {
        return this.element;
    }
}