import React, { useEffect } from 'react';
import { Hero } from '../components/sections/Hero';
import { About } from '../components/sections/About';
import { Skills } from '../components/sections/Skills';
import { Projects } from '../components/sections/Projects';
import { Education } from '../components/sections/Education';
import { Certifications } from '../components/sections/Certifications';
import { Achievements } from '../components/sections/Achievements';
import { Contact } from '../components/sections/Contact';
import { Resume } from '../components/sections/Resume';
import { trackVisit } from '../api/portfolio';

export const Home: React.FC = () => {
  useEffect(() => {
    trackVisit().catch(() => {}); // Fire and forget
  }, []);

  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Education />
      <Certifications />
      <Achievements />
      <Contact />
      <Resume />
    </main>
  );
};
