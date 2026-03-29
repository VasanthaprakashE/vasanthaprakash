#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Path to blogs.json
const blogsPath = path.join(__dirname, '../src/content/blogs.json');

// Function to read current blogs
function readBlogs() {
    try {
        const data = fs.readFileSync(blogsPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Error reading blogs.json:', error.message);
        return { blogs: [] };
    }
}

// Function to save blogs
function saveBlogs(data) {
    try {
        fs.writeFileSync(blogsPath, JSON.stringify(data, null, 2));
        console.log('✅ Blogs saved successfully!');
        return true;
    } catch (error) {
        console.error('❌ Error saving blogs:', error.message);
        return false;
    }
}

// Function to generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Function to generate unique ID
function generateId() {
    return 'blog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

// Function to add new blog
function addBlog(blogData) {
    const data = readBlogs();
    
    const slug = blogData.slug || generateSlug(blogData.title);
    
    const newBlog = {
        id: generateId(),
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
    
    if (saveBlogs(data)) {
        console.log('\n✅ Blog added successfully!');
        console.log('📝 Blog Details:');
        console.log('   ID:', newBlog.id);
        console.log('   Title:', newBlog.title);
        console.log('   Slug:', newBlog.slug);
        console.log('   Status:', newBlog.status);
        console.log('   Tags:', newBlog.tags.join(', '));
        return newBlog;
    }
    return null;
}

// Function to list all blogs
function listBlogs() {
    const data = readBlogs();
    console.log('\n📝 Current Blogs:');
    console.log('='.repeat(60));
    data.blogs.forEach((blog, index) => {
        console.log(`${index + 1}. ${blog.title}`);
        console.log(`   ID: ${blog.id}`);
        console.log(`   Status: ${blog.status}`);
        console.log(`   Date: ${blog.date}`);
        console.log(`   Tags: ${blog.tags.join(', ')}`);
        console.log('-'.repeat(60));
    });
}

// Function to delete blog
function deleteBlog(blogId) {
    const data = readBlogs();
    const initialLength = data.blogs.length;
    data.blogs = data.blogs.filter(b => b.id !== blogId);
    
    if (data.blogs.length === initialLength) {
        console.log('❌ Blog not found with ID:', blogId);
        return false;
    }
    
    if (saveBlogs(data)) {
        console.log('✅ Blog deleted successfully!');
        return true;
    }
    return false;
}

// Function to publish blog
function publishBlog(blogId) {
    const data = readBlogs();
    const blog = data.blogs.find(b => b.id === blogId);
    
    if (!blog) {
        console.log('❌ Blog not found with ID:', blogId);
        return false;
    }
    
    blog.status = 'published';
    
    if (saveBlogs(data)) {
        console.log(`✅ Blog "${blog.title}" published successfully!`);
        return true;
    }
    return false;
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

// Show help if no command
if (args.length === 0 || command === '--help' || command === '-h') {
    console.log(`
📝 Blog Management CLI Tool

Usage:
  npm run add-blog -- [command] [options]

Commands:
  add       Add a new blog post
  list      List all blog posts
  delete    Delete a blog post by ID
  publish   Publish a draft blog

Options for 'add':
  --title="Blog Title"           (Required)
  --desc="Blog Description"      (Required)
  --content="Full blog content"  (Optional)
  --tags="SQL,Power BI,Python"   (Optional)
  --status="draft"               (Optional: draft/published/coming-soon)
  --readtime="5 min read"        (Optional)
  --icon="fa-book"               (Optional)
  --slug="custom-url-slug"       (Optional)
  --featured="false"             (Optional: true/false)

Examples:
  # Add a draft blog
  npm run add-blog -- add --title="My SQL Journey" --desc="Learning SQL" --tags="SQL,Database"
  
  # Add a published blog with content
  npm run add-blog -- add --title="Power BI Tips" --desc="Dashboard tips" --status="published" --content="Full article here..."
  
  # List all blogs
  npm run add-blog -- list
  
  # Delete a blog
  npm run add-blog -- delete blog_1234567890
  
  # Publish a draft
  npm run add-blog -- publish blog_1234567890
`);
    process.exit(0);
}

// Execute commands
switch (command) {
    case 'add':
        const blogData = {
            title: args.find(a => a.startsWith('--title='))?.split('=')[1],
            description: args.find(a => a.startsWith('--desc='))?.split('=')[1],
            content: args.find(a => a.startsWith('--content='))?.split('=')[1],
            tags: args.find(a => a.startsWith('--tags='))?.split('=')[1],
            status: args.find(a => a.startsWith('--status='))?.split('=')[1] || 'draft',
            readTime: args.find(a => a.startsWith('--readtime='))?.split('=')[1],
            icon: args.find(a => a.startsWith('--icon='))?.split('=')[1],
            slug: args.find(a => a.startsWith('--slug='))?.split('=')[1],
            featured: args.find(a => a.startsWith('--featured='))?.split('=')[1] || 'false'
        };
        
        if (!blogData.title || !blogData.description) {
            console.error('❌ Error: --title and --desc are required!');
            console.log('Use --help for usage information');
            process.exit(1);
        }
        
        addBlog(blogData);
        break;
        
    case 'list':
        listBlogs();
        break;
        
    case 'delete':
        const blogId = args[1];
        if (!blogId) {
            console.error('❌ Error: Please provide blog ID to delete');
            console.log('Usage: npm run add-blog -- delete BLOG_ID');
            process.exit(1);
        }
        deleteBlog(blogId);
        break;
        
    case 'publish':
        const publishId = args[1];
        if (!publishId) {
            console.error('❌ Error: Please provide blog ID to publish');
            console.log('Usage: npm run add-blog -- publish BLOG_ID');
            process.exit(1);
        }
        publishBlog(publishId);
        break;
        
    default:
        console.error('❌ Unknown command:', command);
        console.log('Use --help for usage information');
        process.exit(1);
}