import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, ExternalLink, Search } from 'lucide-react';
import { sendChatMessage, generateWelcomeMessage } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string, sources?: {title: string, uri: string}[]}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user, isNewSignup, clearNewSignupParams } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Handle Automatic Welcome for New Signups
  useEffect(() => {
    if (user && isNewSignup) {
      const initWelcome = async () => {
        setIsOpen(true);
        setLoading(true);
        // Add a small delay to make it feel natural after "signup success"
        await new Promise(r => setTimeout(r, 800));
        
        const welcomeText = await generateWelcomeMessage(user.displayName);
        setMessages(prev => [...prev, { role: 'model', text: welcomeText }]);
        setLoading(false);
        clearNewSignupParams(); // Reset flag so it doesn't trigger again on refresh/re-render
      };
      initWelcome();
    }
  }, [user, isNewSignup, clearNewSignupParams]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await sendChatMessage(userMsg);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text,
        sources: response.sources
      }]);
    } catch (error) {
       setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-brand-600 text-white rounded-full shadow-lg hover:bg-brand-700 transition-all z-50 ${isOpen ? 'hidden' : 'flex'} items-center gap-2`}
        aria-label="Open Chat"
      >
        <Sparkles className="h-6 w-6" />
        <span className="font-medium hidden md:inline">Ask AI</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-full h-[60vh] sm:h-[500px] sm:w-96 sm:max-w-[calc(100vw-3rem)] sm:bottom-6 sm:right-6 bg-white dark:bg-gray-800 sm:rounded-2xl rounded-t-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
           {/* Header */}
           <div className="bg-brand-600 p-4 flex justify-between items-center text-white flex-shrink-0">
              <div className="flex items-center gap-2">
                 <Sparkles className="h-5 w-5" />
                 <h3 className="font-bold">Kejah AI Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-brand-700 p-1 rounded-full transition-colors">
                 <X className="h-5 w-5" />
              </button>
           </div>

           {/* Messages */}
           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.length === 0 && (
                 <div className="text-center text-gray-400 mt-8 text-sm">
                    <p>👋 Hi! I'm your AI housing assistant.</p>
                    <p className="mt-1">Ask me about market trends, financing, or how to find your dream home.</p>
                 </div>
              )}
              {messages.map((m, i) => (
                 <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                       m.role === 'user' 
                       ? 'bg-brand-600 text-white rounded-br-none' 
                       : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-none shadow-sm'
                    }`}>
                       {m.text}
                    </div>
                    {/* Render Sources if available */}
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2 ml-1 max-w-[85%]">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center gap-1">
                          <Search className="h-3 w-3" />
                          Sources
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {m.sources.map((source, idx) => (
                            <a 
                              key={idx} 
                              href={source.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-brand-600 dark:text-brand-400 px-2 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-brand-200 truncate max-w-[200px] flex items-center gap-1 transition-colors"
                              title={source.title}
                            >
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{source.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                 </div>
              ))}
              {loading && (
                 <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                       <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                       </div>
                    </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
           </div>

           {/* Input */}
           <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2 flex-shrink-0">
              <input 
                 type="text" 
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 placeholder="Type a message..."
                 className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-transparent focus:bg-white dark:focus:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              />
              <button 
                 type="submit" 
                 disabled={loading || !input.trim()}
                 className="bg-brand-600 text-white p-2 rounded-full hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                 <Send className="h-4 w-4" />
              </button>
           </form>
        </div>
      )}
    </>
  );
};