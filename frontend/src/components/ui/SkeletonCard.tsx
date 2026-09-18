import React from 'react';

interface SkeletonCardProps {
  count?: number;
  height?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 3, height = '200px' }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="skeleton"
        style={{ height, borderRadius: '16px', marginBottom: '16px' }}
        role="status"
        aria-label="Loading..."
      />
    ))}
  </>
);

export const SkeletonLine: React.FC<{ width?: string; height?: string }> = ({
  width = '100%', height = '16px'
}) => (
  <div className="skeleton" style={{ width, height, borderRadius: '4px', marginBottom: '8px' }} />
);
