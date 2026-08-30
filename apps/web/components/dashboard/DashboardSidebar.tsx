"use client";

import {
  BarChart3,
  Bot,
  Box,
  CreditCard,
  LayoutDashboard,
  Megaphone,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";

type Merchant = {
  id: string;
  name: string;
  slug: string;
  currency: string;
};

const navigation = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    label: "Products",
    icon: Package,
  },
  {
    label: "Payments",
    icon: CreditCard,
  },
  {
    label: "AI Agents",
    icon: Bot,
  },
  {
    label: "Campaigns",
    icon: Megaphone,
  },
  {
    label: "Customers",
    icon: Users,
  },
  {
    label: "Analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    icon: Settings,
  },
];

export default function DashboardSidebar({
  merchant,
}: {
  merchant?: Merchant;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col bg-[#151515] px-4 py-5 text-white">
      <div className="px-3">
        <div className="font-serif text-[34px] tracking-[-1.5px] text-[#c98761]">
          Raze
        </div>
      </div>


      <nav className="mt-7 flex-1 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                item.active
                  ? "bg-white/[0.1] text-white"
                  : "text-white/55 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] ${
                  item.active
                    ? "text-[#d18a61]"
                    : "text-white/50 group-hover:text-white"
                }`}
                strokeWidth={1.7}
              />

              <span>
                {item.label}
              </span>

              {item.label ===
                "AI Agents" && (
                <span className="ml-auto rounded-full bg-[#c47c55]/15 px-2 py-0.5 text-[10px] text-[#d99a76]">
                  AI
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-[#3b3028] bg-[#211d19] p-4">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-[#d28b64]" />

          <p className="text-xs font-medium text-white/80">
            AI agents are working
          </p>
        </div>

        <p className="mt-1 text-xs text-white/40">
          Growing your store automatically.
        </p>

        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/75 hover:bg-white/5">
          View activity
          <span>→</span>
        </button>
      </div>

    
    </aside>
  );
}