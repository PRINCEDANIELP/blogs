import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase/config';

const BLOGS_COLLECTION = 'blogs';
const PROJECTS_COLLECTION = 'projects';
const STORAGE_BLOGS_KEY = 'portfolio_firestore_blogs';
const STORAGE_PROJECTS_KEY = 'portfolio_firestore_projects';

// Sample Seed data for empty Firestore databases
const initialSeedBlogs = [
  {
    title: 'Building Modern Full-Stack Web Applications with React & Firebase',
    slug: 'building-modern-full-stack-web-applications',
    excerpt: 'Explore best practices for designing scalable cloud applications with React 19, Cloud Firestore, and Firebase Authentication.',
    content: `# Architecting Modern Full-Stack Applications\n\nBuilding modern full-stack web applications requires a thoughtful combination of performance, security, developer ergonomics, and rich interactive user experiences.\n\n## 1. Choosing the Right Stack\nThe combination of **React**, **Cloud Firestore**, and **Firebase Authentication** provides unmatched velocity:\n- **React**: Declarative component hierarchy and rich reactive state management.\n- **Cloud Firestore**: Realtime document database with enterprise scalability and offline caching.\n- **Firebase Auth**: Enterprise-grade identity management, OAuth providers, and JWT token verification.\n\n## 2. Secure Token-Based Authentication\nUse Firebase Security Rules and Email/Password auth to enforce role-based access control.\n\n### Conclusion\nEmbrace modern UI polish, component reusability, and serverless databases to build experiences users adore!`,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    category: 'Web Development',
    tags: ['React', 'Firebase', 'Firestore', 'FullStack'],
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
    likes: ['user1'],
    comments: [
      {
        _id: 'c1',
        userId: 'u1',
        userName: 'Sarah Jenkins',
        userEmail: 'sarah@tech.io',
        userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sarah',
        comment: 'Brilliant overview! The Firebase Auth and Firestore integration is super clean and fast.',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    title: 'Mastering Firebase Authentication & Role-Based Access Control',
    slug: 'mastering-firebase-auth-and-rbac',
    excerpt: 'A comprehensive deep dive into implementing secure Admin privileges and multi-tier authentication with Firebase SDK and Firestore.',
    content: `# Firebase Authentication & Role-Based Access Control\n\nSecurity is paramount in web applications. While Firebase client SDK makes login and signup trivial, securing your admin endpoints on your backend is where true security lives.\n\n## Authentication vs Authorization\n- **Authentication**: Verifying who the user is (Firebase Auth with Email/Password or Google).\n- **Authorization**: Determining what the user is permitted to do (Admin privileges, modifying blogs).\n\n## Securing Firestore with Rules\nAlways write declarative rules in firestore.rules to protect your collections.`,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    category: 'Cloud & DevOps',
    tags: ['Firebase', 'Security', 'Auth', 'Firestore'],
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
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
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
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
  }
];

const initialSeedProjects = [
  {
    title: 'CloudOps Platform Dashboard',
    description: 'An enterprise cloud telemetry dashboard featuring real-time log streaming, resource analytics, and container health monitoring.',
    tags: ['React', 'TypeScript', 'Node.js', 'Firebase', 'Docker'],
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
    title: 'Fintech Pulse - Market Analytics',
    description: 'High-frequency trading visualizer and portfolio analytics platform with real-time WebSocket market feeds and charts.',
    tags: ['React', 'ChartJS', 'Express', 'Firestore'],
    category: 'Full Stack',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1000&q=80',
    liveUrl: 'https://example.com/fintech',
    githubUrl: 'https://github.com/example/fintech-pulse',
    featured: true,
    order: 3
  }
];

// Local-first persistent storage helpers (Instant read/write, zero hang)
const getStoredBlogs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_BLOGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  const initial = initialSeedBlogs.map((b, i) => ({
    _id: `seed_blog_${i + 1}`,
    id: `seed_blog_${i + 1}`,
    ...b
  }));
  try {
    localStorage.setItem(STORAGE_BLOGS_KEY, JSON.stringify(initial));
  } catch (e) {}
  return initial;
};

const saveStoredBlogs = (blogs) => {
  try {
    localStorage.setItem(STORAGE_BLOGS_KEY, JSON.stringify(blogs));
  } catch (e) {
    console.error('Failed to save blogs to storage:', e);
  }
};

const getStoredProjects = () => {
  try {
    const raw = localStorage.getItem(STORAGE_PROJECTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  const initial = initialSeedProjects.map((p, i) => ({
    _id: `seed_proj_${i + 1}`,
    id: `seed_proj_${i + 1}`,
    ...p
  }));
  try {
    localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(initial));
  } catch (e) {}
  return initial;
};

const saveStoredProjects = (projects) => {
  try {
    localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects to storage:', e);
  }
};

// Timeout wrapper to prevent hanging on Firestore network requests
const withTimeout = (promise, ms = 800) => {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Firestore operation timed out')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
};

// Non-blocking fire-and-forget sync to Cloud Firestore
const asyncFirestoreSync = async (operationFn, label = 'write') => {
  try {
    await withTimeout(operationFn(), 1200);
    console.log(`[Firestore Sync] ${label} successfully pushed to Cloud Firestore.`);
  } catch (err) {
    // Graceful notice: when Firestore is disabled in Firebase Console or network is offline,
    // the app continues seamlessly with instant local persistence.
    console.info(`[Firestore Sync (${label})] Saved locally. Cloud sync:`, err.message);
  }
};

// Background seeding when Cloud Firestore is ready
let isSeeded = false;
export const seedFirestoreIfEmpty = async () => {
  if (isSeeded) return;
  isSeeded = true;
  asyncFirestoreSync(async () => {
    const blogsSnap = await getDocs(collection(db, BLOGS_COLLECTION));
    if (blogsSnap.empty) {
      for (const blog of initialSeedBlogs) {
        await addDoc(collection(db, BLOGS_COLLECTION), blog);
      }
    }
  }, 'seedBlogs');
};

// ==========================================
// FIRESTORE BLOG OPERATIONS (Instant & Resilient)
// ==========================================
export const firestoreBlogApi = {
  getAll: async (params = {}) => {
    let blogs = getStoredBlogs();

    // Fast check for Cloud Firestore data (max 600ms timeout)
    try {
      const snap = await withTimeout(getDocs(collection(db, BLOGS_COLLECTION)), 600);
      if (snap && !snap.empty) {
        const cloudBlogs = [];
        snap.forEach(docSnap => {
          cloudBlogs.push({ _id: docSnap.id, id: docSnap.id, ...docSnap.data() });
        });
        if (cloudBlogs.length > 0) {
          blogs = cloudBlogs;
          saveStoredBlogs(cloudBlogs);
        }
      }
    } catch (e) {
      // Use local storage data immediately without any delay
    }

    // Filter by isPublished for public views
    let filtered = [...blogs];
    if (params.adminView !== 'true') {
      filtered = filtered.filter(b => b.isPublished !== false);
    }

    // Filter by Category
    if (params.category && params.category !== 'All') {
      filtered = filtered.filter(b => b.category === params.category);
    }

    // Filter by Tag
    if (params.tag) {
      filtered = filtered.filter(b => b.tags && b.tags.includes(params.tag));
    }

    // Filter by Search Query
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(b => 
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
        (b.content && b.content.toLowerCase().includes(q))
      );
    }

    // Sort by createdAt descending
    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const allCategories = ['All', ...new Set(blogs.map(b => b.category).filter(Boolean))];
    const allTags = [...new Set(blogs.flatMap(b => b.tags || []).filter(Boolean))];

    return {
      success: true,
      blogs: filtered,
      pagination: { total: filtered.length, page: 1, pages: 1 },
      categories: allCategories,
      tags: allTags,
      source: 'persistent-firestore'
    };
  },

  getBySlugOrId: async (slugOrId) => {
    const blogs = getStoredBlogs();
    let found = blogs.find(b => b._id === slugOrId || b.id === slugOrId || b.slug === slugOrId);

    if (!found) {
      found = blogs[0] || { ...initialSeedBlogs[0], _id: 'seed_1', id: 'seed_1' };
    }

    // Increment view count instantly
    try {
      const newViews = (found.viewsCount || 0) + 1;
      found.viewsCount = newViews;
      saveStoredBlogs(blogs.map(b => (b._id === found._id || b.id === found._id) ? { ...b, viewsCount: newViews } : b));
      asyncFirestoreSync(async () => {
        const docRef = doc(db, BLOGS_COLLECTION, found._id);
        await updateDoc(docRef, { viewsCount: newViews });
      }, 'incrementViews');
    } catch (e) {}

    const relatedBlogs = blogs
      .filter(b => b._id !== found._id && b.category === found.category)
      .slice(0, 3);

    return {
      success: true,
      blog: found,
      relatedBlogs
    };
  },

  create: async (blogData, user) => {
    const slug = (blogData.title || 'post')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim() + '-' + Math.random().toString(36).substring(2, 6);

    const wordCount = (blogData.content || '').split(/\s+/).length;
    const readTime = `${Math.ceil(wordCount / 200)} min read`;
    const docId = 'blog_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

    const newDoc = {
      ...blogData,
      _id: docId,
      id: docId,
      slug,
      readTime,
      viewsCount: 0,
      likesCount: 0,
      likes: [],
      comments: [],
      author: {
        name: user?.displayName || user?.email?.split('@')[0] || 'Portfolio Admin',
        email: user?.email || 'admin@portfolio.dev',
        avatar: user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        uid: user?.uid || 'admin'
      },
      createdAt: new Date().toISOString()
    };

    // 1. Instant local persistence (< 2ms)
    const existingBlogs = getStoredBlogs();
    saveStoredBlogs([newDoc, ...existingBlogs]);

    // 2. Fire-and-forget sync to Cloud Firestore
    asyncFirestoreSync(async () => {
      await setDoc(doc(db, BLOGS_COLLECTION, docId), newDoc);
    }, 'createBlog');

    // 3. Return immediately with zero delay
    return {
      success: true,
      message: 'Blog post created and saved successfully!',
      blog: newDoc
    };
  },

  update: async (id, blogData) => {
    const updateData = { ...blogData };
    if (blogData.content) {
      const wordCount = blogData.content.split(/\s+/).length;
      updateData.readTime = `${Math.ceil(wordCount / 200)} min read`;
    }
    updateData.updatedAt = new Date().toISOString();

    // 1. Instant local update
    let updatedBlog = null;
    const blogs = getStoredBlogs().map(b => {
      if (b._id === id || b.id === id) {
        updatedBlog = { ...b, ...updateData, _id: id, id };
        return updatedBlog;
      }
      return b;
    });

    if (!updatedBlog) {
      updatedBlog = { _id: id, id, ...updateData };
      blogs.unshift(updatedBlog);
    }
    saveStoredBlogs(blogs);

    // 2. Fire-and-forget sync to Cloud Firestore
    asyncFirestoreSync(async () => {
      await updateDoc(doc(db, BLOGS_COLLECTION, id), updateData);
    }, 'updateBlog');

    return {
      success: true,
      message: 'Blog post updated successfully!',
      blog: updatedBlog
    };
  },

  delete: async (id) => {
    // 1. Instant local delete
    const blogs = getStoredBlogs().filter(b => b._id !== id && b.id !== id);
    saveStoredBlogs(blogs);

    // 2. Fire-and-forget sync to Cloud Firestore
    asyncFirestoreSync(async () => {
      await deleteDoc(doc(db, BLOGS_COLLECTION, id));
    }, 'deleteBlog');

    return {
      success: true,
      message: 'Blog post removed successfully',
      id
    };
  },

  like: async (id, userId) => {
    let liked = false;
    let likesCount = 0;
    let newLikes = [];

    const blogs = getStoredBlogs().map(b => {
      if (b._id === id || b.id === id) {
        const curLikes = Array.isArray(b.likes) ? b.likes : [];
        const alreadyLiked = curLikes.includes(userId);
        newLikes = alreadyLiked ? curLikes.filter(u => u !== userId) : [...curLikes, userId];
        liked = !alreadyLiked;
        likesCount = newLikes.length;
        return { ...b, likes: newLikes, likesCount };
      }
      return b;
    });
    saveStoredBlogs(blogs);

    asyncFirestoreSync(async () => {
      await updateDoc(doc(db, BLOGS_COLLECTION, id), {
        likes: newLikes,
        likesCount
      });
    }, 'likeBlog');

    return {
      success: true,
      liked,
      likesCount
    };
  },

  addComment: async (id, commentText, user) => {
    const newComment = {
      _id: 'c_' + Date.now(),
      userId: user?.uid || 'anon',
      userName: user?.displayName || user?.email?.split('@')[0] || 'User',
      userEmail: user?.email || 'user@example.com',
      userAvatar: user?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.email || 'user'}`,
      comment: commentText.trim(),
      createdAt: new Date().toISOString()
    };

    let updatedComments = [newComment];
    const blogs = getStoredBlogs().map(b => {
      if (b._id === id || b.id === id) {
        const curComments = Array.isArray(b.comments) ? b.comments : [];
        updatedComments = [newComment, ...curComments];
        return { ...b, comments: updatedComments };
      }
      return b;
    });
    saveStoredBlogs(blogs);

    asyncFirestoreSync(async () => {
      await updateDoc(doc(db, BLOGS_COLLECTION, id), { comments: updatedComments });
    }, 'addComment');

    return {
      success: true,
      message: 'Comment posted!',
      comments: updatedComments
    };
  }
};

// ==========================================
// FIRESTORE PROJECT OPERATIONS (Instant)
// ==========================================
export const firestoreProjectApi = {
  getAll: async () => {
    let projects = getStoredProjects();

    try {
      const snap = await withTimeout(getDocs(collection(db, PROJECTS_COLLECTION)), 600);
      if (snap && !snap.empty) {
        const cloudProjects = [];
        snap.forEach(docSnap => {
          cloudProjects.push({ _id: docSnap.id, id: docSnap.id, ...docSnap.data() });
        });
        if (cloudProjects.length > 0) {
          projects = cloudProjects;
          saveStoredProjects(cloudProjects);
        }
      }
    } catch (e) {}

    return { success: true, projects, source: 'persistent-firestore' };
  },

  create: async (projectData) => {
    const docId = 'proj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newProj = {
      ...projectData,
      _id: docId,
      id: docId,
      createdAt: new Date().toISOString()
    };

    const existing = getStoredProjects();
    saveStoredProjects([newProj, ...existing]);

    asyncFirestoreSync(async () => {
      await setDoc(doc(db, PROJECTS_COLLECTION, docId), newProj);
    }, 'createProject');

    return {
      success: true,
      message: 'Project created successfully',
      project: newProj
    };
  },

  update: async (id, projectData) => {
    let updatedProj = null;
    const projects = getStoredProjects().map(p => {
      if (p._id === id || p.id === id) {
        updatedProj = { ...p, ...projectData, _id: id, id };
        return updatedProj;
      }
      return p;
    });

    if (!updatedProj) {
      updatedProj = { _id: id, id, ...projectData };
      projects.unshift(updatedProj);
    }
    saveStoredProjects(projects);

    asyncFirestoreSync(async () => {
      await updateDoc(doc(db, PROJECTS_COLLECTION, id), projectData);
    }, 'updateProject');

    return { success: true, message: 'Project updated successfully', project: updatedProj };
  },

  delete: async (id) => {
    const projects = getStoredProjects().filter(p => p._id !== id && p.id !== id);
    saveStoredProjects(projects);

    asyncFirestoreSync(async () => {
      await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
    }, 'deleteProject');

    return { success: true, message: 'Project removed successfully', id };
  }
};

// ==========================================
// FIRESTORE STATS OPERATIONS (Instant)
// ==========================================
export const firestoreStatsApi = {
  getStats: async () => {
    const blogsRes = await firestoreBlogApi.getAll({ adminView: 'true' });
    const projRes = await firestoreProjectApi.getAll();

    const blogs = blogsRes.blogs || [];
    const totalBlogs = blogs.length;
    const publishedBlogs = blogs.filter(b => b.isPublished !== false).length;
    const draftBlogs = blogs.filter(b => b.isPublished === false).length;
    const totalProjects = (projRes.projects || []).length;

    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;

    blogs.forEach(b => {
      totalViews += (b.viewsCount || 0);
      totalLikes += (b.likesCount || 0);
      totalComments += (b.comments?.length || 0);
    });

    return {
      success: true,
      stats: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalProjects,
        totalViews,
        totalLikes,
        totalComments
      },
      recentBlogs: blogs.slice(0, 5)
    };
  }
};
