"use client";
import { useState } from "react";
import { motion } from "motion/react";
import BrandInput from "@/components/BrandInput";
import { useBrandStore } from "@/store/brandStore";
import {
  IconBrandReddit,
  IconBrandX,
  IconChartBar,
  IconSparkles,
  IconDatabase,
} from "@tabler/icons-react";
import Link from "next/link";

export default function AnalyzePage() {
  const { isLoading, brand } = useBrandStore();
  const [limit, setLimit] = useState(100);
  const [includeReddit, setIncludeReddit] = useState(true);
  const [includeTwitter, setIncludeTwitter] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f3f0] to-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
            <IconSparkles size={18} className="text-amber-500" />
            <span className="text-sm font-medium text-gray-700">
              AI-Powered Sentiment Analysis
            </span>
          </div>
          <h1 className="text-5xl font-serif font-bold text-[#0b0b0b] mb-4">
            Analyze Brand Perception
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Understand how your brand is perceived across social media. We
            scrape, analyze, and visualize sentiment, emotions, and trending
            topics in real-time.
          </p>
        </motion.div>

        {/* Main Analysis Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8"
        >
          {/* Brand Input Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Brand Name
            </label>
            <BrandInput
              limit={limit}
              includeReddit={includeReddit}
              includeTwitter={includeTwitter}
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter any brand name to start analyzing public sentiment
            </p>
          </div>

          {/* Configuration Section */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Analysis Configuration
            </h3>

            {/* Data Sources */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-600 mb-3">
                Data Sources
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIncludeReddit(!includeReddit)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    includeReddit
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <IconBrandReddit size={20} />
                  <span className="font-medium">Reddit</span>
                  {includeReddit && (
                    <span className="ml-1 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIncludeTwitter(!includeTwitter)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    includeTwitter
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <IconBrandX size={20} />
                  <span className="font-medium">Twitter / X</span>
                  {includeTwitter && (
                    <span className="ml-1 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Posts Limit */}
            <div>
              <label
                htmlFor="limit"
                className="block text-xs font-medium text-gray-600 mb-3"
              >
                <IconDatabase size={16} className="inline mr-1" />
                Posts to Analyze
              </label>
              <div className="flex gap-2">
                {[50, 100, 200].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setLimit(value)}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                      limit === value
                        ? "bg-[#0b0b0b] text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Higher limits provide more comprehensive analysis but take
                longer
              </p>
            </div>
          </div>
        </motion.div>

        {/* Status Messages */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="animate-spin">
                <IconChartBar size={24} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  Analysis in Progress
                </h4>
                <p className="text-sm text-blue-700">
                  Scraping posts from selected sources and running ML
                  inference... This typically takes 30-60 seconds.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {brand && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-900 mb-1">
                  Analysis Complete
                </h4>
                <p className="text-sm text-green-700">
                  Your sentiment analysis for <strong>{brand}</strong> is ready
                  to view
                </p>
              </div>
              <Link
                href={`/insights?brand=${brand}`}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                <IconChartBar size={20} />
                View Insights
              </Link>
            </div>
          </motion.div>
        )}

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mt-12"
        >
          {[
            {
              label: "Sentiment Detection",
              value: "Positive, Negative, Neutral",
            },
            { label: "Emotion Analysis", value: "Joy, Anger, Sadness, Fear" },
            { label: "Topic Extraction", value: "Pricing, Quality, Support" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-4 border border-gray-100 text-center"
            >
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {item.label}
              </div>
              <div className="text-sm text-gray-700">{item.value}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
