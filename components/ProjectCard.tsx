import React from 'react';
import { Project } from '../types';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  return (
    <div 
      className={`
        group relative bg-white border-4 border-neo-black shadow-neo-lg 
        hover:shadow-none hover:translate-x-[10px] hover:translate-y-[10px] 
        transition-all duration-200 flex flex-col h-full
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header Bar */}
      <div className="bg-neo-black text-white p-2 flex justify-between items-center border-b-4 border-neo-black">
         <span className="font-bold text-sm">PRJ_0{project.id}</span>
         <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-neo-pink border border-white"></div>
            <div className="w-3 h-3 rounded-full bg-neo-secondary border border-white"></div>
         </div>
      </div>

      {/* Image/Preview Area */}
      <div className={`h-48 border-b-4 border-neo-black overflow-hidden relative ${project.color}`}>
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-all"></div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-3xl font-display font-black mb-3 uppercase leading-tight group-hover:text-neo-primary transition-colors">
          {project.title}
        </h3>
        <p className="font-bold text-gray-600 mb-6 flex-grow leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span key={tag} className="bg-neo-bg border-2 border-neo-black px-2 py-1 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-auto">
          <button className="flex-1 bg-neo-secondary hover:bg-black hover:text-white border-4 border-neo-black p-3 font-bold flex items-center justify-center gap-2 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <ExternalLink size={18} /> DEMO
          </button>
          <button className="bg-white hover:bg-neo-pink hover:text-white border-4 border-neo-black p-3 font-bold transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Github size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;