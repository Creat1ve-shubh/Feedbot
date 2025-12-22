"use client";

import React, { useState } from "react";
import { motion } from "motion/react";

interface ComponentDetail {
  name: string;
  tech: string;
  description: string;
  metrics?: string;
}

const components: ComponentDetail[] = [
  {
    name: "Data Scrapers",
    tech: "PRAW + Tweepy",
    description:
      "Multi-platform social data collection with rate limiting and deduplication",
    metrics: "~1000 posts/min",
  },
  {
    name: "Frontend",
    tech: "Next.js + React",
    description: "Server-side rendered dashboard with real-time updates",
    metrics: "3s poll interval",
  },
  {
    name: "API Gateway",
    tech: "FastAPI",
    description: "High-performance async REST API with WebSocket support",
    metrics: "< 50ms latency",
  },
  {
    name: "Task Queue",
    tech: "Celery + Redis",
    description: "Distributed task processing with auto-scaling workers",
    metrics: "10k+ tasks/hour",
  },
  {
    name: "ML Engine",
    tech: "PyTorch + Transformers",
    description: "DistilBERT + BiLSTM hybrid model for sentiment analysis",
    metrics: "94% accuracy",
  },
  {
    name: "Database",
    tech: "PostgreSQL",
    description:
      "Persistent storage with optimized indexing for time-series queries",
    metrics: "100k+ posts stored",
  },
];

export default function AnimatedArchitectureDiagram() {
  const [selectedComponent, setSelectedComponent] = useState<number | null>(
    null
  );

  return (
    <div className="py-32 bg-[#0b0b0b] w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">
            System Architecture
          </p>
          <h3 className="text-5xl md:text-6xl font-serif text-white leading-tight mb-6">
            Click on any component to
            <br />
            explore the technical details
          </h3>
        </motion.div>
      </div>

      {/* Component Grid - Full Width */}
      <div className="w-full px-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-800">
            {components.map((component, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onMouseEnter={() => setSelectedComponent(idx)}
                onMouseLeave={() => setSelectedComponent(null)}
                className="bg-[#0b0b0b] border border-gray-800 hover:border-gray-700 transition-colors duration-300 cursor-pointer"
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <h4 className="text-xl font-serif text-white">
                      {component.name}
                    </h4>
                    <span className="text-xs font-mono text-gray-600 border border-gray-800 px-2 py-1">
                      {component.tech}
                    </span>
                  </div>

                  {/* Description */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: selectedComponent === idx ? "auto" : 0,
                      opacity: selectedComponent === idx ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                      {component.description}
                    </p>
                    {component.metrics && (
                      <div className="text-xs text-gray-500 font-mono border-t border-gray-900 pt-4">
                        {component.metrics}
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Flow Legend */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center border-t border-gray-900 pt-16"
        >
          <p className="text-sm text-gray-600">
            Data flows automatically through each stage
          </p>
        </motion.div>
      </div>
    </div>
  );
}
