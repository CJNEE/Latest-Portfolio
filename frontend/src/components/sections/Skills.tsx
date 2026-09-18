import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSkills } from '../../hooks/usePortfolioData';
import { SkeletonCard } from '../ui/SkeletonCard';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { GenericEditModal } from '../owner/EditModals';
import { Plus, Edit2 } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import type { Skill } from '../../types/portfolio';

export const Skills: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data, isLoading, error, refetch } = useSkills();
  const { editMode } = useAuth();
  const queryClient = useQueryClient();

  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [yearAcquired, setYearAcquired] = useState<number | ''>('');
  const [certification, setCertification] = useState('');

  const groupedSkills = data?.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof data>) || {};

  const openNewModal = () => {
    setIsNew(true);
    setActiveSkill(null);
    setName('');
    setCategory('Frontend');
    setYearAcquired(new Date().getFullYear());
    setCertification('');
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setIsNew(false);
    setActiveSkill(skill);
    setName(skill.name || '');
    setCategory(skill.category || 'Frontend');
    setYearAcquired(skill.year_acquired || '');
    setCertification(skill.certification || '');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      name,
      category,
      year_acquired: yearAcquired ? Number(yearAcquired) : null,
      certification,
    };
    if (isNew) {
      await apiClient.post('/owner/skills/', payload);
    } else if (activeSkill) {
      await apiClient.put(`/owner/skills/${activeSkill.skill_id}/`, payload);
    }
    queryClient.invalidateQueries({ queryKey: ['skills'] });
  };

  const handleDelete = async () => {
    if (activeSkill) {
      await apiClient.delete(`/owner/skills/${activeSkill.skill_id}/`);
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    }
  };

  return (
    <section id="skills" ref={ref} className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="section-divider" />
            <h2 className="section-title">My <span className="gradient-text">Skills</span></h2>
            <p className="section-subtitle">Technologies and tools I work with</p>
          </motion.div>

          {editMode && (
            <button
              onClick={openNewModal}
              className="btn btn-primary"
              style={{ marginBottom: '60px', padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Add Skill
            </button>
          )}
        </div>
        
        {isLoading && <SkeletonCard count={2} height="200px" />}
        {error && <ErrorState onRetry={refetch} />}
        {!isLoading && !error && Object.keys(groupedSkills).length === 0 && <EmptyState />}
        {!isLoading && !error && Object.keys(groupedSkills).length > 0 && (
          <div className="grid-2">
            {Object.entries(groupedSkills).map(([cat, skills], idx) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card"
                style={{ padding: '32px' }}
              >
                <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', color: 'var(--text-primary)' }}>{cat}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {skills.map((skill) => (
                    <div
                      key={skill.skill_id}
                      className="tag tag-teal"
                      style={{
                        cursor: editMode ? 'pointer' : 'default',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: editMode ? '6px 12px' : '4px 12px',
                      }}
                      onClick={() => editMode && openEditModal(skill)}
                    >
                      <span>{skill.name} {skill.year_acquired ? `('${skill.year_acquired.toString().slice(-2)})` : ''}</span>
                      {editMode && <Edit2 size={11} color="var(--accent-teal)" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <GenericEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isNew ? 'Add Technical Skill' : 'Edit Technical Skill'}
        onSuccess={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        onDelete={!isNew ? handleDelete : undefined}
      >
        {() => (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Skill Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. React, Python, Docker, PostgreSQL"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Category</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Frontend, Backend, Database, DevOps"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Year Acquired</label>
                <input
                  type="number"
                  value={yearAcquired}
                  onChange={(e) => setYearAcquired(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 2023"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Certification / Notes (Optional)</label>
              <input
                type="text"
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
                placeholder="e.g. Certified React Developer"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
              />
            </div>
          </>
        )}
      </GenericEditModal>
    </section>
  );
};
