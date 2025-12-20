"use client";

import React from "react";
import { motion } from "motion/react";
import CaseStudiesSection from "@/components/sections/CaseStudiesSection";
import TechnicalDetailsSection from "@/components/sections/TechnicalDetailsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import Footer from "@/components/sections/Footer";
import Link from "next/link";

export default function LandingPage(): JSX.Element {
  return (
    <div className="w-full min-h-screen bg-[#f5f3f0] text-black font-sans overflow-x-hidden">
      {/* ================= HERO SECTION ================= */}
      <main className="relative min-h-screen w-full bg-[#f5f3f0] flex items-center justify-center overflow-hidden px-6">
        {/* Background artistic block */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/hero-art.png"
            alt="Abstract Art"
            className="w-[480px] h-[580px] md:w-[640px] md:h-[760px] object-cover mix-blend-multiply opacity-90"
          />
        </div>

        {/* Main Content */}
        <div className="min-h-screen w-full bg-[#f5f3f0] flex flex-col items-center justify-center p-6">
          {/* Large background type */}
          <div className="relative max-w-6xl w-full flex-1 flex flex-col justify-center">
            <h1 className="pointer-events-none select-none text-[160px] leading-[0.8] font-serif opacity-95 text-[#0b0b0b] tracking-tight transform -translate-y-48">
              <span className="block">Delivering</span>
            </h1>

            {/* Center framed artwork */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative w-[340px] h-[420px] md:w-[420px] md:h-[520px] rounded-sm overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
                {/* Black frame */}
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  {/* inner artwork using SVG for grain + shapes */}
                  <svg
                    viewBox="0 0 400 500"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <defs>
                      <filter id="grain">
                        <feTurbulence
                          type="fractalNoise"
                          baseFrequency="0.8"
                          numOctaves="2"
                          stitchTiles="stitch"
                          result="noise"
                        />
                        <feColorMatrix type="saturate" values="0" />
                        <feBlend
                          in="SourceGraphic"
                          in2="noise"
                          mode="overlay"
                        />
                      </filter>

                      <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#111" stopOpacity="1" />
                        <stop
                          offset="100%"
                          stopColor="#111"
                          stopOpacity="0.5"
                        />
                      </linearGradient>

                      <radialGradient id="halo" cx="50%" cy="75%" r="50%">
                        <stop offset="0%" stopColor="#111" stopOpacity="0.9" />
                        <stop offset="70%" stopColor="#111" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#111" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Background soft gradient */}
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill="#0b0b0b"
                    />

                    {/* Wavy band shapes */}
                    <path
                      d="M0,80 C60,30 140,130 200,100 C260,70 340,140 400,110 L400,0 L0,0 Z"
                      fill="#ffffff"
                      opacity="0.04"
                      transform="translate(0,40) scale(1.2)"
                    />
                    <path
                      d="M0,180 C80,120 160,260 240,200 C320,140 400,240 400,200 L400,500 L0,500 Z"
                      fill="#ffffff"
                      opacity="0.06"
                      transform="translate(0,-60) scale(1.05)"
                    />

                    {/* Palm circle / halo */}
                    <circle cx="200" cy="360" r="60" fill="url(#halo)" />

                    {/* Palm silhouette (simple palm tree) */}
                    <g transform="translate(200,360) scale(0.9)">
                      <path
                        d="M0,30 C-2,10 -4,-30 0,-48"
                        stroke="#0b0b0b"
                        strokeWidth="2.5"
                        fill="none"
                      />
                      <g transform="translate(-8,-36)">
                        <path
                          d="M0,0 C-6,-6 -18,-12 -28,-10 C-18,-2 -8,6 0,0 Z"
                          fill="#0b0b0b"
                          opacity="0.95"
                        />
                        <path
                          d="M0,0 C6,-6 18,-12 28,-10 C18,-2 8,6 0,0 Z"
                          fill="#0b0b0b"
                          opacity="0.95"
                          transform="translate(16,0)"
                        />
                        <path
                          d="M0,0 C-10,-10 -24,-20 -36,-18 C-24,-6 -12,6 0,0 Z"
                          fill="#0b0b0b"
                          opacity="0.9"
                          transform="translate(-12,-8)"
                        />
                      </g>
                    </g>

                    {/* Eye in top band */}
                    <g transform="translate(200,80)">
                      <ellipse cx="0" cy="0" rx="34" ry="14" fill="#fff" />
                      <circle cx="2" cy="0" r="6" fill="#0b0b0b" />
                    </g>

                    {/* Outer vignette to add depth */}
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill="black"
                      opacity="0.05"
                    />

                    {/* Apply grain filter by drawing a transparent rect so filter blends */}
                    <g filter="url(#grain)">
                      <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="rgba(255,255,255,0.02)"
                      />
                    </g>
                  </svg>
                </div>

                {/* Thin outer border (frame) */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ boxShadow: "inset 0 0 0 8px #f5f3f0" }}
                />
              </div>
            </div>

            {/* Bottom text to complete the oversized typography */}
            <h2 className="pointer-events-none select-none text-[160px] leading-[0.8] font-serif opacity-95 text-[#0b0b0b] tracking-tight transform translate-y-56 text-right">
              <span className="block">Insights</span>
            </h2>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16 relative z-20"
          >
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0b0b0b] text-white font-medium hover:bg-[#1a1a1a] transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Try Demo
              <span className="text-lg">→</span>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* ================= CASE STUDIES SECTION ================= */}
      <CaseStudiesSection />

      {/* ================= TECHNICAL DETAILS SECTION ================= */}
      <TechnicalDetailsSection />

      {/* ================= HOW IT WORKS SECTION ================= */}
      <HowItWorksSection />

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}
