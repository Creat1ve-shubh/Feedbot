"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PipelineStage {
  id: number;
  name: string;
  description: string;
  tech: string[];
  processingTime: string;
  details: {
    input: string;
    output: string;
    operations: string[];
  };
}

const pipelineStages: PipelineStage[] = [
  {
    id: 1,
    name: "Data Collection",
    description: "Scrape social media posts from multiple platforms",
    tech: ["PRAW", "Tweepy", "Async I/O"],
    processingTime: "5-10s",
    details: {
      input: "Brand name + Platform selection",
      output: "Raw post data (text, metadata, timestamps)",
      operations: [
        "Multi-threaded API calls",
        "Rate limit management",
        "SHA256 deduplication",
        "Context filtering with keywords",
      ],
    },
  },
  {
    id: 2,
    name: "Text Preprocessing",
    description: "Clean and normalize text data for ML processing",
    tech: ["Regex", "NLTK", "Custom Filters"],
    processingTime: "2-3s",
    details: {
      input: "Raw post text with emojis, URLs, mentions",
      output: "Cleaned, normalized text ready for tokenization",
      operations: [
        "Remove URLs and special characters",
        "Lowercase normalization",
        "Remove excessive whitespace",
        "Filter spam and irrelevant content",
      ],
    },
  },
  {
    id: 3,
    name: "Tokenization",
    description: "Convert text into numerical representations",
    tech: ["DistilBERT", "Transformers", "PyTorch"],
    processingTime: "1-2s",
    details: {
      input: "Cleaned text strings",
      output: "Token IDs, attention masks (768-dim embeddings)",
      operations: [
        "DistilBERT tokenizer encoding",
        "Padding/truncation to 128 tokens",
        "Generate attention masks",
        "Batch processing optimization",
      ],
    },
  },
  {
    id: 4,
    name: "ML Inference",
    description: "Run sentiment analysis through hybrid model",
    tech: ["BiLSTM", "PyTorch", "ONNX Runtime"],
    processingTime: "1.5-2s",
    details: {
      input: "Token embeddings (batch_size × 128 × 768)",
      output: "Sentiment logits + confidence scores",
      operations: [
        "DistilBERT feature extraction",
        "BiLSTM sequence encoding (256 units, 2 layers)",
        "Dense classification head",
        "Softmax probability distribution",
      ],
    },
  },
  {
    id: 5,
    name: "Post-Processing",
    description: "Extract insights and aggregate results",
    tech: ["Pandas", "NumPy", "Scikit-learn"],
    processingTime: "2-3s",
    details: {
      input: "Raw predictions + metadata",
      output: "Sentiment, emotions, topics, trends",
      operations: [
        "Classify sentiment (Pos/Neg/Mixed)",
        "Extract 8+ emotion categories",
        "Keyword clustering for topics",
        "Calculate aggregate statistics",
      ],
    },
  },
  {
    id: 6,
    name: "Storage & Response",
    description: "Persist results and return to client",
    tech: ["PostgreSQL", "SQLAlchemy", "FastAPI"],
    processingTime: "0.5-1s",
    details: {
      input: "Structured analysis results",
      output: "JSON response + database record",
      operations: [
        "Bulk insert to Postgres",
        "Update task status",
        "Generate summary statistics",
        "Return formatted JSON response",
      ],
    },
  },
];

export default function InteractivePipeline() {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  return (
    <div className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">
            ML Pipeline Deep Dive
          </p>
          <h3 className="text-5xl md:text-6xl font-serif text-[#0b0b0b] leading-tight mb-6">
            From raw social data to
            <br />
            actionable insights in seconds
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl">
            Click any stage to explore the technical details
          </p>
        </motion.div>

        {/* Pipeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
          {pipelineStages.map((stage, idx) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="relative bg-white"
            >
              <button
                onClick={() =>
                  setSelectedStage(selectedStage === stage.id ? null : stage.id)
                }
                className="w-full h-full text-left p-8 hover:bg-gray-50 transition-colors duration-300 group"
              >
                {/* Stage Number */}
                <div className="flex items-start justify-between mb-6">
                  <span className="text-sm font-mono text-gray-400">
                    {String(stage.id).padStart(2, "0")}
                  </span>
                  <span className="text-xs font-mono text-gray-500 group-hover:text-[#0b0b0b] transition-colors">
                    {stage.processingTime}
                  </span>
                </div>

                {/* Stage Title */}
                <h4 className="text-2xl font-serif text-[#0b0b0b] mb-3 group-hover:text-gray-600 transition-colors">
                  {stage.name}
                </h4>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {stage.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {stage.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 border border-gray-200 text-gray-600 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Expand Indicator */}
                <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 group-hover:text-[#0b0b0b] transition-colors">
                  <span>
                    {selectedStage === stage.id
                      ? "Hide details"
                      : "View details"}
                  </span>
                  <motion.span
                    animate={{ rotate: selectedStage === stage.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    →
                  </motion.span>
                </div>
              </button>

              {/* Expanded Details */}
              <AnimatePresence>
                {selectedStage === stage.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-gray-200"
                  >
                    <div className="p-8 bg-gray-50">
                      {/* Input/Output */}
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                            Input
                          </p>
                          <p className="text-sm text-gray-700 font-mono leading-relaxed">
                            {stage.details.input}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                            Output
                          </p>
                          <p className="text-sm text-gray-700 font-mono leading-relaxed">
                            {stage.details.output}
                          </p>
                        </div>
                      </div>

                      {/* Operations */}
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">
                          Key Operations
                        </p>
                        <ul className="space-y-2">
                          {stage.details.operations.map((op, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="text-sm text-gray-700 flex items-start gap-3"
                            >
                              <span className="text-gray-400 mt-1.5">—</span>
                              <span>{op}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Total Processing Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center border-t border-gray-200 pt-16"
        >
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">
            Total End-to-End Time
          </p>
          <p className="text-6xl font-serif text-[#0b0b0b]">12-20 seconds</p>
        </motion.div>
      </div>
    </div>
  );
}
