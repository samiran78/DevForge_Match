'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { matching } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { SwipeCard } from '@/components/SwipeCard';

export default function AppPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [tab, setTab] = useState<'swipe' | 'matches'>('swipe');
  const [loading, setLoading] = useState(true);
  const [matchToast, setMatchToast] = useState<any>(null);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [c, m] = await Promise.all([
        matching.getCandidates(),
        matching.getMatches(),
      ]);
      setCandidates(Array.isArray(c) ? c : []);
      setMatches(Array.isArray(m) ? m : []);
    } catch (e) {
      console.error(e);
      setCandidates([]);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (userId: string, direction: 'left' | 'right') => {
    setCandidates((prev) => prev.filter((c) => c.id !== userId));
    try {
      const res = await matching.swipe(userId, direction === 'right');
      if (res.match) {
        setMatchToast(res.match);
        setMatches((prev) => [res.match, ...prev]);
        setTimeout(() => setMatchToast(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const currentCandidate = candidates[0];

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-violet-950 via-violet-900 to-violet-950" />
      <nav className="glass border-b border-violet-500/20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="font-bold bg-gradient-to-r from-neon-pink to-neon-blue bg-clip-text text-transparent">
            DevMatch
          </span>
          <div className="flex gap-4">
            <button
              onClick={() => setTab('swipe')}
              className={tab === 'swipe' ? 'text-neon-pink' : 'text-violet-400'}
            >
              Discover
            </button>
            <button
              onClick={() => setTab('matches')}
              className={tab === 'matches' ? 'text-neon-pink' : 'text-violet-400'}
            >
              Matches ({matches.length})
            </button>
            <Link href="/app/profile" className="text-violet-400 hover:text-white">
              Profile
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {tab === 'swipe' && (
          <div className="relative h-[520px] flex items-center justify-center">
            {loading ? (
              <div className="text-violet-400">Loading...</div>
            ) : currentCandidate ? (
              <SwipeCard
                user={{
                  id: currentCandidate.id,
                  displayName: currentCandidate.profile?.displayName || currentCandidate.email?.split('@')[0],
                  bio: currentCandidate.profile?.bio,
                  techStack: currentCandidate.profile?.techStack,
                  experienceLevel: currentCandidate.profile?.experienceLevel,
                  relationshipGoal: currentCandidate.profile?.relationshipGoal,
                  avatarUrl: currentCandidate.avatarUrl || currentCandidate.profile?.avatarUrl,
                  githubDna: currentCandidate.profile?.githubDna,
                }}
                onSwipe={(d) => handleSwipe(currentCandidate.id, d)}
                index={0}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-violet-400"
              >
                <p className="text-lg mb-4">No more candidates right now.</p>
                <p className="text-sm">Check back later or update your profile.</p>
              </motion.div>
            )}
            {currentCandidate && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-8">
                <button
                  onClick={() => handleSwipe(currentCandidate.id, 'left')}
                  className="w-16 h-16 rounded-full glass border-2 border-red-500/50 flex items-center justify-center text-2xl hover:scale-110 transition"
                >
                  ✕
                </button>
                <button
                  onClick={() => handleSwipe(currentCandidate.id, 'right')}
                  className="w-16 h-16 rounded-full glass border-2 border-green-500/50 flex items-center justify-center text-2xl hover:scale-110 transition"
                >
                  ♥
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'matches' && (
          <div className="grid gap-4">
            {matches.length === 0 ? (
              <p className="text-violet-400 text-center py-12">No matches yet. Start swiping!</p>
            ) : (
              matches.map((m) => {
                const other = m.user1Id === user?.id ? m.user2 : m.user1;
                return (
                  <Link
                    key={m.id}
                    href={`/app/chat/${m.id}`}
                    className="glass rounded-xl p-4 flex items-center gap-4 hover:border-neon-pink/30 transition"
                  >
                    <div className="w-12 h-12 rounded-full bg-violet-700 flex items-center justify-center">
                      {other?.profile?.displayName?.[0] || '?'}
                    </div>
                    <div>
                      <p className="font-medium">{other?.profile?.displayName || other?.email}</p>
                      <p className="text-sm text-violet-400">Start a conversation</p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {matchToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 glass rounded-xl px-6 py-4 border border-neon-pink/50 glow-pink"
          >
            <p className="font-semibold text-neon-pink">It&apos;s a match! 🎉</p>
            <Link href={`/app/chat/${matchToast.id}`} className="text-sm text-neon-blue underline">
              Start chatting
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
