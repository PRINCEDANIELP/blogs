import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, Sparkles, Shield, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

const AuthModal = () => {
  const navigate = useNavigate();
  const { 
    authModalOpen, 
    authModalMode, 
    closeAuthModal, 
    setAuthModalMode,
    selectedRole,
    login, 
    signup, 
    loginWithGoogle,
    loginAsDemoAdmin,
    loginAsDemoUser
  } = useAuth();

  const [role, setRole] = useState(selectedRole || 'admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Keep in sync with selectedRole if opened with one
  React.useEffect(() => {
    if (selectedRole) setRole(selectedRole);
  }, [selectedRole]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (authModalMode === 'signup') {
        if (password.length < 6) {
          throw new Error('Password should be at least 6 characters long');
        }
        await signup(email, password, displayName, role);
        await logout();
        setAuthModalMode('login');
        setPassword('');
        setSuccess(`🎉 Account created as ${role === 'admin' ? 'Admin 👑' : 'User 👤'}! Now enter your password below to sign in.`);
        setLoading(false);
        return;
      } else {
        await login(email, password, role);
        setSuccess(`Logged in as ${role === 'admin' ? 'Admin' : 'User'}! Opening page...`);
      }
      setTimeout(() => {
        closeAuthModal();
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/blogs');
        }
      }, 900);
    } catch (err) {
      console.error(err);
      let friendlyMsg = err.message || 'Authentication failed. Please check credentials.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyMsg = 'This email is already registered. Please switch to Sign In.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        friendlyMsg = "Account not found or incorrect password. If you haven't registered yet, click 'Create one now' below!";
      } else if (err.code === 'auth/user-not-found') {
        friendlyMsg = 'No account found with this email. Please create an account first.';
      } else if (err.code === 'auth/operation-not-allowed') {
        friendlyMsg = 'Please enable Email/Password provider in your Firebase Console (Authentication > Sign-in method).';
      } else if (err.code === 'auth/configuration-not-found' || (err.message && err.message.includes('configuration-not-found'))) {
        friendlyMsg = 'Authentication has not been initialized in Firebase Console yet. Click "Get Started" in Firebase Console > Authentication > Sign-in method and enable Email/Password.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMsg = 'Password is too weak. Please use at least 6 characters.';
      }
      setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await loginWithGoogle(role);
      setSuccess(`Google Authentication successful as ${role === 'admin' ? 'Admin' : 'User'}! Opening page...`);
      setTimeout(() => {
        closeAuthModal();
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/blogs');
        }
      }, 900);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was closed before completion.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled in Firebase Console. Enable it in Authentication > Sign-in method.');
      } else {
        setError(err.message || 'Google sign-in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(2, 6, 23, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '32px',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(99, 102, 241, 0.2)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: '#94a3b8',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={26} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
            {authModalMode === 'signup' ? 'Create Account' : 'Sign In'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
            First select your role (Admin or User), then enter your details
          </p>
        </div>

        {/* STEP 1: ROLE SELECTION */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', textAlign: 'center' }}>
            1. CHOOSE ROLE TO OPEN
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setRole('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '11px 12px',
                borderRadius: '12px',
                border: role === 'admin' ? '2px solid #fb7185' : '1px solid var(--border-glass)',
                background: role === 'admin' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                color: role === 'admin' ? '#fb7185' : '#94a3b8',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 700,
                fontSize: '0.88rem',
                transition: 'all 0.2s'
              }}
            >
              <ShieldCheck size={17} />
              <span>Admin 👑</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('user')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '11px 12px',
                borderRadius: '12px',
                border: role === 'user' ? '2px solid #6366f1' : '1px solid var(--border-glass)',
                background: role === 'user' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                color: role === 'user' ? '#818cf8' : '#94a3b8',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 700,
                fontSize: '0.88rem',
                transition: 'all 0.2s'
              }}
            >
              <User size={17} />
              <span>User 👤</span>
            </button>
          </div>
        </div>

        {/* Fast 1-Click Demo Buttons for Testing */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px dashed rgba(99, 102, 241, 0.3)',
          borderRadius: '12px',
          padding: '10px 12px',
          marginBottom: '18px'
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Shield size={12} /> INSTANT TEST SHORTCUT:
          </div>
          <button
            type="button"
            onClick={() => {
              if (role === 'admin') {
                loginAsDemoAdmin();
                setSuccess('Signed in as Admin! Opening Admin Panel...');
                setTimeout(() => {
                  closeAuthModal();
                  navigate('/admin');
                }, 700);
              } else {
                loginAsDemoUser();
                setSuccess('Signed in as Reader! Opening Blog...');
                setTimeout(() => {
                  closeAuthModal();
                  navigate('/blogs');
                }, 700);
              }
            }}
            className="btn-secondary"
            style={{
              width: '100%',
              fontSize: '0.82rem',
              padding: '8px',
              justifyContent: 'center',
              border: role === 'admin' ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
              color: role === 'admin' ? '#fb7185' : '#818cf8'
            }}
          >
            <span>Instant 1-Click Open as {role === 'admin' ? 'Admin 👑' : 'User 👤'}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#fb7185',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#34d399',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {authModalMode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '40px' }}
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
              marginTop: '6px',
              height: '46px',
              background: role === 'admin' ? 'linear-gradient(135deg, #f43f5e, #fb7185)' : 'var(--gradient-main)'
            }}
          >
            {loading ? 'Processing...' : (
              <>
                <span>{authModalMode === 'signup' ? `Create Account as ${role === 'admin' ? 'Admin' : 'User'}` : `Sign In & Open as ${role === 'admin' ? 'Admin 👑' : 'User 👤'}`}</span>
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
            style={{ width: '100%', justifyContent: 'center', height: '44px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google as {role === 'admin' ? 'Admin' : 'User'}</span>
          </button>
        </div>

        {/* Switch Auth Mode */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
          {authModalMode === 'signup' ? (
            <div>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setAuthModalMode('login'); setError(''); }}
                style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 600, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </div>
          ) : (
            <div>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setAuthModalMode('signup'); setError(''); }}
                style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 600, cursor: 'pointer' }}
              >
                Create one now
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
