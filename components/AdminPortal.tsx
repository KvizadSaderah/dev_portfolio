import React, { useState } from 'react';
import { ViewState, Project, BlogPost } from '../types';
import { Lock, Trash2, Plus, Save, X, Code, FileText, LogOut, Database, AlertCircle, Wand2, Cpu, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { DB, getGeminiKey, getAdminPassword } from '../lib/db';
import { GoogleGenAI, Chat } from "@google/genai";

interface AdminPortalProps {
  setView: (view: ViewState) => void;
  projects: Project[];
  posts: BlogPost[];
  refreshData: () => Promise<void>;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ setView, projects, posts, refreshData }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'BLOG'>('PROJECTS');
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Form States
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const correctPassword = getAdminPassword();

    // If no password configured in environment, deny access
    if (!correctPassword) {
      setError('ADMIN_PASSWORD not configured. Set it in Vercel environment variables.');
      return;
    }

    // Check if password matches
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
      await refreshData();
    } else {
      setError('INCORRECT PASSWORD. ACCESS DENIED.');
      setPassword('');
    }
  };

  const deleteProject = async (id: number) => {
    if(confirm('CONFIRM DELETION? THIS ACTION IS IRREVERSIBLE.')) {
      await DB.deleteProject(id);
      await refreshData();
    }
  };

  const saveProject = async () => {
    if (!editingProject?.title) return;
    
    const p: Project = {
       ...(editingProject as Project),
       id: editingProject.id || Date.now(),
       tags: typeof editingProject.tags === 'string' ? (editingProject.tags as string).split(',').map((t: string) => t.trim()) : editingProject.tags || []
    };

    await DB.saveProject(p);
    await refreshData();
    setEditingProject(null);
    setStatusMsg('PROJECT SAVED SUCCESSFULLY');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const deletePost = async (id: number) => {
    if(confirm('DELETE THOUGHT RECORD?')) {
      await DB.deletePost(id);
      await refreshData();
    }
  };

  const savePost = async () => {
    if (!editingPost?.title) return;
    
    const p: BlogPost = {
        ...(editingPost as BlogPost),
        id: editingPost.id || Date.now(),
        tags: typeof editingPost.tags === 'string' ? (editingPost.tags as string).split(',').map((t: string) => t.trim()) : editingPost.tags || []
    };

    await DB.savePost(p);
    await refreshData();
    setEditingPost(null);
    setStatusMsg('BLOG POST SAVED SUCCESSFULLY');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const generatePostContent = async () => {
    const key = getGeminiKey();

    if (!editingPost?.title) {
        alert("TITLE REQUIRED");
        return;
    }

    if (!key) {
        alert("AI KEY MISSING. Set GEMINI_API_KEY in Vercel environment variables.");
        return;
    }

    setIsGenerating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: key });
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are a technical content writer. Write raw, opinionated, neobrutalist-style technical blog posts.
Keep sentences short. Use Markdown. Format: Introduction, Key Points (use bullet points), Conclusion.
Use ## for Headers. Use ** for bold.`,
            },
        });

        const result = await chat.sendMessage({
            message: `Write a blog post about: "${editingPost.title}"`
        });

        setEditingPost(prev => ({ ...prev, content: result.text }));
    } catch (e) {
        alert("AI GENERATION FAILED. CHECK API KEY.");
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neo-black flex items-center justify-center p-4 font-mono">
        <div className="bg-white border-4 border-neo-primary shadow-[10px_10px_0px_0px_#FF4D00] p-8 w-full max-w-md">
          <div className="flex justify-center mb-6 text-neo-primary animate-pulse">
            <Lock size={64} />
          </div>
          <h2 className="text-3xl font-black text-center mb-2 text-black">ADMIN ACCESS</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Enter admin password
            <br/>
            <span className="text-xs text-gray-400">(Set ADMIN_PASSWORD in Vercel environment)</span>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-4 border-black p-4 text-xl font-bold focus:outline-none focus:border-neo-primary text-black placeholder-gray-500"
              placeholder="PASSWORD..."
              autoFocus
            />
            {error && <p className="text-red-600 font-bold text-sm bg-red-100 p-2 border-l-4 border-red-600">{error}</p>}
            <button className="w-full bg-neo-black text-white font-bold py-4 border-4 border-transparent hover:bg-neo-primary hover:text-black hover:border-black transition-all shadow-neo">
              ACCESS ADMIN
            </button>
          </form>
          <button onClick={() => setView('HOME')} className="w-full mt-4 text-gray-400 hover:text-black font-bold text-sm">
            RETURN TO VISITOR MODE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-neo-black font-mono p-4 pb-24">
      {/* Admin Header */}
      <div className="bg-neo-black text-neo-secondary p-4 mb-8 border-b-4 border-neo-primary flex flex-col md:flex-row justify-between items-center shadow-neo gap-4">
        <div className="flex items-center gap-3">
           <ShieldCheck className="text-green-400" />
           <h1 className="text-2xl font-black tracking-tighter">ADMIN_CONSOLE_V2.0 <span className="text-xs bg-green-600 text-white px-1 rounded">SECURE</span></h1>
        </div>
        {statusMsg && (
            <div className="bg-neo-primary text-black px-4 py-1 font-bold uppercase animate-pulse">
                {statusMsg}
            </div>
        )}
        <div className="flex gap-4">
            <button onClick={() => setView('HOME')} className="bg-neo-bg text-black font-bold px-4 py-2 hover:bg-neo-primary border-2 border-transparent hover:border-black">
               VIEW SITE
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="text-red-500 hover:text-white hover:bg-red-500 px-3 py-2">
               <LogOut size={20} />
            </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('PROJECTS')}
            className={`flex items-center gap-2 px-6 py-3 font-bold border-4 border-black shadow-neo transition-all whitespace-nowrap ${activeTab === 'PROJECTS' ? 'bg-neo-primary text-black translate-x-[2px] translate-y-[2px] shadow-none' : 'bg-white text-black hover:bg-gray-50'}`}
          >
            <Code /> PROJECTS ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('BLOG')}
            className={`flex items-center gap-2 px-6 py-3 font-bold border-4 border-black shadow-neo transition-all whitespace-nowrap ${activeTab === 'BLOG' ? 'bg-neo-accent text-black translate-x-[2px] translate-y-[2px] shadow-none' : 'bg-white text-black hover:bg-gray-50'}`}
          >
            <FileText /> BLOG ({posts.length})
          </button>
        </div>

        {/* System Status Bar */}
        <div className="bg-neo-black text-white p-4 mb-6 border-4 border-neo-secondary flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-2">
            <Database size={20} />
            <span className="font-bold text-sm">MONGODB:</span>
            {/* We check if MongoDB is configured by trying to fetch - for now just show status */}
            <span className="text-neo-secondary font-bold">ENV CONFIG</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={20} />
            <span className="font-bold text-sm">AI MODULE:</span>
            {getGeminiKey() ? (
              <span className="flex items-center gap-1 text-green-400 font-bold">
                <CheckCircle size={16} /> ACTIVE
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-400 font-bold">
                <XCircle size={16} /> DISABLED
              </span>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white border-4 border-black p-6 shadow-neo-lg min-h-[500px]">
          
          {/* PROJECTS TAB */}
          {activeTab === 'PROJECTS' && (
            <div>
               <div className="flex justify-between items-center mb-6 border-b-4 border-gray-200 pb-4">
                 <h2 className="text-3xl font-black uppercase text-black">Projects Database</h2>
                 <button 
                   onClick={() => setEditingProject({ color: 'bg-neo-secondary', tags: [] })}
                   className="bg-neo-black text-white px-4 py-2 font-bold flex items-center gap-2 hover:bg-neo-primary hover:text-black transition-colors"
                 >
                   <Plus size={18} /> ADD NEW
                 </button>
               </div>

               {editingProject ? (
                 <div className="bg-gray-50 border-4 border-gray-200 p-6 animate-in slide-in-from-right-4">
                    <h3 className="text-xl font-black mb-4 text-black">
                      {editingProject.id ? 'EDIT PROJECT' : 'NEW PROJECT'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       <div className="space-y-2">
                         <label className="font-bold text-sm text-black">TITLE</label>
                         <input 
                           className="w-full bg-white border-2 border-black p-2 focus:ring-2 focus:ring-neo-primary focus:outline-none text-black placeholder-gray-400"
                           value={editingProject.title || ''} 
                           onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="font-bold text-sm text-black">IMAGE URL</label>
                         <input 
                           className="w-full bg-white border-2 border-black p-2 focus:ring-2 focus:ring-neo-primary focus:outline-none text-black placeholder-gray-400"
                           value={editingProject.image || ''} 
                           onChange={e => setEditingProject({...editingProject, image: e.target.value})}
                         />
                       </div>
                       <div className="space-y-2 md:col-span-2">
                         <label className="font-bold text-sm text-black">DESCRIPTION</label>
                         <textarea 
                           className="w-full bg-white border-2 border-black p-2 h-24 focus:ring-2 focus:ring-neo-primary focus:outline-none text-black placeholder-gray-400"
                           value={editingProject.description || ''} 
                           onChange={e => setEditingProject({...editingProject, description: e.target.value})}
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="font-bold text-sm text-black">TAGS (comma separated)</label>
                         <input 
                           className="w-full bg-white border-2 border-black p-2 focus:ring-2 focus:ring-neo-primary focus:outline-none text-black placeholder-gray-400"
                           value={Array.isArray(editingProject.tags) ? editingProject.tags.join(', ') : editingProject.tags || ''} 
                           onChange={e => setEditingProject({...editingProject, tags: e.target.value.split(',')})}
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="font-bold text-sm text-black">COLOR THEME (Tailwind Class)</label>
                         <select 
                           className="w-full border-2 border-black p-2 bg-white focus:ring-2 focus:ring-neo-primary focus:outline-none text-black"
                           value={editingProject.color || 'bg-neo-secondary'} 
                           onChange={e => setEditingProject({...editingProject, color: e.target.value})}
                         >
                            <option value="bg-neo-secondary">NEO GREEN</option>
                            <option value="bg-neo-primary">NEO ORANGE</option>
                            <option value="bg-neo-accent">NEO CYAN</option>
                            <option value="bg-neo-pink">NEO PINK</option>
                            <option value="bg-yellow-400">YELLOW</option>
                            <option value="bg-purple-500">PURPLE</option>
                         </select>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <button onClick={saveProject} className="flex-1 bg-neo-primary text-black border-4 border-black p-3 font-bold hover:bg-white transition-colors flex justify-center gap-2">
                         <Save /> SAVE DATA
                       </button>
                       <button onClick={() => setEditingProject(null)} className="bg-gray-200 border-4 border-transparent p-3 font-bold hover:bg-gray-300 text-gray-600">
                         CANCEL
                       </button>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-4">
                    {projects.map(p => (
                      <div key={p.id} className="flex flex-col md:flex-row items-center justify-between bg-white border-2 border-black p-4 hover:shadow-neo-hover transition-shadow">
                         <div className="flex items-center gap-4 mb-4 md:mb-0 w-full">
                            <div className={`w-12 h-12 border-2 border-black ${p.color}`}></div>
                            <div>
                               <h4 className="font-bold text-xl text-black">{p.title}</h4>
                               <p className="text-sm text-gray-600 truncate max-w-xs">{p.description}</p>
                            </div>
                         </div>
                         <div className="flex gap-2 w-full md:w-auto justify-end">
                            <button onClick={() => setEditingProject(p)} className="px-4 py-2 bg-gray-100 text-black border-2 border-black font-bold hover:bg-yellow-300">EDIT</button>
                            <button onClick={() => deleteProject(p.id)} className="px-4 py-2 bg-gray-100 text-black border-2 border-black font-bold hover:bg-red-500 hover:text-white"><Trash2 size={18}/></button>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

          {/* BLOG TAB */}
          {activeTab === 'BLOG' && (
            <div>
               <div className="flex justify-between items-center mb-6 border-b-4 border-gray-200 pb-4">
                 <h2 className="text-3xl font-black uppercase text-black">Thought Records</h2>
                 <button 
                   onClick={() => setEditingPost({ date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(), tags: [] })}
                   className="bg-neo-black text-white px-4 py-2 font-bold flex items-center gap-2 hover:bg-neo-primary hover:text-black transition-colors"
                 >
                   <Plus size={18} /> NEW ENTRY
                 </button>
               </div>

               {editingPost ? (
                 <div className="bg-gray-50 border-4 border-gray-200 p-6 animate-in slide-in-from-right-4">
                    <h3 className="text-xl font-black mb-4 text-black">
                      {editingPost.id ? 'EDIT ENTRY' : 'NEW ENTRY'}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                       <div className="space-y-2">
                         <label className="font-bold text-sm text-black">TITLE</label>
                         <input 
                           className="w-full bg-white border-2 border-black p-2 focus:ring-2 focus:ring-neo-accent focus:outline-none text-black placeholder-gray-400"
                           value={editingPost.title || ''} 
                           onChange={e => setEditingPost({...editingPost, title: e.target.value})}
                         />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="font-bold text-sm text-black">DATE</label>
                            <input 
                            className="w-full bg-white border-2 border-black p-2 focus:ring-2 focus:ring-neo-accent focus:outline-none text-black placeholder-gray-400"
                            value={editingPost.date || ''} 
                            onChange={e => setEditingPost({...editingPost, date: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="font-bold text-sm text-black">READ TIME</label>
                            <input 
                            className="w-full bg-white border-2 border-black p-2 focus:ring-2 focus:ring-neo-accent focus:outline-none text-black placeholder-gray-400"
                            value={editingPost.readTime || ''} 
                            onChange={e => setEditingPost({...editingPost, readTime: e.target.value})}
                            placeholder="5 MIN READ"
                            />
                        </div>
                       </div>
                       <div className="space-y-2">
                         <label className="font-bold text-sm text-black">EXCERPT</label>
                         <textarea 
                           className="w-full bg-white border-2 border-black p-2 h-24 focus:ring-2 focus:ring-neo-accent focus:outline-none text-black placeholder-gray-400"
                           value={editingPost.excerpt || ''} 
                           onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})}
                         />
                       </div>
                       <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <label className="font-bold text-sm text-black">FULL CONTENT (MARKDOWN SUPPORTED)</label>
                            <button 
                                onClick={generatePostContent}
                                disabled={isGenerating}
                                className="text-xs bg-neo-secondary text-black px-2 py-1 font-bold hover:bg-black hover:text-white flex items-center gap-1 transition-colors"
                            >
                                <Wand2 size={12} /> {isGenerating ? 'GENERATING...' : 'AUTO-WRITE WITH AI'}
                            </button>
                         </div>
                         <textarea 
                           className="w-full bg-white border-2 border-black p-2 h-64 focus:ring-2 focus:ring-neo-accent focus:outline-none text-black placeholder-gray-400 font-mono"
                           value={editingPost.content || ''} 
                           onChange={e => setEditingPost({...editingPost, content: e.target.value})}
                           placeholder="Write your full article here... Use **bold**, ## Headers, - Lists"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="font-bold text-sm text-black">TAGS (comma separated)</label>
                         <input 
                           className="w-full bg-white border-2 border-black p-2 focus:ring-2 focus:ring-neo-accent focus:outline-none text-black placeholder-gray-400"
                           value={Array.isArray(editingPost.tags) ? editingPost.tags.join(', ') : editingPost.tags || ''} 
                           onChange={e => setEditingPost({...editingPost, tags: e.target.value.split(',')})}
                         />
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <button onClick={savePost} className="flex-1 bg-neo-accent text-black border-4 border-black p-3 font-bold hover:bg-white transition-colors flex justify-center gap-2">
                         <Save /> SAVE RECORD
                       </button>
                       <button onClick={() => setEditingPost(null)} className="bg-gray-200 border-4 border-transparent p-3 font-bold hover:bg-gray-300 text-gray-600">
                         CANCEL
                       </button>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-4">
                    {posts.map(p => (
                      <div key={p.id} className="flex flex-col md:flex-row items-center justify-between bg-white border-2 border-black p-4 hover:shadow-neo-hover transition-shadow group">
                         <div className="mb-4 md:mb-0 w-full">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-xs font-bold bg-neo-black text-white px-1">{p.date}</span>
                                <span className="text-xs font-bold text-gray-600">{p.tags.join(', ')}</span>
                            </div>
                            <h4 className="font-bold text-xl text-black group-hover:text-neo-primary transition-colors">{p.title}</h4>
                         </div>
                         <div className="flex gap-2 w-full md:w-auto justify-end">
                            <button onClick={() => setEditingPost(p)} className="px-4 py-2 bg-gray-100 text-black border-2 border-black font-bold hover:bg-yellow-300">EDIT</button>
                            <button onClick={() => deletePost(p.id)} className="px-4 py-2 bg-gray-100 text-black border-2 border-black font-bold hover:bg-red-500 hover:text-white"><Trash2 size={18}/></button>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminPortal;