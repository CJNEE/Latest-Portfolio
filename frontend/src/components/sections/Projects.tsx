import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useProjects } from '../../hooks/usePortfolioData';
import { SkeletonCard } from '../ui/SkeletonCard';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import { ExternalLink, Github, Plus, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GenericEditModal } from '../owner/EditModals';
import apiClient from '../../api/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import type { Project } from '../../types/portfolio';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const Projects: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data, isLoading, error, refetch } = useProjects();
  const { editMode } = useAuth();
  const queryClient = useQueryClient();

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const sortedProjects = data?.slice().sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return a.display_order - b.display_order;
  });

  const openNewModal = () => {
    setIsNew(true);
    setActiveProject(null);
    setTitle('');
    setDescription('');
    setDemoUrl('');
    setGithubUrl('');
    setMediaUrl('');
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setIsNew(false);
    setActiveProject(project);
    setTitle(project.title || '');
    setDescription(project.description || '');
    setDemoUrl(project.demo_url || '');
    setGithubUrl(project.github_url || '');
    setMediaUrl(project.media?.[0]?.media_url || '');
    setIsFeatured(project.is_featured || false);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      title,
      description,
      demo_url: demoUrl,
      github_url: githubUrl,
      media_url: mediaUrl,
      is_featured: isFeatured,
      display_order: isNew ? (data?.length || 0) + 1 : activeProject?.display_order || 0,
    };

    if (isNew) {
      await apiClient.post('/owner/projects/', payload);
    } else if (activeProject) {
      await apiClient.put(`/owner/projects/${activeProject.project_id}/`, payload);
    }
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

  const handleDelete = async () => {
    if (activeProject) {
      await apiClient.delete(`/owner/projects/${activeProject.project_id}/`);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  };

  return (
    <section id="projects" ref={ref} className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="section-divider" />
            <h2 className="section-title">Featured <span className="gradient-text">Projects</span></h2>
            <p className="section-subtitle">Websites, applications, and systems I've built</p>
          </motion.div>

          {editMode && (
            <button
              onClick={openNewModal}
              className="btn btn-primary"
              style={{ marginBottom: '60px', padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Add Project
            </button>
          )}
        </div>
        
        {isLoading && <div className="grid-2"><SkeletonCard count={2} height="350px" /></div>}
        {error && <ErrorState onRetry={refetch} />}
        {!isLoading && !error && (!sortedProjects || sortedProjects.length === 0) && <EmptyState />}
        
        {!isLoading && !error && sortedProjects && sortedProjects.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid-2"
          >
            {sortedProjects.map((project) => (
              <motion.div
                key={project.project_id}
                variants={itemVariants}
                className="glass-card"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}
              >
                {editMode && (
                  <button
                    onClick={() => openEditModal(project)}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      zIndex: 10,
                      background: 'rgba(17, 24, 39, 0.9)',
                      border: '1px solid rgba(0, 212, 170, 0.5)',
                      color: 'var(--accent-teal)',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    }}
                  >
                    <Edit2 size={13} /> Edit Project
                  </button>
                )}

                {project.media && project.media.length > 0 && (
                  <div style={{ height: '220px', width: '100%', overflow: 'hidden', background: '#0a0f1e' }}>
                    <img src={project.media[0].media_url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {project.is_featured && <span className="tag tag-purple" style={{ alignSelf: 'flex-start', marginBottom: '16px' }}>Featured</span>}
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-primary)' }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', flex: 1, lineHeight: 1.7 }}>{project.description}</p>
                  
                  <div style={{ display: 'flex', gap: '16px', marginTop: 'auto', flexWrap: 'wrap' }}>
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                        <ExternalLink size={16} /> Live Demo / Website
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                        <Github size={16} /> Source Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      <GenericEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isNew ? 'Add New Project / Website / App' : 'Edit Project Details'}
        onSuccess={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        onDelete={!isNew ? handleDelete : undefined}
      >
        {() => (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Project Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. E-Commerce Platform, Inventory System, AI Mobile App"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Description</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key features, tech stack, architecture, purpose..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Live Demo / Website Link</label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://mywebsite.com"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>GitHub / Repository Link</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Preview Image URL</label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://example.com/screenshot.jpg"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-teal)' }}
              />
              <label htmlFor="isFeatured" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                Featured Project (highlighted at top)
              </label>
            </div>
          </>
        )}
      </GenericEditModal>
    </section>
  );
};
