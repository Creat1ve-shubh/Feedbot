"use client";

import useSWR from "swr";
import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import SentimentPie from "@/components/charts/SentimentPie";
import EmotionBar from "@/components/charts/EmotionBar";
import TopicBar from "@/components/charts/TopicBar";
import PostTable from "@/components/PostTable";

function InsightsContent() {
  const sp = useSearchParams();
  const brand = sp.get("brand") || "";
  const { data, isLoading, mutate, error } = useSWR(
    `/api/results?brand=${brand}`,
    fetcher,
    {
      refreshInterval: 3000, // real-time polling
    }
  );

  // Always call hooks unconditionally. Compute summary with safe defaults.
  const summary = useMemo(() => {
    const rows: any[] = Array.isArray(data) ? data : [];
    const total = rows.length;
    const pos = rows.filter((d) => d.sentiment === "Positive").length;
    const neg = rows.filter((d) => d.sentiment === "Negative").length;
    return { total, pos, neg };
  }, [data]);

  if (isLoading) return <p className="p-8">Loading charts…</p>;
  if (error)
    return (
      <p className="p-8 text-red-600">Failed to load insights. Please retry.</p>
    );
  if (!data?.length)
    return (
      <div className="p-8 space-y-4">
        <p>No posts yet. Try again later.</p>
        <button
          className="border px-3 py-2 rounded-md"
          onClick={() => mutate()}
        >
          Refresh
        </button>
      </div>
    );

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Insights — {brand}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {summary.total} posts · {summary.pos} positive · {summary.neg}{" "}
            negative
          </span>
          <button
            className="border px-3 py-2 rounded-md"
            onClick={() => mutate()}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SentimentPie data={data} />
        <EmotionBar data={data} />
        <TopicBar data={data} />
      </div>

      <PostTable data={data} />
    </div>
  );
}

export default function InsightsPage() {
  return (
    <Suspense fallback={<p className="p-8">Loading insights...</p>}>
      <InsightsContent />
    </Suspense>
  );
}
