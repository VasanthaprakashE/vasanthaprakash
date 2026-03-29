import { ContentService } from '../services/ContentService';

export class About {
    private element: HTMLElement;
    private contentService: ContentService;

    constructor() {
        this.contentService = ContentService.getInstance();
        this.element = this.createAbout();
        this.animateSkills();
    }

    private createAbout(): HTMLElement {
        const section = document.createElement('div');
        section.className = 'section';
        section.id = 'about';
        
        const skills = this.contentService.getSkills();
        const social = this.contentService.getSocialLinks();
        const contact = this.contentService.getContactInfo();
        
        section.innerHTML = `
            <div class="section-header">
                <div class="section-tag">About Me</div>
                <h2>Who I Am</h2>
                <p>A practical data professional focused on business reporting, SQL analysis, dashboards, and automation.</p>
            </div>
            <div class="about-grid">
                <div class="about-text">
                    <p>
                        I'm currently working as an <strong>MIS Executive</strong> and actively transitioning into a 
                        <strong>Data Analyst</strong> role. My day-to-day work involves handling reports, validating 
                        operational data, preparing dashboards, and improving reporting workflows.
                    </p>
                    <p>
                        I'm strongest in <strong>SQL</strong> and comfortable working with <strong>Power BI, Python, 
                        Excel, Google Sheets, and process automation</strong>. I also support <strong>AI Sensy 
                        chatbot-related workflows</strong>, including template handling, campaign coordination, 
                        and communication process support.
                    </p>
                    <p>
                        My goal is simple: <strong>make data clean, useful, and decision-ready.</strong>
                    </p>
                    <div class="about-info">
                        <div class="info-item">
                            <div class="info-icon"><i class="fas fa-map-marker-alt"></i></div>
                            <div><strong>Location</strong><br>${contact.location}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-icon"><i class="fas fa-envelope"></i></div>
                            <div><strong>Email</strong><br>${social.email}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-icon"><i class="fab fa-github"></i></div>
                            <div><strong>GitHub</strong><br>${social.github.split('/').pop()}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-icon"><i class="fab fa-linkedin"></i></div>
                            <div><strong>LinkedIn</strong><br>${social.linkedin.split('/').pop()}</div>
                        </div>
                    </div>
                </div>
                <div class="about-stats">
                    ${skills.map(skill => `
                        <div class="skill-bar-item">
                            <div class="skill-info">
                                <span>${skill.name}</span>
                                <span>${skill.percentage}%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress" data-width="${skill.percentage}"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        return section;
    }

    private animateSkills(): void {
        setTimeout(() => {
            const progressBars = this.element.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                if (width) {
                    (bar as HTMLElement).style.width = width + '%';
                }
            });
        }, 500);
    }

    render(): HTMLElement {
        return this.element;
    }
}