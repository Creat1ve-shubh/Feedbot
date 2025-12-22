"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconCopy, IconCheck } from "@tabler/icons-react";

const codeExamples = {
  curl: {
    label: "cURL",
    code: `curl -X POST "http://localhost:8000/analyze" \\
  -H "Content-Type: application/json" \\
  -d '{
    "brand_name": "Tesla",
    "platforms": ["reddit", "twitter"],
    "post_limit": 50
  }'`,
    language: "bash",
  },
  python: {
    label: "Python",
    code: `import requests

# Analyze brand sentiment
response = requests.post(
    "http://localhost:8000/analyze",
    json={
        "brand_name": "Tesla",
        "platforms": ["reddit", "twitter"],
        "post_limit": 50
    }
)

task_id = response.json()["task_id"]
print(f"Analysis started: {task_id}")`,
    language: "python",
  },
  javascript: {
    label: "JavaScript",
    code: `// Analyze brand sentiment
const response = await fetch('http://localhost:8000/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    brand_name: 'Tesla',
    platforms: ['reddit', 'twitter'],
    post_limit: 50
  })
});

const { task_id } = await response.json();
console.log(\`Analysis started: \${task_id}\`);`,
    language: "javascript",
  },
};

const responseExample = {
  code: `{
  "task_id": "abc123-def456-ghi789",
  "status": "processing",
  "message": "Analysis started successfully",
  "estimated_time": "2-3 minutes",
  "posts_to_analyze": 50
}`,
  language: "json",
};

const resultsExample = {
  code: `{
  "task_id": "abc123-def456-ghi789",
  "status": "completed",
  "brand_name": "Tesla",
  "summary": {
    "total_posts": 47,
    "sentiment_breakdown": {
      "positive": 29,
      "negative": 12,
      "mixed": 6
    },
    "overall_sentiment": "Positive",
    "confidence": 0.87
  },
  "top_emotions": [
    { "emotion": "excitement", "count": 18 },
    { "emotion": "curiosity", "count": 14 },
    { "emotion": "frustration", "count": 9 }
  ],
  "trending_topics": [
    "autopilot", "battery", "delivery", "pricing"
  ]
}`,
  language: "json",
};

export default function LiveCodePlayground() {
  const [activeTab, setActiveTab] = useState<"curl" | "python" | "javascript">(
    "python"
  );
  const [copied, setCopied] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = () => {
    setIsTyping(true);
    setShowResponse(false);
    setTimeout(() => {
      setIsTyping(false);
      setShowResponse(true);
    }, 1500);
  };

  return (
    <div className="py-16 px-6 bg-gradient-to-b from-white to-[#f5f3f0]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-4xl md:text-5xl font-serif text-[#0b0b0b] mb-4">
            Developer-First API
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start analyzing sentiment in minutes. Simple REST endpoints with
            comprehensive responses.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Request Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#1e1e1e] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Tab Header */}
            <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex gap-2">
                {Object.entries(codeExamples).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as any)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      activeTab === key
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleCopy(codeExamples[activeTab].code)}
                className="p-2 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                title="Copy code"
              >
                {copied ? (
                  <IconCheck className="w-4 h-4 text-green-400" />
                ) : (
                  <IconCopy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Code Display */}
            <div className="p-6 overflow-x-auto">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-mono leading-relaxed"
                >
                  <code
                    className={`language-${codeExamples[activeTab].language}`}
                  >
                    {codeExamples[activeTab].code}
                  </code>
                </motion.pre>
              </AnimatePresence>
            </div>

            {/* Run Button */}
            <div className="px-6 pb-6">
              <button
                onClick={handleRunCode}
                disabled={isTyping}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/25"
              >
                {isTyping ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="w-2 h-2 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </span>
                ) : (
                  "▶ Run Request"
                )}
              </button>
            </div>
          </motion.div>

          {/* Response Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#1e1e1e] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Response Header */}
            <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-400">
                  Response
                </span>
                {showResponse && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium"
                  >
                    200 OK
                  </motion.span>
                )}
              </div>

              {showResponse && (
                <button
                  onClick={() => handleCopy(responseExample.code)}
                  className="p-2 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                  title="Copy response"
                >
                  {copied ? (
                    <IconCheck className="w-4 h-4 text-green-400" />
                  ) : (
                    <IconCopy className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            {/* Response Display */}
            <div className="p-6 overflow-x-auto min-h-[300px] flex items-start">
              <AnimatePresence mode="wait">
                {!showResponse && !isTyping ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full flex flex-col items-center justify-center py-12 text-gray-500"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <p className="text-sm">
                      Click "Run Request" to see the response
                    </p>
                  </motion.div>
                ) : isTyping ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full flex flex-col items-center justify-center py-12 text-gray-400"
                  >
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-sm">Processing request...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full"
                  >
                    <motion.pre
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-mono leading-relaxed"
                    >
                      <code className="language-json">
                        {responseExample.code}
                      </code>
                    </motion.pre>

                    {/* Additional Results Preview */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-6 pt-6 border-t border-white/10"
                    >
                      <p className="text-xs text-gray-500 mb-3">
                        📊 Poll /results/{"{task_id}"} to get full analysis:
                      </p>
                      <pre className="text-xs font-mono leading-relaxed opacity-60">
                        <code className="language-json">
                          {resultsExample.code}
                        </code>
                      </pre>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* API Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {[
            { icon: "⚡", label: "Fast Response", detail: "< 2s inference" },
            {
              icon: "🔄",
              label: "Async Processing",
              detail: "Task-based queue",
            },
            {
              icon: "📊",
              label: "Rich Analytics",
              detail: "Multi-dimensional",
            },
            { icon: "🔒", label: "Type-Safe", detail: "Full TypeScript" },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-md text-center"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h4 className="font-semibold text-[#0b0b0b] mb-1">
                {feature.label}
              </h4>
              <p className="text-sm text-gray-600">{feature.detail}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        code {
          color: #e5e5e5;
        }
        .language-bash .hljs-string,
        .language-json .hljs-string {
          color: #ce9178;
        }
        .language-json .hljs-number {
          color: #b5cea8;
        }
        .language-json .hljs-literal {
          color: #569cd6;
        }
        .language-python .hljs-keyword,
        .language-javascript .hljs-keyword {
          color: #569cd6;
        }
        .language-python .hljs-string,
        .language-javascript .hljs-string {
          color: #ce9178;
        }
        .language-python .hljs-function,
        .language-javascript .hljs-function {
          color: #dcdcaa;
        }
        .language-bash .hljs-meta {
          color: #808080;
        }
        .language-json .hljs-attr {
          color: #9cdcfe;
        }
      `}</style>
    </div>
  );
}
