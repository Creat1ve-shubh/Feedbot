"use client";

import React from "react";
import { motion } from "motion/react";
import {
  IconSearch,
  IconBolt,
  IconChartBar,
  IconArrowRight,
} from "@tabler/icons-react";

const steps = [
  {
    number: "01",
    title: "Scrape & Collect",
    description:
      "Our distributed scrapers gather real-time posts about your brand from Reddit, Twitter, and other platforms.",
    icon: IconSearch,
    details: [
      "Real-time data collection",
      "Multi-platform support",
      "Automatic deduplication",
    ],
  },
  {
    number: "02",
    title: "Analyze & Understand",
    description:
      "Advanced ML models analyze each post for sentiment, emotions, topics, and intent with industry-leading accuracy.",
    icon: IconBolt,
    details: [
      "94% accuracy model",
      "8+ emotion categories",
      "Keyword extraction",
    ],
  },
  {
    number: "03",
    title: "Visualize & Act",
    description:
      "Beautiful, interactive dashboards present insights in real-time. Spot trends, address concerns, and celebrate wins.",
    icon: IconChartBar,
    details: ["Live dashboards", "Trend alerts", "Exportable reports"],
  },
];

export default function HowItWorksSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-serif leading-tight text-[#0b0b0b] mb-4">
            How It Works
          </h2>
          <p className="text-lg opacity-70 max-w-2xl mx-auto">
            Three simple steps to transform your brand perception into
            actionable insights.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative"
              >
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-16 items-start">
                  {/* Left: Number + Icon */}
                  <div className="flex flex-col items-center md:items-end md:text-right">
                    <div className="text-7xl font-serif text-gray-200 leading-none mb-4">
                      {step.number}
                    </div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="bg-gradient-to-br from-[#f5f3f0] to-white rounded-2xl p-8 border border-gray-200">
                    <h3 className="text-3xl font-serif text-[#0b0b0b] mb-3">
                      {step.title}
                    </h3>

                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                      {step.description}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {step.details.map((detail, i) => (
                        <div
                          key={i}
                          className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 border border-gray-300"
                        >
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute left-[100px] top-[120px] w-1 h-24 bg-gradient-to-b from-blue-400 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-lg text-gray-700 mb-8">
            Start understanding your brand perception today
          </p>
          <motion.a
            href="/analyze"
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#0b0b0b] text-white font-medium hover:bg-[#1a1a1a] transition-colors"
          >
            Begin Analysis
            <IconArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
