import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { blogApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  BookOpen, 
  Clock, 
  Eye, 
  Heart, 
  MessageSquare, 
  ArrowRight, 
  PlusCircle, 
  Filter,
  Sparkles,
  Tag
} from 'lucide-react';

const BlogList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (selectedTag) params.tag = selectedTag;

      const res = await blogApi.getAll(params);
      if (res.blogs) setBlogs(res.blogs);
      if (res.categories) setCategories(res.categories);
      if (res.tags) setTags(res.tags);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory, selectedTag]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBlogs();
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleTagClick = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag('');
      searchParams.delete('tag');
    } else {
      setSelectedTag(tag);
      searchParams.set('tag', tag);
    }
    setSearchParams(searchParams);
  };

  return (
    <div style={{ padding: '60px 0 90px 0' }}>
      <div className="container-custom">
        
        {/* Header Title */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#818cf8',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            <BookOpen size={15} />
            <span>ARTICLES, INSIGHTS & TUTORIALS</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#f8fafc', marginBottom: '16px' }}>
            Technical <span className="gradient-text">Blog & Knowledge Base</span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6 }}>
            In-depth guides on full-stack web development, cloud architectures, database design with MongoDB, and security with Firebase Auth.
          </p>

          {isAdmin && (
            <div style={{ marginTop: '20px' }}>
              <Link to="/admin?tab=new-post" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                <PlusCircle size={18} />
                <span>Publish New Blog Post</span>
              </Link>
            </div>
          )}
        </div>

        {/* Search & Filter Controls */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', marginBottom: '40px' }}>
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search articles by title, keywords, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '46px', height: '48px', fontSize: '0.95rem' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ height: '48px', padding: '0 24px' }}>
              Search
            </button>
          </form>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#94a3b8', marginRight: '6px' }}>
              <Filter size={14} /> Categories:
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  background: selectedCategory === cat ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(30, 41, 59, 0.6)',
                  color: selectedCategory === cat ? '#ffffff' : '#94a3b8',
                  borderColor: selectedCategory === cat ? '#6366f1' : 'var(--border-glass)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tag Filter Pills */}
          {tags.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#64748b', marginRight: '6px' }}>
                <Tag size={13} /> Tags:
              </div>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    border: '1px solid',
                    fontFamily: 'inherit',
                    background: selectedTag === tag ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    color: selectedTag === tag ? '#818cf8' : '#94a3b8',
                    borderColor: selectedTag === tag ? '#6366f1' : 'transparent'
                  }}
                >
                  #{tag}
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={() => handleTagClick('')}
                  style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: '0.75rem', cursor: 'pointer', marginLeft: '6px' }}
                >
                  Clear Tag
                </button>
              )}
            </div>
          )}

        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(99,102,241,0.2)',
              borderTopColor: '#6366f1',
              borderRadius: '50%',
              margin: '0 auto 16px auto',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <span>Loading articles from MongoDB...</span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '20px' }}>
            <BookOpen size={48} color="#64748b" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
              No Articles Found
            </h3>
            <p style={{ color: '#94a3b8', maxWidth: '440px', margin: '0 auto 20px auto', fontSize: '0.9rem' }}>
              No published articles match your current search or category filters. Try clearing your filters or creating a new post.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setSelectedTag(''); }}
              className="btn-secondary"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid-cols-auto-fit">
            {blogs.map((blog) => (
              <article key={blog._id || blog.slug} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                
                {/* Cover Image */}
                <div style={{ height: '210px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={blog.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'}
                    alt={blog.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
                    <span className="badge badge-tech" style={{ backdropFilter: 'blur(8px)', background: 'rgba(15, 23, 42, 0.85)' }}>
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      {blog.readTime || '5 min read'}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={14} />
                      {blog.viewsCount || 0} views
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Heart size={14} color="#fb7185" />
                      {blog.likesCount || 0}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.4, marginBottom: '10px' }}>
                    <Link to={`/blogs/${blog.slug || blog._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {blog.title}
                    </Link>
                  </h2>

                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '18px', flex: 1 }}>
                    {blog.excerpt}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {blog.tags?.slice(0, 3).map((t, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        borderRadius: '4px',
                        color: '#94a3b8'
                      }}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Author & CTA Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={blog.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt={blog.author?.name || 'Author'}
                        style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>
                          {blog.author?.name || 'Admin'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {new Date(blog.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/blogs/${blog.slug || blog._id}`}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                    >
                      <span>Read Post</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogList;
