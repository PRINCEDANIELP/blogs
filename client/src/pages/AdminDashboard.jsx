import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { blogApi, projectApi, statsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  Heart, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Layers, 
  RefreshCw, 
  Sparkles, 
  Database, 
  Lock, 
  AlertTriangle, 
  ArrowRight,
  ExternalLink,
  Search,
  Save,
  Check
} from 'lucide-react';

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser, token, isAdmin, loginAsDemoAdmin, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'blogs'); // 'blogs', 'editor', 'projects', 'stats'
  const [stats, setStats] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });
  const [searchFilter, setSearchFilter] = useState('');

  // Blog Editor State
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    category: 'Technology',
    tags: '',
    excerpt: '',
    coverImage: '',
    content: '',
    isPublished: true
  });

  // Project Editor State
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    description: '',
    tags: '',
    category: 'Full Stack',
    image: '',
    liveUrl: '',
    githubUrl: '',
    featured: false
  });
  const [editingProjectId, setEditingProjectId] = useState(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, blogRes, projRes] = await Promise.all([
        statsApi.getStats(token),
        blogApi.getAll({ adminView: 'true', limit: 100 }),
        projectApi.getAll()
      ]);
      if (statsRes.stats) setStats(statsRes.stats);
      if (blogRes.blogs) setBlogs(blogRes.blogs);
      if (projRes.projects) setProjects(projRes.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, [isAdmin, token]);

  const showAlert = (type, text) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg({ type: '', text: '' }), 4000);
  };

  // Switch to Editor for creating a new post
  const handleStartCreateBlog = () => {
    setEditingBlogId(null);
    setBlogFormData({
      title: '',
      category: 'Technology',
      tags: '',
      excerpt: '',
      coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
      content: '## Introduction\n\nWrite your blog post content here...\n\n### Key Concepts\n- Point 1\n- Point 2\n\n```javascript\nconsole.log("Hello, World!");\n```',
      isPublished: true
    });
    setActiveTab('editor');
  };

  // Switch to Editor for modifying an existing post
  const handleStartEditBlog = (blog) => {
    setEditingBlogId(blog._id);
    setBlogFormData({
      title: blog.title || '',
      category: blog.category || 'Technology',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
      excerpt: blog.excerpt || '',
      coverImage: blog.coverImage || '',
      content: blog.content || '',
      isPublished: blog.isPublished !== undefined ? blog.isPublished : true
    });
    setActiveTab('editor');
  };

  // Save (Create or Update) Blog
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        ...blogFormData,
        tags: blogFormData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingBlogId) {
        const res = await blogApi.update(editingBlogId, payload);
        const updated = res?.blog || { ...payload, _id: editingBlogId, id: editingBlogId };
        setBlogs(prev => prev.map(b => (b._id === editingBlogId || b.id === editingBlogId) ? { ...b, ...updated } : b));
        showAlert('success', 'Blog post successfully updated in database!');
      } else {
        const res = await blogApi.create(payload, currentUser);
        const created = res?.blog;
        if (created) {
          setBlogs(prev => [created, ...prev]);
        }
        showAlert('success', 'New blog post successfully published to database!');
      }

      setEditingBlogId(null);
      setActiveTab('blogs');
      loadAdminData();
    } catch (err) {
      console.error(err);
      showAlert('error', err.message || 'Failed to save blog post.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Blog
  const handleDeleteBlog = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    setActionLoading(true);
    try {
      await blogApi.delete(id);
      showAlert('success', 'Blog post deleted from database.');
      setBlogs(prev => prev.filter(b => b._id !== id && b.id !== id));
      loadAdminData();
    } catch (err) {
      showAlert('error', err.message || 'Failed to delete blog.');
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Toggle Publish Status
  const handleTogglePublish = async (blog) => {
    try {
      const newStatus = !blog.isPublished;
      await blogApi.update(blog._id || blog.id, { isPublished: newStatus });
      setBlogs(prev => prev.map(b => (b._id === blog._id || b.id === blog.id) ? { ...b, isPublished: newStatus } : b));
      showAlert('success', `Post status changed to ${newStatus ? 'Published' : 'Draft'}`);
    } catch (err) {
      showAlert('error', 'Failed to toggle status');
    }
  };

  // Save Project
  const handleSaveProject = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        ...projectFormData,
        tags: projectFormData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      if (editingProjectId) {
        const res = await projectApi.update(editingProjectId, payload);
        const updated = res?.project || { ...payload, _id: editingProjectId, id: editingProjectId };
        setProjects(prev => prev.map(p => (p._id === editingProjectId || p.id === editingProjectId) ? { ...p, ...updated } : p));
        showAlert('success', 'Project updated successfully in database');
      } else {
        const res = await projectApi.create(payload);
        if (res?.project) {
          setProjects(prev => [res.project, ...prev]);
        }
        showAlert('success', 'Project created successfully in database');
      }
      setEditingProjectId(null);
      setProjectFormData({ title: '', description: '', tags: '', category: 'Full Stack', image: '', liveUrl: '', githubUrl: '', featured: false });
      loadAdminData();
    } catch (err) {
      showAlert('error', err.message || 'Failed to save project');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectApi.delete(id);
      showAlert('success', 'Project deleted from Firestore');
      setProjects(projects.filter(p => p._id !== id));
    } catch (err) {
      showAlert('error', 'Failed to delete project');
    }
  };

  // ==========================================
  // RESTRICTED ACCESS SCREEN (If not Admin)
  // ==========================================
  if (!isAdmin) {
    return (
      <div style={{ padding: '80px 0 100px 0' }}>
        <div className="container-custom" style={{ maxWidth: '640px' }}>
          <div className="glass-panel" style={{ padding: '48px 36px', textAlign: 'center', borderRadius: '24px' }}>
            
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Lock size={32} color="#f43f5e" />
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '12px' }}>
              Admin Access Restricted
            </h2>

            <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '28px' }}>
              The Admin Panel is strictly protected with Firebase Authentication and role authorization. You must be authenticated with an authorized administrator account to manage blog posts and database records.
            </p>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-glass)',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '28px',
              textAlign: 'left',
              fontSize: '0.85rem'
            }}>
              <div style={{ fontWeight: 700, color: '#818cf8', marginBottom: '6px' }}>Authorized Admin Credentials:</div>
              <div style={{ color: '#cbd5e1' }}>Email: <code style={{ color: '#fb7185' }}>admin@portfolio.dev</code></div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '4px' }}>
                Or test immediately with the 1-click Demo Admin shortcut below.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={loginAsDemoAdmin}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', height: '48px', fontSize: '1rem' }}
              >
                <ShieldCheck size={20} />
                <span>Sign In as Demo Admin (1-Click)</span>
              </button>

              <Link
                to="/login"
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', height: '44px', textDecoration: 'none' }}
              >
                Sign In (Choose Admin Role)
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    b.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div style={{ padding: '50px 0 90px 0' }}>
      <div className="container-custom">
        
        {/* Admin Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '36px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-admin">
                <ShieldCheck size={13} /> ADMIN CONSOLE
              </span>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Logged in as <strong style={{ color: '#f8fafc' }}>{currentUser?.email}</strong>
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc' }}>
              Blog & Content <span className="gradient-text">Management System</span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleStartCreateBlog}
              className="btn-primary"
              style={{ padding: '10px 20px' }}
            >
              <PlusCircle size={18} />
              <span>Create Blog Post</span>
            </button>
            <button
              onClick={loadAdminData}
              disabled={loading}
              className="btn-secondary"
              style={{ padding: '10px 14px' }}
              title="Refresh Data"
            >
              <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Global Feedback Alert */}
        {alertMsg.text && (
          <div style={{
            background: alertMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            border: `1px solid ${alertMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            borderRadius: '12px',
            padding: '12px 18px',
            color: alertMsg.type === 'success' ? '#34d399' : '#fb7185',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {alertMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            <span>{alertMsg.text}</span>
          </div>
        )}

        {/* Analytics Overview Cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Total Posts</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                {stats.totalBlogs}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '4px' }}>
                {stats.publishedBlogs} Published • {stats.draftBlogs} Drafts
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Total Views</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                {stats.totalViews || 0}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>Across all articles</div>
            </div>

            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Total Likes</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fb7185', marginTop: '4px' }}>
                {stats.totalLikes || 0}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>User reactions</div>
            </div>

            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Comments</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a855f7', marginTop: '4px' }}>
                {stats.totalComments || 0}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>Reader discussions</div>
            </div>

            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Portfolio Projects</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                {stats.totalProjects || projects.length}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>Showcase entries</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', marginBottom: '28px' }}>
          {[
            { id: 'blogs', name: `Manage Blogs (${blogs.length})`, icon: FileText },
            { id: 'editor', name: editingBlogId ? 'Edit Blog Post' : 'New Blog Post', icon: Edit3 },
            { id: 'projects', name: `Portfolio Projects (${projects.length})`, icon: Layers }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  border: 'none',
                  background: active ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  color: active ? '#ffffff' : '#94a3b8',
                  borderBottom: active ? '2px solid #6366f1' : '2px solid transparent'
                }}
              >
                <Icon size={16} color={active ? '#818cf8' : '#64748b'} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: MANAGE BLOGS TABLE                                 */}
        {/* ========================================================= */}
        {activeTab === 'blogs' && (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
            
            {/* Filter Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '320px' }}>
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filter posts by title or category..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '38px', height: '40px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Showing <strong>{filteredBlogs.length}</strong> posts in MongoDB
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Post</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Stats</th>
                    <th style={{ padding: '12px 16px' }}>Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                        No blog posts match your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredBlogs.map((blog) => (
                      <tr
                        key={blog._id}
                        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Title & Cover */}
                        <td style={{ padding: '16px', minWidth: '280px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={blog.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'}
                              alt="Cover"
                              style={{ width: '50px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: '#f8fafc', lineHeight: 1.3 }}>
                                {blog.title}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                                /{blog.slug}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={{ padding: '16px' }}>
                          <span className="badge badge-tech" style={{ fontSize: '0.72rem' }}>
                            {blog.category}
                          </span>
                        </td>

                        {/* Status Toggle */}
                        <td style={{ padding: '16px' }}>
                          <button
                            onClick={() => handleTogglePublish(blog)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              padding: 0
                            }}
                            title="Click to toggle publish status"
                          >
                            <span className={`badge ${blog.isPublished ? 'badge-success' : 'badge-admin'}`} style={{ cursor: 'pointer' }}>
                              {blog.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </button>
                        </td>

                        {/* Stats */}
                        <td style={{ padding: '16px', color: '#94a3b8', fontSize: '0.8rem' }}>
                          <div>👁️ {blog.viewsCount || 0} views</div>
                          <div>❤️ {blog.likesCount || 0} likes</div>
                        </td>

                        {/* Date */}
                        <td style={{ padding: '16px', color: '#94a3b8', fontSize: '0.8rem' }}>
                          {new Date(blog.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <Link
                              to={`/blogs/${blog.slug || blog._id}`}
                              target="_blank"
                              className="btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                              title="View Public Post"
                            >
                              <ExternalLink size={14} />
                            </Link>

                            <button
                              onClick={() => handleStartEditBlog(blog)}
                              className="btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '0.78rem', color: '#38bdf8' }}
                              title="Edit Post"
                            >
                              <Edit3 size={14} />
                            </button>

                            <button
                              onClick={() => handleDeleteBlog(blog._id, blog.title)}
                              className="btn-danger"
                              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                              title="Delete Post"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CREATE / EDIT BLOG POST FORM                       */}
        {/* ========================================================= */}
        {activeTab === 'editor' && (
          <div className="glass-panel" style={{ padding: '36px', borderRadius: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
                  {editingBlogId ? 'Update Blog Post' : 'Compose New Blog Post'}
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
                  Changes are saved instantly to your Firestore database.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('blogs')}
                className="btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveBlog} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Title & Category Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                    Post Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Deep Dive into MongoDB Sharding and Replication"
                    value={blogFormData.title}
                    onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                    Category *
                  </label>
                  <select
                    value={blogFormData.category}
                    onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                    className="input-field"
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Web Development">Web Development</option>
                    <option value="AI & ML">AI & ML</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Design & UI/UX">Design & UI/UX</option>
                    <option value="Career & Tips">Career & Tips</option>
                    <option value="Tutorials">Tutorials</option>
                  </select>
                </div>
              </div>

              {/* Cover Image URL & Tags */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={blogFormData.coverImage}
                    onChange={(e) => setBlogFormData({ ...blogFormData, coverImage: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="React, MongoDB, Backend, FullStack"
                    value={blogFormData.tags}
                    onChange={(e) => setBlogFormData({ ...blogFormData, tags: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                  Short Summary / Excerpt * (Displayed on blog cards)
                </label>
                <textarea
                  required
                  rows={2}
                  maxLength={300}
                  placeholder="Provide a concise 1-2 sentence overview of the article..."
                  value={blogFormData.excerpt}
                  onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                  className="input-field"
                ></textarea>
              </div>

              {/* Full Content Editor */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>
                    Article Body Content * (Supports Markdown: # Heading, ```code```, - lists)
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#818cf8' }}>
                    Markdown Formatted
                  </span>
                </div>
                <textarea
                  required
                  rows={14}
                  placeholder="Write your in-depth post content in Markdown here..."
                  value={blogFormData.content}
                  onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                  className="input-field"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: 1.6 }}
                ></textarea>
              </div>

              {/* Publish Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0' }}>
                <input
                  type="checkbox"
                  id="publishCheckbox"
                  checked={blogFormData.isPublished}
                  onChange={(e) => setBlogFormData({ ...blogFormData, isPublished: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#6366f1' }}
                />
                <label htmlFor="publishCheckbox" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', cursor: 'pointer' }}>
                  Publish immediately (Uncheck to save as draft)
                </label>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="btn-primary"
                  style={{ height: '48px', padding: '0 28px', fontSize: '0.95rem' }}
                >
                  <Save size={18} />
                  <span>{actionLoading ? 'Saving to Database...' : (editingBlogId ? 'Save & Update Post' : 'Publish Blog Post')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('blogs')}
                  className="btn-secondary"
                  style={{ height: '48px', padding: '0 20px' }}
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PORTFOLIO PROJECTS MANAGER                         */}
        {/* ========================================================= */}
        {activeTab === 'projects' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* Create Project Form */}
            <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
                {editingProjectId ? 'Edit Project' : 'Add New Portfolio Project'}
              </h3>

              <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Project Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Cloud Cache"
                    value={projectFormData.title}
                    onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Category</label>
                  <select
                    value={projectFormData.category}
                    onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="AI & ML">AI & ML</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={projectFormData.image}
                    onChange={(e) => setProjectFormData({ ...projectFormData, image: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="React, Docker, Node.js"
                    value={projectFormData.tags}
                    onChange={(e) => setProjectFormData({ ...projectFormData, tags: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Architecture and feature summary..."
                    value={projectFormData.description}
                    onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                    className="input-field"
                  ></textarea>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Live URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={projectFormData.liveUrl}
                      onChange={(e) => setProjectFormData({ ...projectFormData, liveUrl: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>GitHub URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={projectFormData.githubUrl}
                      onChange={(e) => setProjectFormData({ ...projectFormData, githubUrl: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <button type="submit" disabled={actionLoading} className="btn-primary" style={{ marginTop: '8px', justifyContent: 'center' }}>
                  <Save size={16} />
                  <span>{editingProjectId ? 'Update Project' : 'Add Project'}</span>
                </button>
              </form>
            </div>

            {/* Existing Projects List */}
            <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
                Existing Projects ({projects.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {projects.map((p) => (
                  <div key={p._id} style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={p.image} alt={p.title} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.92rem' }}>{p.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.category}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => {
                          setEditingProjectId(p._id);
                          setProjectFormData({
                            title: p.title,
                            description: p.description,
                            tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
                            category: p.category || 'Full Stack',
                            image: p.image || '',
                            liveUrl: p.liveUrl || '',
                            githubUrl: p.githubUrl || '',
                            featured: p.featured || false
                          });
                        }}
                        className="btn-secondary"
                        style={{ padding: '6px 8px' }}
                      >
                        <Edit3 size={14} color="#38bdf8" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p._id)}
                        className="btn-danger"
                        style={{ padding: '6px 8px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
