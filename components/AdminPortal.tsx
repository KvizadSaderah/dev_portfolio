import React, { useState, useEffect } from 'react';
import { ViewState, Project, BlogPost, MongoConfig } from '../types';
import { Lock, Unlock, Trash2, Plus, Save, X, Code, FileText, LogOut, Database, Cloud, Server, AlertCircle } from 'lucide-react';
import { DB, getMongoConfig, saveMongoConfig, clearMongoConfig } from '../lib/db';

interface AdminPortalProps {
  setView: (view: ViewState) => void;
  projects: Project[];
  posts: BlogPost[];
  refreshData: () => Promise<void>;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ setView, projects, posts, refreshData }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'BLOG' | 'DB'>('PROJECTS');
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // Form States
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);

  // DB Config State
  const [dbConfig, setDbConfig] = useState<MongoConfig>({
    apiUrl: '',
    apiKey: '',
    cluster: 'Cluster0',
    database: 'portfolio'
  });

  useEffect(() => {
    const cfg = getMongoConfig();
    if (cfg) setDbConfig(cfg);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('ACCESS DENIED: INVALID CREDENTIALS');
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

  const saveDbConfig = () => {
    saveMongoConfig(dbConfig);
    setStatusMsg('DB CONNECTION UPDATED. REFRESHING...');
    setTimeout(() => {
        refreshData().then(() => setStatusMsg('CONNECTED TO CLOUD'));
    }, 1000);
  };

  const disconnectDb = () => {
    clearMongoConfig();
    setDbConfig({ apiUrl: '', apiKey: '', cluster: '', database: '' });
    refreshData();
    setStatusMsg('DISCONNECTED. REVERTED TO LOCAL STORAGE.');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neo-black flex items-center justify-center p-4 font-mono">
        <div className="bg-white border-4 border-neo-primary shadow-[10px_10px_0px_0px_#FF4D00] p-8 w-full max-w-md">
          <div className="flex justify-center mb-6 text-neo-primary animate-pulse">
            <Lock size={64} />
          </div>
          <h2 className="text-3xl font-black text-center mb-2 text-black">SYSTEM LOCKED</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">ENTER AUTHORIZATION CODE TO PROCEED</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-100 border-4 border-black p-4 text-xl font-bold focus:outline-none focus:border-neo-primary text-black placeholder-gray-500"
              placeholder="PASSWORD..."
              autoFocus
            />
            {error && <p className="text-red-600 font-bold text-sm bg-red-100 p-2 border-l-4 border-red-600">{error}</p>}
            <button className="w-full bg-neo-black text-white font-bold py-4 border-4 border-transparent hover:bg-neo-primary hover:text-black hover:border-black transition-all shadow-neo">
              AUTHENTICATE
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
           <Unlock className="animate-pulse" />
           <h1 className="text-2xl font-black tracking-tighter">ADMIN_CONSOLE_V1.0</h1>
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
          <button 
            onClick={() => setActiveTab('DB')}
            className={`flex items-center gap-2 px-6 py-3 font-bold border-4 border-black shadow-neo transition-all whitespace-nowrap ${activeTab === 'DB' ? 'bg-neo-secondary text-black translate-x-[2px] translate-y-[2px] shadow-none' : 'bg-white text-black hover:bg-gray-50'}`}
          >
            <Database /> DATABASE
          </button>
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
                           className="w-full border-2 border-black p-2 focus:ring-2 focus:ring-neo-primary focus:outline-none text-black placeholder-gray-400"
                           value={editingProject.title || ''} 
                           onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="font-bold text-sm text-black">IMAGE URL</label>
                         <input 
                           className="w-full border-2 border-black p-2 focus:ring-2 focus:ring-neo-primary focus:outline-none text-black placeholder-gray-400"
                           value={editingProject.image || ''} 
                           onChange={e => setEditingProject({...editingProject, image: e.target.value})}
                         />
                       </div>
                       <div className="space-y-2 md:col-span-2">
                         <label className="font-bold text-sm text-black">DESCRIPTION</label>
                         <textarea 
                           className="w-full border-2 border-black p-2 h-24 focus:ring-2 focus:ring-neo-primary focus:outline-none text-black placeholder-gray-400"
                           value={editingProject.description || ''} 
                           onChange={e => setEditingProject({...editingProject, description: e.target.value})}
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="font-bold text-sm text-black">TAGS (comma separated)</label>
                         <input 
                           className="w-full border-2 border-black p-2 focus:ring-2 focus:ring-neo-primary focus:outline-none text-black placeholder-gray-400"
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
                           className="w-full border-2 border-black p-2 focus:ring-2 focus:ring-neo-accent focus:outline-none text-black placeholder-gray-400"
                           value={editingPost.title || ''} 
                           onChange={e => setEditingPost({...editingPost, title: e.target.value})}
                         />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="font-bold text-sm text-black">DATE</label>
                            <input 
                            className="w-full border-2 border-black p-2 focus:ring-2 focus:ring-neo-accent focus:outline-none text-black placeholder-gray-400"
                            value={editingPost.date || ''} 
                            onChange={e => setEditingPost({...editingPost, date: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="font-bold text-sm text-black">READ TIME</label>
                            <input 
                            className="w-full border-2 border-black p-2 focus:ring-2 focus:ring-neo-accent focus:outline-none text-black placeholder-gray-400"
                            value={editingPost.readTime || ''} 
                            onChange={e => setEditingPost({...editingPost, readTime: e.target.value})}
                            placeholder="5 MIN READ"
                            />
                        </div>
                       </div>
                       <div className="space-y-2">
                         <label className="font-bold text-sm text-black">EXCERPT</label>
                         <textarea 
                           className="w-full border-2 border-black p-2 h-24 focus:ring-2 focus:ring-neo-accent focus:outline-none text-black placeholder-gray-400"
                           value={editingPost.excerpt || ''} 
                           onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})}
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="font-bold text-sm text-black">TAGS (comma separated)</label>
                         <input 
                           className="w-full border-2 border-black p-2 focus:ring-2 focus:ring-neo-accent focus:outline-none text-black placeholder-gray-400"
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

          {/* DATABASE TAB */}
          {activeTab === 'DB' && (
            <div className="animate-in slide-in-from-right-4">
                 <div className="flex justify-between items-center mb-6 border-b-4 border-gray-200 pb-4">
                    <div className="flex items-center gap-3">
                        <Server className="text-neo-secondary w-8 h-8 fill-current" />
                        <h2 className="text-3xl font-black uppercase text-black">CLOUD SYNC</h2>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-blue-50 border-l-8 border-blue-500 p-4">
                            <h4 className="font-bold flex items-center gap-2 text-blue-700"><AlertCircle size={20}/> INSTRUCTIONS</h4>
                            <p className="text-sm mt-2 leading-relaxed text-gray-800">
                                To enable cloud storage, create a <a href="https://www.mongodb.com/atlas/database" target="_blank" className="underline font-bold">MongoDB Atlas</a> account. 
                                Enable the <strong>Data API</strong> in your dashboard and generate an API Key.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="font-bold text-sm text-black">DATA API ENDPOINT URL</label>
                                <input 
                                    className="w-full border-2 border-black p-3 font-mono text-sm focus:ring-2 focus:ring-neo-secondary focus:outline-none text-black placeholder-gray-400"
                                    placeholder="https://..."
                                    value={dbConfig.apiUrl}
                                    onChange={(e) => setDbConfig({...dbConfig, apiUrl: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="font-bold text-sm text-black">API KEY</label>
                                <input 
                                    type="password"
                                    className="w-full border-2 border-black p-3 font-mono text-sm focus:ring-2 focus:ring-neo-secondary focus:outline-none text-black placeholder-gray-400"
                                    placeholder="Secret Key..."
                                    value={dbConfig.apiKey}
                                    onChange={(e) => setDbConfig({...dbConfig, apiKey: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="font-bold text-sm text-black">CLUSTER NAME</label>
                                    <input 
                                        className="w-full border-2 border-black p-3 font-mono text-sm focus:ring-2 focus:ring-neo-secondary focus:outline-none text-black placeholder-gray-400"
                                        placeholder="Cluster0"
                                        value={dbConfig.cluster}
                                        onChange={(e) => setDbConfig({...dbConfig, cluster: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-bold text-sm text-black">DATABASE NAME</label>
                                    <input 
                                        className="w-full border-2 border-black p-3 font-mono text-sm focus:ring-2 focus:ring-neo-secondary focus:outline-none text-black placeholder-gray-400"
                                        placeholder="portfolio"
                                        value={dbConfig.database}
                                        onChange={(e) => setDbConfig({...dbConfig, database: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button 
                                onClick={saveDbConfig}
                                className="flex-1 bg-neo-black text-white border-4 border-transparent hover:border-black hover:bg-neo-secondary hover:text-black p-4 font-bold transition-all flex justify-center items-center gap-2 shadow-neo"
                            >
                                <Cloud /> CONNECT CLOUD
                            </button>
                            {getMongoConfig() && (
                                <button 
                                    onClick={disconnectDb}
                                    className="px-6 border-4 border-black hover:bg-red-500 hover:text-white font-bold transition-all text-black"
                                    title="Revert to LocalStorage"
                                >
                                    <LogOut />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-neo-black text-green-400 p-6 font-mono text-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-2 opacity-50"><Database size={100} /></div>
                        <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">CONNECTION STATUS</h3>
                        <div className="space-y-2">
                            <p>
                                <span className="text-gray-500">DRIVER:</span>{' '}
                                {getMongoConfig() ? 'MONGO_ATLAS_DATA_API' : 'LOCAL_STORAGE_EMULATOR'}
                            </p>
                            <p>
                                <span className="text-gray-500">STATUS:</span>{' '}
                                {getMongoConfig() ? <span className="text-neo-secondary animate-pulse">ONLINE</span> : <span className="text-yellow-400">OFFLINE (LOCAL)</span>}
                            </p>
                            <p>
                                <span className="text-gray-500">COLLECTIONS:</span> projects, posts
                            </p>
                            <div className="mt-8 p-4 border border-green-900 bg-black bg-opacity-50">
                                <p className="text-xs text-gray-500 mb-2">// SYSTEM LOG</p>
                                <p>> Initializing interface...</p>
                                <p>> Checking persistence layer...</p>
                                <p>> {getMongoConfig() ? `Connected to ${dbConfig.cluster}` : 'Using browser local storage'}</p>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminPortal;