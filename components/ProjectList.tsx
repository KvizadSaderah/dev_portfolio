import React from 'react';
import ProjectCard from './ProjectCard';
import { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="mb-12 border-b-8 border-neo-black pb-4 flex flex-col md:flex-row justify-between items-end gap-4">
        <h2 className="text-6xl md:text-8xl font-display font-black uppercase text-stroke-black leading-[0.8]">
          Selected <span className="text-neo-primary">Works</span>
        </h2>
        <div className="font-mono text-sm font-bold bg-neo-black text-white px-2 py-1">
          INDEX_COUNT: {projects.length < 10 ? `0${projects.length}` : projects.length}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border-4 border-neo-black p-12 text-center shadow-neo">
          <h3 className="text-2xl font-black font-mono mb-2">NO PROJECTS FOUND</h3>
          <p className="text-gray-500">THE DATABASE IS EMPTY. INITIALIZE NEW PROJECTS IN ADMIN.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;