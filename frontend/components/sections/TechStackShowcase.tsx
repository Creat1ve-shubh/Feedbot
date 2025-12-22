"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";

interface TechItem {
  name: string;
  category: string;
  logo: string;
  color: string;
  bgColor: string;
}

const techStack: TechItem[] = [
  {
    name: "PyTorch",
    category: "ML Framework",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
    color: "#EE4C2C",
    bgColor: "rgba(238, 76, 44, 0.1)",
  },
  {
    name: "Transformers",
    category: "NLP Library",
    logo: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
    color: "#FFD21E",
    bgColor: "rgba(255, 210, 30, 0.1)",
  },
  {
    name: "FastAPI",
    category: "Backend Framework",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
    color: "#009688",
    bgColor: "rgba(0, 150, 136, 0.1)",
  },
  {
    name: "Next.js",
    category: "Frontend Framework",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    color: "#000000",
    bgColor: "rgba(0, 0, 0, 0.05)",
  },
  {
    name: "PostgreSQL",
    category: "Database",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    color: "#336791",
    bgColor: "rgba(51, 103, 145, 0.1)",
  },
  {
    name: "Redis",
    category: "Cache & Queue",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    color: "#DC382D",
    bgColor: "rgba(220, 56, 45, 0.1)",
  },
  {
    name: "Celery",
    category: "Task Queue",
    logo: "https://docs.celeryq.dev/en/stable/_static/celery_512.png",
    color: "#37814A",
    bgColor: "rgba(55, 129, 74, 0.1)",
  },
  {
    name: "Docker",
    category: "Containerization",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    color: "#2496ED",
    bgColor: "rgba(36, 150, 237, 0.1)",
  },
];

const metrics = [
  { label: "Model Accuracy", value: "94%" },
  { label: "Avg Response Time", value: "<2s" },
  { label: "Posts Analyzed", value: "125k+" },
  { label: "API Uptime", value: "99.7%" },
];

const comparison = [
  {
    feature: "Custom ML Model",
    feedbot: "DistilBERT + BiLSTM",
    generic: "Generic model",
  },
  {
    feature: "Emotion Detection",
    feedbot: "8+ emotions",
    generic: "Basic only",
  },
  {
    feature: "Topic Extraction",
    feedbot: "Keyword clustering",
    generic: "Not included",
  },
  {
    feature: "Multi-Platform",
    feedbot: "Reddit + Twitter",
    generic: "Limited",
  },
  {
    feature: "Real-time Processing",
    feedbot: "Celery workers",
    generic: "Varies",
  },
  { feature: "Accuracy", feedbot: "94%", generic: "80-85%" },
  { feature: "Open Source", feedbot: "MIT License", generic: "Proprietary" },
];

export default function TechStackShowcase() {
  return (
    <div className="py-32 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">
            Built with Best-in-Class Tools
          </p>
          <h3 className="text-5xl md:text-6xl font-serif text-[#0b0b0b] leading-tight mb-6">
            Enterprise-grade technologies
            <br />
            powering every aspect of Feedbot
          </h3>
        </motion.div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32">
          {techStack.map((tech, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.03 }}
              className="bg-white border border-gray-200 p-8 hover:border-gray-300 transition-all duration-300 group cursor-pointer flex flex-col items-start relative overflow-hidden"
            >
              {/* Colored accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
                style={{ backgroundColor: tech.color }}
              />

              {/* Logo with colored background */}
              <div
                className="w-20 h-20 mb-8 rounded-lg flex items-center justify-center transition-all duration-300"
                style={{ backgroundColor: tech.bgColor }}
              >
                <img
                  src={tech.logo}
                  alt={`${tech.name} logo`}
                  className="w-12 h-12 object-contain"
                />
              </div>

              {/* Content */}
              <div>
                <h4 className="text-2xl font-serif text-[#0b0b0b] mb-2 group-hover:opacity-70 transition-opacity">
                  {tech.name}
                </h4>
                <p className="text-sm text-gray-500 uppercase tracking-wider">
                  {tech.category}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-12 text-center">
            Performance at Scale
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-gray-200 p-10 text-center hover:border-gray-300 transition-all duration-300"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                  className="text-4xl font-serif text-[#0b0b0b] mb-3"
                >
                  {metric.value}
                </motion.div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  {metric.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-gray-200 bg-white"
        >
          <div className="p-8 border-b border-gray-200">
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">
              Comparison
            </p>
            <h4 className="text-3xl font-serif text-[#0b0b0b]">
              Feedbot vs Generic Sentiment APIs
            </h4>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-6 text-xs uppercase tracking-wider text-gray-500 font-normal">
                  Feature
                </th>
                <th className="text-center p-6 text-xs uppercase tracking-wider text-[#0b0b0b] font-normal">
                  Feedbot
                </th>
                <th className="text-center p-6 text-xs uppercase tracking-wider text-gray-500 font-normal">
                  Generic APIs
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="p-6 text-sm text-gray-700">{row.feature}</td>
                  <td className="p-6 text-sm text-center font-mono text-[#0b0b0b]">
                    {row.feedbot}
                  </td>
                  <td className="p-6 text-sm text-center font-mono text-gray-500">
                    {row.generic}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Open Source Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 text-center border-t border-gray-200 pt-16"
        >
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">
            Open Source on GitHub
          </p>
          <p className="text-xl font-serif text-[#0b0b0b]">
            MIT Licensed · Contributions Welcome
          </p>
        </motion.div>
      </div>
    </div>
  );
}
