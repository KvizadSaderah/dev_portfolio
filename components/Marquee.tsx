import React from 'react';

interface MarqueeProps {
  text: string;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

const Marquee: React.FC<MarqueeProps> = ({ text, speed = 20, direction = 'left', className = '' }) => {
  return (
    <div className={`relative flex overflow-x-hidden border-y-4 border-neo-black bg-neo-accent text-neo-black py-3 ${className}`}>
      <div className={`animate-marquee whitespace-nowrap flex ${direction === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
        {[...Array(10)].map((_, i) => (
          <span key={i} className="mx-4 text-xl md:text-2xl font-bold font-mono uppercase tracking-widest">
            {text}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee ${speed}s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Marquee;