// Visitor and User Types
export interface VisitorData {
    name: string;
    profession: string;
    device: string;
    ipAddress: string;
    location: string;
    userAgent: string;
    hiringDetails: HiringDetails | null;
    devDetails: DevDetails | null;
    studentDetails: StudentDetails | null;
    founderDetails: FounderDetails | null;
    otherReason: string;
    interests: string[];
    message: string;
    timestamp: string;
}

export interface HiringDetails {
    hiringRole: string;
    companyName: string;
    additionalDetails?: string;
}

export interface DevDetails {
    devInterest: string;
    techStack: string;
    yearsExp?: string;
}

export interface StudentDetails {
    course: string;
    learningGoals: string;
}

export interface FounderDetails {
    startupName: string;
    industry: string;
}

// Feedback Types
export interface FeedbackData {
    rating: number;
    message: string;
    visitorName: string;
    timestamp: string;
    ipAddress?: string;
    device?: string;
}

// Content Types
export interface Skill {
    id?: string;
    name: string;
    percentage: number;
    category: string;
    yearsOfExperience: number;
    icon: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    icon: string;
    technologies: string[];
    type: 'internal' | 'external';
    link: string;
    date: string;
    featured: boolean;
    image?: string;
    github?: string | null;
    demo?: string | null;
}

export interface Experience {
    id: string;
    title: string;
    company: string;
    location: string;
    period: string;
    description: string;
    achievements: string[];
    technologies: string[];
    current: boolean;
}

export interface Blog {
    id: string;
    title: string;
    description: string;
    content: string;
    icon: string;
    status: 'published' | 'coming-soon' | 'draft';
    date: string;
    readTime: string;
    tags: string[];
    featured: boolean;
    image?: string;
    slug: string;
    views: number;
    likes: number;
}

export interface SocialLinks {
    email: string;
    linkedin: string;
    github: string;
    twitter?: string | null;
    medium?: string | null;
}

export interface ContactInfo {
    location: string;
    availability: string;
    preferredRoles: string[];
}

export interface HeroInfo {
    badge: string;
    title: string;
    stats: StatItem[];
}

export interface StatItem {
    value: string;
    label: string;
}

// Analytics Types
export interface PageView {
    page: string;
    timestamp: string;
    userAgent: string;
    referrer?: string;
}

export interface Event {
    category: string;
    action: string;
    label?: string;
    value?: number;
    timestamp: string;
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Configuration Types
export interface AppConfig {
    googleScriptUrl: string;
    encryptionKey: string;
    apiBaseUrl: string;
    isProduction: boolean;
    enableAnalytics: boolean;
    enableFeedback: boolean;
}

// Storage Types
export interface StoredData<T = any> {
    data: T;
    timestamp: string;
    version: string;
}

// Component Props Types
export interface ComponentProps {
    className?: string;
    id?: string;
    children?: any;
}

export interface ButtonProps extends ComponentProps {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children?: any;
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ReadonlyDeep<T> = {
    readonly [P in keyof T]: ReadonlyDeep<T[P]>;
};

// Error Types
export class AppError extends Error {
    constructor(
        message: string,
        public code?: string,
        public status?: number
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export interface ErrorDetails {
    message: string;
    code?: string;
    status?: number;
    timestamp: string;
    stack?: string;
}