import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ExternalLink, User, Mail, Briefcase, Edit3 } from 'lucide-react';
import { useProfile, useResume } from '../../hooks/usePortfolioData';
import { useAuth } from '../../context/AuthContext';
import { useLongPress } from '../../hooks/useLongPress';
import { GenericEditModal } from '../owner/EditModals';
import apiClient from '../../api/apiClient';
import { useQueryClient } from '@tanstack/react-query';

const typingStrings = [
  'Full-Stack Developer',
  'React Enthusiast',
  'Django Backend Engineer',
  'UI/UX Passionate',
  'Problem Solver',
];

const useTypingEffect = (strings: string[], speed = 80, deleteSpeed = 40, pause = 2000) => {
  const [displayed, setDisplayed] = React.useState('');
  const [stringIndex, setStringIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  useEffect(() => {
    const current = strings[stringIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(current.slice(0, charIndex + 1));
        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pause);
        } else {
          setCharIndex(c => c + 1);
        }
      } else {
        setDisplayed(current.slice(0, charIndex - 1));
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setStringIndex(i => (i + 1) % strings.length);
          setCharIndex(0);
        } else {
          setCharIndex(c => c - 1);
        }
      }
    }, isDeleting ? deleteSpeed : speed);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, stringIndex, strings, speed, deleteSpeed, pause]);

  return displayed;
};

export const Hero: React.FC = () => {
  const { data: profile, isLoading } = useProfile();
  const { data: resumes } = useResume();
  const queryClient = useQueryClient();
  const { openLoginModal, editMode } = useAuth();
  const typedText = useTypingEffect(typingStrings);
  const primaryResume = resumes?.find(r => r.is_primary) || resumes?.[0];

  // 5-second long press hook for hidden login
  const { handlers, progress, isPressing } = useLongPress({
    threshold: 5000,
    onFinish: () => {
      openLoginModal();
    },
  });

  // Edit profile state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formFirstname, setFormFirstname] = useState('');
  const [formMiddlename, setFormMiddlename] = useState('');
  const [formLastname, setFormLastname] = useState('');
  const [formBio, setFormBio] = useState('');

  useEffect(() => {
    if (profile) {
      setFormFirstname(profile.firstname || '');
      setFormMiddlename(profile.middlename || '');
      setFormLastname(profile.lastname || '');
      setFormBio(profile.bio || '');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    await apiClient.put('/owner/profile/', {
      firstname: formFirstname,
      middlename: formMiddlename,
      lastname: formLastname,
      bio: formBio,
    });
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  };

  const name = profile?.full_name || 'Christian Joseph Ostaga';
  const bio = profile?.bio || 'A passionate full-stack developer dedicated to building modern, scalable web applications.';

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', position: 'relative', overflow: 'hidden',
        padding: '120px 0 80px',
      }}
      aria-label="Hero section"
    >
      {/* Background gradient orbs */}
      <div style={{
        position: 'absolute', top: '20%', left: '10%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', filter: 'blur(40px)',
      }} aria-hidden="true" />
      <div style={{
        position: 'absolute', bottom: '20%', right: '10%',
        width: '350px', height: '350px',
        background: 'radial-gradient(circle, rgba(0, 212, 170, 0.10) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', filter: 'blur(40px)',
      }} aria-hidden="true" />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '900px' }}>
        {/* Logo Avatar with 5-second hold trigger */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
          style={{ marginBottom: '24px', display: 'inline-block', position: 'relative' }}
        >
          <div
            {...handlers}
            title="Hold for 5 seconds to open Owner Login"
            style={{
              position: 'relative',
              width: '144px',
              height: '144px',
              margin: '0 auto',
              cursor: 'pointer',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            {/* SVG Progress Ring */}
            <svg
              style={{
                position: 'absolute',
                top: -4,
                left: -4,
                width: 152,
                height: 152,
                transform: 'rotate(-90deg)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              <circle
                cx="76"
                cy="76"
                r={radius}
                stroke={isPressing ? 'rgba(0, 212, 170, 0.2)' : 'transparent'}
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="76"
                cy="76"
                r={radius}
                stroke="#00d4aa"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                style={{
                  transition: 'stroke-dashoffset 0.05s linear',
                  filter: 'drop-shadow(0 0 8px #00d4aa)',
                }}
              />
            </svg>

            {/* Glowing background */}
            <div style={{
              position: 'absolute',
              inset: '4px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00d4aa, #6366f1, #06b6d4)',
              filter: 'blur(10px)',
              opacity: isPressing ? 0.95 : 0.75,
              transform: isPressing ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s ease',
            }} />

            <img
              src="/logo.jpg"
              alt="Christian Joseph Ostaga (CJ)"
              style={{
                position: 'relative',
                width: '136px',
                height: '136px',
                margin: '4px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid rgba(0, 212, 170, 0.6)',
                boxShadow: isPressing ? '0 0 30px rgba(0, 212, 170, 0.8)' : '0 8px 32px rgba(0, 0, 0, 0.6)',
                display: 'block',
                transform: isPressing ? 'scale(0.97)' : 'scale(1)',
                transition: 'all 0.2s ease',
              }}
            />

            {isPressing && (
              <div style={{
                position: 'absolute',
                bottom: -28,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.8)',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                color: 'var(--accent-teal)',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                border: '1px solid rgba(0, 212, 170, 0.4)',
                zIndex: 10,
              }}>
                Unlocking Owner... {Math.round(progress * 100)}%
              </div>
            )}
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ marginBottom: '28px' }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 20px', borderRadius: '50px',
            background: 'rgba(0, 212, 170, 0.08)',
            border: '1px solid rgba(0, 212, 170, 0.2)',
            fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-teal)',
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-teal)', animation: 'pulse 2s infinite' }} />
            Available for opportunities
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 900, lineHeight: 1.05,
            letterSpacing: '-0.03em', marginBottom: '16px',
          }}
        >
          {isLoading ? (
            <span style={{ color: 'var(--text-primary)' }}>{name}</span>
          ) : (
            <span className="gradient-text">{name}</span>
          )}
        </motion.h1>

        {/* Typing effect title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ marginBottom: '28px', minHeight: '48px' }}
        >
          <span style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.75rem)',
            fontWeight: 300, color: 'var(--text-secondary)',
          }}>
            I'm a{' '}
            <span style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>
              {typedText}
              <span style={{ animation: 'blink 1s infinite' }}>|</span>
            </span>
          </span>
        </motion.div>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.125rem)',
            color: 'var(--text-secondary)', lineHeight: 1.8,
            maxWidth: '700px', margin: '0 auto 48px',
          }}
        >
          {bio}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}
        >
          <button onClick={() => scrollTo('projects')} className="btn btn-primary">
            <Briefcase size={18} />
            View Projects
          </button>
          <button onClick={() => scrollTo('about')} className="btn btn-outline">
            <User size={18} />
            About Me
          </button>
          <button onClick={() => scrollTo('contact')} className="btn btn-outline">
            <Mail size={18} />
            Contact
          </button>
          {primaryResume?.file_url && (
            <a href={primaryResume.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <ExternalLink size={18} />
              Download CV
            </a>
          )}
          {editMode && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: '50px',
                background: 'rgba(0, 212, 170, 0.15)',
                border: '1px solid rgba(0, 212, 170, 0.5)',
                color: 'var(--accent-teal)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Edit3 size={16} /> Edit Hero & Bio
            </button>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ position: 'relative', marginTop: '40px' }}
        >
          <button
            onClick={() => scrollTo('about')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            aria-label="Scroll down"
          >
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
            <ChevronDown size={20} style={{ animation: 'bounce 2s infinite' }} />
          </button>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <GenericEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile & Hero Information"
        onSuccess={() => setIsEditModalOpen(false)}
        onSubmit={handleSaveProfile}
      >
        {() => (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>First Name</label>
                <input
                  type="text"
                  value={formFirstname}
                  onChange={(e) => setFormFirstname(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Middle Name</label>
                <input
                  type="text"
                  value={formMiddlename}
                  onChange={(e) => setFormMiddlename(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Last Name</label>
                <input
                  type="text"
                  value={formLastname}
                  onChange={(e) => setFormLastname(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Professional Bio</label>
              <textarea
                rows={4}
                value={formBio}
                onChange={(e) => setFormBio(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', resize: 'vertical' }}
              />
            </div>
          </>
        )}
      </GenericEditModal>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
      `}</style>
    </section>
  );
};
