'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface SwipeCardProps {
  user: {
    id: string;
    displayName?: string;
    bio?: string;
    techStack?: string[];
    experienceLevel?: string;
    relationshipGoal?: string;
    avatarUrl?: string;
    githubDna?: { auraType?: string };
  };
  onSwipe: (direction: 'left' | 'right') => void;
  index: number;
}

export function SwipeCard({ user, onSwipe, index }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    if (info.offset.x > threshold || velocity > 500) {
      onSwipe('right');
    } else if (info.offset.x < -threshold || velocity < -500) {
      onSwipe('left');
    }
  };

  const auraColors: Record<string, string> = {
    green: 'from-green-500/40 to-emerald-500/40',
    blue: 'from-blue-500/40 to-cyan-500/40',
    red: 'from-red-500/40 to-rose-500/40',
    purple: 'from-purple-500/40 to-violet-500/40',
    gold: 'from-amber-500/40 to-yellow-500/40',
  };
  const aura = user.githubDna?.auraType || 'purple';
  const auraClass = auraColors[aura] || auraColors.purple;

  return (
    <motion.div
      className="absolute inset-0 w-full max-w-sm mx-auto"
      style={{ zIndex: 10 - index, x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
    >
      <div className="glass rounded-2xl overflow-hidden border border-violet-500/30 card-tilt aspect-[3/4] max-h-[500px]">
        {/* Aura ring */}
        <div className={`absolute inset-0 bg-gradient-to-br ${auraClass} opacity-20 blur-2xl -z-10`} />
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-neon-pink/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-neon-blue/10 blur-3xl" />

        <div className="absolute inset-0 flex flex-col">
          <div className="relative h-64 flex items-center justify-center bg-violet-900/30">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${auraClass} flex items-center justify-center text-4xl`}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>{user.displayName?.[0] || '?'}</span>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <span className="px-2 py-1 rounded text-xs bg-violet-800/80 capitalize">
                {aura} aura
              </span>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            <h3 className="text-xl font-semibold mb-2">{user.displayName || 'Anonymous'}</h3>
            <p className="text-violet-300 text-sm mb-4 line-clamp-3">{user.bio || 'No bio yet'}</p>
            <div className="flex flex-wrap gap-2">
              {(user.techStack || []).slice(0, 5).map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 rounded text-xs bg-violet-800/60 border border-violet-500/30"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-violet-500 capitalize">
              {user.experienceLevel} • {user.relationshipGoal?.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
