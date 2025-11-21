import React from 'react';
import { ViewState } from '../types';
import { ArrowDownRight, Code, Cpu, Globe } from 'lucide-react';

interface HeroProps {
  setView: (view: ViewState) => void;
}

const Hero: React.FC<HeroProps> = ({ setView }) => {
  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Main Headline Area */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Block - Intro */}
        <div className="lg:col-span-8 bg-white border-4 border-neo-black shadow-neo-lg p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <Cpu size={200} />
          </div>
          
          <div>
            <div className="inline-block bg-neo-black text-white px-3 py-1 font-bold mb-6 transform -rotate-2">
              FULL STACK DEVELOPER
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-[0.9] mb-8">
              CODE<br />
              DESIGN<br />
              <span className="text-neo-primary md:text-transparent md:bg-clip-text md:bg-gradient-to-r md:from-neo-primary md:to-neo-pink">DESTROY</span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl font-bold max-w-2xl border-l-8 border-neo-secondary pl-6 leading-relaxed">
            I craft high-performance digital experiences with raw aesthetics and modern stacks. Based in Cyberspace.
          </p>

          <div className="mt-12 flex flex-wrap gap-4">
            <button 
              onClick={() => setView('PROJECTS')}
              className="bg-neo-secondary hover:bg-black hover:text-white text-black font-bold text-xl px-8 py-4 border-4 border-black shadow-neo hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all flex items-center gap-3"
            >
              SEE MY WORK <ArrowDownRight />
            </button>
            <button 
              className="bg-white hover:bg-neo-accent text-black font-bold text-xl px-8 py-4 border-4 border-black shadow-neo hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all"
            >
              CONTACT ME
            </button>
          </div>
        </div>

        {/* Right Block - Stack/Stats */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-neo-pink border-4 border-neo-black shadow-neo p-8 flex-1 hover:rotate-1 transition-transform">
            <h3 className="text-3xl font-black mb-6 border-b-4 border-black pb-2 inline-block">STACK</h3>
            <ul className="space-y-4 font-bold text-lg">
              <li className="flex items-center gap-2"><Code className="stroke-[3px]" /> React / Next.js</li>
              <li className="flex items-center gap-2"><Code className="stroke-[3px]" /> TypeScript</li>
              <li className="flex items-center gap-2"><Code className="stroke-[3px]" /> Tailwind CSS</li>
              <li className="flex items-center gap-2"><Code className="stroke-[3px]" /> Node.js / Bun</li>
              <li className="flex items-center gap-2"><Code className="stroke-[3px]" /> WebGL / Three.js</li>
            </ul>
          </div>

          <div className="bg-neo-accent border-4 border-neo-black shadow-neo p-8 flex-1 hover:-rotate-1 transition-transform">
             <h3 className="text-3xl font-black mb-4">STATUS</h3>
             <div className="flex items-center gap-4 mb-4">
                <span className="w-6 h-6 rounded-full bg-green-500 border-2 border-black animate-pulse"></span>
                <span className="font-bold text-xl">ONLINE</span>
             </div>
             <p className="font-bold">Currently working on: <br/> <span className="bg-white px-1">A Secret AI Project</span></p>
          </div>
        </div>

      </section>

      {/* Bottom Ticker/Info */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {['CLEAN CODE', 'PIXEL PERFECT', 'FAST SHIPPING'].map((txt, i) => (
           <div key={i} className="border-4 border-neo-black bg-white p-4 font-black text-xl shadow-neo-hover hover:bg-neo-black hover:text-white transition-colors">
             {txt}
           </div>
        ))}
      </section>
    </div>
  );
};

export default Hero;