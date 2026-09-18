import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Edit3, Eye, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const OwnerToolbar: React.FC = () => {
  const { isOwner, user, editMode, setEditMode, logout } = useAuth();

  if (!isOwner) return null;

  return (
    <motion.aside
      aria-label="Owner CMS Toolbar"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 18px',
        borderRadius: '50px',
        background: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(0, 212, 170, 0.5)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 24px rgba(0, 212, 170, 0.25)',
      }}
    >
      {/* Owner Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '8px', borderRight: '1px solid var(--border)' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00d4aa, #6366f1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Crown size={15} color="white" />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-teal)', display: 'block', lineHeight: 1 }}>
            Owner Mode
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {user?.email}
          </span>
        </div>
      </div>

      {/* Edit Mode Toggle */}
      <button
        type="button"
        onClick={() => setEditMode((prev) => !prev)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: '30px',
          background: editMode ? 'rgba(0, 212, 170, 0.15)' : 'rgba(255, 255, 255, 0.05)',
          border: editMode ? '1px solid rgba(0, 212, 170, 0.4)' : '1px solid var(--border)',
          color: editMode ? 'var(--accent-teal)' : 'var(--text-secondary)',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'all 0.2s',
        }}
      >
        {editMode ? <Edit3 size={14} /> : <Eye size={14} />}
        <span>{editMode ? 'Edit Mode: ON' : 'Preview Mode'}</span>
      </button>

      {/* Logout */}
      <button
        type="button"
        onClick={logout}
        title="Log Out of Owner Mode"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          color: '#ef4444',
          cursor: 'pointer',
        }}
      >
        <LogOut size={15} />
      </button>
    </motion.aside>
  );
};
