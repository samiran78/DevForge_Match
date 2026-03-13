'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { profiles } from '@/lib/api';

const RELATIONSHIP_GOALS = [
  { value: 'lts', label: 'LTS (Long Term Support)' },
  { value: 'beta_testing', label: 'Beta Testing' },
  { value: 'serverless', label: 'Serverless' },
  { value: 'open_source', label: 'Open Source' },
  { value: 'peer_review', label: 'Peer Review' },
];

const EXPERIENCE_LEVELS = [
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid' },
  { value: 'senior', label: 'Senior' },
  { value: 'staff', label: 'Staff' },
  { value: 'principal', label: 'Principal' },
];

const TECH_STACK = ['TypeScript', 'JavaScript', 'Python', 'React', 'Node.js', 'Go', 'Rust', 'Java', 'C++', 'Ruby'];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    displayName: '',
    bio: '',
    techStack: [] as string[],
    experienceLevel: 'mid',
    relationshipGoal: 'open_source',
    interests: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleTech = (t: string) => {
    setForm((f) => ({
      ...f,
      techStack: f.techStack.includes(t) ? f.techStack.filter((x) => x !== t) : [...f.techStack, t],
    }));
  };

  const handleNext = async () => {
    if (step < 2) setStep((s) => s + 1);
    else {
      setLoading(true);
      try {
        await profiles.update(form);
        router.push('/app');
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-violet-950 via-violet-900 to-violet-950" />
      <motion.div
        className="w-full max-w-lg glass rounded-2xl p-8 border border-violet-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-neon-pink' : 'bg-violet-900'}`}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">Tell us about yourself</h2>
              <input
                placeholder="Display name"
                value={form.displayName}
                onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-violet-900/50 border border-violet-500/30 focus:border-neon-blue focus:outline-none"
              />
              <textarea
                placeholder="Bio (what you're building, what you're looking for)"
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-violet-900/50 border border-violet-500/30 focus:border-neon-blue focus:outline-none resize-none"
              />
            </motion.div>
          )}
          {step === 1 && (
            <motion.div
              key="1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">Tech stack</h2>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleTech(t)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      form.techStack.includes(t)
                        ? 'bg-neon-pink/20 border-neon-pink text-neon-pink'
                        : 'border-violet-500/30 hover:border-violet-400/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <h2 className="text-xl font-semibold mt-6">Experience level</h2>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_LEVELS.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => setForm((f) => ({ ...f, experienceLevel: e.value }))}
                    className={`px-4 py-2 rounded-lg border transition ${
                      form.experienceLevel === e.value
                        ? 'bg-neon-blue/20 border-neon-blue text-neon-blue'
                        : 'border-violet-500/30 hover:border-violet-400/50'
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">Relationship goal</h2>
              <div className="space-y-2">
                {RELATIONSHIP_GOALS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setForm((f) => ({ ...f, relationshipGoal: g.value }))}
                    className={`w-full px-4 py-3 rounded-lg border text-left transition ${
                      form.relationshipGoal === g.value
                        ? 'bg-neon-pink/20 border-neon-pink text-neon-pink'
                        : 'border-violet-500/30 hover:border-violet-400/50'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={handleNext}
          disabled={loading}
          className="mt-8 w-full py-3 rounded-lg bg-gradient-to-r from-neon-pink to-neon-blue text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {step < 2 ? 'Next' : loading ? 'Saving...' : 'Complete'}
        </button>
      </motion.div>
    </div>
  );
}
