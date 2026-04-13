'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, Calendar } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import Link from 'next/link';

export function ContactInfo() {
  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Email',
      value: 'gazyraihan3@gmail.com',
      href: 'mailto:gazyraihan3@gmail.com',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: 'Location',
      value: 'Dhaka, Bangladesh',
      href: '#',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Response Time',
      value: '24-48 Hours',
      href: '#',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
  ];

  const socialLinks = [
    {
      icon: <FaGithub className="w-5 h-5" />,
      href: siteConfig.links.github,
      label: 'GitHub',
    },
    {
      icon: <FaLinkedin className="w-5 h-5" />,
      href: siteConfig.links.linkedin,
      label: 'LinkedIn',
    },
    {
      icon: <FaTwitter className="w-5 h-5" />,
      href: siteConfig.links.twitter,
      label: 'Twitter',
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      href: '/contact',
      label: 'Schedule Call',
    },
  ];

  return (
    <div className="space-y-6">
      {contactMethods.map((method, index) => (
        <motion.div
          key={method.title}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${method.bg}`}>
                <span className={method.color}>{method.icon}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">{method.title}</p>
                <Link
                  href={method.href}
                  className="text-sm text-white hover:text-indigo-400 transition-colors"
                >
                  {method.value}
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-white mb-4">
              Connect With Me
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="sm"
                  asChild
                  className="justify-start gap-2"
                >
                  <Link
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {social.icon}
                    <span className="text-xs">{social.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-xl bg-green-500/10 border border-green-500/20"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <div>
            <p className="text-sm font-semibold text-green-400">
              Available for Work
            </p>
            <p className="text-xs text-gray-500">
              Open to freelance & full-time
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}