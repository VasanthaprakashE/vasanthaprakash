import { AppError, ErrorDetails } from '../types';

export class Helpers {
    private static instance: Helpers;
    
    private constructor() {}
    
    static getInstance(): Helpers {
        if (!Helpers.instance) {
            Helpers.instance = new Helpers();
        }
        return Helpers.instance;
    }
    
    // Device and Browser Detection
    static getDeviceType(): string {
        const ua = navigator.userAgent.toLowerCase();
        if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
            return '📱 Mobile Phone';
        }
        if (/ipad|tablet|playbook|silk/i.test(ua)) {
            return '📟 Tablet';
        }
        return '💻 Desktop';
    }
    
    static getBrowserInfo(): string {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        if (ua.includes('Edg')) return 'Edge';
        if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
        return 'Unknown';
    }
    
    static getOSInfo(): string {
        const platform = navigator.platform.toLowerCase();
        if (platform.includes('win')) return 'Windows';
        if (platform.includes('mac')) return 'macOS';
        if (platform.includes('linux')) return 'Linux';
        if (/android|iphone|ipad|ipod/i.test(platform)) return 'Mobile';
        return 'Unknown';
    }
    
    // IP and Location Detection
    static async fetchIPData(): Promise<{ ip: string; location: string; city: string; country: string }> {
        try {
            // Try multiple IP detection services for redundancy
            const services = [
                'https://ipapi.co/json/',
                'https://api.ipify.org?format=json',
                'https://ipinfo.io/json'
            ];
            
            for (const service of services) {
                try {
                    const response = await fetch(service);
                    if (response.ok) {
                        const data = await response.json();
                        if (service.includes('ipapi')) {
                            return {
                                ip: data.ip || 'Unknown',
                                city: data.city || 'Unknown',
                                country: data.country_name || 'Unknown',
                                location: `${data.city || 'Unknown'}, ${data.country_name || 'Unknown'}`
                            };
                        } else if (service.includes('ipify')) {
                            const geoResponse = await fetch('https://ipapi.co/' + data.ip + '/json/');
                            const geoData = await geoResponse.json();
                            return {
                                ip: data.ip,
                                city: geoData.city || 'Unknown',
                                country: geoData.country_name || 'Unknown',
                                location: `${geoData.city || 'Unknown'}, ${geoData.country_name || 'Unknown'}`
                            };
                        } else if (service.includes('ipinfo')) {
                            return {
                                ip: data.ip,
                                city: data.city || 'Unknown',
                                country: data.country || 'Unknown',
                                location: `${data.city || 'Unknown'}, ${data.country || 'Unknown'}`
                            };
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
            throw new Error('All IP detection services failed');
        } catch (error) {
            console.warn('IP detection failed:', error);
            return {
                ip: 'Detection unavailable',
                city: 'Unknown',
                country: 'Unknown',
                location: 'Location unavailable'
            };
        }
    }
    
    // Date and Time Helpers
    static getGreeting(name: string): string {
        const hour = new Date().getHours();
        let greeting = '';
        
        if (hour < 12) greeting = 'Good morning';
        else if (hour < 18) greeting = 'Good afternoon';
        else greeting = 'Good evening';
        
        return `${greeting}, ${name}! 👋`;
    }
    
    static formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
        const d = typeof date === 'string' ? new Date(date) : date;
        
        if (format === 'relative') {
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - d.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) return 'Today';
            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
            if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
            return `${Math.floor(diffDays / 365)} years ago`;
        }
        
        if (format === 'long') {
            return d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    static getTimeAgo(date: Date | string): string {
        const now = new Date();
        const past = typeof date === 'string' ? new Date(date) : date;
        const diffMs = now.getTime() - past.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
        if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
        return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    }
    
    // UI Helpers
    static showToast(message: string, isError: boolean = false, duration: number = 3000): void {
        const existingToasts = document.querySelectorAll('.toast-message');
        existingToasts.forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.style.background = isError ? '#EF4444' : 'var(--primary)';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.zIndex = '10001';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '40px';
        toast.style.color = 'white';
        toast.style.fontWeight = '500';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        toast.style.animation = 'slideInRight 0.3s ease';
        toast.innerHTML = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    static scrollToSection(sectionId: string, offset: number = 80): void {
        const element = document.getElementById(sectionId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        } else {
            console.warn(`Element with id "${sectionId}" not found`);
        }
    }
    
    static debounce<T extends (...args: any[]) => any>(
        func: T,
        wait: number
    ): (...args: Parameters<T>) => void {
        let timeout: NodeJS.Timeout | null = null;
        
        return (...args: Parameters<T>) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }
    
    static throttle<T extends (...args: any[]) => any>(
        func: T,
        limit: number
    ): (...args: Parameters<T>) => void {
        let inThrottle: boolean = false;
        
        return (...args: Parameters<T>) => {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }
    
    // String Helpers
    static truncateText(text: string, maxLength: number = 100): string {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }
    
    static capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    
    static slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    }
    
    // Number Helpers
    static formatNumber(num: number, digits: number = 2): string {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(digits) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(digits) + 'K';
        }
        return num.toString();
    }
    
    static formatPercentage(value: number, total: number): string {
        if (total === 0) return '0%';
        return ((value / total) * 100).toFixed(1) + '%';
    }
    
    // Color Helpers
    static getRandomColor(seed: string): string {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - color.length) + color;
    }
    
    // Local Storage Helpers
    static setLocalStorage<T>(key: string, value: T, expiryHours: number = 24): void {
        const item = {
            value: value,
            expiry: new Date().getTime() + (expiryHours * 60 * 60 * 1000)
        };
        localStorage.setItem(key, JSON.stringify(item));
    }
    
    static getLocalStorage<T>(key: string): T | null {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        
        try {
            const item = JSON.parse(itemStr);
            if (item.expiry && new Date().getTime() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            return item.value as T;
        } catch {
            return null;
        }
    }
    
    // Error Handling
    static handleError(error: Error | AppError): ErrorDetails {
        const details: ErrorDetails = {
            message: error.message,
            timestamp: new Date().toISOString(),
            stack: error.stack
        };
        
        if (error instanceof AppError) {
            details.code = error.code;
            details.status = error.status;
        }
        
        console.error('Error:', details);
        return details;
    }
    
    static async retry<T>(
        fn: () => Promise<T>,
        retries: number = 3,
        delay: number = 1000
    ): Promise<T> {
        try {
            return await fn();
        } catch (error) {
            if (retries === 0) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
            return this.retry(fn, retries - 1, delay * 2);
        }
    }
    
    // DOM Helpers
    static createElement<K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        className?: string,
        attributes?: Record<string, string>
    ): HTMLElementTagNameMap[K] {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        if (attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }
        return element;
    }
    
    static addEventListeners(
        element: HTMLElement,
        events: Record<string, EventListener>
    ): void {
        Object.entries(events).forEach(([event, handler]) => {
            element.addEventListener(event, handler);
        });
    }
    
    // Animation Helpers
    static fadeIn(element: HTMLElement, duration: number = 300): Promise<void> {
        return new Promise((resolve) => {
            element.style.opacity = '0';
            element.style.display = 'block';
            
            let start: number | null = null;
            const animate = (timestamp: number) => {
                if (!start) start = timestamp;
                const progress = (timestamp - start) / duration;
                element.style.opacity = Math.min(progress, 1).toString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
    
    static fadeOut(element: HTMLElement, duration: number = 300): Promise<void> {
        return new Promise((resolve) => {
            let start: number | null = null;
            const startOpacity = parseFloat(element.style.opacity) || 1;
            
            const animate = (timestamp: number) => {
                if (!start) start = timestamp;
                const progress = (timestamp - start) / duration;
                element.style.opacity = Math.max(startOpacity - progress, 0).toString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
}