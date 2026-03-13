'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { profiles } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    profiles.getMe().then(setProfile).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-violet-950 via-violet-900 to-violet-950" />
      <nav className="glass border-b border-violet-500/20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/app" className="text-violet-400 hover:text-white">← Back</Link>
          <span className="font-bold bg-gradient-to-r from-neon-pink to-neon-blue bg-clip-text text-transparent">
            DevMatch
          </span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          className="glass rounded-2xl p-8 border border-violet-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-violet-700 flex items-center justify-center text-2xl">
              {profile?.displayName?.[0] || user?.email?.[0] || '?'}
            </div>
            <div>
              <h1 className="text-xl font-semibold">{profile?.displayName || 'Anonymous'}</h1>
              <p className="text-violet-400 text-sm">{user?.email}</p>
            </div>
          </div>
          <p className="text-violet-300 mb-4">{profile?.bio || 'No bio yet'}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {(profile?.techStack || []).map((t: string) => (
              <span
                key={t}
                className="px-2 py-1 rounded text-sm bg-violet-800/60 border border-violet-500/30"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="text-sm text-violet-500 capitalize">
            {profile?.experienceLevel} • {profile?.relationshipGoal?.replace('_', ' ')}
          </p>
          <Link
            href="/onboarding"
            className="mt-6 inline-block px-4 py-2 rounded-lg glass border border-violet-500/30 hover:border-neon-blue/50 transition"
          >
            Edit profile
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
