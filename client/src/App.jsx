import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import DbStatusModal from './components/DbStatusModal';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import Portfolio from './pages/Portfolio';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

// Workflow Gatekeeper: Ensures the initial screen is the Sign In / Role selection page
const WorkflowGate = ({ children, initialMode = 'login' }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#818cf8', fontWeight: 600, fontSize: '1rem' }}>
          Initializing DevPortfolio...
        </div>
      </div>
    );
  }

  // If not authenticated, open the Sign In page first before workflow starts
  if (!currentUser) {
    return <Login initialMode={initialMode} />;
  }

  return children;
};

function App() {
  const [dbModalOpen, setDbModalOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar onOpenDbStatus={() => setDbModalOpen(true)} />
          
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Initially open Sign In page with role selection; then workflow starts */}
              <Route path="/" element={<WorkflowGate initialMode="login"><Home /></WorkflowGate>} />
              <Route path="/login" element={<Login initialMode="login" />} />
              <Route path="/signin" element={<Login initialMode="login" />} />
              <Route path="/signup" element={<Login initialMode="signup" />} />
              <Route path="/blogs" element={<WorkflowGate initialMode="login"><BlogList /></WorkflowGate>} />
              <Route path="/blogs/:slug" element={<WorkflowGate initialMode="login"><BlogDetail /></WorkflowGate>} />
              <Route path="/portfolio" element={<WorkflowGate initialMode="login"><Portfolio /></WorkflowGate>} />
              <Route path="/admin" element={<WorkflowGate initialMode="login"><AdminDashboard /></WorkflowGate>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />

          {/* Modals */}
          <AuthModal />
          <DbStatusModal isOpen={dbModalOpen} onClose={() => setDbModalOpen(false)} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
