import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import blogRoutes from './routes/blogs.js';
import projectRoutes from './routes/projects.js';
import statsRoutes from './routes/stats.js';
import Blog from './models/Blog.js';
import Project from './models/Project.js';

import dns from 'dns';
dotenv.config();

// Ensure SRV DNS records resolve properly on Windows for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog_portfolio';


// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-email', 'x-user-name']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initial seed data
const sampleBlogs = [
  {
    title: 'Building Modern Full-Stack Web Applications with React, Node & MongoDB',
    slug: 'building-modern-full-stack-web-applications',
    excerpt: 'Explore best practices for designing scalable full-stack applications with React 19, Express, MongoDB Atlas, and Firebase Authentication.',
    content: `
# Architecting Modern Full-Stack Applications

Building modern full-stack web applications requires a thoughtful combination of performance, security, developer ergonomics, and rich interactive user experiences.

## 1. Choosing the Right Stack
The combination of **React**, **Node.js/Express**, **MongoDB**, and **Firebase** provides unmatched velocity:
- **React**: Declarative component hierarchy and rich reactive state management.
- **Express**: Lightweight yet powerful REST API routing and middleware pipeline.
- **MongoDB**: Flexible JSON-native schema modeling with Mongoose.
- **Firebase Auth**: Enterprise-grade identity management, OAuth providers, and JWT token verification.

## 2. Secure Token-Based Authentication
When passing user actions between the client and backend, verify tokens on the server:
\`\`\`javascript
// Firebase verification middleware
const decodedToken = await admin.auth().verifyIdToken(token);
req.user = decodedToken;
\`\`\`

## 3. Database Indexing & Optimization
MongoDB aggregation pipelines and indexing on critical query fields like \`slug\` and \`category\` ensure sub-millisecond query responses even under high traffic loads.

### Conclusion
Embrace modern UI polish, component reusability, and clean RESTful API contracts to build experiences users adore!
    `,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    category: 'Web Development',
    tags: ['React', 'NodeJS', 'MongoDB', 'Firebase', 'FullStack'],
    readTime: '6 min read',
    isPublished: true,
    viewsCount: 142,
    likesCount: 18,
    likes: ['user1', 'user2']
  },
  {
    title: 'Mastering Firebase Authentication & Role-Based Access Control',
    slug: 'mastering-firebase-auth-and-rbac',
    excerpt: 'A comprehensive deep dive into implementing secure Admin privileges and multi-tier authentication with Firebase SDK and Express.',
    content: `
# Firebase Authentication & Role-Based Access Control

Security is paramount in web applications. While Firebase client SDK makes login and signup trivial, securing your admin endpoints on your backend is where true security lives.

## Authentication vs Authorization
- **Authentication**: Verifying *who* the user is (Firebase Auth with Email/Password or Google).
- **Authorization**: Determining *what* the user is permitted to do (Admin privileges, modifying blogs).

## Securing API Endpoints
Always validate the \`Authorization: Bearer <idToken>\` header on protected endpoints:
\`\`\`javascript
export const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = await admin.auth().verifyIdToken(token);
  if (adminEmails.includes(decoded.email)) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden' });
};
\`\`\`
    `,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    category: 'Cloud & DevOps',
    tags: ['Firebase', 'Security', 'Auth', 'Express', 'JWT'],
    readTime: '5 min read',
    isPublished: true,
    viewsCount: 98,
    likesCount: 12,
    likes: ['user3']
  },
  {
    title: 'The Future of AI-Powered Development and Micro-Interactions in UI/UX',
    slug: 'future-of-ai-powered-development-and-ui-ux',
    excerpt: 'How glassmorphism, responsive micro-animations, and AI workflows are shaping the next generation of web interfaces.',
    content: `
# UI/UX Trends in the Age of AI

Design is no longer just how it looks—it is how it feels and responds to user intent.

## Core Pillars of Premium Aesthetics
1. **Dynamic Lighting & Glassmorphism**: Translucent backdrop blurs that bring depth to cards and headers.
2. **Micro-Interactions**: Subtle hover states, spring physics, and instantaneous feedback.
3. **Typography Mastery**: Crisp geometric sans-serif typefaces paired with high-contrast accents.

Great apps look alive and invite discovery at every interaction!
    `,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    category: 'Design & UI/UX',
    tags: ['UI/UX', 'Design', 'Tailwind', 'Aesthetics', 'Frontend'],
    readTime: '4 min read',
    isPublished: true,
    viewsCount: 215,
    likesCount: 29,
    likes: ['user1', 'user4']
  }
];

const sampleProjects = [
  {
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

// Seed initial database data if empty
async function seedDatabaseIfEmpty() {
  try {
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('🌱 Seeding sample blogs into MongoDB...');
      await Blog.insertMany(sampleBlogs);
      console.log('✅ Sample blogs successfully seeded.');
    }

    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log('🌱 Seeding sample projects into MongoDB...');
      await Project.insertMany(sampleProjects);
      console.log('✅ Sample projects successfully seeded.');
    }
  } catch (err) {
    console.warn('⚠️ Seeding note:', err.message);
  }
}

// Database connection status tracking
let isDbConnected = false;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
.then(async () => {
  isDbConnected = true;
  console.log(`🚀 Successfully connected to MongoDB at: ${MONGODB_URI}`);
  await seedDatabaseIfEmpty();
})
.catch((err) => {
  isDbConnected = false;
  console.warn(`⚠️ MongoDB connection note: ${err.message}`);
  console.log('💡 Note: You can specify MONGODB_URI in server/.env (e.g. MongoDB Atlas or local MongoDB).');
});

// Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/stats', statsRoutes);

// System Health & Connection Status Route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    database: {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      uriMasked: MONGODB_URI.replace(/:([^:@]{3,})@/, ':****@')
    },
    auth: {
      firebaseConfigured: Boolean(process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_SERVICE_ACCOUNT),
      adminEmails: (process.env.ADMIN_EMAILS || 'admin@portfolio.dev').split(',')
    }
  });
});

// Root API Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Blog Portfolio REST API is operational',
    endpoints: {
      blogs: '/api/blogs',
      projects: '/api/projects',
      stats: '/api/stats',
      health: '/api/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`✨ Blog Portfolio Backend Server running on http://localhost:${PORT}`);
});
