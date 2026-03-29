import * as CryptoJS from 'crypto-js';
import { StoredData } from '../types';

export class StorageService {
    private static readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-me';
    private static readonly STORAGE_VERSION = '1.0.0';
    
    static saveData<T>(key: string, data: T, encrypt: boolean = true): void {
        try {
            const storageData: StoredData<T> = {
                data: data,
                timestamp: new Date().toISOString(),
                version: this.STORAGE_VERSION
            };
            
            let valueToStore: string;
            
            if (encrypt) {
                valueToStore = CryptoJS.AES.encrypt(
                    JSON.stringify(storageData),
                    this.ENCRYPTION_KEY
                ).toString();
            } else {
                valueToStore = JSON.stringify(storageData);
            }
            
            localStorage.setItem(key, valueToStore);
        } catch (error) {
            console.error('Failed to save data:', error);
        }
    }
    
    static getData<T>(key: string, decrypt: boolean = true): T | null {
        try {
            const stored = localStorage.getItem(key);
            if (!stored) return null;
            
            let storageData: StoredData<T>;
            
            if (decrypt) {
                const decrypted = CryptoJS.AES.decrypt(stored, this.ENCRYPTION_KEY);
                const dataString = decrypted.toString(CryptoJS.enc.Utf8);
                if (!dataString) return null;
                storageData = JSON.parse(dataString);
            } else {
                storageData = JSON.parse(stored);
            }
            
            // Check version compatibility
            if (storageData.version !== this.STORAGE_VERSION) {
                console.warn(`Storage version mismatch for key: ${key}`);
                // Attempt migration if needed
                return this.migrateData<T>(key, storageData);
            }
            
            return storageData.data;
        } catch (error) {
            console.error('Failed to retrieve data:', error);
            return null;
        }
    }
    
    private static migrateData<T>(key: string, oldData: StoredData<any>): T | null {
        // Implement migration logic based on versions
        console.log(`Migrating data for key: ${key} from version ${oldData.version} to ${this.STORAGE_VERSION}`);
        
        // For now, return null and let the application recreate data
        this.removeData(key);
        return null;
    }
    
    static removeData(key: string): void {
        localStorage.removeItem(key);
    }
    
    static clearAll(): void {
        localStorage.clear();
    }
    
    static hasData(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }
    
    static getKeys(): string[] {
        return Object.keys(localStorage);
    }
    
    static getStorageSize(): number {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                const value = localStorage.getItem(key);
                if (value) {
                    total += value.length + key.length;
                }
            }
        }
        return total;
    }
    
    static isNearCapacity(): boolean {
        const size = this.getStorageSize();
        const maxSize = 5 * 1024 * 1024; // 5MB typical limit
        return size > maxSize * 0.8; // 80% of capacity
    }
    
    static cleanup(): void {
        if (this.isNearCapacity()) {
            const keys = this.getKeys();
            const oldItems: Array<{key: string, timestamp: string}> = [];
            
            for (const key of keys) {
                try {
                    const data = localStorage.getItem(key);
                    if (data) {
                        const parsed = JSON.parse(data);
                        if (parsed.timestamp) {
                            oldItems.push({
                                key,
                                timestamp: parsed.timestamp
                            });
                        }
                    }
                } catch {
                    // If can't parse, it's likely encrypted, skip
                }
            }
            
            // Sort by timestamp (oldest first)
            oldItems.sort((a, b) => 
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
            
            // Remove oldest 20% of items
            const toRemove = Math.ceil(oldItems.length * 0.2);
            for (let i = 0; i < toRemove; i++) {
                this.removeData(oldItems[i].key);
            }
        }
    }
    
    static exportData(): string {
        const exportData: Record<string, any> = {};
        const keys = this.getKeys();
        
        for (const key of keys) {
            exportData[key] = this.getData(key);
        }
        
        return JSON.stringify(exportData, null, 2);
    }
    
    static importData(jsonData: string): boolean {
        try {
            const importData = JSON.parse(jsonData);
            for (const [key, value] of Object.entries(importData)) {
                this.saveData(key, value);
            }
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }
    
    static async compressData(key: string): Promise<string | null> {
        try {
            const data = this.getData(key);
            if (!data) return null;
            
            const jsonString = JSON.stringify(data);
            // Simple compression: remove whitespace
            const compressed = jsonString.replace(/\s+/g, '');
            return compressed;
        } catch (error) {
            console.error('Failed to compress data:', error);
            return null;
        }
    }
}