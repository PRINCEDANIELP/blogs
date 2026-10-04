import express from 'express';
import { dbBlogs, dbProjects } from '../data/store.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/stats - Get analytics and counts for the Admin Dashboard
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const allBlogs = await dbBlogs.find({});
    const totalBlogs = allBlogs.length;
    const publishedBlogs = allBlogs.filter(b => b.isPublished).length;
    const draftBlogs = allBlogs.filter(b => !b.isPublished).length;
    const totalProjects = await dbProjects.countDocuments();

    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;

    const categoryMap = {};

    allBlogs.forEach(b => {
      totalViews += (b.viewsCount || 0);
      totalLikes += (b.likesCount || 0);
      totalComments += (b.comments?.length || 0);
      const cat = b.category || 'General';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const categoriesDistribution = Object.keys(categoryMap).map(k => ({
      _id: k,
      count: categoryMap[k]
    }));

    const recentBlogs = allBlogs.slice(0, 5);

    return res.json({
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
      recentBlogs,
      categoriesDistribution
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch statistics', error: error.message });
  }
});

export default router;
