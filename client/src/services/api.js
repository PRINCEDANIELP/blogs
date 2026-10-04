import { 
  firestoreBlogApi, 
  firestoreProjectApi, 
  firestoreStatsApi 
} from './firestoreService';

// Firebase Firestore is now your active backend database!
export const blogApi = {
  getAll: (params) => firestoreBlogApi.getAll(params),
  getBySlugOrId: (slugOrId) => firestoreBlogApi.getBySlugOrId(slugOrId),
  create: (blogData, user) => firestoreBlogApi.create(blogData, user),
  update: (id, blogData) => firestoreBlogApi.update(id, blogData),
  delete: (id) => firestoreBlogApi.delete(id),
  like: (id, userId) => firestoreBlogApi.like(id, userId),
  addComment: (id, commentText, user) => firestoreBlogApi.addComment(id, commentText, user)
};

export const projectApi = {
  getAll: () => firestoreProjectApi.getAll(),
  create: (data) => firestoreProjectApi.create(data),
  update: (id, data) => firestoreProjectApi.update(id, data),
  delete: (id) => firestoreProjectApi.delete(id)
};

export const statsApi = {
  getStats: () => firestoreStatsApi.getStats(),
  getHealth: async () => ({
    success: true,
    status: 'online',
    backend: 'Firebase Backend (Auth + Firestore)',
    projectId: 'blog-5f508',
    appId: '1:299121501531:web:80202ff78d9599eacae67e',
    database: {
      connected: true,
      type: 'Cloud Firestore',
      instance: 'blog-5f508'
    },
    auth: {
      provider: 'Firebase Authentication',
      emailPassword: true,
      google: true
    }
  })
};
