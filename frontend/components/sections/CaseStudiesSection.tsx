"use client";

import React from "react";
import { caseStudies } from "@/lib/mockCaseStudies";

export default function CaseStudiesSection() {
  return (
    <section className="py-32 px-6 bg-[#f5f3f0]">
      <div className="max-w-4xl mx-auto">
        {/* Section Header - Editorial Style */}
        <header className="mb-20 pb-12 border-b-2 border-gray-200">
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-6">
            Research Publication
          </div>
          <h2 className="text-5xl font-serif text-[#0b0b0b] mb-6 leading-tight">
            Representative Case Studies
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            The following analyses demonstrate model performance across diverse
            brand categories and social discourse patterns. Each study
            represents a controlled inference executed under identical pipeline
            conditions.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
              <span>
                Model Version: <span className="font-mono">v2.1.3</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
              <span>
                Total Observations: <span className="font-mono">12,483</span>
              </span>
            </div>
          </div>
        </header>

        {/* Case Studies - Academic Layout */}
        <div className="space-y-24">
          {caseStudies.map((study, index) => (
            <article key={study.id} className="relative">
              {/* Figure Number - Academic Style */}
              <div className="absolute -left-20 top-0 text-right">
                <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                  Figure {index + 1}
                </div>
              </div>

              {/* Article Header */}
              <header className="mb-10">
                <h3 className="text-3xl font-serif text-[#0b0b0b] mb-3 leading-tight">
                  {study.brand}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <span className="font-medium">{study.industry}</span>
                  <span>•</span>
                  <span className="font-mono">
                    n = {study.postsAnalyzed.toLocaleString()}
                  </span>
                  <span>•</span>
                  <span>Sources: Reddit, Twitter</span>
                </div>
                <div className="bg-gray-50 border-l-4 border-gray-300 p-6">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Summary Finding
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed italic">
                    {study.keyInsight}
                  </p>
                </div>
              </header>

              {/* Data Tables - White Paper Style */}
              <div className="space-y-10">
                {/* Table 1: Sentiment Distribution */}
                <div>
                  <div className="text-sm font-semibold text-[#0b0b0b] mb-4">
                    Table {index + 1}.1: Sentiment Classification Results
                  </div>
                  <div className="border border-gray-300">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-300">
                        <tr>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Category
                          </th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Frequency
                          </th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Distribution
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-700">
                            Positive
                          </td>
                          <td className="py-3 px-4 text-sm font-mono text-right text-gray-900">
                            {Math.round(
                              (study.postsAnalyzed *
                                study.sentimentBreakdown.positive) /
                                100
                            ).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm font-mono text-right font-semibold text-teal-700">
                            {study.sentimentBreakdown.positive}%
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-700">
                            Mixed/Neutral
                          </td>
                          <td className="py-3 px-4 text-sm font-mono text-right text-gray-900">
                            {Math.round(
                              (study.postsAnalyzed *
                                study.sentimentBreakdown.mixed) /
                                100
                            ).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm font-mono text-right font-semibold text-amber-700">
                            {study.sentimentBreakdown.mixed}%
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-700">
                            Negative
                          </td>
                          <td className="py-3 px-4 text-sm font-mono text-right text-gray-900">
                            {Math.round(
                              (study.postsAnalyzed *
                                study.sentimentBreakdown.negative) /
                                100
                            ).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm font-mono text-right font-semibold text-red-700">
                            {study.sentimentBreakdown.negative}%
                          </td>
                        </tr>
                        <tr className="bg-gray-50 font-semibold border-t-2 border-gray-300">
                          <td className="py-3 px-4 text-sm text-gray-900">
                            Total
                          </td>
                          <td className="py-3 px-4 text-sm font-mono text-right text-gray-900">
                            {study.postsAnalyzed.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm font-mono text-right text-gray-900">
                            100%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 2: Emotion Distribution */}
                <div>
                  <div className="text-sm font-semibold text-[#0b0b0b] mb-4">
                    Table {index + 1}.2: Dominant Emotional Patterns
                  </div>
                  <div className="border border-gray-300">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-300">
                        <tr>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Rank
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Emotion Category
                          </th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Detection Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {study.topEmotions.slice(0, 3).map((emotion, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm font-mono text-gray-500">
                              {i + 1}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">
                              {emotion.name}
                            </td>
                            <td className="py-3 px-4 text-sm font-mono text-right font-semibold text-[#0b0b0b]">
                              {emotion.value}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 3: Topic Extraction */}
                <div>
                  <div className="text-sm font-semibold text-[#0b0b0b] mb-4">
                    Table {index + 1}.3: Extracted Topic Frequencies
                  </div>
                  <div className="border border-gray-300">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-300">
                        <tr>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Topic Cluster
                          </th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Mentions
                          </th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Relative Freq.
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {study.topTopics.slice(0, 3).map((topic, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-700">
                              {topic.name}
                            </td>
                            <td className="py-3 px-4 text-sm font-mono text-right text-gray-900">
                              {topic.count}
                            </td>
                            <td className="py-3 px-4 text-sm font-mono text-right font-semibold text-[#0b0b0b]">
                              {(
                                (topic.count / study.postsAnalyzed) *
                                100
                              ).toFixed(1)}
                              %
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Footnote */}
              <footer className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-semibold">Data Collection:</span>{" "}
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                  .
                  <span className="ml-2">
                    <span className="font-semibold">Pipeline:</span> Inference
                    v2.1.3 with TF-IDF topic extraction.
                  </span>
                  <span className="ml-2">
                    <span className="font-semibold">Confidence Threshold:</span>{" "}
                    ≥0.75 for classification.
                  </span>
                </p>
              </footer>
            </article>
          ))}
        </div>

        {/* Methodology Appendix */}
        <aside className="mt-24 pt-12 border-t-2 border-gray-200">
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">
            Appendix A
          </div>
          <h4 className="text-xl font-serif text-[#0b0b0b] mb-6">
            Methodology & Limitations
          </h4>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-900">Model Architecture:</strong> All
              analyses employ a fine-tuned transformer model (BERT-base) trained
              on social media discourse. The model performs multi-label
              classification for sentiment (3 classes) and emotion (8 classes),
              with concurrent TF-IDF-based topic extraction.
            </p>
            <p>
              <strong className="text-gray-900">Sampling Protocol:</strong> Data
              collected via Reddit and Twitter APIs using brand-specific keyword
              queries. Sample sizes reflect available discourse volume during
              collection windows. No temporal weighting applied.
            </p>
            <p>
              <strong className="text-gray-900">Known Limitations:</strong>{" "}
              Emotion and topic rankings represent relative frequencies within
              collected samples, not population-level estimates. Model trained
              on English-language data; performance on other languages not
              validated. Sarcasm and context-dependent sentiment may reduce
              classification accuracy.
            </p>
            <p>
              <strong className="text-gray-900">Validation:</strong>{" "}
              Cross-validation metrics (precision, recall, F1) available upon
              request. Confidence thresholds set at ≥0.75 to minimize false
              positives.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
