"use client";
import { useBrandStore } from "@/store/brandStore";
import { useTransition } from "react";

export default function BrandInput() {
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
        limit: 100,
        include_reddit: true,
        include_twitter: true,
      }),
      headers: { "Content-Type": "application/json" },
    });

    startTransition(() => {
      setLoading(false);
    });
  }

  return (
    <form action={handleSubmit} className="flex gap-2 items-center">
      <input
        name="brand"
        placeholder="Search brand e.g. Nike"
        className="border px-3 py-2 rounded-md w-64"
      />
      <button
        type="submit"
        className="bg-black text-white px-3 py-2 rounded-md disabled:opacity-50"
        disabled={isPending}
      >
        {isPending ? "Queuing..." : "Analyze"}
      </button>
    </form>
  );
}
