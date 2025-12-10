import { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { MusicPlayer } from './components/MusicPlayer';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'player'>('home');

  if (currentPage === 'player') {
    return <MusicPlayer onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero onStart={() => setCurrentPage('player')} />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
