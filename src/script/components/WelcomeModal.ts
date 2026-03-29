import { VisitorData, HiringDetails, DevDetails } from '../types';
import { Helpers } from '../utils/helpers';
import { Validators } from '../utils/validators';
import { GoogleSheetsService } from '../services/GoogleSheetsService';
const FeedbackPopupClass = require('./FeedbackPopup').FeedbackPopup;

export class WelcomeModal {
    private element: HTMLElement;
    private currentStep: number = 1;
    private visitorData: Partial<VisitorData> = {};
    private selectedInterests: string[] = [];

    constructor() {
        this.element = this.createModal();
        this.attachEventListeners();
    }

    private createModal(): HTMLElement {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'welcomeModal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal">
                <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
                <button class="modal-close" id="modalClose">&times;</button>
                
                <div class="modal-step active" id="step1">
                    <h2>👋 Welcome!</h2>
                    <p>Please introduce yourself - this helps me personalize your experience</p>
                    <div class="form-group">
                        <label>Your Full Name *</label>
                        <input type="text" id="visitorNameInput" placeholder="Enter your full name" required autocomplete="name">
                    </div>
                    <div class="form-group">
                        <label>Professional Role *</label>
                        <select id="professionType" required>
                            <option value="" disabled selected>Select your role</option>
                            <option value="Hiring Manager">🎯 Hiring Manager / Recruiter</option>
                            <option value="Tech Lead">👨‍💻 Tech Lead / Engineering Manager</option>
                            <option value="CTO">🚀 CTO / VP Engineering</option>
                            <option value="Data Analyst">📊 Data Analyst / Business Analyst</option>
                            <option value="Student">🎓 Student / Bootcamp Graduate</option>
                            <option value="Founder">🌟 Founder / Entrepreneur</option>
                            <option value="Other">✨ Other</option>
                        </select>
                    </div>
                    <div class="button-group">
                        <button class="next-btn" data-step="1">Continue →</button>
                    </div>
                </div>
                
                <div class="modal-step" id="step2">
                    <h2 id="step2Title">Tell me more</h2>
                    <p id="step2Description">This helps me tailor my response to you</p>
                    <div id="step2Content"></div>
                    <div class="button-group">
                        <button class="back-btn" data-step="2">← Back</button>
                        <button class="next-btn" data-step="2">Continue →</button>
                    </div>
                </div>
                
                <div class="modal-step" id="step3">
                    <h2>What brings you here today?</h2>
                    <p>Select your interests (multiple allowed)</p>
                    <div class="interest-tags" id="interestTags">
                        <span class="interest-tag" data-interest="Hiring">🎯 Hiring / Recruitment</span>
                        <span class="interest-tag" data-interest="Collaboration">🤝 Collaboration</span>
                        <span class="interest-tag" data-interest="Mentorship">📚 Mentorship</span>
                        <span class="interest-tag" data-interest="Technical">💡 Technical Discussion</span>
                        <span class="interest-tag" data-interest="Portfolio">🎨 Portfolio Feedback</span>
                        <span class="interest-tag" data-interest="Speaking">🎤 Speaking Opportunity</span>
                    </div>
                    <div class="form-group" style="margin-top: 24px;">
                        <label>Any specific questions or comments? (Optional)</label>
                        <textarea id="visitorMessage" rows="3" placeholder="I'd love to hear what you're thinking..."></textarea>
                    </div>
                    <div class="button-group">
                        <button class="back-btn" data-step="3">← Back</button>
                        <button class="submit-btn" id="finalSubmitBtn">Submit & Explore →</button>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }

    private attachEventListeners(): void {
        const nextBtns = this.element.querySelectorAll('.next-btn');
        const backBtns = this.element.querySelectorAll('.back-btn');
        const submitBtn = this.element.querySelector('#finalSubmitBtn');
        const closeBtn = this.element.querySelector('#modalClose');

        nextBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const step = parseInt((e.target as HTMLElement).getAttribute('data-step') || '0');
                this.nextStep(step);
            });
        });

        backBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const step = parseInt((e.target as HTMLElement).getAttribute('data-step') || '0');
                this.prevStep(step);
            });
        });

        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitForm());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
    }

    private updateProgress(): void {
        const progressFill = this.element.querySelector('#progressFill') as HTMLElement;
        if (progressFill) {
            progressFill.style.width = (this.currentStep / 3) * 100 + '%';
        }
    }

    private showStep(step: number): void {
        const steps = this.element.querySelectorAll('.modal-step');
        steps.forEach((el, index) => {
            if (index + 1 === step) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
        this.currentStep = step;
        this.updateProgress();
    }

    private updateStep2Content(): void {
        const profession = (this.element.querySelector('#professionType') as HTMLSelectElement)?.value;
        const step2Content = this.element.querySelector('#step2Content') as HTMLElement;
        const step2Title = this.element.querySelector('#step2Title') as HTMLElement;
        const step2Desc = this.element.querySelector('#step2Description') as HTMLElement;

        if (!step2Content || !step2Title || !step2Desc) return;

        if (profession === 'Hiring Manager' || profession === 'Tech Lead' || profession === 'CTO') {
            step2Title.innerHTML = '🎯 Hiring Opportunity';
            step2Desc.innerHTML = 'I\'d love to learn about the opportunity';
            step2Content.innerHTML = `
                <div class="form-group">
                    <label>What role are you hiring for?</label>
                    <select id="hiringRole">
                        <option>Data Analyst</option>
                        <option>Senior Data Analyst</option>
                        <option>Business Analyst</option>
                        <option>MIS Analyst</option>
                        <option>Reporting Analyst</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Company / Organization</label>
                    <input type="text" id="companyName" placeholder="Company name" autocomplete="organization">
                </div>
                <div class="form-group">
                    <label>Additional details (optional)</label>
                    <textarea id="hiringDetails" rows="3" placeholder="Any specific requirements or timeline?"></textarea>
                </div>`;
        } else if (profession === 'Data Analyst') {
            step2Title.innerHTML = '📊 Fellow Data Professional';
            step2Desc.innerHTML = 'Would you like to collaborate or connect?';
            step2Content.innerHTML = `
                <div class="form-group">
                    <label>What brings you here?</label>
                    <select id="devInterest">
                        <option>Collaboration on projects</option>
                        <option>Learning about reporting workflows</option>
                        <option>Networking</option>
                        <option>SQL / Power BI discussion</option>
                        <option>Code review / Feedback</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Your primary tools</label>
                    <input type="text" id="techStack" placeholder="e.g., SQL, Power BI, Python, Tableau">
                </div>
                <div class="form-group">
                    <label>Years of experience</label>
                    <input type="number" id="yearsExp" placeholder="Years in data field">
                </div>`;
        } else if (profession === 'Student') {
            step2Title.innerHTML = '🎓 Student / Learner';
            step2Desc.innerHTML = 'I\'d love to help you on your data journey';
            step2Content.innerHTML = `
                <div class="form-group">
                    <label>What are you studying?</label>
                    <input type="text" id="courseStudy" placeholder="e.g., Data Science, Computer Science">
                </div>
                <div class="form-group">
                    <label>What would you like to learn?</label>
                    <textarea id="learningGoals" rows="3" placeholder="SQL, Power BI, Python, Reporting..."></textarea>
                </div>`;
        } else {
            step2Title.innerHTML = '✨ Tell me more';
            step2Desc.innerHTML = 'What brings you to my portfolio?';
            step2Content.innerHTML = `
                <div class="form-group">
                    <label>Your reason for visiting</label>
                    <textarea id="otherReason" rows="3" placeholder="I'd love to hear from you..."></textarea>
                </div>`;
        }
    }

    private setupInterestTags(): void {
        const tags = this.element.querySelectorAll('.interest-tag');
        tags.forEach(tag => {
            tag.addEventListener('click', () => {
                const interest = tag.getAttribute('data-interest');
                if (tag.classList.contains('selected')) {
                    tag.classList.remove('selected');
                    this.selectedInterests = this.selectedInterests.filter(i => i !== interest);
                } else {
                    tag.classList.add('selected');
                    if (interest) this.selectedInterests.push(interest);
                }
            });
        });
    }

    private nextStep(current: number): void {
        if (current === 1) {
            const nameInput = this.element.querySelector('#visitorNameInput') as HTMLInputElement;
            const professionSelect = this.element.querySelector('#professionType') as HTMLSelectElement;
            
            const name = nameInput?.value.trim() || '';
            const profession = professionSelect?.value || '';
            
            if (!name || !profession) {
                Helpers.showToast('Please fill in all fields', true);
                return;
            }
            
            if (!Validators.validateName(name)) {
                Helpers.showToast('Please enter a valid name (2-100 characters)', true);
                return;
            }
            
            this.visitorData.name = Validators.sanitizeInput(name);
            this.visitorData.profession = profession;
            this.updateStep2Content();
            this.showStep(2);
        } else if (current === 2) {
            const profession = this.visitorData.profession;
            
            if (profession === 'Hiring Manager' || profession === 'Tech Lead' || profession === 'CTO') {
                const hiringRole = this.element.querySelector('#hiringRole') as HTMLSelectElement;
                const companyName = this.element.querySelector('#companyName') as HTMLInputElement;
                const hiringDetails = this.element.querySelector('#hiringDetails') as HTMLTextAreaElement;
                this.visitorData.hiringDetails = {
                    hiringRole: hiringRole?.value || '',
                    companyName: companyName?.value || '',
                    additionalDetails: hiringDetails?.value || ''
                } as any;
            } else if (profession === 'Data Analyst') {
                const devInterest = this.element.querySelector('#devInterest') as HTMLSelectElement;
                const techStack = this.element.querySelector('#techStack') as HTMLInputElement;
                const yearsExp = this.element.querySelector('#yearsExp') as HTMLInputElement;
                this.visitorData.devDetails = {
                    devInterest: devInterest?.value || '',
                    techStack: techStack?.value || '',
                    yearsExp: yearsExp?.value || ''
                } as any;
            } else if (profession === 'Student') {
                const courseStudy = this.element.querySelector('#courseStudy') as HTMLInputElement;
                const learningGoals = this.element.querySelector('#learningGoals') as HTMLTextAreaElement;
                this.visitorData.studentDetails = {
                    course: courseStudy?.value || '',
                    learningGoals: learningGoals?.value || ''
                } as any;
            } else {
                const otherReason = this.element.querySelector('#otherReason') as HTMLTextAreaElement;
                this.visitorData.otherReason = Validators.sanitizeInput(otherReason?.value || '');
            }
            
            this.showStep(3);
            this.setupInterestTags();
        }
    }

    private prevStep(step: number): void {
        if (step === 2) this.showStep(1);
        if (step === 3) this.showStep(2);
    }

    private async submitForm(): Promise<void> {
        this.visitorData.message = Validators.sanitizeInput(
            (this.element.querySelector('#visitorMessage') as HTMLTextAreaElement)?.value || ''
        );
        this.visitorData.interests = [...this.selectedInterests];
        this.visitorData.timestamp = new Date().toISOString();
        this.visitorData.device = Helpers.getDeviceType();
        this.visitorData.userAgent = Helpers.getBrowserInfo();
        
        const ipData = await Helpers.fetchIPData();
        this.visitorData.ipAddress = ipData.ip;
        this.visitorData.location = ipData.location;
        
        this.closeModal();
        
        // Save data to Google Sheets
        await GoogleSheetsService.saveUserData(this.visitorData);
        Helpers.showToast(`🎉 Welcome ${this.visitorData.name}! Thanks for visiting.`);
        
        // Trigger feedback popup after 10 seconds
        setTimeout(() => {
            this.showFeedbackPopup();
        }, 10000);
    }

    private closeModal(): void {
        const modal = this.element;
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    private showFeedbackPopup(): void {
        import('./FeedbackPopup').then(module => {
            const popup = new module.FeedbackPopup(this.visitorData.name || 'Anonymous');
            document.body.appendChild(popup.render());
        }).catch(() => {
            // Fallback if dynamic import fails
            const popup = new FeedbackPopupClass(this.visitorData.name || 'Anonymous');
            document.body.appendChild(popup.render());
        });
    }

    render(): HTMLElement {
        return this.element;
    }
}