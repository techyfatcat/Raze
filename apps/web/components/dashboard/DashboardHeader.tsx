"use client";

import {
  Bell,
  ChevronDown,
  RefreshCw,
  Search,
} from "lucide-react";

type Merchant = {
  id: string;
  name: string;
  slug: string;
  currency: string;
};

export default function DashboardHeader({
  merchant,
  onRefresh,
}: {
  merchant?: Merchant;
  onRefresh: () => void;
}) {
  return (
    <header className="flex h-[76px] items-center justify-between border-b border-[#e9e1d7] bg-[#f8f5f0]/90 px-7 backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
          <Box className="h-4 w-4 text-[#a56b45]" />
        </div>

        <span className="text-sm font-medium text-neutral-600">
          Merchant Console
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden h-10 w-[250px] items-center gap-2 rounded-xl border border-[#e5ddd4] bg-white px-3 md:flex">
          <Search className="h-4 w-4 text-neutral-400" />

          <input
            placeholder="Search anything..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />

          <span className="text-xs text-neutral-300">
            ⌘K
          </span>
        </div>

        <button
          onClick={onRefresh}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e5ddd4] bg-white text-neutral-500 transition hover:text-neutral-900"
          title="Refresh dashboard"
        >
          <RefreshCw className="h-4 w-4" />
        </button>

        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#e5ddd4] bg-white">
          <Bell className="h-4 w-4 text-neutral-600" />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#c36f45]" />
        </button>

        <button className="flex h-10 items-center gap-3 rounded-xl border border-[#e5ddd4] bg-white px-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#f3e7dc] text-xs font-semibold text-[#8c5738]">
            {merchant?.name
              ?.charAt(0)
              ?.toUpperCase() ?? "M"}
          </div>

          <span className="hidden max-w-[120px] truncate text-sm font-medium sm:block">
            {merchant?.name ??
              "Store"}
          </span>

          <ChevronDown className="h-4 w-4 text-neutral-400" />
        </button>
      </div>
    </header>
  );
}

function Box({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m21 8-9-5-9 5 9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}