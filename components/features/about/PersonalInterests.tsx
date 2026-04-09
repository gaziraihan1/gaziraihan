// components/features/about/personal-interests.tsx
'use client';

import { motion } from 'framer-motion';
import { Heart, Gamepad2, BookOpen, Camera, Music, Plane } from 'lucide-react';

const interests = [
  { icon: <Gamepad2 />, title: 'Gaming', description: 'Love exploring open-world games and game design' },
  { icon: <BookOpen />, title: 'Reading', description: 'Tech books, sci-fi novels, and design theory' },
  { icon: <Camera />, title: 'Photography', description: 'Street photography and landscape shots' },
  { icon: <Music />, title: 'Music', description: 'Playing guitar and producing electronic music' },
  { icon: <Plane />, title: 'Travel', description: 'Exploring new cultures and cuisines' },
  { icon: <Heart />, title: 'Open Source', description: 'Contributing to community projects' },
];

export function PersonalInterests() {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-6 h-6 text-indigo-400" />
          <h2 className="text-3xl font-bold text-white">Beyond the Code</h2>
        </div>
        <p className="text-gray-400">What I do when I&apos;m not building software</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {interests.map((interest, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5, scale: 1.05 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-indigo-500/30 transition-colors cursor-default"
          >
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4">
              {interest.icon}
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{interest.title}</h3>
            <p className="text-xs text-gray-500">{interest.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}