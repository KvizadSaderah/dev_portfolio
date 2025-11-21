import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectList from './components/ProjectList';
import BlogList from './components/BlogList';
import Footer from './components/Footer';
import Marquee from './components/Marquee';
import { ViewState } from './types';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate a raw loading screen
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-neo-black flex flex-col items-center justify-center font-mono text-neo-secondary p-4">
        <div className="text-6xl md:text-9xl font-black tracking-tighter animate-pulse">
          LOADING...
        </div>
        <div className="mt-8 border-2 border-neo-secondary w-64 h-8 p-1">
          <div className="h-full bg-neo-secondary w-full animate-[width_1.5s_ease-in-out]"></div>
        </div>
        <p className="mt-4 text-sm">INITIALIZING SYSTEM CORE</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neo-bg text-neo-black font-mono selection:bg-neo-pink selection:text-white overflow-x-hidden">
      <Marquee text="AVAILABLE FOR FREELANCE // BUILDING THE FUTURE // TYPESCRIPT WIZARD // REACT ENTHUSIAST // " speed={20} />
      
      <Navbar currentView={view} setView={setView} />

      <main className="container mx-auto px-4 md:px-8 py-8 max-w-7xl min-h-[80vh]">
        {view === 'HOME' && <Hero setView={setView} />}
        {view === 'PROJECTS' && <ProjectList />}
        {view === 'BLOG' && <BlogList />}
      </main>

      <Marquee text="KEEP IT SIMPLE // KEEP IT RAW // PUSH TO PRODUCTION // " speed={30} direction="right" className="bg-neo-black text-neo-bg border-y-4 border-neo-black" />
      
      <Footer />
      
      {/* Floating Action Button for Contact (Mobile) */}
      <div className="fixed bottom-8 right-8 md:hidden z-50">
        <button 
          className="bg-neo-primary p-4 border-4 border-neo-black shadow-neo active:shadow-neo-hover active:translate-x-[3px] active:translate-y-[3px] transition-all rounded-none"
          onClick={() => window.open('mailto:hello@example.com')}
        >
           <span className="font-bold text-xl">@</span>
        </button>
      </div>
    </div>
  );
};

export default App;