import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Coming Soon',
  message = 'This section will be updated soon.',
  icon,
}) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px',
    textAlign: 'center',
    color: 'var(--text-muted)',
  }}>
    <div style={{
      width: '72px', height: '72px',
      borderRadius: '50%',
      background: 'rgba(99, 102, 241, 0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: '24px',
      border: '1px solid rgba(99, 102, 241, 0.15)',
    }}>
      {icon || <Inbox size={32} color="var(--accent-indigo)" />}
    </div>
    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>{title}</h3>
    <p style={{ fontSize: '0.9rem', maxWidth: '360px', lineHeight: 1.6 }}>{message}</p>
  </div>
);
