"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import SentimentPie from "@/components/charts/SentimentPie";
import EmotionBar from "@/components/charts/EmotionBar";
import TopicBar from "@/components/charts/TopicBar";
import PostTable from "@/components/PostTable";

export default function InsightsPage({ searchParams }: any) {
  const brand = searchParams.brand;
  const { data, isLoading } = useSWR(`/api/results?brand=${brand}`, fetcher, {
    refreshInterval: 3000, // real-time polling
  });

  if (isLoading) return <p className="p-8">Loading charts…</p>;
  if (!data?.length) return <p className="p-8">No posts yet. Try again later.</p>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-semibold">Insights — {brand}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SentimentPie data={data} />
        <EmotionBar data={data} />
        <TopicBar data={data} />
      </div>

      <PostTable data={data} />
    </div>
  );
}
