export class Validators {
    // Name Validation
    static validateName(name: string): boolean {
        if (!name || typeof name !== 'string') return false;
        const trimmed = name.trim();
        return trimmed.length >= 2 && trimmed.length <= 100 && /^[a-zA-Z\s\-'.]+$/.test(trimmed);
    }
    
    // Email Validation
    static validateEmail(email: string): boolean {
        if (!email || typeof email !== 'string') return false;
        const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        return re.test(email);
    }
    
    // Phone Validation
    static validatePhone(phone: string): boolean {
        if (!phone || typeof phone !== 'string') return false;
        const re = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;
        return re.test(phone);
    }
    
    // URL Validation
    static validateURL(url: string): boolean {
        if (!url || typeof url !== 'string') return false;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    
    // Message Validation
    static validateMessage(message: string, minLength: number = 1, maxLength: number = 1000): boolean {
        if (!message || typeof message !== 'string') return false;
        const trimmed = message.trim();
        return trimmed.length >= minLength && trimmed.length <= maxLength;
    }
    
    // Input Sanitization
    static sanitizeInput(input: string): string {
        if (!input || typeof input !== 'string') return '';
        return input
            .trim()
            .replace(/[<>]/g, '') // Remove < and >
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/\//g, '&#x2F;');
    }
    
    static sanitizeHTML(html: string): string {
        if (!html || typeof html !== 'string') return '';
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    }
    
    // Number Validation
    static validateNumber(value: any, min?: number, max?: number): boolean {
        const num = Number(value);
        if (isNaN(num)) return false;
        if (min !== undefined && num < min) return false;
        if (max !== undefined && num > max) return false;
        return true;
    }
    
    static validatePercentage(value: any): boolean {
        return this.validateNumber(value, 0, 100);
    }
    
    static validateYear(value: any): boolean {
        const year = Number(value);
        const currentYear = new Date().getFullYear();
        return this.validateNumber(year, 1900, currentYear + 10);
    }
    
    // Date Validation
    static validateDate(date: string): boolean {
        if (!date || typeof date !== 'string') return false;
        const d = new Date(date);
        return d instanceof Date && !isNaN(d.getTime());
    }
    
    static validateFutureDate(date: string): boolean {
        if (!this.validateDate(date)) return false;
        return new Date(date) > new Date();
    }
    
    static validatePastDate(date: string): boolean {
        if (!this.validateDate(date)) return false;
        return new Date(date) < new Date();
    }
    
    // Password Validation
    static validatePassword(password: string, minLength: number = 8): boolean {
        if (!password || typeof password !== 'string') return false;
        return password.length >= minLength;
    }
    
    static validateStrongPassword(password: string): boolean {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }
    
    // Username Validation
    static validateUsername(username: string): boolean {
        if (!username || typeof username !== 'string') return false;
        return /^[a-zA-Z0-9_.-]{3,30}$/.test(username);
    }
    
    // Postal Code Validation
    static validatePostalCode(code: string, country: 'US' | 'UK' | 'IN' | 'CA' = 'IN'): boolean {
        if (!code || typeof code !== 'string') return false;
        
        const patterns = {
            US: /^\d{5}(-\d{4})?$/,
            UK: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/i,
            IN: /^\d{6}$/,
            CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/i
        };
        
        return patterns[country].test(code.trim());
    }
    
    // Credit Card Validation (Luhn algorithm)
    static validateCreditCard(number: string): boolean {
        if (!number || typeof number !== 'string') return false;
        
        const digits = number.replace(/\D/g, '');
        if (digits.length < 13 || digits.length > 19) return false;
        
        let sum = 0;
        let isEven = false;
        
        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits.charAt(i), 10);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }
    
    // JSON Validation
    static validateJSON(str: string): boolean {
        if (!str || typeof str !== 'string') return false;
        try {
            JSON.parse(str);
            return true;
        } catch {
            return false;
        }
    }
    
    // IP Address Validation
    static validateIPv4(ip: string): boolean {
        if (!ip || typeof ip !== 'string') return false;
        const parts = ip.split('.');
        if (parts.length !== 4) return false;
        
        return parts.every(part => {
            const num = parseInt(part, 10);
            return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
        });
    }
    
    static validateIPv6(ip: string): boolean {
        if (!ip || typeof ip !== 'string') return false;
        const regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
        return regex.test(ip);
    }
    
    // Object Validation
    static isEmptyObject(obj: any): boolean {
        return obj && typeof obj === 'object' && Object.keys(obj).length === 0;
    }
    
    static hasRequiredFields(obj: any, requiredFields: string[]): boolean {
        if (!obj || typeof obj !== 'object') return false;
        return requiredFields.every(field => 
            obj.hasOwnProperty(field) && 
            obj[field] !== null && 
            obj[field] !== undefined &&
            obj[field] !== ''
        );
    }
    
    // File Validation
    static validateFileType(file: File, allowedTypes: string[]): boolean {
        return allowedTypes.includes(file.type);
    }
    
    static validateFileSize(file: File, maxSizeMB: number): boolean {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        return file.size <= maxSizeBytes;
    }
    
    // Color Validation
    static validateHexColor(color: string): boolean {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }
    
    static validateRGBColor(color: string): boolean {
        const rgbRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
        if (!rgbRegex.test(color)) return false;
        
        const matches = color.match(/\d+/g);
        if (matches) {
            return matches.every(num => parseInt(num) >= 0 && parseInt(num) <= 255);
        }
        return false;
    }
}