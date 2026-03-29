import { VisitorData, FeedbackData } from '../types';
import { StorageService } from './StorageService';
import { Helpers } from '../utils/helpers';

export class GoogleSheetsService {
    private static readonly SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || '';
    private static readonly MAX_RETRIES = 3;
    private static readonly RETRY_DELAY = 2000;
    
    static async saveUserData(data: Partial<VisitorData>): Promise<boolean> {
        try {
            const payload = {
                action: 'saveUser',
                timestamp: new Date().toISOString(),
                ...data
            };
            
            await this.sendToSheets(payload);
            
            // Backup to localStorage
            StorageService.saveData('visitorData_backup', data);
            
            // Track successful submission
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'user_registered', {
                    'event_category': 'engagement',
                    'event_label': data.profession || 'Unknown'
                });
            }
            
            return true;
        } catch (error) {
            console.error('Failed to save user data:', error);
            // Store for retry later
            this.queueForRetry('saveUser', data);
            return false;
        }
    }
    
    static async saveFeedback(feedback: Partial<FeedbackData>): Promise<boolean> {
        try {
            const payload = {
                action: 'saveFeedback',
                timestamp: new Date().toISOString(),
                ...feedback
            };
            
            await this.sendToSheets(payload);
            
            // Backup to localStorage
            StorageService.saveData('feedback_backup', feedback);
            
            // Track feedback submission
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'feedback_submitted', {
                    'event_category': 'engagement',
                    'event_label': `${feedback.rating}_stars`
                });
            }
            
            return true;
        } catch (error) {
            console.error('Failed to save feedback:', error);
            this.queueForRetry('saveFeedback', feedback);
            return false;
        }
    }
    
    private static async sendToSheets(payload: any): Promise<void> {
        if (!this.SCRIPT_URL) {
            console.warn('Google Sheets URL not configured');
            return;
        }
        
        const response = await Helpers.retry(
            async () => {
                const res = await fetch(this.SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });
                return res;
            },
            this.MAX_RETRIES,
            this.RETRY_DELAY
        );
        
        // Since mode is 'no-cors', we can't read the response
        // We assume success if no error was thrown
        console.log('Data sent to Google Sheets successfully');
    }
    
    private static queueForRetry(action: string, data: any): void {
        const queue = StorageService.getData<Array<{action: string, data: any, timestamp: string}>>('retry_queue') || [];
        queue.push({
            action,
            data,
            timestamp: new Date().toISOString()
        });
        StorageService.saveData('retry_queue', queue);
        
        // Attempt to process queue after 30 seconds
        setTimeout(() => this.processRetryQueue(), 30000);
    }
    
    static async processRetryQueue(): Promise<void> {
        const queue = StorageService.getData<Array<{action: string, data: any, timestamp: string}>>('retry_queue');
        if (!queue || queue.length === 0) return;
        
        const failedItems: typeof queue = [];
        
        for (const item of queue) {
            try {
                if (item.action === 'saveUser') {
                    await this.saveUserData(item.data);
                } else if (item.action === 'saveFeedback') {
                    await this.saveFeedback(item.data);
                }
            } catch (error) {
                failedItems.push(item);
            }
        }
        
        if (failedItems.length > 0) {
            StorageService.saveData('retry_queue', failedItems);
        } else {
            StorageService.removeData('retry_queue');
        }
    }
    
    static async testConnection(): Promise<boolean> {
        try {
            const testPayload = {
                action: 'test',
                timestamp: new Date().toISOString(),
                test: true
            };
            
            await this.sendToSheets(testPayload);
            return true;
        } catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }
}