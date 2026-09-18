import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Loader2 } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSuccess: () => void;
  children: (helpers: { loading: boolean; error: string | null }) => React.ReactNode;
  onSubmit: () => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const GenericEditModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  onSuccess,
  children,
  onSubmit,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to save changes.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setLoading(true);
    setError(null);
    try {
      await onDelete();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          background: 'rgba(5, 8, 18, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#111827',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '32px',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{title}</h3>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {error && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {children({ loading, error })}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              {onDelete ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={15} /> Delete
                </button>
              ) : <div />}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                >
                  {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><Save size={16} /> Save Changes</>}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
