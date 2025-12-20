"use client";

import React from "react";
import { motion } from "motion/react";
import { caseStudies } from "@/lib/mockCaseStudies";
import Link from "next/link";

export default function CaseStudiesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
      },
    },
  };

  const titleVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: {
      x: -10,
      opacity: 1,
      transition: { duration: 0.7 },
    },
  };

  const detailVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.7, delay: 0.1 },
    },
  };

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-5xl md:text-6xl font-serif leading-tight text-[#0b0b0b]">
          Real Brand Insights
        </h2>
        <p className="mt-4 text-lg opacity-70 max-w-2xl">
          See how leading brands are understood through sentiment analysis and
          emotional intelligence.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-8"
      >
        {caseStudies.map((study) => (
          <motion.div
            key={study.id}
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
          >
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 md:gap-10 items-start md:items-stretch">
              {/* Animated Title Panel */}
              <motion.div
                variants={titleVariants}
                className="relative w-full md:w-1/3 bg-gradient-to-br from-black/90 via-black/80 to-black/60 text-white rounded-2xl p-6 md:p-8 overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 35%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.12), transparent 30%)",
                  }}
                />
                <div
                  className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-50"
                  style={{
                    background: study.color.includes("from")
                      ? undefined
                      : undefined,
                  }}
                />
                <div
                  className={`absolute inset-0 ${study.color} opacity-40 mix-blend-screen`}
                />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-300 mb-3">
                      {study.industry}
                    </p>
                    <h3 className="text-3xl md:text-4xl font-serif leading-tight">
                      {study.brand}
                    </h3>
                  </div>
                  <div className="mt-6 text-sm text-gray-200/90">
                    {study.keyInsight}
                  </div>
                </div>
              </motion.div>

              {/* Details Panel */}
              <motion.div
                variants={detailVariants}
                className="flex-1 w-full space-y-6"
              >
                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Posts Analyzed
                    </p>
                    <p className="text-2xl font-serif text-[#0b0b0b]">
                      {study.postsAnalyzed.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Positive
                    </p>
                    <p className="text-xl font-semibold text-green-600">
                      {study.sentimentBreakdown.positive}%
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Negative
                    </p>
                    <p className="text-xl font-semibold text-red-600">
                      {study.sentimentBreakdown.negative}%
                    </p>
                  </div>
                </div>

                {/* Sentiment Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Sentiment Split</span>
                    <span className="text-xs text-gray-500">
                      Positive / Mixed / Negative
                    </span>
                  </div>
                  <div className="flex gap-2 h-3 rounded-full overflow-hidden bg-gray-100">
                    <div
                      className="bg-green-500"
                      style={{ width: `${study.sentimentBreakdown.positive}%` }}
                    />
                    <div
                      className="bg-orange-500"
                      style={{ width: `${study.sentimentBreakdown.mixed}%` }}
                    />
                    <div
                      className="bg-red-500"
                      style={{ width: `${study.sentimentBreakdown.negative}%` }}
                    />
                  </div>
                </div>

                {/* Emotions and Insight */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Top Emotions
                    </h4>
                    <div className="space-y-2">
                      {study.topEmotions.slice(0, 3).map((emotion, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700">{emotion.name}</span>
                          <span className="font-medium text-[#0b0b0b]">
                            {emotion.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col justify-between">
                    <p className="text-sm leading-relaxed text-gray-700 italic">
                      "{study.keyInsight}"
                    </p>
                    <Link
                      href="/analyze"
                      className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#f5f3f0] hover:bg-[#ebe8e3] text-[#0b0b0b] font-medium transition-colors duration-300"
                    >
                      Analyze This Brand →
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-20 text-center"
      >
        <p className="text-lg opacity-70 mb-6">Ready to analyze your brand?</p>
        <Link
          href="/analyze"
          className="inline-block px-8 py-4 rounded-full bg-[#0b0b0b] text-white font-medium hover:bg-[#1a1a1a] transition-colors duration-300"
        >
          Start Your Analysis →
        </Link>
      </motion.div>
    </section>
  );
}
