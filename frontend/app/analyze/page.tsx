"use client";
import BrandInput from "@/components/BrandInput";
import { useBrandStore } from "@/store/brandStore";

export default function AnalyzePage() {
  const { isLoading, brand } = useBrandStore();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Analyze Brand</h1>
      <BrandInput />

      {isLoading && <p className="mt-6">⏳ Scraping and analyzing posts…</p>}

      {brand && !isLoading && (
        <a href={`/insights?brand=${brand}`} className="underline text-blue-600 mt-4 inline-block">
          View Insights →
        </a>
      )}
    </div>
  );
}
