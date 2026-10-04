import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  BookOpen,
  Terminal,
  ChevronRight
} from 'lucide-react';

const Login = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, loginWithGoogle, loginAsDemoAdmin, loginAsDemoUser, logout, currentUser, isAdmin } = useAuth();

  // If URL is explicitly /signup, use signup, otherwise default to login
  const isSignupRoute = location.pathname === '/signup';
  const [role, setRole] = useState('admin');
  const [mode, setMode] = useState(isSignupRoute ? 'signup' : (initialMode || 'login'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        await signup(email, password, displayName, role);
        // After creating account, cleanly switch to Sign In page so user enters their details
        await logout();
        setMode('login');
        setPassword('');
        setSuccess(`🎉 Account created successfully as ${role === 'admin' ? 'Admin 👑' : 'User 👤'}! Now enter your password below to sign in and open your application.`);
        setLoading(false);
        return;
      } else {
        await login(email, password, role);
        setSuccess(`Logged in as ${role === 'admin' ? 'Administrator' : 'Reader'}! Opening application...`);
      }

      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 700);
    } catch (err) {
      console.error(err);
      let msg = err.message || 'Authentication failed. Please verify credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = "Account not found or password incorrect. If this is your first time, click 'Create Account' below to register!";
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Switching you to Sign In...';
        setMode('login');
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoType) => {
    if (mode === 'signup') {
      const demoEmail = demoType === 'admin' ? 'admin@portfolio.dev' : 'reader@example.com';
      setEmail(demoEmail);
      setDisplayName(demoType === 'admin' ? 'Portfolio Admin' : 'Reader Member');
      setPassword('admin123456');
      setSuccess(`Filled test details for ${demoType === 'admin' ? 'Admin' : 'Reader'}! Click "Create Account" below to register and advance to Sign In.`);
    } else {
      if (demoType === 'admin') {
        loginAsDemoAdmin();
        setSuccess('Started as Administrator! Opening Admin Panel...');
        setTimeout(() => navigate('/admin'), 600);
      } else {
        loginAsDemoUser();
        setSuccess('Started as Reader! Starting workflow...');
        setTimeout(() => navigate('/'), 600);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await loginWithGoogle(role);
      setSuccess(`Signed in with Google as ${role === 'admin' ? 'Administrator' : 'Reader'}! Starting workflow...`);
      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 700);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was closed.');
      } else {
        setError(err.message || 'Google sign-in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
      <div style={{ width: '100%', maxWidth: '580px' }}>
        
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)'
          }}>
            <Terminal size={28} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
            {mode === 'signup' ? 'Create Your Account' : 'Sign In'} to <span className="gradient-text">DevPortfolio</span>
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#94a3b8' }}>
            {mode === 'signup' 
              ? 'New user? Select role & create account first, then sign in with your details to start the workflow' 
              : `Put your credentials below to sign in as ${role === 'admin' ? 'Administrator 👑' : 'Reader 👤'} and launch your session`}
          </p>
        </div>

        {/* Existing Session Alert Banner */}
        {currentUser && (
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Currently Active Session:</div>
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span>{currentUser.displayName || currentUser.email}</span>
                <span className={isAdmin ? "badge badge-admin" : "badge badge-tech"} style={{ fontSize: '0.65rem' }}>
                  {isAdmin ? 'ADMIN 👑' : 'USER 👤'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => navigate(isAdmin ? '/admin' : '/')}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                Open {isAdmin ? 'Admin Dashboard' : 'Blogs'}
              </button>
              <button
                type="button"
                onClick={logout}
                className="btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px' }}>
          
          {/* ROLE SELECTION */}
          <div style={{ marginBottom: '26px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              1. SELECT YOUR ROLE:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              
              {/* Admin Card */}
              <button
                type="button"
                onClick={() => setRole('admin')}
                style={{
                  padding: '18px 16px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  transition: 'all 0.25s ease',
                  border: role === 'admin' ? '2px solid #fb7185' : '1px solid var(--border-glass)',
                  background: role === 'admin' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                  boxShadow: role === 'admin' ? '0 0 20px rgba(244, 63, 94, 0.25)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: role === 'admin' ? '#f43f5e' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <ShieldCheck size={20} />
                  </div>
                  <span className={`badge ${role === 'admin' ? 'badge-admin' : ''}`} style={{ fontSize: '0.65rem' }}>
                    {role === 'admin' ? 'SELECTED' : 'ADMIN'}
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f8fafc', marginBottom: '4px' }}>
                  Admin
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  Full management of blogs, projects & analytics
                </div>
              </button>

              {/* User Card */}
              <button
                type="button"
                onClick={() => setRole('user')}
                style={{
                  padding: '18px 16px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  transition: 'all 0.25s ease',
                  border: role === 'user' ? '2px solid #6366f1' : '1px solid var(--border-glass)',
                  background: role === 'user' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                  boxShadow: role === 'user' ? '0 0 20px rgba(99, 102, 241, 0.25)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: role === 'user' ? '#6366f1' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <User size={20} />
                  </div>
                  <span className={`badge ${role === 'user' ? 'badge-tech' : ''}`} style={{ fontSize: '0.65rem' }}>
                    {role === 'user' ? 'SELECTED' : 'READER'}
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f8fafc', marginBottom: '4px' }}>
                  User / Reader
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  Read articles, leave comments & like posts
                </div>
              </button>

            </div>
          </div>

          {/* Quick 1-Click Testing Shortcut Bar */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px dashed var(--border-glass)',
            borderRadius: '14px',
            padding: '14px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>
                INSTANT TEST SHORTCUT ({role.toUpperCase()}):
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleQuickDemo(role)}
              className="btn-secondary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '10px',
                fontSize: '0.88rem',
                border: role === 'admin' ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
                color: role === 'admin' ? '#fb7185' : '#818cf8'
              }}
            >
              <span>{mode === 'signup' ? `⚡ Fill Test Info for ${role === 'admin' ? 'Admin 👑' : 'User 👤'}` : `⚡ Instant 1-Click Sign In as ${role === 'admin' ? 'Admin 👑' : 'User 👤'}`}</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#fb7185',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#34d399',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          {/* CREDENTIALS FORM */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: mode === 'signup' ? '#fb7185' : '#818cf8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              {mode === 'signup' ? `2. CREATE YOUR ${role.toUpperCase()} ACCOUNT` : `2. ENTER YOUR ${role.toUpperCase()} CREDENTIALS TO SIGN IN`}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {mode === 'signup' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="e.g. Harini"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '44px', height: '46px' }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    placeholder={role === 'admin' ? "admin@portfolio.dev or your email" : "reader@example.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '44px', height: '46px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '44px', height: '46px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  height: '48px',
                  fontSize: '0.98rem',
                  marginTop: '8px',
                  background: role === 'admin' ? 'linear-gradient(135deg, #f43f5e, #fb7185)' : 'var(--gradient-main)'
                }}
              >
                {loading ? 'Processing...' : (
                  <>
                    <span>{mode === 'signup' ? `Create Account` : `Sign In & Open as ${role === 'admin' ? 'Admin 👑' : 'User 👤'}`}</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

            </form>

            {/* Google OAuth Option */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '16px 0',
                color: '#64748b',
                fontSize: '0.8rem'
              }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                <span style={{ padding: '0 10px' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', height: '46px', gap: '10px' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google as {role === 'admin' ? 'Admin 👑' : 'User 👤'}</span>
              </button>
            </div>

            {/* Toggle Mode */}
            <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
              {mode === 'signup' ? (
                <div>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                    style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Sign In here
                  </button>
                </div>
              ) : (
                <div>
                  New user?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
                    style={{ background: 'none', border: 'none', color: '#fb7185', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Sign up now (Create Account)
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;
