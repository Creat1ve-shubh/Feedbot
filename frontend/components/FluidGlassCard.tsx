"use client";

import React from "react";
import { motion } from "motion/react";

interface FluidGlassCardProps {
  brand: string;
  industry: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

export default function FluidGlassCard({
  brand,
  industry,
  icon,
  children,
}: FluidGlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative group h-full overflow-hidden rounded-3xl"
    >
      {/* Solid frosted glass base with strong blur effect */}
      <div className="absolute inset-0 bg-white/12 backdrop-blur-2xl" />

      {/* Strong glassmorphism effect - darker overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 from-0% via-white/8 via-50% to-white/5 to-100%" />

      {/* Light accent border with glow */}
      <div className="absolute inset-0 border border-white/40 rounded-3xl shadow-[0_8px_32px_rgba(255,255,255,0.1)]" />

      {/* Animated light ray effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-lg" />

      {/* Content */}
      <div className="relative z-20 p-8 md:p-10 rounded-3xl h-full flex flex-col justify-between">
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full border border-white/30 mb-4 group-hover:bg-white/20 transition-colors duration-300">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Case Study
              </span>
            </div>
          </div>
          <div className="text-white/80 group-hover:text-white transition-all duration-300 transform group-hover:scale-110 group-hover:-rotate-12">
            {icon}
          </div>
        </div>

        {/* Brand Name */}
        <div className="mb-auto pb-6">
          <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-3 font-bold">
            {brand}
          </h3>
          <p className="text-sm uppercase tracking-[0.15em] text-white/70 font-medium">
            {industry}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-white/40 via-white/20 to-transparent mb-6" />

        {/* Children Content */}
        {children && (
          <div className="text-white/85 leading-relaxed space-y-2">
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
}
