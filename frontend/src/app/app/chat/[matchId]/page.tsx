'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { chat, matching, profiles } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { ChemistryDisplay } from './chemistry';
import { MoodSelector } from './mood-selector';

export default function ChatPage() {
  const params = useParams();
  const matchId = params.matchId as string;
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chemistry, setChemistry] = useState<any>(null);
  const [showMood, setShowMood] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    loadMessages();
    profiles.getMe().then(setProfile).catch(console.error);
  }, [matchId]);

  useEffect(() => {
    if (messages.length >= 10 && !chemistry) {
      matching.computeChemistry(matchId).then(setChemistry).catch(console.error);
    }
  }, [messages.length, matchId, chemistry]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const msgs = await chat.getMessages(matchId);
      setMessages(Array.isArray(msgs) ? msgs.reverse() : []);
    } catch (e) {
      console.error(e);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!input.trim() || sending) return;
    const content = input.trim();
    setInput('');
    setSending(true);
    try {
      const msg = await chat.sendMessage(matchId, content);
      setMessages((prev) => [...prev, { ...msg, senderId: user?.id }]);
    } catch (e) {
      console.error(e);
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-violet-950 via-violet-900 to-violet-950" />
      <header className="glass border-b border-violet-500/20">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/app" className="text-violet-400 hover:text-white">
            ←
          </Link>
          <h1 className="font-semibold">Chat</h1>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full flex flex-col p-4">
        {showMood && (
          <div className="mb-4">
            <p className="text-sm text-violet-400 mb-2">Your mood</p>
            <MoodSelector
              currentMood={profile?.currentMood}
              onSelect={() => setShowMood(false)}
            />
          </div>
        )}
        {chemistry && (
          <div className="mb-4">
            <ChemistryDisplay
              score={chemistry.score}
              breakdown={chemistry.breakdown}
              aiInsight={chemistry.aiInsight}
            />
          </div>
        )}
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-violet-400">Loading...</div>
        ) : (
          <div className="flex-1 overflow-auto space-y-4">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    m.senderId === user?.id
                      ? 'bg-neon-pink/20 border border-neon-pink/30'
                      : 'glass border border-violet-500/30'
                  }`}
                >
                  {m.content}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <button
            onClick={() => setShowMood((s) => !s)}
            className="px-3 py-3 rounded-xl glass border border-violet-500/30 hover:border-neon-blue/50 transition"
            title="Mood"
          >
            😊
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-xl bg-violet-900/50 border border-violet-500/30 focus:border-neon-blue focus:outline-none"
          />
          <button
            onClick={send}
            disabled={!input.trim() || sending}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-pink to-neon-blue text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </main>
      <div ref={bottomRef} />
    </div>
  );
}
