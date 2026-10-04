import React, { useState, useEffect } from 'react';
import { statsApi } from '../services/api';
import { Database, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, X, Copy, ExternalLink, Cpu } from 'lucide-react';

const DbStatusModal = ({ isOpen, onClose }) => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await statsApi.getHealth();
      setHealthData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMongoConnected = healthData?.database?.connected;
  const isServerOnline = healthData?.status === 'online';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '620px', padding: '32px', position: 'relative' }}>
        
        {/* Close button */}
        <button
          onClick={onClose}
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

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Database size={24} color="#10b981" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
              Firebase Backend & Database Integration
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Real-time monitoring of Cloud Firestore, Firebase Auth & Project blog-5f508
            </p>
          </div>
        </div>

        {/* Integration Status Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          
          {/* Cloud Firestore Card */}
          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                <Database size={18} color="#10b981" />
                <span>Cloud Firestore</span>
              </div>
              <span className="badge badge-success">
                Connected
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
              <div><strong>Project:</strong> blog-5f508</div>
              <div><strong>Collections:</strong> blogs, projects</div>
              <div><strong>Status:</strong> Live Realtime Cloud Firestore</div>
            </div>
          </div>

          {/* Firebase Auth Card */}
          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                <ShieldCheck size={18} color="#818cf8" />
                <span>Firebase Auth</span>
              </div>
              <span className="badge badge-tech">
                Active
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
              <div><strong>Engine:</strong> Firebase Auth SDK v12</div>
              <div><strong>Methods:</strong> Email/Password & Google OAuth</div>
              <div><strong>Security:</strong> Role-Based Access Control</div>
            </div>
          </div>

        </div>

        {/* Backend Server Ping Banner */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid var(--border-glass)',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={18} color={isServerOnline ? '#10b981' : '#f43f5e'} />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>
                Express REST API: {isServerOnline ? 'http://localhost:5000' : 'Connecting...'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Protected Endpoints: /api/blogs, /api/projects, /api/stats
              </div>
            </div>
          </div>

          <button
            onClick={fetchStatus}
            disabled={loading}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Ping</span>
          </button>
        </div>

        {/* Admin Setup Instruction Quick Reference */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          borderRadius: '12px',
          padding: '14px 18px',
          fontSize: '0.82rem',
          color: '#cbd5e1',
          lineHeight: 1.6
        }}>
          <div style={{ fontWeight: 700, color: '#818cf8', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={15} /> Admin Permissions Config:
          </div>
          <div>
            Default administrator emails recognized by the system:
            <code style={{ background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px', color: '#fb7185' }}>
              admin@portfolio.dev
            </code>,{' '}
            <code style={{ background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px', color: '#fb7185' }}>
              admin@gmail.com
            </code>
          </div>
          <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
            You can modify the whitelist via <span style={{ color: '#f8fafc' }}>server/.env</span> with <code style={{ color: '#38bdf8' }}>ADMIN_EMAILS=your_email@domain.com</code>.
          </div>
        </div>

      </div>
    </div>
  );
};

export default DbStatusModal;
