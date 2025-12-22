"use client";

import React from "react";
import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Scrape & Collect",
    description:
      "Distributed scrapers gather real-time posts about your brand from Reddit, Twitter, and other platforms.",
  },
  {
    number: "02",
    title: "Analyze & Understand",
    description:
      "Advanced ML models analyze each post for sentiment, emotions, topics, and intent with 94% accuracy.",
  },
  {
    number: "03",
    title: "Visualize & Act",
    description:
      "Interactive dashboards present insights in real-time. Spot trends, address concerns, and celebrate wins.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-32 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">
            How It Works
          </p>
          <h2 className="text-5xl md:text-6xl font-serif text-[#0b0b0b] leading-tight mb-6">
            Three simple steps to transform
            <br />
            your brand perception
          </h2>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-12 hover:bg-gray-50 transition-colors duration-300"
            >
              {/* Step Number */}
              <span className="text-sm font-mono text-gray-400 block mb-8">
                {step.number}
              </span>

              {/* Title */}
              <h3 className="text-3xl font-serif text-[#0b0b0b] mb-6">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center border-t border-gray-200 pt-20"
        >
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-8">
            Start understanding your brand perception today
          </p>
          <motion.a
            href="/analyze"
            whileHover={{ x: 10 }}
            className="inline-flex items-center gap-3 text-lg font-serif text-[#0b0b0b] hover:text-gray-600 transition-colors"
          >
            Begin Analysis
            <span>→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
