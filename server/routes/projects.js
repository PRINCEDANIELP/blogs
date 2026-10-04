import express from 'express';
import { dbProjects } from '../data/store.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/projects - Get all portfolio projects
router.get('/', async (req, res) => {
  try {
    const projects = await dbProjects.find();
    return res.json({ success: true, projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch projects', error: error.message });
  }
});

// POST /api/projects - Add a new portfolio project (Admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, description, tags, category, image, liveUrl, githubUrl, featured } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const savedProject = await dbProjects.create({
      title,
      description,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      category: category || 'Full Stack',
      image: image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
      liveUrl: liveUrl || '',
      githubUrl: githubUrl || '',
      featured: Boolean(featured)
    });

    return res.status(201).json({
      success: true,
      message: 'Project created successfully in database',
      project: savedProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ success: false, message: 'Failed to create project', error: error.message });
  }
});

// PUT /api/projects/:id - Update project (Admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await dbProjects.updateById(id, req.body);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    return res.json({ success: true, message: 'Project updated successfully', project });
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({ success: false, message: 'Failed to update project', error: error.message });
  }
});

// DELETE /api/projects/:id - Delete project (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await dbProjects.deleteById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    return res.json({ success: true, message: 'Project deleted successfully from database' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete project', error: error.message });
  }
});

export default router;
