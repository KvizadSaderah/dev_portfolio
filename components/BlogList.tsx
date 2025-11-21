import React from 'react';
import { BlogPost } from '../types';
import { ArrowRight } from 'lucide-react';

interface BlogListProps {
  posts: BlogPost[];
}

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="mb-16 text-center bg-neo-black text-white p-8 rotate-1 shadow-neo-lg border-4 border-white">
        <h2 className="text-5xl md:text-7xl font-display font-black uppercase italic">Brain Dump</h2>
        <p className="font-mono text-neo-secondary mt-2">Thoughts, tutorials, and hot takes.</p>
      </div>

      <div className="space-y-8">
        {posts.length === 0 ? (
           <div className="bg-white border-4 border-neo-black p-12 text-center shadow-neo -rotate-1">
            <h3 className="text-2xl font-black font-mono mb-2">NO THOUGHTS DETECTED</h3>
            <p className="text-gray-500">HEAD EMPTY. ADD ENTRIES VIA ADMIN PORTAL.</p>
          </div>
        ) : (
          posts.map((post, i) => (
            <article 
              key={post.id}
              className="group relative bg-white border-4 border-neo-black p-6 md:p-8 shadow-neo hover:shadow-neo-lg hover:-translate-y-1 hover:-translate-x-1 transition-all duration-200 cursor-pointer"
            >
              {/* Decorative bg element */}
              <div className={`absolute top-0 left-0 w-full h-2 ${i % 2 === 0 ? 'bg-neo-primary' : 'bg-neo-accent'} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>

              <div className="flex flex-col md:flex-row gap-4 md:items-baseline justify-between mb-4">
                <span className="font-black text-neo-primary text-lg bg-neo-black px-2 py-1 inline-block transform -rotate-1">
                  {post.date}
                </span>
                <span className="font-mono font-bold text-gray-500 uppercase text-sm tracking-wider">
                  {post.readTime} // {post.tags.join(', ')}
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-black mb-4 group-hover:underline decoration-4 decoration-neo-secondary underline-offset-4">
                {post.title}
              </h3>

              <p className="text-lg font-medium text-gray-800 mb-6 border-l-4 border-gray-300 pl-4 group-hover:border-neo-black transition-colors">
                {post.excerpt}
              </p>

              <div className="flex justify-end">
                 <button className="font-black text-xl flex items-center gap-2 hover:gap-4 transition-all bg-neo-bg border-2 border-neo-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-neo-black hover:text-white">
                   READ ARTICLE <ArrowRight strokeWidth={3} />
                 </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogList;