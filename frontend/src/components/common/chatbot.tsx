import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { answerGuide, guideSuggestions } from '@/lib/procedure-guide';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Halo! Saya Asisten Panduan SATU GIZI. Saya bantu prosedur perizinan & verifikasi vendor MBG — pendaftaran, dokumen (NPWP/NIB/sertifikasi), proses BGN, hingga sertifikat blockchain. Ada yang bisa dibantu?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const location = useLocation();

  const hiddenRoutes = ['/login', '/register'];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  const ask = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), text, sender: 'user', timestamp: new Date() };
    setChatHistory(prev => [...prev, userMsg]);
    setMessage('');
    setTimeout(() => {
      const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), text: answerGuide(text), sender: 'bot', timestamp: new Date() };
      setChatHistory(prev => [...prev, botMsg]);
    }, 500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    ask(message);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[9998] flex flex-col h-[500px] max-h-[80vh]"
          >
            <div className="bg-brand-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Asisten Cerdas</h3>
                  <p className="text-xs text-brand-100">Selalu Aktif</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title="Tutup Obrolan"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
              {chatHistory.map((chat) => (
                <div 
                  key={chat.id} 
                  className={`flex gap-3 max-w-[85%] ${chat.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    chat.sender === 'user' ? 'bg-brand-100 text-brand-700' : 'bg-white border border-gray-200 text-brand-600 shadow-sm'
                  }`}>
                    {chat.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 text-sm flex flex-col ${
                    chat.sender === 'user' 
                      ? 'bg-brand-600 text-white rounded-2xl rounded-tr-sm' 
                      : 'bg-white border border-gray-100 text-gray-700 shadow-sm rounded-2xl rounded-tl-sm'
                  }`}>
                    <p className="leading-relaxed">{chat.text}</p>
                    <span className={`text-[10px] mt-1 ${chat.sender === 'user' ? 'text-brand-200 text-right' : 'text-gray-400'}`}>
                      {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              {chatHistory.length <= 1 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {guideSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="text-[11px] px-2.5 py-1 bg-brand-50 text-brand-700 rounded-full hover:bg-brand-100 transition-colors cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ketik pesan..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="p-2.5 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-600 text-white rounded-full shadow-xl flex items-center justify-center z-[9999] hover:bg-brand-700 transition-colors"
        title="Buka Asisten"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};
