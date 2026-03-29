import { ContentService } from '../services/ContentService';

export class Blogs {
    private element: HTMLElement;
    private contentService: ContentService;

    constructor() {
        this.contentService = ContentService.getInstance();
        this.element = this.createBlogs();
    }

    private createBlogs(): HTMLElement {
        const section = document.createElement('div');
        section.className = 'section';
        section.id = 'blogs';
        
        const blogs = this.contentService.getBlogs(false); // Get all blogs including coming soon
        
        section.innerHTML = `
            <div class="section-header">
                <div class="section-tag">Insights</div>
                <h2>Blog / Knowledge Sharing</h2>
                <p>Topics I work on, learn from, and share through my data and automation journey.</p>
            </div>
            <div class="blogs-grid">
                ${this.getBlogCards(blogs)}
            </div>
        `;
        
        return section;
    }

    private getBlogCards(blogs: any[]): string {
        if (blogs.length === 0) {
            return '<p>No blog posts yet. Check back soon for new content!</p>';
        }
        
        return blogs.map(blog => `
            <div class="blog-card">
                <div class="blog-image"><i class="fas ${blog.icon}"></i></div>
                <div class="blog-content">
                    <div class="blog-title">${blog.title}</div>
                    <div class="blog-description">${blog.description}</div>
                    ${blog.status === 'published' ? `
                        <div class="blog-meta">
                            <span><i class="far fa-calendar"></i> ${new Date(blog.date).toLocaleDateString()}</span>
                            <span><i class="far fa-clock"></i> ${blog.readTime}</span>
                            <span><i class="far fa-eye"></i> ${blog.views} views</span>
                        </div>
                    ` : ''}
                    <div class="blog-links">
                        ${blog.status === 'published' ? 
                            `<a href="/blog/${blog.slug}"><i class="fas fa-book-open"></i> Read More</a>` :
                            `<a href="#"><i class="fas fa-hourglass-half"></i> Coming Soon</a>`
                        }
                    </div>
                </div>
            </div>
        `).join('');
    }

    render(): HTMLElement {
        return this.element;
    }
}