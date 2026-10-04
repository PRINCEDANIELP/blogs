import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Terminal, 
  BookOpen, 
  Briefcase, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  User, 
  Database, 
  Sparkles,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

const Navbar = ({ onOpenDbStatus }) => {
  const { currentUser, isAdmin, logout, openAuthModal, loginAsDemoAdmin, loginAsDemoUser } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Sparkles },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
    { name: 'Blog', path: '/blogs', icon: BookOpen },
    ...(isAdmin ? [{ name: 'Admin Panel', path: '/admin', icon: ShieldCheck, isSpecial: true }] : [])
  ];

  return (
    <nav className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Terminal size={22} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
              Dev<span className="gradient-text">Portfolio</span>
            </span>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '0.05em', fontWeight: 600 }}>
              BLOG & SHOWCASE
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '8px' }} className="desktop-links-container">
          {currentUser ? (
            navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '0.92rem',
                    fontWeight: active ? 600 : 500,
                    color: active ? '#ffffff' : '#94a3b8',
                    background: active 
                      ? (link.isSpecial ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.12)')
                      : 'transparent',
                    border: active 
                      ? (link.isSpecial ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(99, 102, 241, 0.25)')
                      : '1px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={17} color={active ? (link.isSpecial ? '#fb7185' : '#818cf8') : '#64748b'} />
                  <span>{link.name}</span>
                  {link.isSpecial && (
                    <span className="badge badge-admin" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>ADMIN</span>
                  )}
                </Link>
              );
            })
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              fontSize: '0.82rem',
              color: '#818cf8'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }}></span>
              <span>Select role & sign in below to start workflow</span>
            </div>
          )}
        </div>

        {/* Right Action Icons & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* DB Status Badge */}
          <button
            onClick={onOpenDbStatus}
            title="MongoDB & Firebase Status Configuration"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#34d399',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
            <Database size={13} />
            <span className="hidden-mobile">Stack Live</span>
          </button>

          {/* User Auth Section */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid var(--border-glass)',
                  padding: '6px 12px 6px 6px',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  color: '#f8fafc',
                  fontFamily: 'inherit'
                }}
              >
                <img
                  src={currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`}
                  alt="Avatar"
                  style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                <ChevronDown size={14} color="#94a3b8" />
              </button>

              {userDropdownOpen && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '46px',
                    width: '230px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    zIndex: 100,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
                  }}
                >
                  <div style={{ padding: '4px 8px 8px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                      {currentUser.displayName || 'User'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', wordBreak: 'break-all' }}>
                      {currentUser.email}
                    </div>
                    {isAdmin && (
                      <span className="badge badge-admin" style={{ marginTop: '6px', fontSize: '0.65rem' }}>
                        Admin Privileges Active
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: '#fb7185',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: 'rgba(244, 63, 94, 0.1)'
                      }}
                    >
                      <ShieldCheck size={16} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => (e.target.style.color = '#f43f5e')}
                    onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                to="/login"
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.88rem', textDecoration: 'none' }}
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#f8fafc',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Responsive Inline CSS Helper */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-links-container { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="glass-panel"
          style={{
            margin: '0 16px 16px 16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive(link.path) ? '#6366f1' : '#f8fafc',
                fontWeight: 600,
                background: isActive(link.path) ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
              }}
            >
              <link.icon size={18} />
              <span>{link.name}</span>
            </Link>
          ))}
          {!currentUser && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary"
                style={{ justifyContent: 'center', textDecoration: 'none', padding: '10px' }}
              >
                <LogIn size={16} />
                <span>Sign In (Select Role)</span>
              </Link>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    loginAsDemoAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: '0.8rem', justifyContent: 'center' }}
                >
                  Demo Admin
                </button>
                <button
                  onClick={() => {
                    loginAsDemoUser();
                    setMobileMenuOpen(false);
                  }}
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: '0.8rem', justifyContent: 'center' }}
                >
                  Demo User
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
