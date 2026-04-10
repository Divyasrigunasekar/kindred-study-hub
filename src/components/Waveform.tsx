import { motion } from 'framer-motion';

export const Waveform = ({ active }: { active: boolean }) => (
  <div className="flex items-center gap-[2px] h-8">
    {Array.from({ length: 32 }).map((_, i) => (
      <motion.div
        key={i}
        className="w-[3px] rounded-full bg-primary"
        animate={active ? {
          scaleY: [0.3, Math.random() * 0.7 + 0.3, 0.3],
        } : { scaleY: 0.3 }}
        transition={active ? {
          duration: 0.4 + Math.random() * 0.3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: i * 0.02,
        } : {}}
        style={{ height: '100%', originY: '50%' }}
      />
    ))}
  </div>
);
