// components/features/about/experience-timeline.tsx
'use client';

import { motion } from 'framer-motion';
import { Briefcase, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ExperienceItem } from '@/types/experience';

// ✅ FIXED: Custom type matching the selected fields from getExperience()
// Instead of using @prisma/client Experience (which has createdAt/updatedAt)


interface ExperienceTimelineProps {
  experience: ExperienceItem[]; // ✅ Use custom type instead of Prisma type
}

export function ExperienceTimeline({ experience }: ExperienceTimelineProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Present';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="w-6 h-6 text-indigo-400" />
          <h2 className="text-3xl font-bold text-white">Work Experience</h2>
        </div>
        <p className="text-gray-400">My professional journey and career milestones</p>
      </motion.div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-indigo-500 via-purple-500 to-cyan-500" />

        <div className="space-y-12">
          {experience.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row gap-8 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute -left-1.25 md:left-1/2 md:-translate-x-1/2 top-0 w-3 h-3 rounded-full bg-indigo-500 border-4 border-[#0a0a0a]" />

              {/* Content */}
              <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-8 md:pl-0`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors"
                >
                  {/* Company Icon */}
                  <div className={`flex items-center gap-3 mb-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="p-2 rounded-lg bg-indigo-500/10">
                      <Building2 className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className={index % 2 === 0 ? 'md:text-right' : ''}>
                      <h3 className="text-xl font-bold text-white">{job.role}</h3>
                      <p className="text-indigo-400">{job.company}</p>
                    </div>
                  </div>

                  {/* Date & Location */}
                  <div className={`flex flex-wrap gap-3 mb-4 text-sm ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <Badge variant="secondary" className="text-xs">
                      {formatDate(job.startDate)} - {formatDate(job.endDate)}
                    </Badge>
                    {job.isCurrent && (
                      <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                        Current
                      </Badge>
                    )}
                    {job.location && (
                      <span className="text-gray-500">{job.location}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4">{job.description}</p>

                  {/* Highlights */}
                  {job.highlights.length > 0 && (
                    <ul className={`space-y-2 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                      {job.highlights.map((highlight, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-indigo-400 mt-1">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Technologies */}
                  {job.technologies.length > 0 && (
                    <div className={`flex flex-wrap gap-2 mt-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      {job.technologies.map((tech, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}