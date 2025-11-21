import React from 'react';
import { ViewState } from '../types';
import { Terminal, Briefcase, BookOpen, Monitor } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const navItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'HOME', label: 'TERMINAL', icon: <Terminal className="w-5 h-5" /> },
    { id: 'PROJECTS', label: 'WORK_LOG', icon: <Monitor className="w-5 h-5" /> },
    { id: 'BLOG', label: 'THOUGHTS', icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b-4 border-neo-black bg-neo-bg">
      <div className="flex flex-col md:flex-row justify-between items-stretch">
        <div className="flex items-center justify-between p-4 border-b-4 md:border-b-0 md:border-r-4 border-neo-black bg-neo-secondary hover:bg-neo-pink transition-colors duration-300 cursor-pointer group" onClick={() => setView('HOME')}>
          <h1 className="text-2xl md:text-3xl font-black font-display tracking-tighter italic group-hover:text-white">
            DEV_PORTFOLIO<span className="animate-blink">_</span>
          </h1>
        </div>

        <div className="flex flex-row overflow-x-auto md:overflow-visible">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-6 py-4 md:py-6
                text-lg font-bold uppercase tracking-wide whitespace-nowrap
                border-r-4 border-neo-black last:border-r-0 md:last:border-r-0
                transition-all duration-200
                ${currentView === item.id 
                  ? 'bg-neo-black text-neo-secondary' 
                  : 'bg-white hover:bg-neo-primary hover:text-white'}
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;