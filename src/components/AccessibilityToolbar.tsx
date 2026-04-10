import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, Type, Eye, AlignJustify, Palette, ChevronUp } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const themes = [
  { id: 'default' as const, label: 'Dark', color: '#0F1115' },
  { id: 'creme' as const, label: 'Crème', color: '#F5EFE0' },
  { id: 'contrast' as const, label: 'Hi-Con', color: '#000000' },
  { id: 'focus' as const, label: 'Focus', color: '#1a2744' },
];

export const AccessibilityToolbar = () => {
  const [expanded, setExpanded] = useState(false);
  const { openDyslexic, bionicReading, lineSpacing, theme, toggleDyslexic, toggleBionic, setLineSpacing, setTheme } = useAccessibility();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass-card p-4 space-y-4 w-72"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type size={16} className="text-primary" />
                <span className="text-sm font-body text-foreground">OpenDyslexic</span>
              </div>
              <button
                onClick={toggleDyslexic}
                className={`w-10 h-5 rounded-full transition-colors relative ${openDyslexic ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-foreground absolute top-0.5 transition-transform ${openDyslexic ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-primary" />
                <span className="text-sm font-body text-foreground">Bionic Reading</span>
              </div>
              <button
                onClick={toggleBionic}
                className={`w-10 h-5 rounded-full transition-colors relative ${bionicReading ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-foreground absolute top-0.5 transition-transform ${bionicReading ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlignJustify size={16} className="text-primary" />
                <span className="text-sm font-body text-foreground">Line Spacing: {lineSpacing.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1.2"
                max="3"
                step="0.2"
                value={lineSpacing}
                onChange={e => setLineSpacing(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Palette size={16} className="text-primary" />
                <span className="text-sm font-body text-foreground">Theme</span>
              </div>
              <div className="flex gap-2">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all flex items-center justify-center text-[10px] font-heading ${
                      theme === t.id ? 'border-primary glow-border' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: t.color, color: t.color === '#000000' ? '#FFFF00' : t.color === '#0F1115' || t.color === '#1a2744' ? '#fff' : '#222' }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setExpanded(!expanded)}
        className="glass-card px-5 py-3 flex items-center gap-2 glow-primary cursor-pointer"
      >
        <Accessibility size={18} className="text-primary" />
        <span className="text-sm font-heading text-foreground">A11y</span>
        <ChevronUp
          size={14}
          className={`text-muted-foreground transition-transform ${expanded ? '' : 'rotate-180'}`}
        />
      </motion.button>
    </div>
  );
};
