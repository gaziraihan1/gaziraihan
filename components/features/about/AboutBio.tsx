'use client';

import { motion } from 'framer-motion';
import { Quote, Code2, Palette, Lightbulb } from 'lucide-react';

export function AboutBio() {
  return (
    <section className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative"
      >
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
          <Quote className="w-8 h-8 text-indigo-400 mb-4" />
          <blockquote className="text-xl md:text-2xl text-gray-300 leading-relaxed italic">
            &quot;I believe great software is built at the intersection of technical excellence 
            and thoughtful design. Every line of code should serve a purpose, and every 
            pixel should enhance the user experience.&quot;
          </blockquote>
          <p className="mt-6 text-gray-500">— My Development Philosophy</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="p-3 rounded-xl bg-indigo-500/10 w-fit mb-4">
            <Code2 className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">The Engineer</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            I write clean, maintainable code with a focus on performance and scalability. 
            My backend expertise ensures robust systems that can handle growth.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="p-3 rounded-xl bg-cyan-500/10 w-fit mb-4">
            <Palette className="w-6 h-6 text-cyan-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">The Designer</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            I care deeply about UX. Every interface I build is intuitive, accessible, 
            and delightful to use. Design is not an afterthought—it&apos;s foundational.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="p-3 rounded-xl bg-purple-500/10 w-fit mb-4">
            <Lightbulb className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">The Problem Solver</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            I thrive on complex challenges. Whether it&apos;s optimizing database queries 
            or crafting smooth animations, I find elegant solutions to hard problems.
          </p>
        </motion.div>
      </div>
    </section>
  );
}