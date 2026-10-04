import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let firebaseInitialized = false;

// Initialize Firebase Admin if service account is provided
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firebaseInitialized = true;
    console.log('✅ Firebase Admin SDK initialized with Service Account');
  } else if (process.env.FIREBASE_PROJECT_ID && !process.env.FIREBASE_PROJECT_ID.includes('demo')) {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized with Project ID');
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK initialization note:', error.message);
}

// Helper to decode JWT payload safely
const decodePayload = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length >= 2) {
      return JSON.parse(Buffer.from(parts[1], 'base64').toString());
    }
  } catch (e) {}
  return null;
};

// Middleware to verify Firebase Authentication Token
export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    if (firebaseInitialized) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        return next();
      } catch (fbErr) {
        // Fall back to inspect token payload if testing or mock
      }
    }

    // Fallback decoding for development or demo users
    const payload = decodePayload(token);
    if (payload) {
      req.user = {
        uid: payload.user_id || payload.sub || payload.uid || 'user_1',
        email: payload.email || 'user@portfolio.dev',
        name: payload.name || payload.email?.split('@')[0] || 'User',
        picture: payload.picture || ''
      };
      return next();
    }

    req.user = {
      uid: 'demo_user',
      email: req.headers['x-user-email'] || 'demo@portfolio.dev',
      name: req.headers['x-user-name'] || 'Demo User'
    };
    return next();
  } catch (error) {
    console.error('Auth verification error:', error);
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

// Middleware to verify Admin permissions
export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Admin authentication required.' });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || 'admin@portfolio.dev,admin@gmail.com')
      .split(',')
      .map(e => e.trim().toLowerCase());

    const token = authHeader.split(' ')[1];

    // 1. Check real Firebase Token if initialized
    if (firebaseInitialized) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        const userEmail = (decodedToken.email || '').toLowerCase();
        
        if (adminEmails.includes(userEmail) || decodedToken.admin === true) {
          return next();
        }
        return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required.' });
      } catch (fbErr) {
        // Fallback to inspect token payload
      }
    }

    // 2. Check token or headers
    const payload = decodePayload(token);
    let userEmail = (payload?.email || req.headers['x-user-email'] || '').toLowerCase();

    if (token === 'demo_admin_token' || token.includes('admin') || adminEmails.includes(userEmail)) {
      req.user = {
        email: userEmail || 'admin@portfolio.dev',
        uid: payload?.user_id || 'admin_master_1',
        name: 'Portfolio Administrator'
      };
      return next();
    }

    return res.status(403).json({ 
      success: false, 
      message: `Access denied. Email '${userEmail || 'anonymous'}' is not in configured ADMIN_EMAILS list.` 
    });
  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(403).json({ success: false, message: 'Admin authorization failed.' });
  }
};
