import { ContentService } from '../services/ContentService';

export class Experience {
    private element: HTMLElement;
    private contentService: ContentService;

    constructor() {
        this.contentService = ContentService.getInstance();
        this.element = this.createExperience();
    }

    private createExperience(): HTMLElement {
        const section = document.createElement('div');
        section.className = 'section';
        section.id = 'experience';
        
        const experiences = this.contentService.getExperiences();
        
        section.innerHTML = `
            <div class="section-header">
                <div class="section-tag">Career Path</div>
                <h2>Work Experience</h2>
                <p>My current role and how it connects to my transition into Data Analytics.</p>
            </div>
            <div class="timeline">
                ${this.getTimelineItems(experiences)}
            </div>
        `;
        
        return section;
    }

    private getTimelineItems(experiences: any[]): string {
        if (experiences.length === 0) {
            return '<p>No experience entries yet. Check back soon!</p>';
        }
        
        return experiences.map(exp => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-date">${exp.period}</div>
                <div class="timeline-title">${exp.title}</div>
                <div class="timeline-company">${exp.company} · ${exp.location}</div>
                <div class="timeline-description">
                    ${exp.description}
                    <ul>
                        ${exp.achievements.map((achievement: string) => `<li>${achievement}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    }

    render(): HTMLElement {
        return this.element;
    }
}