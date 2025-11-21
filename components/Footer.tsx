import React from 'react';
import { Github, Twitter, Linkedin, Mail, Lock } from 'lucide-react';
import { ViewState } from '../types';

interface FooterProps {
  setView?: (view: ViewState) => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="bg-neo-black text-neo-bg border-t-4 border-neo-black pt-16 pb-8 relative overflow-hidden">
      {/* Abstract Grid Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          
          <div>
            <h2 className="text-6xl md:text-8xl font-display font-black mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
              LET'S<br/>TALK.
            </h2>
            <p className="text-xl font-mono max-w-md mb-8">
              Have a project in mind? Found a bug? Just want to say hi? 
              I'm always open to discussing new opportunities.
            </p>
            <a 
              href="mailto:contact@example.com" 
              className="inline-block bg-neo-primary text-neo-black font-black text-2xl px-8 py-4 border-4 border-white shadow-[8px_8px_0px_0px_#fff] hover:shadow-[4px_4px_0px_0px_#fff] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              SEND EMAIL
            </a>
          </div>

          <div className="flex flex-col justify-end md:items-end">
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
               <SocialLink href="#" icon={<Github />} label="GITHUB" />
               <SocialLink href="#" icon={<Twitter />} label="TWITTER" />
               <SocialLink href="#" icon={<Linkedin />} label="LINKEDIN" />
               <SocialLink href="#" icon={<Mail />} label="MAIL" />
            </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t-2 border-gray-800 pt-8 font-mono text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} NEO_DEV. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <p>BUILT WITH REACT + TAILWIND</p>
            {setView && (
              <button 
                onClick={() => setView('ADMIN')} 
                className="p-2 hover:bg-white hover:text-black transition-colors rounded-sm group"
                title="System Login"
              >
                <Lock size={14} className="group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
  <a 
    href={href} 
    className="flex items-center justify-center gap-3 p-4 border-2 border-white text-white font-bold hover:bg-white hover:text-neo-black transition-colors uppercase"
  >
    {icon} <span>{label}</span>
  </a>
);

export default Footer;