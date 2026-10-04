import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  googleProvider,
  signInWithPopup,
  updateProfile,
  isRealFirebase
} from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedRole, setSelectedRole] = useState(localStorage.getItem('user_selected_role') || 'admin');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login', 'signup', 'forgot'

  // Admin emails list (whitelisted for admin access)
  const ADMIN_EMAILS = ['admin@portfolio.dev', 'admin@gmail.com', 'harini12@gmail.com'];

  const checkIfAdmin = (email, requestedRole) => {
    if (requestedRole === 'admin') return true;
    if (!email) return false;
    const lower = email.toLowerCase();
    return ADMIN_EMAILS.includes(lower) || lower.includes('admin') || localStorage.getItem('user_selected_role') === 'admin';
  };

  useEffect(() => {
    // Check for cached demo user if Firebase isn't live
    const storedDemoUser = localStorage.getItem('blog_demo_user');
    const savedRole = localStorage.getItem('user_selected_role') || 'admin';
    setSelectedRole(savedRole);

    if (storedDemoUser) {
      try {
        const user = JSON.parse(storedDemoUser);
        setCurrentUser(user);
        setToken(user.token || 'demo_token_' + user.uid);
        setIsAdmin(user.role === 'admin' || checkIfAdmin(user.email, savedRole));
      } catch (e) {}
    }

    if (auth && isRealFirebase) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const idToken = await user.getIdToken();
          const activeRole = localStorage.getItem('user_selected_role') || 'user';
          const userWithRole = { ...user, role: activeRole };
          setCurrentUser(userWithRole);
          setToken(idToken);
          setIsAdmin(activeRole === 'admin' || checkIfAdmin(user.email, activeRole));
        } else if (!storedDemoUser) {
          setCurrentUser(null);
          setToken(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      setLoading(false);
    }
  }, []);

  // Email/Password Signup with explicit Role selection
  const signup = async (email, password, displayName = '', role = 'user') => {
    localStorage.setItem('user_selected_role', role);
    setSelectedRole(role);
    const adminPrivilege = role === 'admin' || checkIfAdmin(email, role);

    if (isRealFirebase && auth) {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName && res.user) {
          await updateProfile(res.user, { displayName });
        }
        const userWithRole = { ...res.user, role };
        setCurrentUser(userWithRole);
        setIsAdmin(adminPrivilege);
        return userWithRole;
      } catch (err) {
        if (err.code === 'auth/configuration-not-found' || err.message?.includes('configuration-not-found')) {
          console.warn('Firebase Console auth fallback for:', email);
          const newUser = {
            uid: 'user_' + Date.now(),
            email,
            displayName: displayName || email.split('@')[0],
            photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
            token: adminPrivilege ? 'demo_admin_token' : 'demo_token_' + Date.now(),
            role,
            isLocalSession: true
          };
          setCurrentUser(newUser);
          setToken(newUser.token);
          setIsAdmin(adminPrivilege);
          localStorage.setItem('blog_demo_user', JSON.stringify(newUser));
          return newUser;
        }
        throw err;
      }
    } else {
      const newUser = {
        uid: 'user_' + Date.now(),
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        token: adminPrivilege ? 'demo_admin_token' : 'demo_token_' + Date.now(),
        role
      };
      setCurrentUser(newUser);
      setToken(newUser.token);
      setIsAdmin(adminPrivilege);
      localStorage.setItem('blog_demo_user', JSON.stringify(newUser));
      return newUser;
    }
  };

  // Email/Password Login with explicit Role selection
  const login = async (email, password, role = 'user') => {
    localStorage.setItem('user_selected_role', role);
    setSelectedRole(role);
    const adminPrivilege = role === 'admin' || checkIfAdmin(email, role);

    if (isRealFirebase && auth) {
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const userWithRole = { ...res.user, role };
        setCurrentUser(userWithRole);
        setIsAdmin(adminPrivilege);
        return userWithRole;
      } catch (err) {
        if (err.code === 'auth/configuration-not-found' || err.message?.includes('configuration-not-found')) {
          console.warn('Firebase Console auth fallback for:', email);
          const user = {
            uid: 'user_' + Math.abs(email.split('').reduce((a, b) => a + b.charCodeAt(0), 0)),
            email,
            displayName: email.split('@')[0],
            photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
            token: adminPrivilege ? 'demo_admin_token' : 'demo_user_token_' + Date.now(),
            role,
            isLocalSession: true
          };
          setCurrentUser(user);
          setToken(user.token);
          setIsAdmin(adminPrivilege);
          localStorage.setItem('blog_demo_user', JSON.stringify(user));
          return user;
        }
        throw err;
      }
    } else {
      const user = {
        uid: 'user_' + Math.abs(email.split('').reduce((a, b) => a + b.charCodeAt(0), 0)),
        email,
        displayName: email.split('@')[0],
        photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        token: adminPrivilege ? 'demo_admin_token' : 'demo_user_token_' + Date.now(),
        role
      };
      setCurrentUser(user);
      setToken(user.token);
      setIsAdmin(adminPrivilege);
      localStorage.setItem('blog_demo_user', JSON.stringify(user));
      return user;
    }
  };

  // Google Login
  const loginWithGoogle = async (role = 'user') => {
    localStorage.setItem('user_selected_role', role);
    setSelectedRole(role);
    const adminPrivilege = role === 'admin';

    if (isRealFirebase && auth && googleProvider) {
      const res = await signInWithPopup(auth, googleProvider);
      const userWithRole = { ...res.user, role };
      setCurrentUser(userWithRole);
      setIsAdmin(adminPrivilege || checkIfAdmin(res.user.email, role));
      return userWithRole;
    } else {
      const googleUser = {
        uid: 'google_user_' + Date.now(),
        email: 'alex.developer@gmail.com',
        displayName: 'Alex Rivers',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        token: adminPrivilege ? 'demo_admin_token' : 'demo_google_token_' + Date.now(),
        role
      };
      setCurrentUser(googleUser);
      setToken(googleUser.token);
      setIsAdmin(adminPrivilege);
      localStorage.setItem('blog_demo_user', JSON.stringify(googleUser));
      return googleUser;
    }
  };

  // Quick Demo Admin Login
  const loginAsDemoAdmin = () => {
    localStorage.setItem('user_selected_role', 'admin');
    setSelectedRole('admin');
    const adminUser = {
      uid: 'admin_master_1',
      email: 'admin@portfolio.dev',
      displayName: 'Portfolio Administrator',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      token: 'demo_admin_token',
      role: 'admin'
    };
    setCurrentUser(adminUser);
    setToken(adminUser.token);
    setIsAdmin(true);
    localStorage.setItem('blog_demo_user', JSON.stringify(adminUser));
  };

  // Quick Demo Regular User Login
  const loginAsDemoUser = () => {
    localStorage.setItem('user_selected_role', 'user');
    setSelectedRole('user');
    const regularUser = {
      uid: 'guest_user_42',
      email: 'guest.reader@example.com',
      displayName: 'Guest Reader',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      token: 'demo_regular_token',
      role: 'user'
    };
    setCurrentUser(regularUser);
    setToken(regularUser.token);
    setIsAdmin(false);
    localStorage.setItem('blog_demo_user', JSON.stringify(regularUser));
  };

  // Logout
  const logout = async () => {
    if (isRealFirebase && auth) {
      await signOut(auth);
    }
    setCurrentUser(null);
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('blog_demo_user');
    localStorage.removeItem('user_selected_role');
  };

  const openAuthModal = (mode = 'login', initialRole = 'admin') => {
    setAuthModalMode(mode);
    setSelectedRole(initialRole);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const value = {
    currentUser,
    token,
    isAdmin,
    loading,
    isRealFirebase,
    selectedRole,
    setSelectedRole,
    authModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    setAuthModalMode,
    login,
    signup,
    loginWithGoogle,
    loginAsDemoAdmin,
    loginAsDemoUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
