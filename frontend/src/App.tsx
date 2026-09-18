import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ParticleBackground } from './components/ui/ParticleBackground';
import { LoginOwnerModal } from './components/auth/LoginOwnerModal';
import { OwnerToolbar } from './components/owner/OwnerToolbar';
import { Home } from './pages/Home';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <ParticleBackground />
        <Navbar />
        <Home />
        <Footer />
        <LoginOwnerModal />
        <OwnerToolbar />
      </div>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
