'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is your typical response time?',
    answer: 'I aim to respond to all inquiries within 24-48 hours. For urgent matters, please mention "URGENT" in your subject line.',
  },
  {
    question: 'Are you available for freelance projects?',
    answer: 'Yes! I take on select freelance projects that align with my expertise. Please provide details about your project timeline and budget.',
  },
  {
    question: 'Do you work remotely?',
    answer: 'Absolutely. I\'m set up for fully remote work and have experience collaborating with teams across different time zones.',
  },
  {
    question: 'What is your rate?',
    answer: 'Rates vary based on project scope, complexity, and timeline. Please share your project details, and I\'ll provide a customized quote.',
  },
  {
    question: 'Can you work with my existing team?',
    answer: 'Yes, I have extensive experience integrating with existing teams, codebases, and workflows. I can work as a contractor or full-time employee.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-400">Quick answers to common questions</p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-sm font-medium text-white">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}