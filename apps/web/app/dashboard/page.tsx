"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bot,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import OverviewCards from "@/components/dashboard/OverviewCards";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RecentOrders from "@/components/dashboard/RecentOrders";
import AgentActivity from "@/components/dashboard/AgentActivity";
import LowStockProducts from "@/components/dashboard/LowStockProducts";

const API_URL =
  process.env.NEXT_PUBLIC_RAZE_API_URL ??
  "http://localhost:5000";

const MERCHANT_ID =
  process.env.NEXT_PUBLIC_RAZE_MERCHANT_ID;

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function loadDashboard() {
    if (!MERCHANT_ID) {
      setError(
        "NEXT_PUBLIC_RAZE_MERCHANT_ID is not configured."
      );

      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/api/dashboard/${MERCHANT_ID}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message ??
            "Failed to load dashboard"
        );
      }

      setDashboard(data.dashboard);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#171717]">
      <DashboardSidebar
        merchant={dashboard?.merchant}
      />

      <main className="ml-[250px] min-h-screen">
        <DashboardHeader
          merchant={dashboard?.merchant}
          onRefresh={loadDashboard}
        />

        <div className="px-7 pb-10">
          {/* Loading */}
          {loading && <DashboardSkeleton />}

          {/* Error */}
          {error && !loading && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-500" />

                <div>
                  <p className="font-semibold text-red-800">
                    Unable to load dashboard
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                </div>
              </div>

              <button
                onClick={loadDashboard}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          )}

          {/* Dashboard */}
          {dashboard && !loading && (
            <>
              {/* Page heading */}
              <div className="mb-7">

                <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                  Store Overview
                </h1>

                <p className="mt-1 text-sm text-neutral-500">
                  Monitor your store, payments,
                  products and AI agents.
                </p>
              </div>

              {/* Overview cards */}
              <OverviewCards
                overview={dashboard.overview}
                currency={
                  dashboard.merchant.currency
                }
              />

              {/* Revenue + Agent Activity */}
              <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.85fr)]">
                <RevenueChart
                  data={dashboard.revenueTrend}
                  currency={
                    dashboard.merchant.currency
                  }
                />

                <AgentActivity
                  activity={
                    dashboard.agentActivity
                  }
                />
              </div>

              {/* Orders + Inventory */}
              <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.85fr)]">
                <RecentOrders
                  orders={
                    dashboard.recentOrders
                  }
                />

                <LowStockProducts
                  products={
                    dashboard.lowStockProducts
                  }
                  currency={
                    dashboard.merchant.currency
                  }
                />
              </div>

              {/* AI Commerce */}
              <div className="mt-6 rounded-2xl border border-[#e9e1d7] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.025)]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5eadf]">
                        <Sparkles className="h-4 w-4 text-[#b66d43]" />
                      </div>

                      <h2 className="text-lg font-semibold">
                        AI Commerce Overview
                      </h2>
                    </div>

                    <p className="mt-2 text-sm text-neutral-500">
                      Raze agents are continuously
                      working across your commerce
                      flow.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f8f5f0] px-4 py-2 text-sm font-medium text-[#8b5638]">
                    {
                      dashboard.overview
                        .completedAgentActions
                    }{" "}
                    actions completed
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <InsightCard
                    icon={Bot}
                    label="Agent Actions"
                    value={
                      dashboard.overview
                        .completedAgentActions
                    }
                    description="Successfully completed"
                  />

                  <InsightCard
                    icon={TrendingUp}
                    label="Campaigns"
                    value={
                      dashboard.overview
                        .totalCampaigns
                    }
                    description="Growth campaigns created"
                  />

                  <InsightCard
                    icon={AlertTriangle}
                    label="Pending Approval"
                    value={
                      dashboard.overview
                        .pendingAgentActions
                    }
                    description="Actions waiting for approval"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/* ======================================================
   INSIGHT CARD
   ====================================================== */

function InsightCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-[#eee7df] bg-[#fcfaf7] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
          <Icon className="h-4 w-4 text-[#a56b45]" />
        </div>

        <div>
          <p className="text-xs text-neutral-500">
            {label}
          </p>

          <p className="mt-0.5 text-xl font-semibold">
            {value}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-neutral-500">
        {description}
      </p>
    </div>
  );
}

/* ======================================================
   LOADING SKELETON
   ====================================================== */

function DashboardSkeleton() {
  return (
    <div className="mt-6 animate-pulse">
      <div className="mb-7">
        <div className="h-4 w-32 rounded bg-neutral-200" />

        <div className="mt-3 h-8 w-56 rounded bg-neutral-200" />

        <div className="mt-2 h-4 w-80 rounded bg-neutral-200" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-32 rounded-2xl bg-white"
            />
          )
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_0.85fr]">
        <div className="h-[350px] rounded-2xl bg-white" />

        <div className="h-[350px] rounded-2xl bg-white" />
      </div>
    </div>
  );
}