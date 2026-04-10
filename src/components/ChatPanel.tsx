import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const initialMessages: Message[] = [
  { role: 'assistant', content: 'Hi! I\'m The Sculptor — your AI study companion. Ask me anything about the document you\'ve uploaded, and I\'ll explain it in a way that works for you. 💜' },
];

export const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulated response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Great question! Let me break that down into simpler terms. The key idea here is that information should be presented in small, manageable pieces — exactly what we're doing right now. Would you like me to explain further?",
      }]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <Bot size={14} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-heading font-semibold text-foreground">The Sculptor</h3>
            <p className="text-[11px] font-body text-muted-foreground">Q&A Assistant</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={12} className="text-primary" />
              </div>
            )}
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm font-body ${
                msg.role === 'user'
                  ? 'bg-primary/20 text-foreground rounded-br-md'
                  : 'rounded-bl-md text-foreground'
              }`}
              style={msg.role === 'assistant' ? {
                background: 'hsla(263, 40%, 78%, 0.12)',
              } : undefined}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                <User size={12} className="text-foreground" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about the document..."
            className="flex-1 bg-secondary/50 rounded-xl px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
          <button
            onClick={handleSend}
            className="glass-card p-2.5 hover:bg-primary/10 transition-colors"
          >
            <Send size={16} className="text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
};
