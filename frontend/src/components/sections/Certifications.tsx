import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useCertifications } from '../../hooks/usePortfolioData';
import { SkeletonCard } from '../ui/SkeletonCard';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import { Award, ExternalLink, Plus, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GenericEditModal } from '../owner/EditModals';
import apiClient from '../../api/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import type { Certification } from '../../types/portfolio';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const Certifications: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data, isLoading, error, refetch } = useCertifications();
  const { editMode } = useAuth();
  const queryClient = useQueryClient();

  const [activeCert, setActiveCert] = useState<Certification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [issuingOrg, setIssuingOrg] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');

  const openNewModal = () => {
    setIsNew(true);
    setActiveCert(null);
    setName('');
    setIssuingOrg('');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setCredentialId('');
    setCredentialUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (cert: Certification) => {
    setIsNew(false);
    setActiveCert(cert);
    setName(cert.name);
    setIssuingOrg(cert.issuing_organization || '');
    setIssueDate(cert.issue_date || '');
    setCredentialId(cert.credential_id || '');
    setCredentialUrl(cert.credential_url || '');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      name,
      issuing_organization: issuingOrg,
      issue_date: issueDate || null,
      credential_id: credentialId,
      credential_url: credentialUrl,
    };
    if (isNew) {
      await apiClient.post('/owner/certifications/', payload);
    } else if (activeCert) {
      await apiClient.put(`/owner/certifications/${activeCert.certification_id}/`, payload);
    }
    queryClient.invalidateQueries({ queryKey: ['certifications'] });
  };

  const handleDelete = async () => {
    if (activeCert) {
      await apiClient.delete(`/owner/certifications/${activeCert.certification_id}/`);
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
    }
  };

  return (
    <section id="certifications" ref={ref} className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="section-divider" />
            <h2 className="section-title"><span className="gradient-text">Certifications</span></h2>
            <p className="section-subtitle">Professional qualifications and certificates</p>
          </motion.div>

          {editMode && (
            <button
              onClick={openNewModal}
              className="btn btn-primary"
              style={{ marginBottom: '60px', padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Add Certification
            </button>
          )}
        </div>
        
        {isLoading && <div className="grid-3"><SkeletonCard count={3} height="180px" /></div>}
        {error && <ErrorState onRetry={refetch} />}
        {!isLoading && !error && (!data || data.length === 0) && <EmptyState />}
        
        {!isLoading && !error && data && data.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid-3"
          >
            {data.map((cert) => (
              <motion.div
                key={cert.certification_id}
                variants={itemVariants}
                className="glass-card"
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative' }}
              >
                {editMode && (
                  <button
                    onClick={() => openEditModal(cert)}
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
                    <Edit2 size={12} /> Edit
                  </button>
                )}

                <Award size={32} color="var(--accent-teal)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '8px' }}>{cert.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>{cert.issuing_organization}</p>
                {cert.credential_id && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    ID: {cert.credential_id}
                  </p>
                )}
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Issued: {cert.issue_date}</span>
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                      Verify <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <GenericEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isNew ? 'Add Certification' : 'Edit Certification'}
        onSuccess={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        onDelete={!isNew ? handleDelete : undefined}
      >
        {() => (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Certification Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AWS Certified Solutions Architect, Meta React Developer"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Issuing Organization</label>
              <input
                type="text"
                required
                value={issuingOrg}
                onChange={(e) => setIssuingOrg(e.target.value)}
                placeholder="e.g. Coursera, Meta, Google, FreeCodeCamp"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Credential ID (Optional)</label>
                <input
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="e.g. CERT-12345"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Credential / Certificate Image Link</label>
              <input
                type="url"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                placeholder="https://example.com/certificate or image link"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
              />
            </div>
          </>
        )}
      </GenericEditModal>
    </section>
  );
};
