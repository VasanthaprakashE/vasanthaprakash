#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectsPath = path.join(__dirname, '../content/projects.json');

function addProject(projectData) {
    try {
        const data = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
        
        const newProject = {
            id: `project_${Date.now()}`,
            title: projectData.title,
            description: projectData.description,
            icon: projectData.icon || 'fa-chart-line',
            technologies: projectData.technologies.split(',').map(t => t.trim()),
            type: projectData.type || 'internal',
            link: projectData.link || '#',
            date: new Date().toISOString().split('T')[0],
            featured: projectData.featured === 'true',
            github: projectData.github || null,
            demo: projectData.demo || null
        };
        
        data.projects.push(newProject);
        fs.writeFileSync(projectsPath, JSON.stringify(data, null, 2));
        
        console.log('✅ Project added successfully!');
        console.log('Project ID:', newProject.id);
        return newProject;
    } catch (error) {
        console.error('❌ Error adding project:', error.message);
        process.exit(1);
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const projectData = {
    title: args.find(a => a.startsWith('--title='))?.split('=')[1],
    description: args.find(a => a.startsWith('--desc='))?.split('=')[1],
    technologies: args.find(a => a.startsWith('--tech='))?.split('=')[1] || '',
    icon: args.find(a => a.startsWith('--icon='))?.split('=')[1],
    type: args.find(a => a.startsWith('--type='))?.split('=')[1],
    github: args.find(a => a.startsWith('--github='))?.split('=')[1],
    demo: args.find(a => a.startsWith('--demo='))?.split('=')[1],
    featured: args.find(a => a.startsWith('--featured='))?.split('=')[1] || 'false'
};

if (!projectData.title || !projectData.description) {
    console.log('Usage: npm run add-project -- --title="Project Title" --desc="Description" --tech="SQL,Python"');
    console.log('Optional: --icon="fa-chart-line" --type="external" --github="url" --demo="url" --featured="true"');
    process.exit(1);
}

addProject(projectData);