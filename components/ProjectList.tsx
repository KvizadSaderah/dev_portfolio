import React from 'react';
import ProjectCard from './ProjectCard';
import { Project } from '../types';

const projects: Project[] = [
  {
    id: 1,
    title: "Retro Terminal",
    description: "A fully functional web-based terminal emulator built with React and custom command parsing logic.",
    tags: ["React", "TypeScript", "CSS"],
    link: "#",
    color: "bg-neo-secondary",
    image: "https://picsum.photos/800/600?random=1"
  },
  {
    id: 2,
    title: "Crypto Dashboard",
    description: "Real-time cryptocurrency tracking dashboard featuring brutalist charts and live websocket data.",
    tags: ["Next.js", "Recharts", "API"],
    link: "#",
    color: "bg-neo-accent",
    image: "https://picsum.photos/800/600?random=2"
  },
  {
    id: 3,
    title: "Glitch Art Gen",
    description: "An HTML5 canvas experiment that generates random glitch art based on user uploaded images.",
    tags: ["Canvas API", "Algorithms", "Art"],
    link: "#",
    color: "bg-neo-pink",
    image: "https://picsum.photos/800/600?random=3"
  },
  {
    id: 4,
    title: "SaaS Landing V1",
    description: "High conversion landing page with scroll-triggered animations and 3D elements.",
    tags: ["Tailwind", "Framer Motion"],
    link: "#",
    color: "bg-yellow-400",
    image: "https://picsum.photos/800/600?random=4"
  }
];

const ProjectList: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="mb-12 border-b-8 border-neo-black pb-4">
        <h2 className="text-6xl md:text-8xl font-display font-black uppercase text-stroke-black">
          Selected <span className="text-neo-primary">Works</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;