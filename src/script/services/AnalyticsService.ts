import { PageView, Event } from '../types';
import { StorageService } from './StorageService';
import { Helpers } from '../utils/helpers';

export class AnalyticsService {
    private static instance: AnalyticsService;
    private pageViewCount: number = 0;
    private sessionId: string;
    private startTime: number;
    private isEnabled: boolean = true;
    
    private constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.loadInitialData();
        this.setupBeforeUnload();
        this.setupVisibilityChange();
    }
    
    static getInstance(): AnalyticsService {
        if (!AnalyticsService.instance) {
            AnalyticsService.instance = new AnalyticsService();
        }
        return AnalyticsService.instance;
    }
    
    private generateSessionId(): string {
        const existingSession = StorageService.getData<string>('session_id');
        if (existingSession) return existingSession;
        
        const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        StorageService.saveData('session_id', newSessionId);
        return newSessionId;
    }
    
    private loadInitialData(): void {
        const savedCount = StorageService.getData<number>('page_view_count');
        if (savedCount) {
            this.pageViewCount = savedCount;
        }
    }
    
    private setupBeforeUnload(): void {
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
            this.trackEvent('Session', 'Duration', `${timeSpent} seconds`);
            StorageService.saveData('page_view_count', this.pageViewCount);
        });
    }
    
    private setupVisibilityChange(): void {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('Session', 'Hidden');
            } else {
                this.trackEvent('Session', 'Visible');
            }
        });
    }
    
    trackPageView(page: string, referrer?: string): void {
        if (!this.isEnabled) return;
        
        this.pageViewCount++;
        
        const pageView: PageView = {
            page,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: referrer || document.referrer
        };
        
        // Send to Google Analytics if available
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'page_view', {
                page_title: page,
                page_location: window.location.href,
                page_referrer: pageView.referrer
            });
        }
        
        // Store in localStorage for later analysis
        const pageViews = StorageService.getData<PageView[]>('page_views') || [];
        pageViews.push(pageView);
        
        // Keep only last 100 page views
        if (pageViews.length > 100) {
            pageViews.shift();
        }
        
        StorageService.saveData('page_views', pageViews);
        
        console.debug('Page view tracked:', pageView);
    }
    
    trackEvent(category: string, action: string, label?: string, value?: number): void {
        if (!this.isEnabled) return;
        
        const event: Event = {
            category,
            action,
            label,
            value,
            timestamp: new Date().toISOString()
        };
        
        // Send to Google Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
        
        // Store in localStorage
        const events = StorageService.getData<Event[]>('user_events') || [];
        events.push(event);
        
        // Keep only last 200 events
        if (events.length > 200) {
            events.shift();
        }
        
        StorageService.saveData('user_events', events);
        
        console.debug('Event tracked:', event);
    }
    
    trackClick(elementId: string, elementClass?: string): void {
        this.trackEvent('Click', elementId, elementClass);
    }
    
    trackScroll(depth: number): void {
        this.trackEvent('Scroll', 'Depth', `${depth}%`, depth);
    }
    
    trackFormSubmit(formId: string, success: boolean): void {
        this.trackEvent('Form', formId, success ? 'Success' : 'Failed');
    }
    
    trackError(errorMessage: string, errorCode?: string): void {
        this.trackEvent('Error', errorMessage, errorCode);
    }
    
    trackOutboundLink(url: string): void {
        this.trackEvent('Outbound', 'Click', url);
    }
    
    trackDownload(fileName: string, fileType: string): void {
        this.trackEvent('Download', fileName, fileType);
    }
    
    trackTimeOnPage(): void {
        const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
        this.trackEvent('Engagement', 'TimeOnPage', `${timeSpent} seconds`);
    }
    
    getPageViewCount(): number {
        return this.pageViewCount;
    }
    
    getSessionId(): string {
        return this.sessionId;
    }
    
    getSessionDuration(): number {
        return Math.round((Date.now() - this.startTime) / 1000);
    }
    
    enableAnalytics(): void {
        this.isEnabled = true;
        this.trackEvent('System', 'AnalyticsEnabled');
    }
    
    disableAnalytics(): void {
        this.trackEvent('System', 'AnalyticsDisabled');
        this.isEnabled = false;
    }
    
    async getAnalyticsSummary(): Promise<{
        totalPageViews: number;
        totalEvents: number;
        sessionDuration: number;
        uniqueEvents: string[];
    }> {
        const events = StorageService.getData<Event[]>('user_events') || [];
        const uniqueEvents = [...new Set(events.map(e => e.action))];
        
        return {
            totalPageViews: this.pageViewCount,
            totalEvents: events.length,
            sessionDuration: this.getSessionDuration(),
            uniqueEvents
        };
    }
    
    async exportAnalytics(): Promise<string> {
        const analytics = {
            sessionId: this.sessionId,
            pageViewCount: this.pageViewCount,
            pageViews: StorageService.getData<PageView[]>('page_views') || [],
            events: StorageService.getData<Event[]>('user_events') || [],
            exportTime: new Date().toISOString()
        };
        
        return JSON.stringify(analytics, null, 2);
    }
    
    clearAnalytics(): void {
        StorageService.removeData('page_views');
        StorageService.removeData('user_events');
        StorageService.removeData('page_view_count');
        this.pageViewCount = 0;
        this.trackEvent('System', 'AnalyticsCleared');
    }
}