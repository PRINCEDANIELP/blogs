import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Send, 
  Sparkles, 
  Check, 
  User, 
  Calendar,
  AlertCircle
} from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams();
  const { currentUser, token, openAuthModal } = useAuth();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadBlog = async () => {
      setLoading(true);
      try {
        const res = await blogApi.getBySlugOrId(slug);
        if (res.blog) {
          setBlog(res.blog);
          setLikesCount(res.blog.likesCount || 0);
          if (currentUser && res.blog.likes) {
            const uid = currentUser.uid || currentUser.email;
            setIsLiked(res.blog.likes.includes(uid));
          }
        }
        if (res.relatedBlogs) setRelatedBlogs(res.relatedBlogs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadBlog();
    window.scrollTo(0, 0);
  }, [slug, currentUser]);

  const handleLike = async () => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }
    try {
      const res = await blogApi.like(blog._id, currentUser.uid || currentUser.email);
      if (res.success) {
        setIsLiked(res.liked);
        setLikesCount(res.likesCount);
      }
    } catch (err) {
      // Local UI toggle fallback
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal('login');
      return;
    }
    if (!commentText.trim()) return;

    setCommentLoading(true);
    setErrorMsg('');

    try {
      const res = await blogApi.addComment(blog._id, commentText, currentUser);
      if (res.success && res.comments) {
        setBlog({ ...blog, comments: res.comments });
        setCommentText('');
      }
    } catch (err) {
      // Local optimistic fallback
      const newComment = {
        _id: 'c_' + Date.now(),
        userName: currentUser.displayName || currentUser.email.split('@')[0],
        userEmail: currentUser.email,
        userAvatar: currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`,
        comment: commentText.trim(),
        createdAt: new Date().toISOString()
      };
      setBlog({
        ...blog,
        comments: [newComment, ...(blog.comments || [])]
      });
      setCommentText('');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Helper to render markdown headings and paragraphs cleanly
  const renderFormattedContent = (content) => {
    if (!content) return null;

    return content.split('\n\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();

      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={index} style={{ fontSize: '2rem', fontWeight: 800, marginTop: '32px', marginBottom: '16px', color: '#f8fafc' }}>
            {trimmed.replace('# ', '')}
          </h1>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={index} style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '28px', marginBottom: '14px', color: '#e2e8f0' }}>
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '24px', marginBottom: '12px', color: '#cbd5e1' }}>
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('```')) {
        const lines = trimmed.split('\n');
        const code = lines.slice(1, -1).join('\n') || trimmed.replace(/```[a-z]*/g, '');
        return (
          <pre key={index} style={{
            background: '#040814',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            padding: '20px',
            borderRadius: '14px',
            overflowX: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: '#38bdf8',
            margin: '24px 0',
            lineHeight: 1.6
          }}>
            <code>{code}</code>
          </pre>
        );
      }
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map(li => li.replace(/^-\s*/, ''));
        return (
          <ul key={index} style={{ paddingLeft: '24px', marginBottom: '20px', color: '#cbd5e1', lineHeight: 1.8 }}>
            {items.map((it, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>{it}</li>
            ))}
          </ul>
        );
      }

      return (
        <p key={index} style={{ color: '#cbd5e1', lineHeight: 1.85, fontSize: '1.08rem', marginBottom: '22px' }}>
          {trimmed}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0', color: '#94a3b8' }}>
        <div style={{
          width: '44px',
          height: '44px',
          border: '3px solid rgba(99,102,241,0.2)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          margin: '0 auto 16px auto',
          animation: 'spin 1s linear infinite'
        }}></div>
        <span>Loading article...</span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container-custom" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#f8fafc', marginBottom: '16px' }}>Article Not Found</h2>
        <Link to="/blogs" className="btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Articles</span>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 90px 0' }}>
      <div className="container-custom" style={{ maxWidth: '920px' }}>
        
        {/* Back Link */}
        <Link
          to="/blogs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#94a3b8',
            fontSize: '0.9rem',
            fontWeight: 600,
            textDecoration: 'none',
            marginBottom: '32px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#f8fafc')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <ArrowLeft size={17} />
          <span>Back to all articles</span>
        </Link>

        {/* Category & Meta Header */}
        <div style={{ marginBottom: '20px' }}>
          <span className="badge badge-tech" style={{ fontSize: '0.8rem', padding: '5px 12px', marginBottom: '16px' }}>
            {blog.category}
          </span>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: '#f8fafc',
            marginBottom: '20px'
          }}>
            {blog.title}
          </h1>

          {/* Excerpt */}
          <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
            {blog.excerpt}
          </p>

          {/* Author & Stats Row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '16px 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={blog.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={blog.author?.name || 'Author'}
                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                  {blog.author?.name || 'Portfolio Admin'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Published on {new Date(blog.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: '#94a3b8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={16} />
                {blog.readTime || '5 min read'}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Eye size={16} />
                {blog.viewsCount || 0} views
              </span>
              
              <button
                onClick={handleCopyShare}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                {copiedLink ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
                <span>{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cover Image Banner */}
        {blog.coverImage && (
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            marginBottom: '40px',
            border: '1px solid var(--border-glass)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <img
              src={blog.coverImage}
              alt={blog.title}
              style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* Article Body Content */}
        <div className="glass-panel prose-custom" style={{ padding: '40px', borderRadius: '20px', marginBottom: '40px' }}>
          {renderFormattedContent(blog.content)}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '10px' }}>
                TOPICS DISCUSSED:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {blog.tags.map((tag, idx) => (
                  <Link
                    key={idx}
                    to={`/blogs?tag=${tag}`}
                    style={{
                      fontSize: '0.8rem',
                      padding: '4px 12px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      borderRadius: '8px',
                      color: '#818cf8',
                      textDecoration: 'none'
                    }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Floating / Bottom Action Bar (Likes & Comments) */}
        <div className="glass-panel" style={{
          padding: '20px 30px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '50px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleLike}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: '1px solid',
                transition: 'all 0.2s ease',
                background: isLiked ? 'rgba(244, 63, 94, 0.2)' : 'rgba(30, 41, 59, 0.8)',
                color: isLiked ? '#fb7185' : '#f8fafc',
                borderColor: isLiked ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-glass)'
              }}
            >
              <Heart size={18} fill={isLiked ? '#fb7185' : 'transparent'} />
              <span>{isLiked ? 'Liked' : 'Like'} ({likesCount})</span>
            </button>

            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              {blog.comments?.length || 0} Comments
            </span>
          </div>

          <button
            onClick={handleCopyShare}
            className="btn-secondary"
          >
            <Share2 size={16} />
            <span>{copiedLink ? 'Link Copied!' : 'Share Article'}</span>
          </button>
        </div>

        {/* Comments Section */}
        <section className="glass-panel" style={{ padding: '36px', borderRadius: '20px', marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <MessageSquare size={22} color="#818cf8" />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              Discussion ({blog.comments?.length || 0})
            </h3>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: '36px' }}>
            {currentUser ? (
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <img
                  src={currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`}
                  alt="Your avatar"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', marginTop: '4px' }}
                />
                <div style={{ flex: 1 }}>
                  <textarea
                    rows={3}
                    placeholder="Share your thoughts or ask a question about this post..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="input-field"
                    style={{ resize: 'vertical', marginBottom: '10px' }}
                  ></textarea>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={commentLoading || !commentText.trim()}
                      className="btn-primary"
                      style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                    >
                      <Send size={15} />
                      <span>{commentLoading ? 'Posting...' : 'Post Comment'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px dashed rgba(99, 102, 241, 0.3)',
                borderRadius: '14px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '14px' }}>
                  Join the discussion! Sign in with Firebase Authentication to leave a comment.
                </p>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                >
                  Sign In to Comment
                </button>
              </div>
            )}
          </form>

          {/* Comment List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(!blog.comments || blog.comments.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: '0.9rem' }}>
                No comments yet. Be the first to share your perspective!
              </div>
            ) : (
              blog.comments.map((comment, idx) => (
                <div
                  key={comment._id || idx}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-glass)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={comment.userAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${comment.userEmail || idx}`}
                        alt={comment.userName}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                          {comment.userName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6, paddingLeft: '42px' }}>
                    {comment.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default BlogDetail;
