import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAboutMe, useProfile } from '../../hooks/usePortfolioData';
import { SkeletonCard } from '../ui/SkeletonCard';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { GenericEditModal } from '../owner/EditModals';
import { ProfilePhotoSlider } from '../ui/ProfilePhotoSlider';
import { Plus, Edit2 } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import type { AboutMe as AboutMeType } from '../../types/portfolio';

export const About: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data: aboutData, isLoading, error, refetch } = useAboutMe();
  const { data: profile } = useProfile();
  const { editMode } = useAuth();
  const queryClient = useQueryClient();

  const [activeItem, setActiveItem] = useState<AboutMeType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const contentList = aboutData && aboutData.length > 0 ? aboutData : (profile?.bio ? [{ about_me_id: 0, title: 'About Me', content: profile.bio, last_updated: '', display_order: 1 }] : []);

  const openNewModal = () => {
    setIsNew(true);
    setActiveItem(null);
    setTitle('');
    setContent('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: AboutMeType) => {
    setIsNew(false);
    setActiveItem(item);
    setTitle(item.title);
    setContent(item.content);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (isNew) {
      await apiClient.post('/owner/aboutme/', { title, content, display_order: contentList.length + 1 });
    } else if (activeItem && activeItem.about_me_id) {
      await apiClient.put(`/owner/aboutme/${activeItem.about_me_id}/`, { title, content });
    }
    queryClient.invalidateQueries({ queryKey: ['aboutme'] });
  };

  const handleDelete = async () => {
    if (activeItem && activeItem.about_me_id) {
      await apiClient.delete(`/owner/aboutme/${activeItem.about_me_id}/`);
      queryClient.invalidateQueries({ queryKey: ['aboutme'] });
    }
  };

  return (
    <section id="about" ref={ref} className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="section-divider" />
            <h2 className="section-title">About <span className="gradient-text">Me</span></h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>Get to know more about me and my journey</p>
          </motion.div>

          {editMode && (
            <button
              onClick={openNewModal}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Add About Section
            </button>
          )}
        </div>
        
        {isLoading && <SkeletonCard count={1} height="300px" />}
        {error && <ErrorState onRetry={refetch} />}
        {!isLoading && !error && contentList.length === 0 && <EmptyState />}
        {!isLoading && !error && contentList.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 440px) 1fr',
              gap: '48px',
              alignItems: 'center',
            }}
            className="about-showcase-grid"
          >
            {/* Left Column: Rotating 3-Second Professional Photo Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ProfilePhotoSlider />
            </motion.div>

            {/* Right Column: About Content Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {contentList.map((item, idx) => (
                <motion.div
                  key={item.about_me_id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                  className="glass-card"
                  style={{ padding: '32px', position: 'relative' }}
                >
                  {editMode && item.about_me_id > 0 && (
                    <button
                      onClick={() => openEditModal(item)}
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(0, 212, 170, 0.15)',
                        border: '1px solid rgba(0, 212, 170, 0.4)',
                        color: 'var(--accent-teal)',
                        padding: '6px 12px',
                        borderRadius: '20px',
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
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '16px', color: 'var(--accent-teal)', fontWeight: 700 }}>
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.02rem' }}>
                    {item.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <GenericEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isNew ? 'Add About Section' : 'Edit About Section'}
        onSuccess={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        onDelete={!isNew && activeItem?.about_me_id ? handleDelete : undefined}
      >
        {() => (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Section Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. My Background or Philosophy"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Content</label>
              <textarea
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your story, expertise or focus areas..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', resize: 'vertical' }}
              />
            </div>
          </>
        )}
      </GenericEditModal>

      <style>{`
        @media (max-width: 960px) {
          .about-showcase-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </section>
  );
};
