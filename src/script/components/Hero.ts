import { Helpers } from '../utils/helpers';
import { ContentService } from '../services/ContentService';

export class Hero {
    private element: HTMLElement;
    private visitorName: string = '';
    private contentService: ContentService;

    constructor(visitorName: string = '') {
        this.visitorName = visitorName;
        this.contentService = ContentService.getInstance();
        this.element = this.createHero();
    }

    private createHero(): HTMLElement {
        const hero = document.createElement('div');
        hero.className = 'hero';
        hero.id = 'hero';
        
        const greeting = this.visitorName ? Helpers.getGreeting(this.visitorName) : '';
        const heroInfo = this.contentService.getHeroInfo();
        
        hero.innerHTML = `
            <div class="hero-content">
                <div class="greeting-message" id="greetingMessage">${greeting}</div>
                <div class="hero-badge">${heroInfo.badge || '✨ Open to Data Analyst opportunities'}</div>
                <h1>Hi, I'm <span>Vasanthaprakash E</span></h1>
                <div class="hero-title">${heroInfo.title || 'MIS Executive → Data Analyst | SQL | Power BI | Python'}</div>
                <p class="hero-description">
                    I work on reporting, dashboards, SQL analysis, automation, and chatbot-related workflows 
                    to turn raw operational data into useful business insights and smarter decisions.
                </p>
                <div class="hero-stats">
                    ${this.getStatsHTML(heroInfo.stats)}
                </div>
                <div class="hero-buttons">
                    <button class="btn-primary" data-section="projects">View My Work <i class="fas fa-arrow-right"></i></button>
                    <button class="btn-secondary" data-section="contact">Let's Talk <i class="fas fa-comment"></i></button>
                </div>
            </div>
            <div class="hero-image">
                <div class="circle"><i class="fas fa-chart-line"></i></div>
            </div>
        `;
        
        this.attachEventListeners();
        return hero;
    }

    private getStatsHTML(stats: any[]): string {
        if (!stats || stats.length === 0) {
            return `
                <div class="stat-item"><h3>2+</h3><p>Years Experience</p></div>
                <div class="stat-item"><h3>10+</h3><p>Reports / Workflows</p></div>
                <div class="stat-item"><h3>SQL</h3><p>Strongest Skill</p></div>
            `;
        }
        
        return stats.map(stat => `
            <div class="stat-item"><h3>${stat.value}</h3><p>${stat.label}</p></div>
        `).join('');
    }

    private attachEventListeners(): void {
        const buttons = this.element.querySelectorAll('.btn-primary, .btn-secondary');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const section = button.getAttribute('data-section');
                if (section) {
                    Helpers.scrollToSection(section);
                }
            });
        });
    }

    updateGreeting(name: string): void {
        this.visitorName = name;
        const greetingElement = this.element.querySelector('#greetingMessage');
        if (greetingElement) {
            greetingElement.innerHTML = Helpers.getGreeting(name);
        }
    }

    render(): HTMLElement {
        return this.element;
    }
}