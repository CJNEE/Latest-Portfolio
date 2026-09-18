import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#education', label: 'Education' },
  { href: '#certifications', label: 'Certs' },
  { href: '#achievements', label: 'Achievements' },
  { href: '#contact', label: 'Contact' },
  { href: '#resume', label: 'Resume' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = navLinks.map(l => l.href.slice(1));
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          padding: scrolled ? '12px 0' : '20px 0',
          background: scrolled ? 'rgba(10, 15, 30, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(99, 102, 241, 0.15)' : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleNav('#hero'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
            aria-label="Christian Joseph Ostaga - Home"
          >
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(0, 212, 170, 0.4)',
              boxShadow: '0 0 16px rgba(0, 212, 170, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#0a0f1e',
            }}>
              <img src="/logo.jpg" alt="Christian Joseph Ostaga Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              CJ<span className="gradient-text">Ostaga</span>
            </span>
          </a>

          <ul style={{ display: 'flex', gap: '4px', listStyle: 'none', alignItems: 'center' }} className="desktop-nav">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNav(link.href)}
                  style={{
                    padding: '8px 14px', borderRadius: '8px',
                    background: activeSection === link.href.slice(1) ? 'rgba(0, 212, 170, 0.1)' : 'transparent',
                    color: activeSection === link.href.slice(1) ? 'var(--accent-teal)' : 'var(--text-secondary)',
                    border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
                    fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--text-primary)'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = activeSection === link.href.slice(1) ? 'var(--accent-teal)' : 'var(--text-secondary)'; }}
                  aria-label={`Navigate to ${link.label}`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '8px', cursor: 'pointer', color: 'var(--text-primary)',
              display: 'none',
            }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', top: '70px', left: 0, right: 0, zIndex: 999,
              background: 'rgba(10, 15, 30, 0.97)', backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border)', padding: '20px 24px',
            }}
            role="dialog"
            aria-label="Mobile navigation menu"
          >
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNav(link.href)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '14px 16px',
                      borderRadius: '10px', background: 'transparent', border: 'none',
                      color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'var(--font-sans)',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'rgba(0, 212, 170, 0.08)'; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'transparent'; }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};
