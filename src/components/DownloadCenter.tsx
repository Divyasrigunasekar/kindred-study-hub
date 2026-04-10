import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, X } from 'lucide-react';

interface DownloadCenterProps {
  visible: boolean;
  onClose: () => void;
  text: string;
}

export const DownloadCenter = ({ visible, onClose, text }: DownloadCenterProps) => {
  const downloadMarkdown = () => {
    const md = `# Simplified Document\n\n${text.split(/[.!?]+/).filter(Boolean).map(s => `- ${s.trim()}`).join('\n')}`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adhd-friendly.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simplified.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="glass-card p-6 max-w-sm w-full space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-heading font-semibold text-foreground">Download Center</h3>
              <button onClick={onClose} className="p-1 hover:bg-secondary/50 rounded-lg transition-colors">
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={downloadMarkdown}
                className="w-full glass-card-hover p-4 flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <FileText size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-heading font-medium text-foreground">ADHD-Friendly Markdown</p>
                  <p className="text-xs font-body text-muted-foreground">Bullet-point format</p>
                </div>
                <Download size={16} className="text-muted-foreground ml-auto" />
              </button>
              <button
                onClick={downloadPDF}
                className="w-full glass-card-hover p-4 flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <FileText size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-heading font-medium text-foreground">Simplified PDF</p>
                  <p className="text-xs font-body text-muted-foreground">Clean, readable layout</p>
                </div>
                <Download size={16} className="text-muted-foreground ml-auto" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
