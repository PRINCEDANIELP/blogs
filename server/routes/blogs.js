import express from 'express';
import { dbBlogs, isMongoLive } from '../data/store.js';
import { verifyAuth, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim() + '-' + Math.random().toString(36).substring(2, 7);
};

// GET /api/blogs - Get all blogs with filters, search, and pagination
router.get('/', async (req, res) => {
  try {
    const { category, tag, search, adminView, limit = 20, page = 1 } = req.query;
    let filter = {};

    if (adminView !== 'true') {
      filter.isPublished = true;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (tag) {
      filter.tag = tag;
    }

    let blogs = await dbBlogs.find(filter);

    if (search) {
      const q = search.toLowerCase();
      blogs = blogs.filter(b => 
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
        (b.content && b.content.toLowerCase().includes(q)) ||
        (b.tags && b.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    const totalBlogs = blogs.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedBlogs = blogs.slice(skip, skip + parseInt(limit));

    const allCategories = [...new Set(blogs.map(b => b.category).filter(Boolean))];
    const allTags = [...new Set(blogs.flatMap(b => b.tags || []).filter(Boolean))];

    return res.json({
      success: true,
      blogs: paginatedBlogs,
      pagination: {
        total: totalBlogs,
        page: parseInt(page),
        pages: Math.ceil(totalBlogs / parseInt(limit)) || 1
      },
      categories: ['All', ...allCategories],
      tags: allTags,
      dbStatus: isMongoLive() ? 'mongodb_atlas' : 'local_database'
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch blogs', error: error.message });
  }
});

// GET /api/blogs/:slugOrId - Get a single blog post
router.get('/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    let blog = await dbBlogs.findById(slugOrId);
    
    if (!blog) {
      blog = await dbBlogs.findOne({ slug: slugOrId });
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Increment views count
    const updatedViews = (blog.viewsCount || 0) + 1;
    blog = await dbBlogs.updateById(blog._id, { viewsCount: updatedViews }) || blog;

    // Fetch related blogs from same category
    const allSameCat = await dbBlogs.find({ category: blog.category });
    const relatedBlogs = allSameCat
      .filter(b => String(b._id) !== String(blog._id))
      .slice(0, 3);

    return res.json({
      success: true,
      blog,
      relatedBlogs
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch blog post', error: error.message });
  }
});

// POST /api/blogs - Create a new blog post (Admin Only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, category, tags, isPublished, author } = req.body;

    if (!title || !content || !excerpt) {
      return res.status(400).json({ success: false, message: 'Title, excerpt, and content are required' });
    }

    const slug = createSlug(title);
    const wordCount = content.split(/\s+/).length;
    const readTime = `${Math.ceil(wordCount / 200)} min read`;

    const newBlog = await dbBlogs.create({
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
      category: category || 'Technology',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      readTime,
      isPublished: isPublished !== undefined ? isPublished : true,
      author: {
        name: author?.name || req.user?.name || 'Portfolio Admin',
        email: author?.email || req.user?.email || 'admin@portfolio.dev',
        avatar: author?.avatar || req.user?.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        uid: author?.uid || req.user?.uid || 'admin'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully in database',
      blog: newBlog
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    return res.status(500).json({ success: false, message: 'Failed to create blog post', error: error.message });
  }
});

// PUT /api/blogs/:id - Update an existing blog post (Admin Only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, coverImage, category, tags, isPublished } = req.body;

    const updateFields = {};
    if (title) updateFields.title = title;
    if (excerpt) updateFields.excerpt = excerpt;
    if (content) {
      updateFields.content = content;
      const wordCount = content.split(/\s+/).length;
      updateFields.readTime = `${Math.ceil(wordCount / 200)} min read`;
    }
    if (coverImage) updateFields.coverImage = coverImage;
    if (category) updateFields.category = category;
    if (tags !== undefined) {
      updateFields.tags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);
    }
    if (isPublished !== undefined) updateFields.isPublished = isPublished;

    const updatedBlog = await dbBlogs.updateById(id, updateFields);

    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    return res.json({
      success: true,
      message: 'Blog post updated successfully',
      blog: updatedBlog
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return res.status(500).json({ success: false, message: 'Failed to update blog post', error: error.message });
  }
});

// DELETE /api/blogs/:id - Delete a blog post (Admin Only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await dbBlogs.deleteById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    return res.json({
      success: true,
      message: 'Blog post deleted successfully from database',
      id
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete blog post', error: error.message });
  }
});

// POST /api/blogs/:id/like - Like or Unlike a blog post (Authenticated users)
router.post('/:id/like', verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.email;

    const blog = await dbBlogs.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const likes = blog.likes || [];
    const alreadyLiked = likes.includes(userId);
    const newLikes = alreadyLiked ? likes.filter(u => u !== userId) : [...likes, userId];

    const updatedBlog = await dbBlogs.updateById(id, {
      likes: newLikes,
      likesCount: newLikes.length
    });

    return res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: updatedBlog.likesCount
    });
  } catch (error) {
    console.error('Error updating like:', error);
    return res.status(500).json({ success: false, message: 'Failed to toggle like', error: error.message });
  }
});

// POST /api/blogs/:id/comments - Add a comment to a blog post (Authenticated users)
router.post('/:id/comments', verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    const blog = await dbBlogs.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const newComment = {
      _id: 'c_' + Date.now(),
      userId: req.user.uid || 'anon',
      userName: req.user.name || req.user.email?.split('@')[0] || 'User',
      userEmail: req.user.email || 'anonymous',
      userAvatar: req.user.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${req.user.email || 'user'}`,
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    const comments = [newComment, ...(blog.comments || [])];
    await dbBlogs.updateById(id, { comments });

    return res.status(201).json({
      success: true,
      message: 'Comment posted successfully',
      comments
    });
  } catch (error) {
    console.error('Error posting comment:', error);
    return res.status(500).json({ success: false, message: 'Failed to post comment', error: error.message });
  }
});

export default router;
