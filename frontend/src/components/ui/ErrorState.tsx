import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Failed to load data. Please try again.',
  onRetry,
}) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '60px 24px', textAlign: 'center',
  }}>
    <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn btn-outline" aria-label="Retry loading">
        <RefreshCw size={16} />
        Retry
      </button>
    )}
  </div>
);
