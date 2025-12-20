"use client";
import { useBrandStore } from "@/store/brandStore";
import { useTransition } from "react";
import { IconSearch, IconSparkles } from "@tabler/icons-react";

type BrandInputProps = {
  limit?: number;
  includeReddit?: boolean;
  includeTwitter?: boolean;
};

export default function BrandInput({
  limit = 100,
  includeReddit = true,
  includeTwitter = true,
}: BrandInputProps) {
  const { setBrand, setLoading } = useBrandStore();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const brand = (formData.get("brand") as string)?.trim();
    if (!brand) return;
    setBrand(brand);
    setLoading(true);

    await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({
        brand,
        limit,
        include_reddit: includeReddit,
        include_twitter: includeTwitter,
      }),
      headers: { "Content-Type": "application/json" },
    });

    startTransition(() => {
      setLoading(false);
    });
  }

  return (
    <form action={handleSubmit} className="flex gap-3 items-center">
      <div className="relative flex-1">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <IconSearch size={20} />
        </div>
        <input
          name="brand"
          placeholder="Enter brand name (e.g., Nike, Tesla, Apple)"
          className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#0b0b0b] focus:outline-none transition-colors text-[#0b0b0b] placeholder:text-gray-400"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 bg-[#0b0b0b] hover:bg-gray-800 disabled:bg-gray-400 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <div className="animate-spin">
              <IconSparkles size={20} />
            </div>
            Analyzing...
          </>
        ) : (
          <>
            <IconSparkles size={20} />
            Analyze
          </>
        )}
      </button>
    </form>
  );
}
