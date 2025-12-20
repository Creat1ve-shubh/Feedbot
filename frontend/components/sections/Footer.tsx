"use client";

import React from "react";
import { motion } from "motion/react";
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconMail,
  IconArrowRight,
} from "@tabler/icons-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    Product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Case Studies", href: "#case-studies" },
      { label: "Dashboard", href: "/insights" },
    ],
    Platform: [
      { label: "Analyze", href: "/analyze" },
      { label: "Insights", href: "/insights" },
      { label: "API", href: "#api" },
      { label: "Documentation", href: "#docs" },
    ],
    Company: [
      { label: "About", href: "#about" },
      { label: "Blog", href: "#blog" },
      { label: "Contact", href: "#contact" },
      { label: "Privacy", href: "#privacy" },
    ],
  };

  const socialLinks = [
    {
      icon: IconBrandTwitter,
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: IconBrandGithub,
      href: "https://github.com/Creat1ve-shubh/Feedbot",
      label: "GitHub",
    },
    {
      icon: IconMail,
      href: "mailto:hello@feedbot.ai",
      label: "Email",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="bg-[#0b0b0b] text-white">
      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="px-6 py-20 border-b border-white/10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-serif mb-6">
            Ready to understand your brand?
          </h3>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Start analyzing brand sentiment in minutes. No credit card required.
          </p>
          <motion.a
            href="/analyze"
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#0b0b0b] font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Free Analysis
            <IconArrowRight className="w-5 h-5" />
          </motion.a>
        </div>
      </motion.div>

      {/* Main Footer */}
      <div className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-serif mb-4">Feedbot</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Advanced sentiment analysis for modern brands. Understand what the
              world is saying about you.
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2 }}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Links */}
          {Object.entries(links).map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-6">{category[0]}</h4>
              <ul className="space-y-3">
                {category[1].map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 py-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Feedbot. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#cookies"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
