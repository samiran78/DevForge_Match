'use client';

import { motion } from 'framer-motion';
import { profiles } from '@/lib/api';

const MOODS = [
  { value: 'focused', label: 'Focused', emoji: '🎯' },
  { value: 'playful', label: 'Playful', emoji: '😄' },
  { value: 'romantic', label: 'Romantic', emoji: '💜' },
  { value: 'adventurous', label: 'Adventurous', emoji: '🚀' },
  { value: 'low_energy', label: 'Low energy', emoji: '🌙' },
  { value: 'deep_talk', label: 'Deep talk', emoji: '💭' },
];

interface MoodSelectorProps {
  currentMood?: string;
  onSelect: (mood: string) => void;
}

export function MoodSelector({ currentMood, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {MOODS.map((m) => (
        <motion.button
          key={m.value}
          onClick={() => {
            onSelect(m.value);
            profiles.updateMood(m.value).catch(console.error);
          }}
          className={`px-4 py-2 rounded-xl border transition flex items-center gap-2 ${
            currentMood === m.value
              ? 'bg-neon-pink/20 border-neon-pink text-neon-pink'
              : 'glass border-violet-500/30 hover:border-violet-400/50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{m.emoji}</span>
          <span className="text-sm">{m.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
