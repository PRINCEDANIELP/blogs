import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Mail, Heart, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './SocialIcons';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-glass)',
      background: 'rgba(9, 13, 22, 0.95)',
      padding: '60px 0 30px 0',
      marginTop: '80px'
    }}>
      <div className="container-custom">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          
          {/* Col 1: Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Terminal size={18} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                Dev<span className="gradient-text">Portfolio</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '16px' }}>
              A state-of-the-art Full Stack portfolio & developer publication platform powered by MongoDB, Express, React & Firebase Authentication.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { icon: GithubIcon, href: 'https://github.com' },
                { icon: LinkedinIcon, href: 'https://linkedin.com' },
                { icon: TwitterIcon, href: 'https://twitter.com' },
                { icon: Mail, href: 'mailto:developer@portfolio.dev' }
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = '#6366f1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'var(--border-glass)'; }}
                >
                  <item.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', letterSpacing: '0.02em' }}>
              Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home Showcase</Link>
              <Link to="/portfolio" style={{ color: '#94a3b8', textDecoration: 'none' }}>Featured Projects</Link>
              <Link to="/blogs" style={{ color: '#94a3b8', textDecoration: 'none' }}>Articles & Insights</Link>
              <Link to="/admin" style={{ color: '#94a3b8', textDecoration: 'none' }}>Admin Console</Link>
            </div>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', letterSpacing: '0.02em' }}>
              Featured Topics
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <Link to="/blogs?category=Web+Development" style={{ color: '#94a3b8', textDecoration: 'none' }}>Web Development</Link>
              <Link to="/blogs?category=Cloud+%26+DevOps" style={{ color: '#94a3b8', textDecoration: 'none' }}>Cloud & DevOps</Link>
              <Link to="/blogs?category=AI+%26+ML" style={{ color: '#94a3b8', textDecoration: 'none' }}>AI & Machine Learning</Link>
              <Link to="/blogs?category=Design+%26+UI%2FUX" style={{ color: '#94a3b8', textDecoration: 'none' }}>Design & UI/UX</Link>
            </div>
          </div>

          {/* Col 4: Stack Details */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', letterSpacing: '0.02em' }}>
              Integrated Tech Stack
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['MongoDB Atlas', 'Mongoose', 'Express.js', 'React 19', 'Firebase Auth', 'Node.js', 'REST API', 'Vite'].map((tech) => (
                <span key={tech} className="badge badge-tech" style={{ fontSize: '0.72rem' }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.82rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} DevPortfolio. Full Stack Blog & Portfolio Application.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Built with <Heart size={14} color="#f43f5e" fill="#f43f5e" /> using React, MongoDB & Firebase
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
