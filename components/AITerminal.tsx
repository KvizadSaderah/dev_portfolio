import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { X, Send, Cpu, Terminal } from 'lucide-react';
import { Project, BlogPost, ChatMessage } from '../types';
import { getGeminiKey } from '../lib/db';

interface AITerminalProps {
  projects: Project[];
  posts: BlogPost[];
}

const AITerminal: React.FC<AITerminalProps> = ({ projects, posts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'NEO_MIND V1.0 ONLINE. ASK ME ABOUT THE DEVELOPER OR THE PROJECTS.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const API_KEY = getGeminiKey(); 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !API_KEY) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      
      // Prepare context
      const context = `
        You are the digital portfolio assistant. 
        PROJECTS DATABASE: ${JSON.stringify(projects.map(p => ({ title: p.title, desc: p.description, tags: p.tags })))}.
        BLOG DATABASE: ${JSON.stringify(posts.map(p => ({ title: p.title, desc: p.excerpt })))}.
      `;

      const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: `
            You are NEO_MIND, a cyberpunk digital construct of the developer's portfolio.
            STYLE: Raw, Neobrutalist, Technical, Concise. 
            TONE: Sarcastic but helpful. Use uppercase for emphasis. 
            Constraint: Keep answers under 50 words unless asked for detail.
            Context: ${context}
          `,
        },
      });

      const result = await chat.sendMessageStream({ message: userMsg });
      
      // Add placeholder for streaming
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      let fullResponse = "";
      for await (const chunk of result) {
        const text = (chunk as GenerateContentResponse).text;
        if (text) {
            fullResponse += text;
            setMessages(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1].text = fullResponse;
                return newHistory;
            });
        }
      }
      
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'ERROR: NEURAL LINK SEVERED. CHECK API KEY CONFIGURATION.' }]);
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  if (!API_KEY) {
      return null; 
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-neo-black text-neo-secondary w-16 h-16 border-4 border-neo-secondary shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center group"
        >
          <Terminal size={32} className="group-hover:scale-110 transition-transform" />
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-neo-primary border-2 border-black animate-pulse"></span>
        </button>
      )}

      {isOpen && (
        <div className="w-[90vw] md:w-[400px] h-[500px] bg-neo-black border-4 border-neo-secondary shadow-[10px_10px_0px_0px_#A3FF00] flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="bg-neo-secondary text-neo-black p-3 flex justify-between items-center font-bold border-b-4 border-neo-black">
            <div className="flex items-center gap-2">
                <Cpu size={20} /> NEO_MIND_V1
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black hover:text-white p-1">
                <X size={20} strokeWidth={3} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-hide">
             {messages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[85%] p-3 border-2 ${
                         msg.role === 'user' 
                         ? 'bg-white border-white text-black' 
                         : 'bg-black border-neo-secondary text-neo-secondary shadow-[4px_4px_0px_0px_#333]'
                     }`}>
                         <p className="text-sm font-bold leading-relaxed">
                             {msg.role === 'model' && <span className="mr-2 text-neo-primary">&gt;&gt;</span>}
                             {msg.text}
                             {msg.role === 'model' && idx === messages.length - 1 && isTyping && <span className="animate-pulse">_</span>}
                         </p>
                     </div>
                 </div>
             ))}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-gray-900 border-t-4 border-neo-secondary flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ENTER COMMAND..."
              className="flex-1 bg-transparent text-white font-bold focus:outline-none placeholder-gray-600"
              autoFocus
            />
            <button 
              disabled={isTyping}
              className="text-neo-secondary hover:text-white disabled:opacity-50"
            >
                <Send size={24} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AITerminal;