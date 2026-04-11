'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Award, CreativeCommons } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const education = [
  {
    degree: 'Bachelor of Science in Computer Science',
    school: 'University of Technology',
    year: '2018 - 2022',
    description: 'Focus on Software Engineering and Human-Computer Interaction',
  },
];

const certifications = [
  { name: 'AWS Certified Developer', issuer: 'Amazon Web Services', year: '2023' },
  { name: 'Google UX Design Certificate', issuer: 'Google', year: '2022' },
  { name: 'Meta Frontend Developer', issuer: 'Meta', year: '2023' },
];

export function EducationSection() {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-6 h-6 text-indigo-400" />
          <h2 className="text-3xl font-bold text-white">Education & Certifications</h2>
        </div>
        <p className="text-gray-400">Academic background and professional certifications</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-indigo-500/10">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Education</h3>
              </div>

              {education.map((edu, index) => (
                <div key={index} className="border-l-2 border-indigo-500 pl-4">
                  <h4 className="text-lg font-semibold text-white">{edu.degree}</h4>
                  <p className="text-indigo-400">{edu.school}</p>
                  <p className="text-sm text-gray-500 mb-2">{edu.year}</p>
                  <p className="text-sm text-gray-400">{edu.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <Award className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Certifications</h3>
              </div>

              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="p-2 rounded-lg bg-white/10">
                      <CreativeCommons className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-white">{cert.name}</h4>
                      <p className="text-xs text-gray-400">{cert.issuer}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {cert.year}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}