#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const blogsPath = path.join(__dirname, '../content/blogs.json');

function addBlog(blogData) {
    try {
        const data = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
        
        const slug = blogData.slug || blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const newBlog = {
            id: `blog_${Date.now()}`,
            title: blogData.title,
            description: blogData.description,
            content: blogData.content || '',
            icon: blogData.icon || 'fa-book',
            status: blogData.status || 'draft',
            date: new Date().toISOString().split('T')[0],
            readTime: blogData.readTime || '5 min read',
            tags: blogData.tags ? blogData.tags.split(',').map(t => t.trim()) : [],
            featured: blogData.featured === 'true',
            slug: slug,
            views: 0,
            likes: 0
        };
        
        data.blogs.push(newBlog);
        fs.writeFileSync(blogsPath, JSON.stringify(data, null, 2));
        
        console.log('✅ Blog added successfully!');
        console.log('Blog ID:', newBlog.id);
        console.log('Slug:', newBlog.slug);
        return newBlog;
    } catch (error) {
        console.error('❌ Error adding blog:', error.message);
        process.exit(1);
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const blogData = {
    title: args.find(a => a.startsWith('--title='))?.split('=')[1],
    description: args.find(a => a.startsWith('--desc='))?.split('=')[1],
    content: args.find(a => a.startsWith('--content='))?.split('=')[1],
    tags: args.find(a => a.startsWith('--tags='))?.split('=')[1] || '',
    status: args.find(a => a.startsWith('--status='))?.split('=')[1] || 'draft',
    slug: args.find(a => a.startsWith('--slug='))?.split('=')[1],
    readTime: args.find(a => a.startsWith('--readtime='))?.split('=')[1],
    featured: args.find(a => a.startsWith('--featured='))?.split('=')[1] || 'false'
};

if (!blogData.title || !blogData.description) {
    console.log('Usage: npm run add-blog -- --title="Blog Title" --desc="Description"');
    console.log('Optional: --content="Full content" --tags="SQL,Python" --status="published" --slug="url-slug"');
    process.exit(1);
}

addBlog(blogData);