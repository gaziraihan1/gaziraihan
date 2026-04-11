'use client';

import { motion } from 'framer-motion';
import { MapPin, Mail, Calendar } from 'lucide-react';
import Image from 'next/image';

export function AboutHero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative order-2 md:order-1"
      >
        <div className="relative aspect-square max-w-md mx-auto">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
          
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-white/5">
            <Image
              src="/portfolio-image-for-gaziraihan.png" // Replace with your photo
              alt="Your Name"
              fill
              className="object-cover"
              fetchPriority='high'
              loading='eager'
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4"
          >
            <p className="text-3xl font-bold text-white">1+</p>
            <p className="text-sm text-gray-400">Years Experience</p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="order-1 md:order-2 space-y-6"
      >
        <div>
          <p className="text-indigo-400 font-medium mb-2">About Me</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hi, I&apos;m <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">Mohammad Raihan Gazi</span>
          </h1>
          <p className="text-xl text-gray-400">
            Junior Full-Stack Developer
          </p>
        </div>

        <p className="text-gray-300 leading-relaxed">
          I specialize in building scalable web applications with modern technologies. 
          With a passion for both backend architecture and frontend design, I bridge 
          the gap between complex systems and intuitive user experiences.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="flex items-center gap-3 text-gray-400">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <MapPin className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm text-white">Dhaka, Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <Mail className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm text-white">gaziraihan505@gmail.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <Calendar className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Available</p>
              <p className="text-sm text-white">For new opportunities</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="w-5 h-5 flex items-center justify-center text-indigo-400 font-bold">🌐</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Work Type</p>
              <p className="text-sm text-white">Remote / Hybrid</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}