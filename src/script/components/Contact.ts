import { ContentService } from '../services/ContentService';
import { Helpers } from '../utils/helpers';

export class Contact {
    private element: HTMLElement;
    private contentService: ContentService;

    constructor() {
        this.contentService = ContentService.getInstance();
        this.element = this.createContact();
    }

    private createContact(): HTMLElement {
        const section = document.createElement('div');
        section.className = 'contact-section';
        section.id = 'contact';
        
        const social = this.contentService.getSocialLinks();
        const contact = this.contentService.getContactInfo();
        
        section.innerHTML = `
            <h2>Let's Connect</h2>
            <p>
                I'm open to opportunities in ${contact.preferredRoles.join(', ')} roles.
            </p>
            <div class="contact-info">
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <a href="mailto:${social.email}">${social.email}</a>
                </div>
                <div class="contact-item">
                    <i class="fab fa-linkedin"></i>
                    <a href="${social.linkedin}" target="_blank">linkedin.com/in/vasanthaprakash-e</a>
                </div>
                <div class="contact-item">
                    <i class="fab fa-github"></i>
                    <a href="${social.github}" target="_blank">github.com/VasanthaprakashE</a>
                </div>
            </div>
            <div class="contact-buttons">
                <a href="mailto:${social.email}" class="btn-primary" style="background: white; color: #1f2937;">
                    Email Me <i class="fas fa-paper-plane"></i>
                </a>
                <a href="${social.linkedin}" target="_blank" class="btn-outline" style="border-color: white; color: white;">
                    Connect on LinkedIn
                </a>
            </div>
        `;
        
        return section;
    }

    render(): HTMLElement {
        return this.element;
    }
}