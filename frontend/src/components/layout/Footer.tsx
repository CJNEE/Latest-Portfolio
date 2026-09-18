import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer style={{
    borderTop: '1px solid var(--border)',
    padding: '48px 0 32px',
    marginTop: '40px',
    position: 'relative', zIndex: 1,
  }}>
    <div className="container" style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          overflow: 'hidden',
          border: '1.5px solid rgba(0, 212, 170, 0.4)',
          boxShadow: '0 0 12px rgba(0, 212, 170, 0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#0a0f1e',
        }}>
          <img src="/logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Christian Joseph Ostaga</span>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> using React + Django
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '8px' }}>
        &copy; {new Date().getFullYear()} Christian Joseph Ostaga. All rights reserved.
      </p>
    </div>
  </footer>
);
