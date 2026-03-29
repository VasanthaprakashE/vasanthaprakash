import { ContentService } from '../services/ContentService';

export class Projects {
    private element: HTMLElement;
    private contentService: ContentService;

    constructor() {
        this.contentService = ContentService.getInstance();
        this.element = this.createProjects();
    }

    private createProjects(): HTMLElement {
        const section = document.createElement('div');
        section.className = 'section';
        section.id = 'projects';
        
        const projects = this.contentService.getProjects(true); // Get featured projects only
        
        section.innerHTML = `
            <div class="section-header">
                <div class="section-tag">Portfolio</div>
                <h2>Featured Projects</h2>
                <p>Real-world work and practical projects that reflect my current data analyst journey.</p>
            </div>
            <div class="projects-grid">
                ${this.getProjectCards(projects)}
            </div>
        `;
        
        return section;
    }

    private getProjectCards(projects: any[]): string {
        if (projects.length === 0) {
            return '<p>No projects to display. Check back soon!</p>';
        }
        
        return projects.map(project => `
            <div class="project-card">
                <div class="project-image"><i class="fas ${project.icon}"></i></div>
                <div class="project-content">
                    <div class="project-title">${project.title}</div>
                    <div class="project-description">${project.description}</div>
                    <div class="project-tech">
                        ${project.technologies.map((tech: string) => `<span>${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${project.github ? `<a href="${project.github}" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
                        ${project.demo ? `<a href="${project.demo}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                        ${!project.github && !project.demo ? `<a href="#"><i class="fas fa-briefcase"></i> Internal Project</a>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    render(): HTMLElement {
        return this.element;
    }
}