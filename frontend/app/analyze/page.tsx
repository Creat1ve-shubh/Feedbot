"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { useBrandStore } from "@/store/brandStore";
import AnalysisForm from "@/components/forms/AnalysisForm";
import {
  IconChartBar,
  IconSparkles,
  IconArrowRight,
  IconCheck,
  IconAlertCircle,
  IconLoader,
  IconCpu,
  IconDatabase,
} from "@tabler/icons-react";
import Link from "next/link";

export default function AnalyzePage() {
  const { isLoading, brand, error } = useBrandStore();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header - keeping structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded mb-4">
            <IconCpu size={14} className="text-gray-600" />
            <span className="text-xs font-mono text-gray-600 uppercase tracking-wide">
              Model v2.1.3 • Sentiment + Emotion + Topic
            </span>
          </div>
          <h1 className="text-5xl font-serif text-[#0b0b0b] mb-3 leading-tight">
            Brand Perception Analysis
          </h1>
          <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
            Query the inference model to extract sentiment, emotions, and topics
            from social media discourse. Results based on Reddit and Twitter
            data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0b0b0b] mb-1">
                  Query Input
                </h2>
                <p className="text-xs text-gray-500">
                  Configure inference parameters
                </p>
              </div>
              <AnalysisForm onSubmitted={() => setSubmitted(true)} />

              {/* Model Metadata */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">
                  Model Configuration
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version</span>
                    <span className="font-mono text-gray-900">v2.1.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domain</span>
                    <span className="font-mono text-gray-900">
                      Social Media
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Training Set</span>
                    <span className="font-mono text-gray-900">
                      2,847 samples
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Inference</span>
                    <span className="font-mono text-gray-900">45s</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Status & Output Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* Loading State */}
            {isLoading && (
              <div className="bg-white border-2 border-indigo-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="animate-spin text-indigo-600">
                      <IconLoader size={20} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-[#0b0b0b]">
                        Inference Running
                      </h3>
                      <span className="text-xs font-mono text-gray-500">
                        Target: {brand}
                      </span>
                    </div>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                        <span className="text-gray-700">
                          Data collection from sources
                        </span>
                        <span className="ml-auto text-xs font-mono text-gray-500">
                          ~15s
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                        <span className="text-gray-700">
                          Model inference (sentiment, emotion, topic)
                        </span>
                        <span className="ml-auto text-xs font-mono text-gray-500">
                          ~30s
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                        <span className="text-gray-500">
                          Result aggregation
                        </span>
                        <span className="ml-auto text-xs font-mono text-gray-400">
                          pending
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="bg-white border-2 border-red-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <IconAlertCircle
                    size={20}
                    className="text-red-600 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <h3 className="font-semibold text-[#0b0b0b] mb-2">
                      Inference Failed
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                      {error ||
                        "Model execution error. Verify input parameters and retry."}
                    </p>
                    <div className="text-xs font-mono text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
                      Error code: INFERENCE_FAILED • Timestamp:{" "}
                      {new Date().toISOString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {(brand || submitted) && !isLoading && !error && (
              <div className="bg-white border-2 border-teal-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <IconCheck
                    size={20}
                    className="text-teal-600 flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-[#0b0b0b] mb-1">
                          Inference Complete
                        </h3>
                        <p className="text-sm text-gray-600">
                          Analysis for{" "}
                          <span className="font-mono font-semibold">
                            {brand}
                          </span>{" "}
                          ready for interpretation
                        </p>
                      </div>
                      <Link
                        href={`/insights?brand=${brand}`}
                        className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-[#0b0b0b] hover:bg-gray-800 text-white text-sm font-medium rounded transition-colors"
                      >
                        View Output
                        <IconArrowRight size={16} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="bg-gray-50 p-2 rounded border border-gray-200">
                        <div className="text-gray-500 mb-1">Samples</div>
                        <div className="font-mono font-semibold">847</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded border border-gray-200">
                        <div className="text-gray-500 mb-1">Confidence</div>
                        <div className="font-mono font-semibold">0.89</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded border border-gray-200">
                        <div className="text-gray-500 mb-1">Duration</div>
                        <div className="font-mono font-semibold">43s</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Info */}
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-4">
                Model Capabilities
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2" />
                  <div>
                    <div className="text-sm font-medium text-[#0b0b0b]">
                      Sentiment Classification
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      3-class output: positive, negative, neutral
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2" />
                  <div>
                    <div className="text-sm font-medium text-[#0b0b0b]">
                      Emotion Detection
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      Multi-label classification across 8 emotion categories
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2" />
                  <div>
                    <div className="text-sm font-medium text-[#0b0b0b]">
                      Topic Extraction
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      Unsupervised keyword clustering with TF-IDF weighting
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Note */}
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <div className="text-xs text-gray-500 leading-relaxed">
                <strong className="text-gray-700">Note:</strong> Model
                predictions reflect patterns in training data. Low-confidence
                results (&lt;0.7) or limited sample sizes may indicate
                insufficient context. Cross-reference with raw data before
                making decisions.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
