import { GoogleSheetsService } from '../services/GoogleSheetsService';
import { Helpers } from '../utils/helpers';

export class FeedbackPopup {
    private element: HTMLElement;
    private selectedRating: number = 0;
    private visitorName: string;

    constructor(visitorName: string) {
        this.visitorName = visitorName;
        this.element = this.createPopup();
        this.attachEventListeners();
    }

    private createPopup(): HTMLElement {
        const popup = document.createElement('div');
        popup.className = 'feedback-popup-overlay';
        popup.id = 'feedbackPopup';
        
        popup.innerHTML = `
            <div class="feedback-modal">
                <div class="feedback-icon">💬</div>
                <h3>How's your experience?</h3>
                <p>Your feedback helps me improve this portfolio!</p>
                <div class="star-rating" id="starRating">
                    <i class="fas fa-star star" data-rating="1"></i>
                    <i class="fas fa-star star" data-rating="2"></i>
                    <i class="fas fa-star star" data-rating="3"></i>
                    <i class="fas fa-star star" data-rating="4"></i>
                    <i class="fas fa-star star" data-rating="5"></i>
                </div>
                <textarea id="feedbackMessage" class="feedback-textarea" rows="3" 
                          placeholder="Share your thoughts..."></textarea>
                <button class="feedback-submit-btn" id="submitFeedback">Send Feedback ✨</button>
                <div class="feedback-later" id="laterFeedback">Maybe later</div>
            </div>
        `;
        
        return popup;
    }

    private attachEventListeners(): void {
        const stars = this.element.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                this.selectedRating = parseInt(star.getAttribute('data-rating') || '0');
                this.updateStarColors(this.selectedRating);
            });
            
            star.addEventListener('mouseenter', () => {
                const rating = parseInt(star.getAttribute('data-rating') || '0');
                this.updateStarColors(rating);
            });
        });
        
        this.element.addEventListener('mouseleave', () => {
            this.updateStarColors(this.selectedRating);
        });
        
        const submitBtn = this.element.querySelector('#submitFeedback');
        submitBtn?.addEventListener('click', () => this.submitFeedback());
        
        const laterBtn = this.element.querySelector('#laterFeedback');
        laterBtn?.addEventListener('click', () => this.close());
    }

    private updateStarColors(rating: number): void {
        const stars = this.element.querySelectorAll('.star');
        stars.forEach((star, index) => {
            (star as HTMLElement).style.color = index < rating ? '#fbbf24' : '#d1d5db';
        });
    }

    private async submitFeedback(): Promise<void> {
        const messageInput = this.element.querySelector('#feedbackMessage') as HTMLTextAreaElement;
        const message = messageInput?.value || '';
        
        if (this.selectedRating === 0) {
            Helpers.showToast('Please select a rating before submitting', true);
            return;
        }
        
        const feedbackData = {
            rating: this.selectedRating,
            message: message,
            visitorName: this.visitorName,
            timestamp: new Date().toISOString()
        };
        
        await GoogleSheetsService.saveFeedback(feedbackData);
        Helpers.showToast('🙏 Thanks for your feedback!');
        this.close();
    }

    private close(): void {
        this.element.style.opacity = '0';
        setTimeout(() => {
            this.element.remove();
        }, 300);
    }

    render(): HTMLElement {
        return this.element;
    }
}