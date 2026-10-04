import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userAvatar: { type: String, default: '' },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    maxlength: 300
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'
  },
  category: {
    type: String,
    default: 'Technology',
    enum: ['Technology', 'Web Development', 'AI & ML', 'Cloud & DevOps', 'Design & UI/UX', 'Career & Tips', 'Tutorials']
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    name: { type: String, default: 'Portfolio Admin' },
    email: { type: String, default: 'admin@portfolio.dev' },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    uid: { type: String, default: 'admin' }
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  viewsCount: {
    type: Number,
    default: 0
  },
  likes: [{
    type: String // user IDs / emails
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  comments: [commentSchema]
}, {
  timestamps: true
});

// Calculate read time before saving
blogSchema.pre('save', function(next) {
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    this.readTime = `${minutes} min read`;
  }
  next();
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog;
