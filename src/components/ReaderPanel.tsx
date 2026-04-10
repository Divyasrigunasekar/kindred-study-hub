import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Waveform } from './Waveform';
import { AgentOverlay } from './AgentOverlay';

interface ReaderPanelProps {
  text: string;
}

function splitIntoChunks(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    chunks.push(sentences.slice(i, i + 2).join(' ').trim());
  }
  return chunks;
}

function bionicWord(word: string): JSX.Element {
  const boldLen = Math.min(3, Math.ceil(word.length / 2));
  return (
    <span>
      <span className="bionic-bold">{word.slice(0, boldLen)}</span>
      {word.slice(boldLen)}
    </span>
  );
}

export const ReaderPanel = ({ text }: ReaderPanelProps) => {
  const chunks = splitIntoChunks(text);
  const [activeChunk, setActiveChunk] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [agentStage, setAgentStage] = useState(0);
  const { bionicReading, lineSpacing } = useAccessibility();
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((index: number) => {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(chunks[index]);
    utt.rate = 0.9;
    utt.onend = () => {
      if (index < chunks.length - 1) {
        setActiveChunk(index + 1);
        speak(index + 1);
      } else {
        setIsSpeaking(false);
      }
    };
    synthRef.current = utt;
    window.speechSynthesis.speak(utt);
  }, [chunks]);

  const toggleVoice = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speak(activeChunk);
    }
  };

  const handleSimplify = async () => {
    setShowOverlay(true);
    setAgentStage(0);
    await new Promise(r => setTimeout(r, 1500));
    setAgentStage(1);
    await new Promise(r => setTimeout(r, 2000));
    setAgentStage(2);
    await new Promise(r => setTimeout(r, 1500));
    setShowOverlay(false);
  };

  useEffect(() => {
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  const renderChunkText = (chunk: string) => {
    if (!bionicReading) return chunk;
    return chunk.split(' ').map((word, i) => (
      <span key={i}>{bionicWord(word)}{' '}</span>
    ));
  };

  return (
    <>
      <AgentOverlay visible={showOverlay} activeStage={agentStage} />
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-sm font-heading font-semibold text-foreground">Reader</h3>
          <div className="flex items-center gap-2">
            <button onClick={handleSimplify} className="glass-card px-3 py-1.5 flex items-center gap-1.5 hover:bg-primary/10 transition-colors">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-body text-foreground">Simplify</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {chunks.map((chunk, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveChunk(i)}
              className={`p-4 rounded-xl cursor-pointer transition-all font-body text-sm ${
                i === activeChunk
                  ? 'glass-card glow-border'
                  : 'hover:bg-secondary/30'
              }`}
              style={{ lineHeight: lineSpacing }}
            >
              <span className={i === activeChunk && isSpeaking ? 'text-primary' : 'text-foreground'}>
                {renderChunkText(chunk)}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveChunk(Math.max(0, activeChunk - 1))} className="p-2 glass-card hover:bg-primary/10 transition-colors">
                <SkipBack size={14} className="text-foreground" />
              </button>
              <button onClick={toggleVoice} className="p-2 glass-card hover:bg-primary/10 transition-colors glow-primary">
                {isSpeaking ? <Pause size={14} className="text-primary" /> : <Play size={14} className="text-primary" />}
              </button>
              <button onClick={() => setActiveChunk(Math.min(chunks.length - 1, activeChunk + 1))} className="p-2 glass-card hover:bg-primary/10 transition-colors">
                <SkipForward size={14} className="text-foreground" />
              </button>
              <button onClick={toggleVoice} className="p-2 glass-card hover:bg-primary/10 transition-colors">
                {isSpeaking ? <Volume2 size={14} className="text-primary" /> : <VolumeX size={14} className="text-muted-foreground" />}
              </button>
            </div>
            <div className="flex-1">
              <Waveform active={isSpeaking} />
            </div>
            <span className="text-xs font-body text-muted-foreground">
              {activeChunk + 1}/{chunks.length}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
