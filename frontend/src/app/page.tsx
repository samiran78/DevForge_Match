'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-violet-900 to-violet-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-800/20 via-transparent to-transparent" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-violet-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.span
            className="text-xl font-bold bg-gradient-to-r from-neon-pink to-neon-blue bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            DevMatch
          </motion.span>
          <div className="flex gap-4">
            <Link href="/auth/login" className="text-violet-300 hover:text-white transition">
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-pink to-neon-blue text-white font-medium hover:opacity-90 transition glow-pink"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 aura-ring rounded-full opacity-60" />
              <div className="absolute inset-2 bg-violet-950 rounded-full flex items-center justify-center">
                <span className="text-4xl">💻</span>
              </div>
            </div>
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-neon-pink bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Find Your Code Companion
          </motion.h1>
          <motion.p
            className="text-xl text-violet-300 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Technical compatibility meets real connection. Swipe, match, and build something together.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              href="/auth/register"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-neon-pink to-neon-blue text-white font-semibold text-lg hover:opacity-90 transition glow-pink"
            >
              Start Matching
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 rounded-xl glass border border-violet-500/30 text-white font-semibold text-lg hover:border-neon-blue/50 transition"
            >
              Sign In with GitHub
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Built for Developers
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'GitHub DNA',
                desc: 'Your coding style visualized. Aura classification from commit patterns, languages, and OSS contribution.',
                icon: '🧬',
              },
              {
                title: 'Smart Matching',
                desc: 'Skill overlap, experience compatibility, and personality inference. Not just a random swipe.',
                icon: '🎯',
              },
              {
                title: 'Real Connection',
                desc: 'Chat, video call, and smart date suggestions. Move from match to meetup with structure.',
                icon: '🤝',
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                className="glass rounded-2xl p-8 card-tilt hover:border-neon-pink/30 transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-4xl mb-4 block">{f.icon}</span>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-violet-300">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 border border-neon-blue/20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-4">Ready to find your match?</h2>
          <p className="text-violet-300 mb-8">
            Join developers who value technical compatibility and real-world connection.
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-neon-pink to-neon-blue text-white font-semibold hover:opacity-90 transition"
          >
            Create Free Account
          </Link>
        </motion.div>
      </section>

      <footer className="py-8 text-center text-violet-500 text-sm">
        © {new Date().getFullYear()} DevMatch. Built for developers, by developers.
      </footer>
    </div>
  );
}
