import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useContact } from '../../hooks/usePortfolioData';
import { SkeletonCard } from '../ui/SkeletonCard';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import * as LucideIcons from 'lucide-react';
import { Plus, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GenericEditModal } from '../owner/EditModals';
import apiClient from '../../api/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import type { Contact as ContactType } from '../../types/portfolio';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const Contact: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data, isLoading, error, refetch } = useContact();
  const { editMode } = useAuth();
  const queryClient = useQueryClient();

  const [activeContact, setActiveContact] = useState<ContactType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Form fields
  const [contactType, setContactType] = useState('Email');
  const [contactValue, setContactValue] = useState('');
  const [iconName, setIconName] = useState('Mail');

  const getIcon = (type?: string, name?: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('tiktok')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.86-4.49V8.75a8.28 8.28 0 0 0 4.84 1.56V6.87a4.9 4.9 0 0 1-.93-.18z" />
        </svg>
      );
    }
    if (t.includes('instagram')) {
      const Ig = (LucideIcons as any).Instagram || LucideIcons.Camera;
      return <Ig size={24} />;
    }
    if (t.includes('facebook')) {
      const Fb = (LucideIcons as any).Facebook || LucideIcons.Share2;
      return <Fb size={24} />;
    }
    const IconComponent = (name && (LucideIcons as any)[name]) || LucideIcons.Mail;
    return <IconComponent size={24} />;
  };

  const openNewModal = () => {
    setIsNew(true);
    setActiveContact(null);
    setContactType('Email');
    setContactValue('');
    setIconName('Mail');
    setIsModalOpen(true);
  };

  const openEditModal = (contact: ContactType) => {
    setIsNew(false);
    setActiveContact(contact);
    setContactType(contact.contact_type || 'Email');
    setContactValue(contact.contact_value || '');
    setIconName(contact.icon_name || 'Mail');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      contact_type: contactType,
      contact_value: contactValue,
      icon_name: iconName,
      display_order: isNew ? (data?.length || 0) + 1 : activeContact?.display_order || 0,
      is_public: true,
    };
    if (isNew) {
      await apiClient.post('/owner/contact/', payload);
    } else if (activeContact) {
      await apiClient.put(`/owner/contact/${activeContact.contact_id}/`, payload);
    }
    queryClient.invalidateQueries({ queryKey: ['contact'] });
  };

  const handleDelete = async () => {
    if (activeContact) {
      await apiClient.delete(`/owner/contact/${activeContact.contact_id}/`);
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    }
  };

  return (
    <section id="contact" ref={ref} className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="section-divider" />
            <h2 className="section-title">Get In <span className="gradient-text">Touch</span></h2>
            <p className="section-subtitle">Let's connect and discuss opportunities</p>
          </motion.div>

          {editMode && (
            <button
              onClick={openNewModal}
              className="btn btn-primary"
              style={{ marginBottom: '60px', padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Add Contact
            </button>
          )}
        </div>
        
        {isLoading && <div className="grid-3"><SkeletonCard count={3} height="120px" /></div>}
        {error && <ErrorState onRetry={refetch} />}
        {!isLoading && !error && (!data || data.length === 0) && <EmptyState />}
        
        {!isLoading && !error && data && data.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {data.map((contact) => (
              <div
                key={contact.contact_id}
                style={{ position: 'relative' }}
              >
                {editMode && (
                  <button
                    onClick={() => openEditModal(contact)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 10,
                      background: 'rgba(0, 212, 170, 0.15)',
                      border: '1px solid rgba(0, 212, 170, 0.4)',
                      color: 'var(--accent-teal)',
                      padding: '4px 8px',
                      borderRadius: '16px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Edit2 size={11} /> Edit
                  </button>
                )}

                <motion.a
                  href={contact.contact_value?.includes('@') ? `mailto:${contact.contact_value}` : contact.contact_value}
                  target={contact.contact_value?.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  className="glass-card"
                  style={{
                    padding: '28px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    textDecoration: 'none',
                    height: '100%',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.15), rgba(99, 102, 241, 0.15))',
                    border: '1px solid rgba(0, 212, 170, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-teal)',
                    marginBottom: '16px',
                  }}>
                    {getIcon(contact.contact_type, contact.icon_name || 'Mail')}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 700 }}>
                    {contact.contact_type}
                  </h3>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    wordBreak: 'break-word',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {contact.contact_value?.replace('https://www.', '').replace('https://', '')}
                  </p>
                </motion.a>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <GenericEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isNew ? 'Add Contact Method' : 'Edit Contact Method'}
        onSuccess={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        onDelete={!isNew ? handleDelete : undefined}
      >
        {() => (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Contact Type / Label</label>
              <input
                type="text"
                required
                value={contactType}
                onChange={(e) => setContactType(e.target.value)}
                placeholder="e.g. Email, GitHub, LinkedIn, TikTok, Instagram, Facebook"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Value / URL / Handle</label>
              <input
                type="text"
                required
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                placeholder="e.g. https://www.tiktok.com/@... or ostagacj@gmail.com"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Icon</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#111827', border: '1px solid var(--border)', color: 'white' }}
              >
                <option value="Mail">Mail / Email</option>
                <option value="Github">Github</option>
                <option value="Linkedin">Linkedin</option>
                <option value="Music">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Globe">Website / Link</option>
                <option value="Phone">Phone</option>
                <option value="Send">Telegram</option>
                <option value="MessageSquare">Discord</option>
              </select>
            </div>
          </>
        )}
      </GenericEditModal>
    </section>
  );
};
