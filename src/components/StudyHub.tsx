import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download } from 'lucide-react';
import { ReaderPanel } from './ReaderPanel';
import { ChatPanel } from './ChatPanel';
import { DownloadCenter } from './DownloadCenter';

interface StudyHubProps {
  text: string;
  fileName: string;
  onBack: () => void;
}

export const StudyHub = ({ text, fileName, onBack }: StudyHubProps) => {
  const [showDownloads, setShowDownloads] = useState(false);

  return (
    <>
      <DownloadCenter visible={showDownloads} onClose={() => setShowDownloads(false)} text={text} />
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col h-screen"
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 glass-card hover:bg-primary/10 transition-colors">
              <ArrowLeft size={16} className="text-foreground" />
            </button>
            <div>
              <h1 className="text-sm font-heading font-semibold text-foreground">Study Hub</h1>
              <p className="text-xs font-body text-muted-foreground">{fileName}</p>
            </div>
          </div>
          <button
            onClick={() => setShowDownloads(true)}
            className="glass-card px-4 py-2 flex items-center gap-2 hover:bg-primary/10 transition-colors"
          >
            <Download size={14} className="text-primary" />
            <span className="text-xs font-heading text-foreground">Export</span>
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 border-r border-border overflow-hidden">
            <ReaderPanel text={text} />
          </div>
          <div className="w-[380px] flex-shrink-0 overflow-hidden">
            <ChatPanel />
          </div>
        </div>
      </motion.div>
    </>
  );
};
