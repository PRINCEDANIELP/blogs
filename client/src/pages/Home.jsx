import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogApi, projectApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Code2, 
  Database, 
  ShieldCheck, 
  ExternalLink, 
  Heart, 
  MessageSquare, 
  Eye, 
  Clock, 
  Layers, 
  Send, 
  CheckCircle2 
} from 'lucide-react';
import { GithubIcon } from '../components/SocialIcons';


const Home = () => {
  const { openAuthModal, currentUser } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [blogRes, projectRes] = await Promise.all([
          blogApi.getAll({ limit: 3 }),
          projectApi.getAll()
        ]);
        if (blogRes.blogs) setBlogs(blogRes.blogs.slice(0, 3));
        if (projectRes.projects) setProjects(projectRes.projects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', message: '' });
      setContactSubmitted(false);
    }, 4000);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '90px 0 70px 0', overflow: 'hidden' }}>
        <div className="container-custom">
          
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            {/* Pill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818cf8',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '24px',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)'
            }}>
              <Sparkles size={16} />
              <span>Full Stack Engineer & Technical Writer</span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '24px'
            }}>
              Crafting Scalable Web Systems & Sharing <span className="gradient-text">Architectural Insights</span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: '#94a3b8',
              lineHeight: 1.7,
              marginBottom: '36px',
              maxWidth: '680px',
              margin: '0 auto 36px auto'
            }}>
              Explore deep dives into modern full-stack architectures, database optimizations with MongoDB, secure authentication flows with Firebase, and high-performance interactive applications.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginBottom: '50px' }}>
              <Link to="/blogs" className="btn-primary" style={{ padding: '14px 28px', fontSize: '1.02rem' }}>
                <BookOpen size={19} />
                <span>Read Articles</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/portfolio" className="btn-secondary" style={{ padding: '14px 26px', fontSize: '1.02rem' }}>
                <Code2 size={19} />
                <span>Explore Projects</span>
              </Link>
            </div>

            {/* Metric Highlights Banner */}
            <div className="glass-panel" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '20px',
              padding: '24px',
              borderRadius: '20px'
            }}>
              {[
                { label: 'Articles Published', val: '10+' },
                { label: 'Database Ops', val: 'MongoDB Atlas' },
                { label: 'Auth System', val: 'Firebase RBAC' },
                { label: 'Uptime & Speed', val: '99.9%' }
              ].map((m, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }} className="gradient-text">
                    {m.val}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px', fontWeight: 500 }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Tech Stack Pillars */}
      <section style={{ padding: '40px 0 60px 0' }}>
        <div className="container-custom">
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>
              Core Engineering Stack
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', marginTop: '6px' }}>
              Robust full stack integration designed for scalability, security, and developer joy
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Database size={24} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>MongoDB & Mongoose</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Flexible NoSQL data layer with schema enforcement, aggregation pipelines, and high-concurrency document management.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <ShieldCheck size={24} color="#818cf8" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Firebase Authentication</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Enterprise identity management, secure JWT token validation, OAuth providers, and role-based admin panel protection.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Code2 size={24} color="#06b6d4" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>React 19 & Vite</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Declarative UI components with instant HMR, reactive state management, and modern glassmorphic styling.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(168, 85, 247, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Layers size={24} color="#a855f7" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Node.js & Express REST</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
                High-throughput asynchronous REST API routing, custom security middleware, and modular controller design.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Featured Blog Posts Section */}
      <section style={{ padding: '60px 0' }}>
        <div className="container-custom">
          
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '36px' }}>
            <div>
              <span className="badge badge-tech" style={{ marginBottom: '8px' }}>LATEST INSIGHTS</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
                Featured Articles & Tutorials
              </h2>
            </div>
            <Link to="/blogs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>
              <span>View All Articles</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-cols-auto-fit">
            {blogs.map((blog) => (
              <article key={blog._id || blog.slug} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Cover Image */}
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={blog.coverImage}
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

                {/* Content */}
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
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.4, marginBottom: '10px' }}>
                    <Link to={`/blogs/${blog.slug || blog._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {blog.title}
                    </Link>
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                    {blog.excerpt}
                  </p>

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
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>
                        {blog.author?.name || 'Admin'}
                      </span>
                    </div>

                    <Link
                      to={`/blogs/${blog.slug || blog._id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#818cf8',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      <span>Read</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* Featured Projects Showcase */}
      <section style={{ padding: '60px 0', background: 'rgba(15, 23, 42, 0.3)' }}>
        <div className="container-custom">
          
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '36px' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '8px' }}>PORTFOLIO WORK</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
                Featured Engineering Projects
              </h2>
            </div>
            <Link to="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>
              <span>View All Projects</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-cols-auto-fit">
            {projects.slice(0, 3).map((proj) => (
              <div key={proj._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '190px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={proj.image}
                    alt={proj.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span className="badge badge-tech" style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)' }}>
                      {proj.category}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '10px' }}>
                    {proj.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                    {proj.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {proj.tags?.map((t, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.72rem',
                        padding: '3px 8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '6px',
                        color: '#cbd5e1'
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary"
                        style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: '0.85rem' }}
                      >
                        <ExternalLink size={14} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary"
                        style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: '0.85rem' }}
                      >
                        <GithubIcon size={14} />
                        <span>Source</span>
                      </a>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Interactive Contact & Inquiry Section */}
      <section style={{ padding: '70px 0' }}>
        <div className="container-custom">
          
          <div className="glass-panel" style={{
            maxWidth: '860px',
            margin: '0 auto',
            padding: '48px',
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', marginBottom: '32px' }}>
              <span className="badge badge-tech" style={{ marginBottom: '10px' }}>LET'S CONNECT</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '12px' }}>
                Have a Project in Mind or Want to Collaborate?
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Whether you have questions about architecture, full stack development, or just want to say hi, feel free to send a message!
              </p>
            </div>

            {contactSubmitted ? (
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                color: '#34d399'
              }}>
                <CheckCircle2 size={40} style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Thank You for Reaching Out!</h3>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '6px' }}>
                  Your message has been received. I will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Morgan"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>Your Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me about your project or inquiry..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="input-field"
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', height: '48px', fontSize: '1rem', marginTop: '8px' }}
                >
                  <Send size={18} />
                  <span>Send Message</span>
                </button>
              </form>
            )}

          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
