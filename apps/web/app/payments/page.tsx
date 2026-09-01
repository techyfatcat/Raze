"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  RefreshCw,
  XCircle,
} from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const API_URL =
  process.env.NEXT_PUBLIC_RAZE_API_URL ??
  "http://localhost:5000";

const MERCHANT_ID =
  process.env.NEXT_PUBLIC_RAZE_MERCHANT_ID;

type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;

  order: {
    id: string;
    amount: number;
    currency: string;
    status: string;

    customer?: {
      name?: string | null;
      email?: string | null;
    } | null;
  };
};

export default function PaymentsPage() {
  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadPayments = useCallback(async () => {
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
        `${API_URL}/api/payments/merchant/${MERCHANT_ID}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message ??
            "Failed to load payments"
        );
      }

      setPayments(data.payments ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load payments"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const summary = useMemo(() => {
    return {
      total: payments.length,

      successful: payments.filter(
        (payment) =>
          payment.status === "SUCCESS" ||
          payment.status === "PAID" ||
          payment.status === "CAPTURED"
      ).length,

      pending: payments.filter(
        (payment) =>
          payment.status === "CREATED" ||
          payment.status === "PENDING"
      ).length,

      failed: payments.filter(
        (payment) =>
          payment.status === "FAILED"
      ).length,
    };
  }, [payments]);

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#171717]">
      <DashboardSidebar />

      <main className="ml-[250px] min-h-screen">
        <DashboardHeader
          onRefresh={loadPayments}
        />

        <div className="px-7 py-7">

          {/* Header */}

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>


              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Payments
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Track payment activity across your store.
              </p>
            </div>

            <button
              onClick={loadPayments}
              disabled={loading}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e5ddd4] bg-white px-4 text-sm font-medium text-neutral-600 transition hover:bg-[#fcfaf7] hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />

              Refresh
            </button>
          </div>

          {/* Summary */}

          {!loading && !error && (
            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                icon={CreditCard}
                label="Total Payments"
                value={summary.total}
              />

              <SummaryCard
                icon={CheckCircle2}
                label="Successful"
                value={summary.successful}
              />

              <SummaryCard
                icon={Clock3}
                label="Pending"
                value={summary.pending}
              />

              <SummaryCard
                icon={XCircle}
                label="Failed"
                value={summary.failed}
              />
            </div>
          )}

          {/* Error */}

          {error && !loading && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-start gap-3">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                <div>
                  <p className="font-semibold text-red-800">
                    Unable to load payments
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                </div>
              </div>

              <button
                onClick={loadPayments}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading */}

          {loading && (
            <PaymentsSkeleton />
          )}

          {/* Empty */}

          {!loading &&
            !error &&
            payments.length === 0 && (
              <EmptyPayments />
            )}

          {/* Table */}

          {!loading &&
            !error &&
            payments.length > 0 && (
              <PaymentsTable
                payments={payments}
              />
            )}

        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------- */
/* Summary card                                       */
/* -------------------------------------------------- */

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
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
    </div>
  );
}

/* -------------------------------------------------- */
/* Payments table                                     */
/* -------------------------------------------------- */

function PaymentsTable({
  payments,
}: {
  payments: Payment[];
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[#e9e1d7] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.025)]">

      <div className="border-b border-[#eee7df] px-5 py-4">
        <h2 className="text-base font-semibold">
          Payment Activity
        </h2>

        <p className="mt-1 text-xs text-neutral-500">
          Recent payment transactions from your store.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">

          <thead>
            <tr className="border-b border-[#eee7df] bg-[#fcfaf7] text-left">

              <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                Payment
              </th>

              <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                Customer
              </th>

              <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                Order
              </th>

              <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                Amount
              </th>

              <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                Status
              </th>

              <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                Date
              </th>

            </tr>
          </thead>

          <tbody>

            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-[#f0ebe5] last:border-0 hover:bg-[#fcfaf7]"
              >

                <td className="px-5 py-4">
                  <p className="max-w-[180px] truncate text-sm font-medium">
                    {payment.id}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-medium">
                    {payment.order.customer?.name ??
                      "Guest customer"}
                  </p>

                  <p className="mt-0.5 text-xs text-neutral-400">
                    {payment.order.customer?.email ??
                      "—"}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="max-w-[150px] truncate font-mono text-xs text-neutral-500">
                    {payment.order.id}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-semibold">
                    {formatMoney(
                      payment.amount,
                      payment.currency
                    )}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <PaymentStatus
                    status={payment.status}
                  />
                </td>

                <td className="px-5 py-4 text-sm text-neutral-500">
                  {formatDate(
                    payment.createdAt
                  )}
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* Status                                             */
/* -------------------------------------------------- */

function PaymentStatus({
  status,
}: {
  status: string;
}) {
  const normalized =
    status.toUpperCase();

  const successful =
    normalized === "SUCCESS" ||
    normalized === "PAID" ||
    normalized === "CAPTURED";

  const pending =
    normalized === "CREATED" ||
    normalized === "PENDING";

  if (successful) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf7ef] px-2.5 py-1 text-xs font-medium text-[#277044]">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {status}
      </span>
    );
  }

  if (pending) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff6df] px-2.5 py-1 text-xs font-medium text-[#8a6418]">
        <Clock3 className="h-3.5 w-3.5" />
        {status}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff0ee] px-2.5 py-1 text-xs font-medium text-[#a23d32]">
      <XCircle className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

/* -------------------------------------------------- */
/* Empty state                                        */
/* -------------------------------------------------- */

function EmptyPayments() {
  return (
    <div className="mt-6 flex min-h-[360px] items-center justify-center rounded-2xl border border-[#e9e1d7] bg-white">

      <div className="max-w-sm px-6 text-center">

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5eadf]">
          <CreditCard className="h-5 w-5 text-[#a56b45]" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">
          No payments yet
        </h2>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Payments will appear here once customers
          complete purchases from your store.
        </p>

      </div>

    </div>
  );
}

/* -------------------------------------------------- */
/* Loading                                            */
/* -------------------------------------------------- */

function PaymentsSkeleton() {
  return (
    <div className="mt-7 animate-pulse">

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-[104px] rounded-2xl bg-white"
            />
          )
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white">

        <div className="h-14 border-b border-[#eee7df]" />

        <div className="space-y-4 p-5">
          {Array.from({ length: 7 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-12 rounded-xl bg-neutral-100"
              />
            )
          )}
        </div>

      </div>

    </div>
  );
}

/* -------------------------------------------------- */
/* Helpers                                            */
/* -------------------------------------------------- */

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