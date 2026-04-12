'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Zap, Users, Shield, type LucideIcon } from 'lucide-react';

interface Metric {
  id: string;
  label: string;
  value: string;
}

const iconMap: Record<string, LucideIcon> = {
  Performance: Zap,
  Growth: TrendingUp,
  Users: Users,
  Security: Shield,
};

export function ProjectMetrics({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
      {metrics.map((metric, index) => {
        const Icon = iconMap[metric.label] || TrendingUp;
        
        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-indigo-500/10 text-indigo-400 mb-4">
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">{metric.value}</div>
            <div className="text-sm text-gray-400">{metric.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}