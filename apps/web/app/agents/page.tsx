"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Sparkles,
  XCircle,
} from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const API_URL =
  process.env.NEXT_PUBLIC_RAZE_API_URL ??
  "http://localhost:5000";

const MERCHANT_ID =
  process.env.NEXT_PUBLIC_RAZE_MERCHANT_ID;

type AgentAction = {
  id: string;
  agentType: string;
  action: string;
  reason?: string | null;
  amount?: number | null;
  status: string;
  approvedBy?: string | null;
  metadata?: unknown;
  createdAt: string;
};

type DashboardData = {
  merchant: {
    id: string;
    name: string;
    slug: string;
    currency: string;
  };

  overview: {
    pendingAgentActions: number;
    completedAgentActions: number;
  };

  agentActivity: AgentAction[];
};

export default function AgentsPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadAgents = useCallback(async () => {
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
            "Failed to load agent activity"
        );
      }

      setDashboard(data.dashboard);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load agent activity"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  const activity =
    dashboard?.agentActivity ?? [];

  const paymentActions = useMemo(
    () =>
      activity.filter(
        (item) =>
          item.agentType === "PAYMENT"
      ),
    [activity]
  );

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#171717]">
      <DashboardSidebar
        merchant={dashboard?.merchant}
      />

      <main className="ml-[250px] min-h-screen">
        <DashboardHeader
          merchant={dashboard?.merchant}
          onRefresh={loadAgents}
        />

        <div className="px-7 py-7">

          {/* Header */}

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                AI Agents
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Monitor AI-powered activity across your commerce flow.
              </p>
            </div>

            <button
              onClick={loadAgents}
              disabled={loading}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e5ddd4] bg-white px-4 text-sm font-medium text-neutral-600 transition hover:bg-[#fcfaf7] hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>
          </div>

          {/* Error */}

          {error && !loading && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-start gap-3">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                <div>
                  <p className="font-semibold text-red-800">
                    Unable to load agent activity
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                </div>
              </div>

              <button
                onClick={loadAgents}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading */}

          {loading && (
            <AgentsSkeleton />
          )}

          {/* Content */}

          {!loading &&
            !error &&
            dashboard && (
              <>
                {/* Overview cards */}

                <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                  <AgentSummaryCard
                    icon={Bot}
                    label="Completed Actions"
                    value={
                      dashboard.overview
                        .completedAgentActions
                    }
                    description="Successfully completed"
                  />

                  <AgentSummaryCard
                    icon={Clock3}
                    label="Pending Approval"
                    value={
                      dashboard.overview
                        .pendingAgentActions
                    }
                    description="Waiting for approval"
                  />

                  <AgentSummaryCard
                    icon={CreditCardIcon}
                    label="Payment Actions"
                    value={paymentActions.length}
                    description="Recent payment requests"
                  />

                  <AgentSummaryCard
                    icon={Sparkles}
                    label="AI Status"
                    value={
                      activity.length > 0
                        ? 1
                        : 0
                    }
                    description={
                      activity.length > 0
                        ? "Activity detected"
                        : "No activity yet"
                    }
                  />

                </div>

                {/* Agent status */}

                <div className="mt-6 rounded-2xl border border-[#e9e1d7] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.025)]">

                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5eadf]">
                        <Bot className="h-5 w-5 text-[#a56b45]" />
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold">
                          Raze AI Agents
                        </h2>

                        <p className="mt-1 text-sm text-neutral-500">
                          AI agents are connected to your commerce workflow.
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-[#edf8f0] px-3 py-1.5 text-xs font-medium text-[#277044]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#3d9b5f]" />

                      Active
                    </div>

                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                    <AgentTypeCard
                      title="Payment Agent"
                      description="Handles payment approval requests."
                      count={paymentActions.length}
                      icon={CreditCardIcon}
                    />

                    <AgentTypeCard
                      title="Commerce Agent"
                      description="Interacts with customers through the AI assistant."
                      count="—"
                      icon={Bot}
                    />

                    <AgentTypeCard
                      title="Growth Agent"
                      description="Growth automation and campaigns."
                      count="—"
                      icon={Sparkles}
                    />

                  </div>

                </div>

                {/* Pending approval */}

                {dashboard.overview
                  .pendingAgentActions > 0 && (
                  <div className="mt-6 rounded-2xl border border-[#eadfca] bg-[#fffaf0] p-5">

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f6e9c9]">
                        <AlertTriangle className="h-4 w-4 text-[#a56b45]" />
                      </div>

                      <div>
                        <p className="font-semibold text-[#5f472d]">
                          Actions need attention
                        </p>

                        <p className="mt-1 text-sm text-[#806b52]">
                          There are{" "}
                          <strong>
                            {
                              dashboard.overview
                                .pendingAgentActions
                            }
                          </strong>{" "}
                          agent actions waiting for approval.
                        </p>
                      </div>

                    </div>

                  </div>
                )}

                {/* Activity */}

                <div className="mt-6 overflow-hidden rounded-2xl border border-[#e9e1d7] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.025)]">

                  <div className="border-b border-[#eee7df] px-5 py-4">

                    <h2 className="text-base font-semibold">
                      Recent Agent Activity
                    </h2>

                    <p className="mt-1 text-xs text-neutral-500">
                      Recent actions performed by Raze agents.
                    </p>

                  </div>

                  {activity.length === 0 ? (
                    <AgentEmptyState />
                  ) : (
                    <div className="divide-y divide-[#f0ebe5]">

                      {activity.map(
                        (item) => (
                          <AgentActivityRow
                            key={item.id}
                            action={item}
                            currency={
                              dashboard
                                .merchant
                                .currency
                            }
                          />
                        )
                      )}

                    </div>
                  )}

                </div>
              </>
            )}

        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------- */
/* Summary                                            */
/* -------------------------------------------------- */

function AgentSummaryCard({
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
    <div className="rounded-2xl border border-[#e9e1d7] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.025)]">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5eadf]">
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

/* -------------------------------------------------- */
/* Agent type                                         */
/* -------------------------------------------------- */

function AgentTypeCard({
  title,
  description,
  count,
  icon: Icon,
}: {
  title: string;
  description: string;
  count: number | string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-[#eee7df] bg-[#fcfaf7] p-4">

      <div className="flex items-start justify-between gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
          <Icon className="h-4 w-4 text-[#a56b45]" />
        </div>

        <span className="text-lg font-semibold">
          {count}
        </span>

      </div>

      <h3 className="mt-4 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-neutral-500">
        {description}
      </p>

    </div>
  );
}

/* -------------------------------------------------- */
/* Activity row                                       */
/* -------------------------------------------------- */

function AgentActivityRow({
  action,
  currency,
}: {
  action: AgentAction;
  currency: string;
}) {
  return (
    <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex min-w-0 items-start gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f5eadf]">
          <Bot className="h-4 w-4 text-[#a56b45]" />
        </div>

        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-2">

            <p className="text-sm font-semibold">
              {formatAction(
                action.action
              )}
            </p>

            <StatusBadge
              status={action.status}
            />

          </div>

          <p className="mt-1 text-xs text-neutral-500">
            {action.reason ??
              "AI agent action"}
          </p>

          <p className="mt-1 text-[11px] text-neutral-400">
            {action.agentType} ·{" "}
            {formatDate(
              action.createdAt
            )}
          </p>

        </div>

      </div>

      {action.amount !== null &&
        action.amount !== undefined && (
          <p className="shrink-0 text-sm font-semibold">
            {formatMoney(
              action.amount,
              currency
            )}
          </p>
        )}

    </div>
  );
}

/* -------------------------------------------------- */
/* Status                                             */
/* -------------------------------------------------- */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized =
    status.toUpperCase();

  if (normalized === "COMPLETED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#eaf7ef] px-2 py-0.5 text-[10px] font-medium text-[#277044]">
        <CheckCircle2 className="h-3 w-3" />
        Completed
      </span>
    );
  }

  if (normalized === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#eef5ff] px-2 py-0.5 text-[10px] font-medium text-[#35649a]">
        Approved
      </span>
    );
  }

  if (normalized === "PROPOSED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#fff6df] px-2 py-0.5 text-[10px] font-medium text-[#8a6418]">
        <Clock3 className="h-3 w-3" />
        Pending
      </span>
    );
  }

  if (normalized === "FAILED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0ee] px-2 py-0.5 text-[10px] font-medium text-[#a23d32]">
        <XCircle className="h-3 w-3" />
        Failed
      </span>
    );
  }

  return (
    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
      {status}
    </span>
  );
}

/* -------------------------------------------------- */
/* Empty state                                        */
/* -------------------------------------------------- */

function AgentEmptyState() {
  return (
    <div className="flex min-h-[300px] items-center justify-center px-6">

      <div className="max-w-sm text-center">

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5eadf]">
          <Bot className="h-5 w-5 text-[#a56b45]" />
        </div>

        <h3 className="mt-4 text-base font-semibold">
          No agent activity yet
        </h3>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Agent actions will appear here as Raze starts working across your store.
        </p>

      </div>

    </div>
  );
}

/* -------------------------------------------------- */
/* Skeleton                                           */
/* -------------------------------------------------- */

function AgentsSkeleton() {
  return (
    <div className="mt-7 animate-pulse">

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-[120px] rounded-2xl bg-white"
            />
          )
        )}
      </div>

      <div className="mt-6 h-[240px] rounded-2xl bg-white" />

      <div className="mt-6 h-[420px] rounded-2xl bg-white" />

    </div>
  );
}

/* -------------------------------------------------- */
/* Helpers                                            */
/* -------------------------------------------------- */

function CreditCardIcon({
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
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />

      <path d="M3 10h18" />
      <path d="M7 15h3" />
    </svg>
  );
}

function formatAction(
  action: string
) {
  return action
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function formatMoney(
  amount: number,
  currency: string
) {
  try {
    return new Intl.NumberFormat(
      undefined,
      {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }
    ).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function formatDate(
  date: string
) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(new Date(date));
}