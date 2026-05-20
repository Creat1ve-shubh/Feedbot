"use client";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import SentimentPie from "@/components/charts/SentimentPie";
import EmotionBar from "@/components/charts/EmotionBar";
import TopicBar from "@/components/charts/TopicBar";
import PostTable from "@/components/PostTable";
import {
  IconSearch,
  IconRefresh,
  IconDownload,
  IconAlertCircle,
  IconLoader,
  IconDatabase,
  IconFilter,
  IconArrowLeft,
  IconChartBar,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";

function MetricCard({
  label,
  value,
  sublabel,
  change,
}: {
  label: string;
  value: string;
  sublabel?: string;
  change?: string;
}) {
  return (
    <div className="bg-white border border-gray-300 p-6">
      <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
        {label}
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <div className="text-2xl font-mono font-bold text-[#0b0b0b]">
          {value}
        </div>
        {change && (
          <div className="text-xs font-mono text-gray-500">{change}</div>
        )}
      </div>
      {sublabel && <div className="text-xs text-gray-500">{sublabel}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const sp = useSearchParams();
  const brand = sp.get("brand") || "";
  const [searchInput, setSearchInput] = useState(brand);
  const [filterSentiment, setFilterSentiment] = useState<string>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const { data, isLoading, error, mutate } = useSWR(
    brand ? `/api/results?brand=${brand}` : null,
    fetcher,
    { refreshInterval: 5000 },
  );

  const allRows: any[] = Array.isArray(data) ? data : [];
  const rows: any[] =
    filterSentiment === "All"
      ? allRows
      : allRows.filter((r) => r.sentiment === filterSentiment);
  const total = allRows.length;
  const pos = allRows.filter((d) => d.sentiment === "Positive").length;
  const neg = allRows.filter((d) => d.sentiment === "Negative").length;
  const neu = allRows.filter((d) => d.sentiment === "Neutral").length;
  const posPct = total ? Math.round((pos / total) * 100) : 0;
  const negPct = total ? Math.round((neg / total) * 100) : 0;
  const neuPct = total ? Math.round((neu / total) * 100) : 0;

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    const url = new URL(window.location.href);
    url.searchParams.set("brand", searchInput.trim());
    window.location.href = url.toString();
  };

  const exportCSV = () => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]).join(",");
    const body = rows
      .map((r) =>
        Object.values(r)
          .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([`${headers}\n${body}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedbot-${brand}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 pb-8 border-b-2 border-gray-200"
        >
          {/* Breadcrumb */}
          <div className="mb-5">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#0b0b0b] transition-colors"
            >
              <IconArrowLeft size={13} />
              New Analysis
            </Link>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
                Interpretation Dashboard
              </div>
              <h1 className="text-4xl font-serif text-[#0b0b0b] mb-2">
                {brand ? `Analysis: ${brand}` : "Brand Analysis Dashboard"}
              </h1>
              {brand && (
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                  <span className="flex items-center gap-2">
                    <IconDatabase size={14} />
                    <span className="font-mono">{total} observations</span>
                  </span>
                  <span>•</span>
                  <span>Last updated: {new Date().toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Search & Controls */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 p-3">
              <IconSearch size={16} className="text-gray-400" />
              <input
                placeholder="Query brand..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => mutate()}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm font-medium"
              >
                <IconRefresh size={16} />
                Refresh
              </button>
              <button
                onClick={exportCSV}
                disabled={!brand || rows.length === 0}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm font-medium"
              >
                <IconDownload size={16} />
                Export CSV
              </button>
            </div>
          </div>
        </motion.header>

        {/* Status Messages */}
        {!brand && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border-2 border-gray-200 rounded-lg p-12"
          >
            <div className="text-center max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <IconChartBar size={24} className="text-gray-400" />
              </div>
              <h3 className="font-semibold text-[#0b0b0b] mb-2">
                No Active Query
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                Search for a brand above, or run a fresh analysis to populate
                this dashboard.
              </p>
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0b0b0b] hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Start New Analysis
                <IconArrowLeft size={14} className="rotate-180" />
              </Link>
            </div>
          </motion.div>
        )}

        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border-2 border-red-300 p-6"
          >
            <div className="flex items-start gap-4">
              <IconAlertCircle
                className="text-red-600 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div>
                <h3 className="font-semibold text-[#0b0b0b] mb-1">
                  Data Retrieval Failed
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Unable to fetch results from database. Verify connection and
                  retry.
                </p>
                <div className="text-xs font-mono text-gray-500 bg-gray-50 p-2 border border-gray-200">
                  Error: {error?.message || "Unknown error"}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {isLoading && brand && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border-2 border-indigo-200 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="animate-spin">
                <IconLoader size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0b0b0b]">
                  Loading results
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  Fetching from database...
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Metrics Grid */}
        {brand && allRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-4">
              Summary Statistics
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label="Total Samples"
                value={String(total)}
                sublabel="Analyzed posts"
              />
              <MetricCard
                label="Positive"
                value={`${posPct}%`}
                change={`n=${pos}`}
              />
              <MetricCard
                label="Negative"
                value={`${negPct}%`}
                change={`n=${neg}`}
              />
              <MetricCard
                label="Neutral"
                value={`${neuPct}%`}
                change={`n=${neu}`}
              />
            </div>
          </motion.div>
        )}

        {/* Visualization Panels */}
        {brand && allRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-4">
              Distribution Analysis
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-300 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#0b0b0b]">
                    Sentiment Distribution
                  </h3>
                  <span className="text-xs font-mono text-gray-500">
                    n={total}
                  </span>
                </div>
                <SentimentPie data={allRows} />
              </div>

              <div className="bg-white border border-gray-300 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#0b0b0b]">
                    Emotion Frequencies
                  </h3>
                  <span className="text-xs font-mono text-gray-500">Top 5</span>
                </div>
                <EmotionBar data={allRows} />
              </div>

              <div className="bg-white border border-gray-300 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#0b0b0b]">
                    Topic Clusters
                  </h3>
                  <span className="text-xs font-mono text-gray-500">
                    TF-IDF
                  </span>
                </div>
                <TopicBar data={allRows} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Raw Data Table */}
        {brand && allRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-300"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#0b0b0b] mb-1">
                    Observation Data
                  </h3>
                  <p className="text-xs text-gray-500">
                    {filterSentiment === "All"
                      ? `${allRows.length} total results`
                      : `${rows.length} of ${allRows.length} — filtered to ${filterSentiment}`}
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setFilterOpen((o) => !o)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border transition-colors ${
                      filterSentiment !== "All"
                        ? "border-[#0b0b0b] bg-[#0b0b0b] text-white"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <IconFilter size={14} />
                    {filterSentiment === "All" ? "Filter" : filterSentiment}
                  </button>
                  {filterOpen && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 shadow-lg z-10">
                      {["All", "Positive", "Negative", "Neutral"].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setFilterSentiment(s);
                            setFilterOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 ${
                            filterSentiment === s
                              ? "font-semibold text-[#0b0b0b]"
                              : "text-gray-600"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6">
              <PostTable data={rows} />
            </div>
          </motion.div>
        )}

        {/* Metadata Footer */}
        {brand && allRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-8 border-t border-gray-200"
          >
            <div className="text-xs text-gray-500 leading-relaxed">
              <strong className="text-gray-700">Dataset Info:</strong> Results
              represent inference output from model v2.1.3.
              <span className="ml-2">Confidence threshold: ≥0.75.</span>
              <span className="ml-2">Visualization refresh interval: 5s.</span>
              <span className="ml-2">
                Export options available for raw data and aggregated metrics.
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
