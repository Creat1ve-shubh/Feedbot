"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  prefix?: string;
  decimals?: number;
}

// Animated counter component
function AnimatedCounter({
  value,
  decimals = 0,
  prefix = "",
  unit = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  unit?: string;
}) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000, bounce: 0 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span>
      {prefix}
      {displayValue.toFixed(decimals)}
      {unit}
    </span>
  );
}

function MetricCard({
  label,
  value,
  unit,
  prefix = "",
  decimals = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border border-gray-200 p-8 hover:border-gray-300 transition-colors duration-300"
    >
      <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">
        {label}
      </p>

      <div className="text-4xl font-serif text-[#0b0b0b] mb-6">
        <AnimatedCounter
          value={value}
          decimals={decimals}
          prefix={prefix}
          unit={unit}
        />
      </div>

      {/* Progress Bar */}
      <motion.div
        className="h-px bg-gray-200 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="h-full bg-[#0b0b0b]"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
}

// Circular gauge component
function CircularGauge({
  percentage,
  label,
}: {
  percentage: number;
  label: string;
}) {
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center"
    >
      <div className="relative w-40 h-40 mb-4">
        <svg className="transform -rotate-90 w-40 h-40">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="60"
            stroke="#e5e5e5"
            strokeWidth="2"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="80"
            cy="80"
            r="60"
            stroke="#0b0b0b"
            strokeWidth="2"
            fill="none"
            strokeLinecap="butt"
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-3xl font-serif text-[#0b0b0b]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
          >
            {percentage}%
          </motion.span>
        </div>
      </div>

      <p className="text-sm text-gray-600">{label}</p>
    </motion.div>
  );
}

export default function LiveMetricsDashboard() {
  const metrics = {
    accuracy: 94,
    postsAnalyzed: 125847,
    inferenceSpeed: 1.8,
    uptime: 99.7,
    activeWorkers: 8,
    queueSize: 234,
  };

  return (
    <div className="py-32 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">
            Performance Metrics
          </p>
          <h3 className="text-5xl md:text-6xl font-serif text-[#0b0b0b] leading-tight mb-6">
            Real-time system performance
            <br />
            and model accuracy indicators
          </h3>
        </motion.div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 mb-16">
          <MetricCard
            label="Posts Analyzed"
            value={metrics.postsAnalyzed}
            unit="+"
          />

          <MetricCard
            label="Avg Inference Time"
            value={metrics.inferenceSpeed}
            unit="s"
            decimals={1}
          />

          <MetricCard
            label="Model Accuracy"
            value={metrics.accuracy}
            unit="%"
          />

          <MetricCard
            label="System Uptime"
            value={metrics.uptime}
            unit="%"
            decimals={1}
          />

          <MetricCard
            label="Active Workers"
            value={metrics.activeWorkers}
            unit=""
          />

          <MetricCard
            label="Queue Size"
            value={metrics.queueSize}
            unit=" tasks"
          />
        </div>

        {/* Performance Gauges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-gray-200 p-12 bg-white"
        >
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-12 text-center">
            Model Performance Breakdown
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <CircularGauge percentage={94} label="Accuracy" />
            <CircularGauge percentage={92} label="Precision" />
            <CircularGauge percentage={91} label="Recall" />
            <CircularGauge percentage={93} label="F1 Score" />
          </div>

          {/* Confusion Matrix Preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-12 border-t border-gray-200"
          >
            <p className="text-sm text-gray-600 text-center mb-8">
              Trained on 50,000+ labeled posts across multiple platforms
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "True Positives", value: "4,231" },
                { label: "True Negatives", value: "4,089" },
                { label: "False Positives", value: "312" },
                { label: "False Negatives", value: "368" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + idx * 0.05 }}
                  className="text-center border border-gray-200 p-6"
                >
                  <div className="text-2xl font-serif text-[#0b0b0b] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Live Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Live data · Updates every 5 seconds
          </p>
        </motion.div>
      </div>
    </div>
  );
}
