import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code2 } from 'lucide-react';

const images = [
  { src: '/profile-1.jpg', alt: 'Christian Joseph Ostaga - Professional Portrait 1' },
  { src: '/profile-2.jpg', alt: 'Christian Joseph Ostaga - Professional Portrait 2' },
  { src: '/profile-3.jpg', alt: 'Christian Joseph Ostaga - Professional Portrait 3' },
];

export const ProfilePhotoSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds interval as requested

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
      }}
    >
      {/* Ambient glowing backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: '-8px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.35), rgba(99, 102, 241, 0.35), rgba(6, 182, 212, 0.25))',
          filter: 'blur(20px)',
          opacity: 0.7,
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Main Card Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: '24px',
          overflow: 'hidden',
          background: '#0d1322',
          border: '1.5px solid rgba(0, 212, 170, 0.4)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 212, 170, 0.15)',
          aspectRatio: '4 / 4.8',
        }}
      >
        {/* Animated Image Slider with cross-fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 20%',
                display: 'block',
              }}
            />
            {/* Dark gradient overlay at bottom for badge readability */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(10, 15, 30, 0.1) 0%, rgba(10, 15, 30, 0.2) 60%, rgba(10, 15, 30, 0.85) 100%)',
                pointerEvents: 'none',
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Top Floating Badge */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 3,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '50px',
            background: 'rgba(10, 15, 30, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(0, 212, 170, 0.3)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--accent-teal)',
            letterSpacing: '0.04em',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
          }}
        >
          <Code2 size={13} />
          <span>Full-Stack Engineer</span>
        </div>

        {/* Top Right Live Pill */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 3,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '50px',
            background: 'rgba(10, 15, 30, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: '#e2e8f0',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#00d4aa',
              boxShadow: '0 0 8px #00d4aa',
            }}
          />
          <span>Active</span>
        </div>

        {/* Bottom Floating Info & Progress */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Caption Box */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '16px',
              background: 'rgba(17, 24, 39, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Christian Joseph Ostaga
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', margin: '2px 0 0 0', fontWeight: 600 }}>
                Founder & Developer
              </p>
            </div>
            <Sparkles size={16} color="var(--accent-teal)" />
          </div>

          {/* 3-Dot Progress Indicators (Switches every 3 seconds) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`View photo ${idx + 1}`}
                style={{
                  height: '4px',
                  width: currentIndex === idx ? '28px' : '12px',
                  borderRadius: '4px',
                  background: currentIndex === idx ? 'var(--accent-teal)' : 'rgba(255, 255, 255, 0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                  boxShadow: currentIndex === idx ? '0 0 10px rgba(0, 212, 170, 0.7)' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
