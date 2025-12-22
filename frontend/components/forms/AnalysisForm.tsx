"use client";

import { useBrandStore } from "@/store/brandStore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  IconBrandReddit,
  IconBrandX,
  IconDatabase,
  IconSparkles,
} from "@tabler/icons-react";

const schema = z.object({
  brand: z.string().min(2, "Enter a brand name"),
  limit: z.number().min(10).max(1000).default(100),
  include_reddit: z.boolean().default(true),
  include_twitter: z.boolean().default(true),
});

export type AnalysisInput = z.infer<typeof schema>;

export default function AnalysisForm({
  defaultValues,
  onSubmitted,
}: {
  defaultValues?: Partial<AnalysisInput>;
  onSubmitted?: (v: any) => void;
}) {
  const { setBrand, setLoading } = useBrandStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<AnalysisInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      brand: "",
      limit: 100,
      include_reddit: true,
      include_twitter: true,
      ...defaultValues,
    },
  });

  async function onSubmit(values: AnalysisInput) {
    setServerError(null);
    setBrand(values.brand);
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Request failed (${res.status})`);
      }
      onSubmitted?.(await res.json().catch(() => ({})));
    } catch (e: any) {
      setServerError(e?.message || "Failed to start analysis");
    } finally {
      setLoading(false);
    }
  }

  const include_reddit = watch("include_reddit");
  const include_twitter = watch("include_twitter");
  const limit = watch("limit");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Brand Name
        </label>
        <input
          {...register("brand")}
          placeholder="Enter brand (e.g., Nike, Tesla)"
          className="w-full pl-4 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#0b0b0b] focus:outline-none transition-colors text-[#0b0b0b] placeholder:text-gray-400"
        />
        {errors.brand && (
          <p className="text-xs text-red-600 mt-1">{errors.brand.message}</p>
        )}
      </div>

      <div className="border-t border-gray-100 pt-6 space-y-6">
        <h3 className="text-sm font-semibold text-gray-700">
          Analysis Configuration
        </h3>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-3">
            Data Sources
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setValue("include_reddit", !include_reddit)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                include_reddit
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              }`}
            >
              <IconBrandReddit size={20} />
              <span className="font-medium">Reddit</span>
            </button>
            <button
              type="button"
              onClick={() => setValue("include_twitter", !include_twitter)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                include_twitter
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              }`}
            >
              <IconBrandX size={20} />
              <span className="font-medium">Twitter / X</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-3">
            <IconDatabase size={16} className="inline mr-1" /> Posts to Analyze
          </label>
          <div className="flex gap-2">
            {[50, 100, 200].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setValue("limit", v)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  limit === v
                    ? "bg-[#0b0b0b] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-2 bg-[#0b0b0b] hover:bg-gray-800 disabled:bg-gray-400 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin">
              <IconSparkles size={20} />
            </div>
            Analyzing...
          </>
        ) : (
          <>
            <IconSparkles size={20} /> Start Analysis
          </>
        )}
      </button>
    </form>
  );
}
