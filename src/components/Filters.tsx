"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CATEGORIES, formatMonth, shiftMonth } from "@/lib/expenses";

export default function Filters({
  month,
  category,
}: {
  month: string;
  category: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function go(next: { month?: string; category?: string }) {
    const params = new URLSearchParams();
    params.set("month", next.month ?? month);
    const cat = next.category ?? category;
    if (cat !== "All") params.set("category", cat);
    startTransition(() => router.push(`/?${params.toString()}`));
  }

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${
        pending ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => go({ month: shiftMonth(month, -1) })}
          aria-label="Previous month"
          className="btn-secondary px-3"
        >
          ‹
        </button>
        <label className="relative flex-1 sm:flex-none">
          <span className="sr-only">Month</span>
          <input
            type="month"
            value={month}
            onChange={(e) => e.target.value && go({ month: e.target.value })}
            className="field text-center font-medium sm:w-44"
            aria-label={formatMonth(month)}
          />
        </label>
        <button
          type="button"
          onClick={() => go({ month: shiftMonth(month, 1) })}
          aria-label="Next month"
          className="btn-secondary px-3"
        >
          ›
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <span className="text-muted">Category</span>
        <select
          value={category}
          onChange={(e) => go({ category: e.target.value })}
          className="field flex-1 sm:w-40"
        >
          <option value="All">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
