import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Wrench, Layout } from 'lucide-react';

const stages = [
  { icon: Heart, label: 'The Empath', desc: 'Analyzing Mood & Complexity', color: 'text-pink-400' },
  { icon: Wrench, label: 'The Sculptor', desc: 'RAG / Simplifying Content', color: 'text-primary' },
  { icon: Layout, label: 'The Formatter', desc: 'Optimizing Layout', color: 'text-emerald-400' },
];

interface AgentOverlayProps {
  visible: boolean;
  activeStage: number;
}

export const AgentOverlay = ({ visible, activeStage }: AgentOverlayProps) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="glass-card p-8 max-w-md w-full space-y-6"
        >
          <h3 className="text-lg font-heading font-semibold text-center text-foreground">
            Processing Document
          </h3>
          <div className="space-y-4">
            {stages.map((stage, i) => {
              const isActive = i === activeStage;
              const isDone = i < activeStage;
              return (
                <motion.div
                  key={stage.label}
                  animate={isActive ? { opacity: [0.5, 1, 0.5] } : {}}
                  transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                    isActive ? 'glass-card glow-border' : isDone ? 'opacity-50' : 'opacity-30'
                  }`}
                >
                  <stage.icon size={24} className={stage.color} />
                  <div>
                    <p className="text-sm font-heading font-medium text-foreground">{stage.label}</p>
                    <p className="text-xs font-body text-muted-foreground">{stage.desc}</p>
                  </div>
                  {isDone && <span className="ml-auto text-xs text-emerald-400">✓</span>}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
