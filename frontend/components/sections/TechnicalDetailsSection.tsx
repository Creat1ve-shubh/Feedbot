"use client";

import React from "react";
import { motion } from "motion/react";
import {
  IconBrain,
  IconTrendingUp,
  IconDatabase,
  IconAlertCircle,
} from "@tabler/icons-react";
import AnimatedArchitectureDiagram from "./AnimatedArchitectureDiagram";
import LiveMetricsDashboard from "./LiveMetricsDashboard";
import InteractivePipeline from "./InteractivePipeline";
import TechStackShowcase from "./TechStackShowcase";

const features = [
  {
    icon: IconBrain,
    title: "Advanced ML Model",
    description:
      "Custom-trained transformer-LSTM architecture analyzes sentiment with 94% accuracy across social platforms.",
    details: [
      "Distilbert tokenization",
      "BiLSTM encoding",
      "Real-time inference",
      "Multi-platform support",
    ],
  },
  {
    icon: IconTrendingUp,
    title: "Emotion Detection",
    description:
      "Beyond sentiment, we identify 8+ distinct emotions: joy, frustration, excitement, concern, and more.",
    details: [
      "Nuanced understanding",
      "Contextual analysis",
      "Trending patterns",
      "Emotion evolution tracking",
    ],
  },
  {
    icon: IconDatabase,
    title: "Topic Extraction",
    description:
      "Automatically discover what topics drive sentiment. Understand what your audience is talking about.",
    details: [
      "Keyword clustering",
      "Trend identification",
      "Conversation mapping",
      "Competitive analysis",
    ],
  },
  {
    icon: IconAlertCircle,
    title: "Real-time Monitoring",
    description:
      "Celery-powered workers process posts in real-time. Get alerts on sentiment spikes and emerging trends.",
    details: [
      "Live dashboard",
      "Instant updates",
      "Queue management",
      "Scalable processing",
    ],
  },
];

export default function TechnicalDetailsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-[#f5f3f0] to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-serif leading-tight text-[#0b0b0b] mb-4">
            Powered by Intelligence
          </h2>
          <p className="text-lg opacity-70 max-w-3xl mx-auto">
            Our technical stack combines cutting-edge machine learning,
            distributed processing, and real-time data infrastructure to deliver
            unprecedented brand insights.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-[#f5f3f0] flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-[#0b0b0b]" />
                </div>

                <h3 className="text-2xl font-serif text-[#0b0b0b] mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <div className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-[#0b0b0b]" />
                      <span className="text-gray-600">{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Enhanced Interactive Components */}
      <div>
        {/* Live Metrics Dashboard */}
        <LiveMetricsDashboard />

        {/* Interactive Architecture Diagram */}
        <AnimatedArchitectureDiagram />

        {/* Interactive ML Pipeline */}
        <InteractivePipeline />

        {/* Tech Stack Showcase */}
        <TechStackShowcase />
      </div>
    </section>
  );
}
