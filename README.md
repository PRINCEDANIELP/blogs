# 🚀 DevPortfolio - Full Stack Blog & Portfolio Web Application

A state-of-the-art **Full Stack Blog Portfolio Web Application** built with **React (Vite)**, **Node.js / Express REST API**, **MongoDB Database integration**, and **Firebase Authentication** with **Role-Based Admin Access**.

---

## 🌟 Key Features

### 1. 🎨 Dynamic & Modern UI/UX
- **Glassmorphism Design System**: Sleek translucent cards, ambient gradients, micro-animations, and responsive layout.
- **Hero & Metrics Banner**: Key showcase statistics and introduction.
- **Featured Projects Grid**: Live demo links, GitHub links, category filters, and tags.
- **Interactive Contact Form**: Client-side submission with instant feedback.

### 2. 📝 Full-Featured Blog & Article Engine
- **Catalog & Discovery**: Instant search, category pill filters, and tag cloud.
- **Rich Article Reader**: Formatted markdown rendering, syntax-highlighted code blocks, read time estimates, and view counters.
- **Interactive Engagement**: Live Like counter and multi-user discussion/comments.

### 3. 🔐 Firebase Authentication System
- **Email & Password**: User signup and secure login.
- **Google OAuth**: Fast 1-click Google Sign-In with popup.
- **JWT Verification Middleware**: Server-side token verification with Firebase Admin.
- **Demo Mode**: Instant 1-click test logins as **Admin** or **Reader** without requiring external credentials setup upfront.

### 4. 👑 Protected Admin Dashboard & Management
- **Role-Based Security**: Route guards and Express middleware blocking unauthorized users.
- **Analytics Overview**: Live metrics for Total Posts, Views, Likes, Comments, and Projects.
- **Blog Management**: Add new posts, edit existing posts, toggle Published/Draft status, and delete posts from MongoDB.
- **Portfolio Management**: Add, update, and remove portfolio showcase items.
- **Real-Time Integration Monitor**: Live MongoDB and Firebase connection diagnostic modal.

---

## 🏗️ Architecture & Project Structure

```
blog/
├── client/                     # Frontend (React + Vite + Modern CSS)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, AuthModal, DbStatusModal, SocialIcons
│   │   ├── context/            # AuthContext (Firebase & Demo Auth provider)
│   │   ├── firebase/           # Firebase client SDK configuration
│   │   ├── pages/              # Home, BlogList, BlogDetail, Portfolio, AdminDashboard
│   │   ├── services/           # REST API client (blogs, projects, stats, health)
│   │   ├── App.jsx             # Main router & modal wrapper
│   │   ├── index.css           # Glassmorphism design tokens & typography
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend (Node.js + Express + Mongoose + Firebase Admin)
│   ├── models/                 # Blog.js, Project.js (Mongoose Schemas)
│   ├── middleware/             # auth.js (Firebase Token & Admin Verification)
│   ├── routes/                 # blogs.js, projects.js, stats.js
│   ├── .env                    # Environment variables (MongoDB URI, Admin Whitelist)
│   ├── package.json
│   └── server.js               # Main Express entry & MongoDB connection
│
└── package.json                # Root orchestration scripts
```

---

## 🛠️ Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local Community Server or MongoDB Atlas cloud URI)

### Quick Start

1. **Install All Dependencies**:
   ```bash
   # From root:
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

2. **Start Backend Server**:
   ```bash
   cd server
   node server.js
   # Server runs on http://localhost:5000
   ```

3. **Start Frontend Client**:
   ```bash
   cd client
   npm run dev
   # Client runs on http://localhost:5173
   ```

---

## ⚙️ Environment Configuration

### Backend (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/blog_portfolio
ADMIN_EMAILS=admin@portfolio.dev,admin@gmail.com
FIREBASE_PROJECT_ID=blog-portfolio-app
```

> **Note for MongoDB Atlas:** Replace `MONGODB_URI` with your connection string:  
> `mongodb+srv://<username>:<password>@cluster0.mongodb.net/blog_portfolio?retryWrites=true&w=majority`

### Frontend (`client/.env` or in-app config):
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project
```

---

## 👑 Admin Access Guide

1. Click **Sign In** in the navigation bar.
2. Sign in with your administrator account (e.g., `admin@portfolio.dev`), or create a new account.
3. Once authenticated as Admin, the **Admin Panel** link with a highlighted `ADMIN` badge appears in the navbar.
4. Navigate to `/admin` to access full CRUD capabilities for blogs and projects!

---

## ⚡ Deploying to Vercel

This repository is pre-configured for instantaneous, 1-click deployment on **Vercel**:

### Option 1: Automatic Monorepo Deploy (Recommended)
1. Import this repository in [Vercel Dashboard](https://vercel.com/new).
2. Keep the **Root Directory** as `./` (or leave default).
3. Vercel will automatically detect `vercel.json`, install dependencies, run `npm run build`, and configure SPA rewrites.
4. Click **Deploy**!

### Option 2: Frontend Directory Deploy
1. In Vercel import settings, set **Root Directory** to `client`.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Click **Deploy**!

All React Router routes (`/blogs`, `/admin`, `/login`, etc.) are handled seamlessly by `vercel.json` rewrites with zero 404 errors.

