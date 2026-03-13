'use client';

import { motion } from 'framer-motion';

interface ChemistryProps {
  score: number;
  breakdown: Record<string, number>;
  aiInsight?: string;
}

export function ChemistryDisplay({ score, breakdown, aiInsight }: ChemistryProps) {
  const entries = Object.entries(breakdown || {});

  return (
    <motion.div
      className="glass rounded-2xl p-6 border border-neon-pink/30"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Chemistry Index</h3>
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-pink to-neon-blue flex items-center justify-center text-xl font-bold">
          {score}
        </div>
      </div>
      {aiInsight && (
        <p className="text-violet-300 text-sm mb-4 italic">&quot;{aiInsight}&quot;</p>
      )}
      <div className="space-y-2">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-sm text-violet-400 w-40 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <div className="flex-1 h-2 rounded-full bg-violet-900 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-pink to-neon-blue rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(value || 0) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
            <span className="text-sm w-10">{Math.round((value || 0) * 100)}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
