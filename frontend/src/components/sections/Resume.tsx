import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useResume } from '../../hooks/usePortfolioData';
import { SkeletonCard } from '../ui/SkeletonCard';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import { FileText, Download, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GenericEditModal } from '../owner/EditModals';
import apiClient from '../../api/apiClient';
import { useQueryClient } from '@tanstack/react-query';

export const Resume: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data, isLoading, error, refetch } = useResume();
  const { editMode } = useAuth();
  const queryClient = useQueryClient();

  const primaryResume = data?.find((r) => r.is_primary) || data?.[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [versionNumber, setVersionNumber] = useState('');
  const [description, setDescription] = useState('');

  const openEditModal = () => {
    setFileUrl(primaryResume?.file_url || '');
    setVersionNumber(primaryResume?.version_number || '2025.1');
    setDescription(primaryResume?.description || '');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await apiClient.put('/owner/resume/', {
      file_url: fileUrl,
      version_number: versionNumber,
      description,
    });
    queryClient.invalidateQueries({ queryKey: ['resume'] });
  };

  return (
    <section id="resume" ref={ref} className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="section-divider" />
          <h2 className="section-title">My <span className="gradient-text">Resume</span></h2>
          <p className="section-subtitle">Download my detailed CV</p>
        </motion.div>
        
        {isLoading && <SkeletonCard count={1} height="150px" />}
        {error && <ErrorState onRetry={refetch} />}
        {!isLoading && !error && !primaryResume && <EmptyState />}
        
        {!isLoading && !error && primaryResume && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="glass-card"
            style={{ padding: '40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px', position: 'relative' }}
          >
            {editMode && (
              <button
                onClick={openEditModal}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(0, 212, 170, 0.15)',
                  border: '1px solid rgba(0, 212, 170, 0.4)',
                  color: 'var(--accent-teal)',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Edit2 size={12} /> Edit Resume Info
              </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.2), rgba(99, 102, 241, 0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={32} color="var(--text-primary)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Detailed Curriculum Vitae</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{primaryResume.description || `Version ${primaryResume.version_number} - Last updated: ${primaryResume.last_updated}`}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              {primaryResume.file_url && primaryResume.file_url !== '#' ? (
                <a href={primaryResume.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '16px 32px' }}>
                  <Download size={20} /> Download PDF
                </a>
              ) : (
                <button
                  onClick={editMode ? openEditModal : () => alert('Resume link will be available soon.')}
                  className="btn btn-primary"
                  style={{ padding: '16px 32px' }}
                >
                  <Download size={20} /> {editMode ? 'Set Resume Link' : 'Download PDF'}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <GenericEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Resume Information"
        onSuccess={() => setIsModalOpen(false)}
        onSubmit={handleSave}
      >
        {() => (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Resume File URL / Cloud Link</label>
              <input
                type="url"
                required
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://drive.google.com/... or direct PDF link"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Version Number</label>
              <input
                type="text"
                value={versionNumber}
                onChange={(e) => setVersionNumber(e.target.value)}
                placeholder="e.g. 2025.1"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Description / Summary</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of your CV..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', resize: 'vertical' }}
              />
            </div>
          </>
        )}
      </GenericEditModal>
    </section>
  );
};
