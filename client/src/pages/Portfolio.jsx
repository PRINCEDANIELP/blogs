import React, { useState, useEffect } from 'react';
import { projectApi } from '../services/api';
import { 
  Briefcase, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Database, 
  Terminal, 
  Cloud 
} from 'lucide-react';
import { GithubIcon } from '../components/SocialIcons';


const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await projectApi.getAll();
        if (res.projects) setProjects(res.projects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const categories = ['All', 'Full Stack', 'Cloud & DevOps', 'AI & ML'];

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div style={{ padding: '60px 0 90px 0' }}>
      <div className="container-custom">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 48px auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            <Briefcase size={15} />
            <span>ENGINEERING & ARCHITECTURE SHOWCASE</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 800, color: '#f8fafc', marginBottom: '16px' }}>
            Featured Full Stack <span className="gradient-text">Portfolio Projects</span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6 }}>
            A curated collection of production web applications, database architectures, microservices, and AI-driven platforms.
          </p>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '28px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  background: activeCategory === cat ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(30, 41, 59, 0.6)',
                  color: activeCategory === cat ? '#ffffff' : '#94a3b8',
                  borderColor: activeCategory === cat ? '#6366f1' : 'var(--border-glass)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
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
            <span>Loading projects...</span>
          </div>
        ) : (
          <div className="grid-cols-auto-fit" style={{ marginBottom: '80px' }}>
            {filteredProjects.map((proj) => (
              <div key={proj._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={proj.image}
                    alt={proj.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
                    <span className="badge badge-tech" style={{ backdropFilter: 'blur(8px)', background: 'rgba(15, 23, 42, 0.85)' }}>
                      {proj.category}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '10px' }}>
                    {proj.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                    {proj.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                    {proj.tags?.map((tag, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.75rem',
                        padding: '3px 10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '6px',
                        color: '#cbd5e1'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary"
                        style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '0.88rem' }}
                      >
                        <ExternalLink size={15} />
                        <span>Live Preview</span>
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary"
                        style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '0.88rem' }}
                      >
                        <GithubIcon size={15} />
                        <span>Repository</span>
                      </a>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Technical Proficiency Grid */}
        <section className="glass-panel" style={{ padding: '48px', borderRadius: '24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 36px auto' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '10px' }}>
              Full Stack Capabilities Matrix
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#94a3b8' }}>
              Specialized skill domains backed by hands-on production engineering
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            
            <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#38bdf8' }}>
                <Terminal size={20} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>Frontend & UI</h4>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#cbd5e1' }}>
                <li>⚡ React 19, Next.js, Vite</li>
                <li>⚡ Modern Vanilla CSS & Tailwind</li>
                <li>⚡ Responsive Glassmorphic UI</li>
                <li>⚡ Web Performance & Accessibility</li>
              </ul>
            </div>

            <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#a855f7' }}>
                <Cpu size={20} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>Backend & APIs</h4>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#cbd5e1' }}>
                <li>⚡ Node.js & Express RESTful API</li>
                <li>⚡ JWT Auth & Security Middleware</li>
                <li>⚡ Role-Based Access Control</li>
                <li>⚡ Microservices & WebSockets</li>
              </ul>
            </div>

            <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#10b981' }}>
                <Database size={20} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>Database & Storage</h4>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#cbd5e1' }}>
                <li>⚡ MongoDB & Mongoose Schemas</li>
                <li>⚡ Aggregation & Complex Pipelines</li>
                <li>⚡ Index Optimization & Sharding</li>
                <li>⚡ Firebase Cloud Firestore</li>
              </ul>
            </div>

            <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#818cf8' }}>
                <Cloud size={20} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>Auth & Cloud</h4>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#cbd5e1' }}>
                <li>⚡ Firebase Authentication SDK</li>
                <li>⚡ OAuth (Google, GitHub, Custom)</li>
                <li>⚡ Docker & CI/CD Pipelines</li>
                <li>⚡ Serverless & Edge Deployments</li>
              </ul>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default Portfolio;
