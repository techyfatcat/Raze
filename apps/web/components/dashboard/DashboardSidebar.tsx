"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  Box,
  CreditCard,
  Megaphone,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";

import type { Merchant } from "@/types/merchant";

interface DashboardSidebarProps {
  merchant?: Merchant;
}

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    label: "Products",
    href: "/products",
    icon: Box,
  },
  {
    label: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    label: "AI Agents",
    href: "/agents",
    icon: Bot,
    badge: "AI",
  },
  {
    label: "Campaigns",
    href: "/campaigns",
    icon: Megaphone,
  },
  {
    label: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function DashboardSidebar({
  merchant,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[250px] flex-col bg-[#151515] text-white">
      {/* Logo */}
      <div className="px-8 pt-7">
        <div className="font-serif text-[32px] font-medium tracking-tight text-[#c77b4b]">
          Raze
        </div>
      </div>

     

      {/* Navigation */}
      <nav className="mt-7 flex-1 px-[18px]">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex h-12 items-center rounded-xl px-3.5 transition ${
                  active
                    ? "bg-[#303030] text-white"
                    : "text-[#9a9a9a] hover:bg-[#202020] hover:text-white"
                }`}
              >
                <Icon
                  className={`h-[19px] w-[19px] ${
                    active
                      ? "text-[#c77b4b]"
                      : "text-[#888]"
                  }`}
                  strokeWidth={1.8}
                />

                <span className="ml-3 text-[15px]">
                  {item.label}
                </span>

                {item.badge && (
                  <span className="ml-auto rounded-full bg-[#3a2a20] px-2 py-0.5 text-[10px] font-medium text-[#d48a5a]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* AI Status */}
      <div className="px-[18px] pb-5">
        <div className="rounded-[18px] border border-[#3a2d24] bg-[#1b1917] p-4">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-[#c77b4b]" />

            <p className="text-xs font-semibold text-white">
              AI agents are working
            </p>
          </div>

          <p className="mt-1 text-xs leading-5 text-[#777]">
            Growing your store automatically.
          </p>

          <Link
            href="/agents"
            className="mt-3 flex h-9 items-center justify-center rounded-lg border border-[#38322d] text-xs text-[#bbb] transition hover:bg-[#24211f] hover:text-white"
          >
            View activity
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}