import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Image, File } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

interface UploadZoneProps {
  onFileUploaded: (text: string, fileName: string) => void;
}

export const UploadZone = ({ onFileUploaded }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [scanning, setScanning] = useState(false);

  const extractPdfText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    return fullText.trim();
  };

  const handleFile = useCallback(async (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (isImage) {
      setScanning(true);
      await new Promise(r => setTimeout(r, 3000));
      setScanning(false);
      onFileUploaded(
        "This is simulated OCR text extracted from the uploaded image. The Kindred AI platform would use a real OCR engine to extract text from images, making printed materials accessible to everyone. Each sentence is designed to be read in manageable chunks. The system breaks down complex paragraphs into digestible pieces. This helps maintain focus and improves comprehension. Visual formatting is applied automatically based on your preferences. The Bionic Reading mode highlights key parts of each word. Line spacing and font choices adapt to your needs.",
        file.name
      );
      return;
    }

    if (file.type === 'application/pdf') {
      setScanning(true);
      try {
        const text = await extractPdfText(file);
        setScanning(false);
        if (text.length === 0) {
          // Scanned/image-based PDF — use OCR simulation fallback
          onFileUploaded(
            "This PDF appears to be a scanned document. OCR simulation: The Kindred AI platform would use a real OCR engine to extract text from scanned pages. Each sentence is designed to be read in manageable chunks. The system breaks down complex paragraphs into digestible pieces. This helps maintain focus and improves comprehension. Visual formatting is applied automatically based on your preferences.",
            file.name
          );
        } else {
          onFileUploaded(text, file.name);
        }
      } catch (err) {
        console.error('PDF parsing error:', err);
        setScanning(false);
        onFileUploaded(
          "Could not extract text from this PDF. It may be corrupted or use an unsupported format.",
          file.name
        );
      }
      return;
    }

    const text = await file.text();
    onFileUploaded(
      text || "Sample document text loaded successfully.",
      file.name
    );
  }, [onFileUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  if (scanning) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card w-full max-w-lg aspect-[4/3] relative overflow-hidden flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-laser"
            style={{ animation: 'scan-laser 2s linear infinite' }}
          />
          <div className="text-center z-10 space-y-3">
            <Image size={48} className="text-primary mx-auto animate-pulse-glow" />
            <p className="text-sm font-body text-muted-foreground">Scanning with OCR...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.label
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`glass-card-hover w-full max-w-2xl aspect-[16/9] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-500 ${
          isDragging ? 'glow-primary border-primary/40' : ''
        }`}
      >
        <input type="file" accept=".pdf,.txt,.png,.jpg,.jpeg,.webp" className="hidden" onChange={handleInput} />

        <motion.div
          animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
          className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center glow-primary"
        >
          <Upload size={32} className="text-primary" />
        </motion.div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Drop your document here
          </h2>
          <p className="text-sm font-body text-muted-foreground">
            PDF, Text, or Image — we'll handle the rest
          </p>
        </div>

        <div className="flex gap-3">
          {[
            { icon: FileText, label: 'PDF' },
            { icon: File, label: 'TXT' },
            { icon: Image, label: 'IMG' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="glass-card px-3 py-1.5 flex items-center gap-1.5">
              <Icon size={14} className="text-primary" />
              <span className="text-xs font-body text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </motion.label>
    </div>
  );
};
