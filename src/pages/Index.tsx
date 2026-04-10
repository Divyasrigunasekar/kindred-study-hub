import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { AccessibilityToolbar } from '@/components/AccessibilityToolbar';
import { UploadZone } from '@/components/UploadZone';
import { StudyHub } from '@/components/StudyHub';

const Index = () => {
  const [view, setView] = useState<'upload' | 'study'>('upload');
  const [docText, setDocText] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileUploaded = (text: string, name: string) => {
    setDocText(text);
    setFileName(name);
    setView('study');
  };

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient glow */}
        <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, hsl(263 70% 70% / 0.3), transparent)' }}
        />
        <div className="fixed bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, hsl(263 50% 55% / 0.2), transparent)' }}
        />

        <AnimatePresence mode="wait">
          {view === 'upload' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col min-h-screen"
            >
              <header className="flex items-center gap-3 px-6 py-5">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
                  <Brain size={18} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-heading font-bold text-gradient">Kindred AI</h1>
                  <p className="text-[11px] font-body text-muted-foreground">Accessibility for Every Mind</p>
                </div>
              </header>
              <UploadZone onFileUploaded={handleFileUploaded} />
            </motion.div>
          ) : (
            <motion.div key="study">
              <StudyHub text={docText} fileName={fileName} onBack={() => setView('upload')} />
            </motion.div>
          )}
        </AnimatePresence>

        <AccessibilityToolbar />
      </div>
    </AccessibilityProvider>
  );
};

export default Index;
