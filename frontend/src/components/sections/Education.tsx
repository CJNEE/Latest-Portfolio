import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEducation } from '../../hooks/usePortfolioData';
import { SkeletonCard } from '../ui/SkeletonCard';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import { GraduationCap, Calendar, Plus, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GenericEditModal } from '../owner/EditModals';
import apiClient from '../../api/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import type { Education as EducationType } from '../../types/portfolio';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export const Education: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data, isLoading, error, refetch } = useEducation();
  const { editMode } = useAuth();
  const queryClient = useQueryClient();

  const [activeEdu, setActiveEdu] = useState<EducationType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Form fields
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [gradeGpa, setGradeGpa] = useState('');

  const openNewModal = () => {
    setIsNew(true);
    setActiveEdu(null);
    setInstitution('');
    setDegree('');
    setFieldOfStudy('');
    setStartDate('');
    setEndDate('');
    setGradeGpa('');
    setIsModalOpen(true);
  };

  const openEditModal = (edu: EducationType) => {
    setIsNew(false);
    setActiveEdu(edu);
    setInstitution(edu.institution_name);
    setDegree(edu.degree || '');
    setFieldOfStudy(edu.field_of_study || '');
    setStartDate(edu.start_date || '');
    setEndDate(edu.end_date || '');
    setGradeGpa(edu.grade_gpa || '');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      institution_name: institution,
      degree,
      field_of_study: fieldOfStudy,
      start_date: startDate || null,
      end_date: endDate || null,
      grade_gpa: gradeGpa,
    };
    if (isNew) {
      await apiClient.post('/owner/education/', payload);
    } else if (activeEdu) {
      await apiClient.put(`/owner/education/${activeEdu.education_id}/`, payload);
    }
    queryClient.invalidateQueries({ queryKey: ['education'] });
  };

  const handleDelete = async () => {
    if (activeEdu) {
      await apiClient.delete(`/owner/education/${activeEdu.education_id}/`);
      queryClient.invalidateQueries({ queryKey: ['education'] });
    }
  };

  return (
    <section id="education" ref={ref} className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="section-divider" />
            <h2 className="section-title"><span className="gradient-text">Education</span> Background</h2>
            <p className="section-subtitle">My academic journey</p>
          </motion.div>

          {editMode && (
            <button
              onClick={openNewModal}
              className="btn btn-primary"
              style={{ marginBottom: '60px', padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Add Education
            </button>
          )}
        </div>
        
        {isLoading && <SkeletonCard count={2} height="120px" />}
        {error && <ErrorState onRetry={refetch} />}
        {!isLoading && !error && (!data || data.length === 0) && <EmptyState />}
        
        {!isLoading && !error && data && data.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}
          >
            <div style={{ position: 'absolute', left: '24px', top: '24px', bottom: '24px', width: '2px', background: 'var(--border)' }} />
            
            {data.map((edu) => (
              <motion.div
                key={edu.education_id}
                variants={itemVariants}
                className="glass-card"
                style={{ padding: '24px', display: 'flex', gap: '24px', position: 'relative' }}
              >
                {editMode && (
                  <button
                    onClick={() => openEditModal(edu)}
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

                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-card)',
                  border: '2px solid var(--accent-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, zIndex: 2
                }}>
                  <GraduationCap size={24} color="var(--accent-indigo)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '8px' }}>{edu.degree} in {edu.field_of_study}</h3>
                  <p style={{ fontSize: '1.1rem', color: 'var(--accent-teal)', marginBottom: '8px', fontWeight: 500 }}>{edu.institution_name}</p>
                  
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} /> {edu.start_date || 'N/A'} - {edu.end_date || 'Present'}
                    </span>
                    {edu.grade_gpa && (
                      <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-indigo)', padding: '2px 8px', borderRadius: '4px' }}>
                        GPA: {edu.grade_gpa}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <GenericEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isNew ? 'Add Education' : 'Edit Education'}
        onSuccess={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        onDelete={!isNew ? handleDelete : undefined}
      >
        {() => (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Institution Name</label>
              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. University of Science & Technology"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Degree</label>
                <input
                  type="text"
                  required
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Bachelor of Science"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Field of Study</label>
                <input
                  type="text"
                  required
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder="e.g. Information Technology"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Grade / Honors</label>
                <input
                  type="text"
                  value={gradeGpa}
                  onChange={(e) => setGradeGpa(e.target.value)}
                  placeholder="e.g. Magna Cum Laude"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                />
              </div>
            </div>
          </>
        )}
      </GenericEditModal>
    </section>
  );
};
