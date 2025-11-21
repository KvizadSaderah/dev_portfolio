import React, { useState } from 'react';
import { BlogPost } from '../types';
import { ArrowRight, X } from 'lucide-react';

interface BlogListProps {
  posts: BlogPost[];
}

// Custom Markdown Renderer for Neobrutalist styling
const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return <p>No content.</p>;

  // Split by double newlines for paragraphs
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-6 font-mono text-gray-700">
      {blocks.map((block, idx) => {
        // Header 2
        if (block.startsWith('## ')) {
           return <h3 key={idx} className="text-2xl font-black text-black mt-8 mb-4 border-b-4 border-neo-secondary inline-block pr-4">{block.replace('## ', '')}</h3>;
        }
        // Header 1 (treated as H2 for post body)
        if (block.startsWith('# ')) {
           return <h3 key={idx} className="text-3xl font-black text-black mt-8 mb-4">{block.replace('# ', '')}</h3>;
        }
        // List
        if (block.startsWith('- ')) {
           const items = block.split('\n').filter(line => line.startsWith('- '));
           return (
             <ul key={idx} className="list-disc list-inside space-y-2 ml-4 bg-gray-100 p-4 border-l-4 border-neo-black">
               {items.map((item, i) => (
                 <li key={i} className="font-bold">
                   {parseInline(item.replace('- ', ''))}
                 </li>
               ))}
             </ul>
           );
        }

        // Standard Paragraph
        return <p key={idx} className="text-lg leading-loose">{parseInline(block)}</p>;
      })}
    </div>
  );
};

// Helper to parse bold text
const parseInline = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="bg-neo-secondary text-black px-1 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

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
          posts.map((post, i) => {
            const isExpanded = expandedId === post.id;
            return (
              <article 
                key={post.id}
                className={`group relative bg-white border-4 border-neo-black p-6 md:p-8 shadow-neo hover:shadow-neo-lg transition-all duration-300 ${isExpanded ? 'translate-y-[-5px] translate-x-[-5px] shadow-neo-lg scale-[1.01] z-10' : 'hover:-translate-y-1 hover:-translate-x-1'}`}
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

                {/* Expanded Content */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
                   <div className="border-t-4 border-dashed border-gray-300 pt-8">
                     <MarkdownContent content={post.content || "No content available for this post."} />
                   </div>
                </div>

                <div className="flex justify-end">
                   <button 
                     onClick={() => toggleExpand(post.id)}
                     className={`font-black text-xl flex items-center gap-2 hover:gap-4 transition-all border-2 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                        ${isExpanded ? 'bg-neo-black text-white border-neo-black' : 'bg-neo-bg border-neo-black hover:bg-neo-black hover:text-white'}`}
                   >
                     {isExpanded ? (
                       <>CLOSE ARTICLE <X strokeWidth={3} /></>
                     ) : (
                       <>READ ARTICLE <ArrowRight strokeWidth={3} /></>
                     )}
                   </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BlogList;