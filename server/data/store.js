import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import Project from '../models/Project.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db_fallback.json');

// Default initial dataset
const initialBlogs = [
  {
    _id: '670000000000000000000001',
    title: 'Building Modern Full-Stack Web Applications with React, Node & MongoDB',
    slug: 'building-modern-full-stack-web-applications',
    excerpt: 'Explore best practices for designing scalable full-stack applications with React 19, Express, MongoDB Atlas, and Firebase Authentication.',
    content: `# Architecting Modern Full-Stack Applications\n\nBuilding modern full-stack web applications requires a thoughtful combination of performance, security, developer ergonomics, and rich interactive user experiences.\n\n## 1. Choosing the Right Stack\nThe combination of **React**, **Node.js/Express**, **MongoDB**, and **Firebase** provides unmatched velocity:\n- **React**: Declarative component hierarchy and rich reactive state management.\n- **Express**: Lightweight yet powerful REST API routing and middleware pipeline.\n- **MongoDB**: Flexible JSON-native schema modeling with Mongoose.\n- **Firebase Auth**: Enterprise-grade identity management, OAuth providers, and JWT token verification.\n\n## 2. Secure Token-Based Authentication\nWhen passing user actions between the client and backend, verify tokens on the server:\n\`\`\`javascript\nconst decodedToken = await admin.auth().verifyIdToken(token);\nreq.user = decodedToken;\n\`\`\`\n\n## 3. Database Indexing & Optimization\nMongoDB aggregation pipelines and indexing on critical query fields like \`slug\` and \`category\` ensure sub-millisecond query responses even under high traffic loads.\n\n### Conclusion\nEmbrace modern UI polish, component reusability, and clean RESTful API contracts to build experiences users adore!`,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    category: 'Web Development',
    tags: ['React', 'NodeJS', 'MongoDB', 'Firebase', 'FullStack'],
    readTime: '6 min read',
    author: {
      name: 'Portfolio Admin',
      email: 'admin@portfolio.dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      uid: 'admin'
    },
    isPublished: true,
    viewsCount: 142,
    likesCount: 18,
    likes: ['demo_user_1'],
    comments: [
      {
        _id: 'c1',
        userId: 'u1',
        userName: 'Sarah Jenkins',
        userEmail: 'sarah@tech.io',
        userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sarah',
        comment: 'Brilliant overview! The Firebase Auth integration pattern with Express middleware is super clean.',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '670000000000000000000002',
    title: 'Mastering Firebase Authentication & Role-Based Access Control',
    slug: 'mastering-firebase-auth-and-rbac',
    excerpt: 'A comprehensive deep dive into implementing secure Admin privileges and multi-tier authentication with Firebase SDK and Express.',
    content: `# Firebase Authentication & Role-Based Access Control\n\nSecurity is paramount in web applications. While Firebase client SDK makes login and signup trivial, securing your admin endpoints on your backend is where true security lives.\n\n## Authentication vs Authorization\n- **Authentication**: Verifying who the user is (Firebase Auth with Email/Password or Google).\n- **Authorization**: Determining what the user is permitted to do (Admin privileges, modifying blogs).\n\n## Securing API Endpoints\nAlways validate the Authorization: Bearer token header on protected endpoints to prevent unauthorized modifications.`,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    category: 'Cloud & DevOps',
    tags: ['Firebase', 'Security', 'Auth', 'Express', 'JWT'],
    readTime: '5 min read',
    author: {
      name: 'Portfolio Admin',
      email: 'admin@portfolio.dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      uid: 'admin'
    },
    isPublished: true,
    viewsCount: 98,
    likesCount: 12,
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '670000000000000000000003',
    title: 'The Future of AI-Powered Development and Micro-Interactions in UI/UX',
    slug: 'future-of-ai-powered-development-and-ui-ux',
    excerpt: 'How glassmorphism, responsive micro-animations, and AI workflows are shaping the next generation of web interfaces.',
    content: `# UI/UX Trends in the Age of AI\n\nDesign is no longer just how it looks—it is how it feels and responds to user intent.\n\n## Core Pillars of Premium Aesthetics\n1. **Dynamic Lighting & Glassmorphism**: Translucent backdrop blurs that bring depth to cards and headers.\n2. **Micro-Interactions**: Subtle hover states, spring physics, and instantaneous feedback.\n3. **Typography Mastery**: Crisp geometric sans-serif typefaces paired with high-contrast accents.\n\nGreat apps look alive and invite discovery at every interaction!`,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    category: 'Design & UI/UX',
    tags: ['UI/UX', 'Design', 'Tailwind', 'Aesthetics', 'Frontend'],
    readTime: '4 min read',
    author: {
      name: 'Portfolio Admin',
      email: 'admin@portfolio.dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      uid: 'admin'
    },
    isPublished: true,
    viewsCount: 215,
    likesCount: 29,
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initialProjects = [
  {
    _id: '670000000000000000000010',
    title: 'CloudOps Platform Dashboard',
    description: 'An enterprise cloud telemetry dashboard featuring real-time log streaming, resource analytics, and container health monitoring.',
    tags: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker'],
    category: 'Cloud & DevOps',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
    liveUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/example/cloudops',
    featured: true,
    order: 1
  },
  {
    _id: '670000000000000000000020',
    title: 'AI Neural Content Generator',
    description: 'Generative AI content suite integrating LLMs for automated technical writing, SEO optimization, and Markdown export.',
    tags: ['Next.js', 'OpenAI API', 'TailwindCSS', 'Firebase'],
    category: 'AI & ML',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1000&q=80',
    liveUrl: 'https://example.com/ai-gen',
    githubUrl: 'https://github.com/example/ai-suite',
    featured: true,
    order: 2
  },
  {
    _id: '670000000000000000000030',
    title: 'Fintech Pulse - Crypto & Stock Tracker',
    description: 'High-frequency trading visualizer and portfolio analytics platform with real-time WebSocket market feeds and charts.',
    tags: ['React', 'ChartJS', 'Express', 'MongoDB'],
    category: 'Full Stack',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1000&q=80',
    liveUrl: 'https://example.com/fintech',
    githubUrl: 'https://github.com/example/fintech-pulse',
    featured: true,
    order: 3
  }
];

// Load local fallback data
let memoryData = { blogs: initialBlogs, projects: initialProjects };

try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    memoryData = JSON.parse(raw);
  } else {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryData, null, 2));
  }
} catch (e) {
  memoryData = { blogs: initialBlogs, projects: initialProjects };
}

const saveLocalData = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryData, null, 2));
  } catch (err) {
    console.error('Failed to save fallback db:', err.message);
  }
};

export const isMongoLive = () => mongoose.connection.readyState === 1;

// Blog Store Operations
export const dbBlogs = {
  find: async (filter = {}) => {
    if (isMongoLive()) {
      return await Blog.find(filter).sort({ createdAt: -1 });
    }
    let list = [...memoryData.blogs];
    if (filter.isPublished !== undefined) {
      list = list.filter(b => b.isPublished === filter.isPublished);
    }
    if (filter.category) {
      list = list.filter(b => b.category === filter.category);
    }
    if (filter.tag) {
      list = list.filter(b => b.tags && b.tags.includes(filter.tag));
    }
    return list;
  },

  findOne: async (query) => {
    if (isMongoLive()) {
      return await Blog.findOne(query);
    }
    return memoryData.blogs.find(b => {
      if (query.slug && b.slug === query.slug) return true;
      if (query._id && (b._id === query._id || String(b._id) === String(query._id))) return true;
      return false;
    }) || null;
  },

  findById: async (id) => {
    if (isMongoLive()) {
      return await Blog.findById(id);
    }
    return memoryData.blogs.find(b => b._id === id || String(b._id) === String(id)) || null;
  },

  create: async (blogData) => {
    if (isMongoLive()) {
      const blog = new Blog(blogData);
      return await blog.save();
    }
    const newBlog = {
      _id: 'b_' + Date.now(),
      ...blogData,
      viewsCount: 0,
      likesCount: 0,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryData.blogs.unshift(newBlog);
    saveLocalData();
    return newBlog;
  },

  updateById: async (id, updateData) => {
    if (isMongoLive()) {
      return await Blog.findByIdAndUpdate(id, updateData, { new: true });
    }
    const idx = memoryData.blogs.findIndex(b => b._id === id || String(b._id) === String(id));
    if (idx === -1) return null;
    memoryData.blogs[idx] = {
      ...memoryData.blogs[idx],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    saveLocalData();
    return memoryData.blogs[idx];
  },

  deleteById: async (id) => {
    if (isMongoLive()) {
      return await Blog.findByIdAndDelete(id);
    }
    const idx = memoryData.blogs.findIndex(b => b._id === id || String(b._id) === String(id));
    if (idx === -1) return null;
    const removed = memoryData.blogs.splice(idx, 1)[0];
    saveLocalData();
    return removed;
  },

  countDocuments: async (filter = {}) => {
    if (isMongoLive()) {
      return await Blog.countDocuments(filter);
    }
    let list = [...memoryData.blogs];
    if (filter.isPublished !== undefined) {
      list = list.filter(b => b.isPublished === filter.isPublished);
    }
    return list.length;
  }
};

// Project Store Operations
export const dbProjects = {
  find: async () => {
    if (isMongoLive()) {
      return await Project.find().sort({ order: 1, createdAt: -1 });
    }
    return memoryData.projects;
  },

  create: async (data) => {
    if (isMongoLive()) {
      const proj = new Project(data);
      return await proj.save();
    }
    const newProj = {
      _id: 'p_' + Date.now(),
      ...data,
      createdAt: new Date().toISOString()
    };
    memoryData.projects.unshift(newProj);
    saveLocalData();
    return newProj;
  },

  updateById: async (id, data) => {
    if (isMongoLive()) {
      return await Project.findByIdAndUpdate(id, data, { new: true });
    }
    const idx = memoryData.projects.findIndex(p => p._id === id || String(p._id) === String(id));
    if (idx === -1) return null;
    memoryData.projects[idx] = { ...memoryData.projects[idx], ...data };
    saveLocalData();
    return memoryData.projects[idx];
  },

  deleteById: async (id) => {
    if (isMongoLive()) {
      return await Project.findByIdAndDelete(id);
    }
    const idx = memoryData.projects.findIndex(p => p._id === id || String(p._id) === String(id));
    if (idx === -1) return null;
    const removed = memoryData.projects.splice(idx, 1)[0];
    saveLocalData();
    return removed;
  },

  countDocuments: async () => {
    if (isMongoLive()) {
      return await Project.countDocuments();
    }
    return memoryData.projects.length;
  }
};
