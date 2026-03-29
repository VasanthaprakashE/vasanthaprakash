import { Project, Blog, Skill, Experience, SocialLinks, ContactInfo, HeroInfo } from '../types';
import projectsData from '../content/projects.json';
import blogsData from '../content/blogs.json';
import skillsData from '../content/skills.json';
import experienceData from '../content/experience.json';
import socialData from '../content/social.json';
import { StorageService } from './StorageService';

export class ContentService {
    private static instance: ContentService;
    private projects: Project[] = [];
    private blogs: Blog[] = [];
    private skills: Skill[] = [];
    private experiences: Experience[] = [];
    private socialLinks: SocialLinks = { email: '', linkedin: '', github: '' };
    private contactInfo: ContactInfo = { location: '', availability: '', preferredRoles: [] };
    private heroInfo: HeroInfo = { badge: '', title: '', stats: [] };
    
    private constructor() {
        this.loadContent();
    }
    
    static getInstance(): ContentService {
        if (!ContentService.instance) {
            ContentService.instance = new ContentService();
        }
        return ContentService.instance;
    }
    
    private loadContent(): void {
        // Load from localStorage first (admin updates), then fallback to JSON files
        const localProjects = StorageService.getData<Project[]>('projects_data');
        const localBlogs = StorageService.getData<Blog[]>('blogs_data');
        const localSkills = StorageService.getData<Skill[]>('skills_data');
        const localExperiences = StorageService.getData<Experience[]>('experience_data');
        
        this.projects = localProjects || (projectsData as any).projects || [];
        this.blogs = localBlogs || (blogsData as any).blogs || [];
        this.skills = localSkills || (skillsData as any).skills || [];
        this.experiences = localExperiences || (experienceData as any).experience || [];
        this.socialLinks = (socialData as any).social || {};
        this.contactInfo = (socialData as any).contact || {};
        this.heroInfo = (socialData as any).hero || {};
    }
    
    async refreshContent(): Promise<void> {
        try {
            // Try to load from localStorage first (for admin updates)
            const localProjects = StorageService.getData<Project[]>('projects_data');
            const localBlogs = StorageService.getData<Blog[]>('blogs_data');
            const localSkills = StorageService.getData<Skill[]>('skills_data');
            const localExperiences = StorageService.getData<Experience[]>('experience_data');
            
            if (localProjects) this.projects = localProjects;
            if (localBlogs) this.blogs = localBlogs;
            if (localSkills) this.skills = localSkills;
            if (localExperiences) this.experiences = localExperiences;
            
            console.log('Content refreshed successfully');
        } catch (error) {
            console.error('Failed to refresh content:', error);
            this.loadContent(); // Fallback to default
        }
    }
    
    // Project Methods
    getProjects(featuredOnly: boolean = false, limit?: number): Project[] {
        let projects = [...this.projects];
        if (featuredOnly) {
            projects = projects.filter(p => p.featured);
        }
        projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (limit) {
            projects = projects.slice(0, limit);
        }
        return projects;
    }
    
    getProjectById(id: string): Project | undefined {
        return this.projects.find(p => p.id === id);
    }
    
    getProjectsByTechnology(tech: string): Project[] {
        return this.projects.filter(p => 
            p.technologies.some(t => t.toLowerCase().includes(tech.toLowerCase()))
        );
    }
    
    getProjectsByType(type: 'internal' | 'external'): Project[] {
        return this.projects.filter(p => p.type === type);
    }
    
    getRecentProjects(limit: number = 3): Project[] {
        return this.getProjects(false, limit);
    }
    
    // Blog Methods
    getBlogs(publishedOnly: boolean = true, limit?: number): Blog[] {
        let blogs = [...this.blogs];
        if (publishedOnly) {
            blogs = blogs.filter(b => b.status === 'published');
        }
        blogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (limit) {
            blogs = blogs.slice(0, limit);
        }
        return blogs;
    }
    
    getBlogBySlug(slug: string): Blog | undefined {
        return this.blogs.find(b => b.slug === slug);
    }
    
    getBlogById(id: string): Blog | undefined {
        return this.blogs.find(b => b.id === id);
    }
    
    getFeaturedBlogs(limit: number = 3): Blog[] {
        return this.blogs
            .filter(b => b.featured && b.status === 'published')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, limit);
    }
    
    getRelatedBlogs(currentBlogId: string, limit: number = 3): Blog[] {
        const currentBlog = this.blogs.find(b => b.id === currentBlogId);
        if (!currentBlog) return [];
        
        return this.blogs
            .filter(b => b.id !== currentBlogId && b.status === 'published')
            .map(blog => ({
                blog,
                matches: blog.tags.filter(tag => currentBlog.tags.includes(tag)).length
            }))
            .sort((a, b) => b.matches - a.matches)
            .slice(0, limit)
            .map(item => item.blog);
    }
    
    getBlogsByTag(tag: string): Blog[] {
        return this.blogs.filter(b => 
            b.tags.some(t => t.toLowerCase() === tag.toLowerCase()) &&
            b.status === 'published'
        );
    }
    
    getBlogsByYear(year: number): Blog[] {
        return this.blogs.filter(b => {
            const blogYear = new Date(b.date).getFullYear();
            return blogYear === year && b.status === 'published';
        });
    }
    
    getAvailableYears(): number[] {
        const years = this.blogs
            .filter(b => b.status === 'published')
            .map(b => new Date(b.date).getFullYear());
        return [...new Set(years)].sort((a, b) => b - a);
    }
    
    getPopularBlogs(limit: number = 5): Blog[] {
        return [...this.blogs]
            .filter(b => b.status === 'published')
            .sort((a, b) => b.views - a.views)
            .slice(0, limit);
    }
    
    incrementBlogViews(slug: string): void {
        const blog = this.blogs.find(b => b.slug === slug);
        if (blog) {
            blog.views++;
            this.saveBlogsToLocalStorage();
        }
    }
    
    incrementBlogLikes(slug: string): void {
        const blog = this.blogs.find(b => b.slug === slug);
        if (blog) {
            blog.likes++;
            this.saveBlogsToLocalStorage();
        }
    }
    
    private saveBlogsToLocalStorage(): void {
        StorageService.saveData('blogs_data', this.blogs);
    }
    
    // Skills Methods
    getSkills(): Skill[] {
        return [...this.skills];
    }
    
    getSkillsByCategory(category: string): Skill[] {
        return this.skills.filter(s => s.category === category);
    }
    
    getSkillCategories(): string[] {
        return [...new Set(this.skills.map(s => s.category))];
    }
    
    getTopSkills(limit: number = 5): Skill[] {
        return [...this.skills]
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, limit);
    }
    
    // Experience Methods
    getExperiences(): Experience[] {
        return [...this.experiences];
    }
    
    getCurrentExperience(): Experience | undefined {
        return this.experiences.find(e => e.current);
    }
    
    getPastExperiences(): Experience[] {
        return this.experiences.filter(e => !e.current);
    }
    
    // Social Methods
    getSocialLinks(): SocialLinks {
        return { ...this.socialLinks };
    }
    
    getContactInfo(): ContactInfo {
        return { ...this.contactInfo };
    }
    
    getHeroInfo(): HeroInfo {
        return { ...this.heroInfo };
    }
    
    // Search Methods
    searchProjects(query: string): Project[] {
        const searchTerm = query.toLowerCase();
        return this.projects.filter(p =>
            p.title.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.technologies.some(t => t.toLowerCase().includes(searchTerm))
        );
    }
    
    searchBlogs(query: string): Blog[] {
        const searchTerm = query.toLowerCase();
        return this.blogs.filter(b =>
            b.title.toLowerCase().includes(searchTerm) ||
            b.description.toLowerCase().includes(searchTerm) ||
            b.content.toLowerCase().includes(searchTerm) ||
            b.tags.some(t => t.toLowerCase().includes(searchTerm))
        );
    }
    
    // Statistics
    getContentStats(): {
        totalProjects: number;
        totalBlogs: number;
        totalSkills: number;
        totalExperiences: number;
        publishedBlogs: number;
        featuredProjects: number;
    } {
        return {
            totalProjects: this.projects.length,
            totalBlogs: this.blogs.length,
            totalSkills: this.skills.length,
            totalExperiences: this.experiences.length,
            publishedBlogs: this.blogs.filter(b => b.status === 'published').length,
            featuredProjects: this.projects.filter(p => p.featured).length
        };
    }
}