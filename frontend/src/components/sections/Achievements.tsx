import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAchievements } from '../../hooks/usePortfolioData';
import { SkeletonCard } from '../ui/SkeletonCard';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import { Trophy, ExternalLink, Plus, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GenericEditModal } from '../owner/EditModals';
import apiClient from '../../api/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import type { Achievement } from '../../types/portfolio';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const Achievements: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data, isLoading, error, refetch } = useAchievements();
  const { editMode } = useAuth();
  const queryClient = useQueryClient();

  const [activeAch, setActiveAch] = useState<Achievement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateAchieved, setDateAchieved] = useState('');
  const [category, setCategory] = useState('Academic');
  const [linkUrl, setLinkUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const openNewModal = () => {
    setIsNew(true);
    setActiveAch(null);
    setTitle('');
    setDescription('');
    setDateAchieved(new Date().toISOString().split('T')[0]);
    setCategory('Academic');
    setLinkUrl('');
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (ach: Achievement) => {
    setIsNew(false);
    setActiveAch(ach);
    setTitle(ach.title);
    setDescription(ach.description || '');
    setDateAchieved(ach.date_achieved || '');
    setCategory(ach.category || 'Academic');
    setLinkUrl(ach.link_url || '');
    setIsFeatured(ach.is_featured || false);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      title,
      description,
      date_achieved: dateAchieved || null,
      category,
      link_url: linkUrl,
      is_featured: isFeatured,
    };
    if (isNew) {
      await apiClient.post('/owner/achievements/', payload);
    } else if (activeAch) {
      await apiClient.put(`/owner/achievements/${activeAch.achievement_id}/`, payload);
    }
    queryClient.invalidateQueries({ queryKey: ['achievements'] });
  };

  const handleDelete = async () => {
    if (activeAch) {
      await apiClient.delete(`/owner/achievements/${activeAch.achievement_id}/`);
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    }
  };

  return (
    <section id="achievements" ref={ref} className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="section-divider" />
            <h2 className="section-title">Key <span className="gradient-text">Achievements</span></h2>
            <p className="section-subtitle">Milestones and recognitions</p>
          </motion.div>

          {editMode && (
            <button
              onClick={openNewModal}
              className="btn btn-primary"
              style={{ marginBottom: '60px', padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Add Achievement
            </button>
          )}
        </div>
        
        {isLoading && <div className="grid-2"><SkeletonCard count={2} height="200px" /></div>}
        {error && <ErrorState onRetry={refetch} />}
        {!isLoading && !error && (!data || data.length === 0) && <EmptyState />}
        
        {!isLoading && !error && data && data.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid-2"
          >
            {data.map((achievement) => (
              <motion.div key={achievement.achievement_id} variants={itemVariants} className="glass-card" style={{ padding: '32px', position: 'relative' }}>
                {editMode && (
                  <button
                    onClick={() => openEditModal(achievement)}
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trophy size={20} color="#f59e0b" />
                    </div>
                    {achievement.category && <span className="tag tag-indigo">{achievement.category}</span>}
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{achievement.date_achieved}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '12px' }}>{achievement.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.95rem' }}>{achievement.description}</p>
                {achievement.link_url && (
                  <a href={achievement.link_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    <ExternalLink size={16} /> Learn More
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <GenericEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isNew ? 'Add Achievement' : 'Edit Achievement'}
        onSuccess={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        onDelete={!isNew ? handleDelete : undefined}
      >
        {() => (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 1st Place Hackathon, Dean's Lister"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Description</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what was accomplished..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Date Achieved</label>
                <input
                  type="date"
                  value={dateAchieved}
                  onChange={(e) => setDateAchieved(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Academic, Competition, Leadership"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Link URL (Optional)</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
              />
            </div>
          </>
        )}
      </GenericEditModal>
    </section>
  );
};
