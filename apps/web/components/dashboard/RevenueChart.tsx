"use client";

import {
  ArrowUpRight,
  CalendarDays,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

type RevenuePoint = {
  date: string;
  revenue: number;
  orders: number;
};

type RevenueChartProps = {
  data: RevenuePoint[];
  currency?: string;
};

export default function RevenueChart({
  data,
  currency = "INR",
}: RevenueChartProps) {
  const totalRevenue = data.reduce(
    (sum, item) => sum + Number(item.revenue || 0),
    0
  );

  const totalOrders = data.reduce(
    (sum, item) => sum + Number(item.orders || 0),
    0
  );

  const hasRevenue = totalRevenue > 0;

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${currency} ${amount.toLocaleString("en-IN")}`;
    }
  };

  return (
    <section className="rounded-2xl border border-[#e9e1d7] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.025)]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7ede4]">
              <IndianRupee className="h-5 w-5 text-[#b66d43]" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#171717]">
                Revenue
              </h2>

              <p className="mt-0.5 text-sm text-neutral-500">
                Revenue from paid orders
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#e9e1d7] bg-[#fcfaf7] px-3 py-2 text-xs font-medium text-neutral-600">
          <CalendarDays className="h-3.5 w-3.5" />
          Last 7 days
        </div>
      </div>

      {/* Content */}
      {hasRevenue ? (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#eee7df] bg-[#fcfaf7] p-4">
              <p className="text-xs font-medium text-neutral-500">
                Revenue
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
                {formatCurrency(totalRevenue)}
              </p>

              <div className="mt-2 flex items-center gap-1 text-xs text-[#5f8f62]">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>From paid orders</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#eee7df] bg-[#fcfaf7] p-4">
              <p className="text-xs font-medium text-neutral-500">
                Paid Orders
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
                {totalOrders}
              </p>

              <div className="mt-2 flex items-center gap-1 text-xs text-neutral-500">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Last 7 days</span>
              </div>
            </div>
          </div>

          {/* Daily breakdown */}
          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium text-neutral-500">
                Daily revenue
              </p>

              <p className="text-xs text-neutral-400">
                Last 7 days
              </p>
            </div>

            <div className="space-y-2">
              {data.map((item) => (
                <div
                  key={item.date}
                  className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-[#fcfaf7]"
                >
                  <span className="text-sm text-neutral-600">
                    {new Date(
                      `${item.date}T00:00:00`
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-neutral-400">
                      {item.orders}{" "}
                      {item.orders === 1 ? "order" : "orders"}
                    </span>

                    <span className="min-w-[90px] text-right text-sm font-medium text-[#171717]">
                      {formatCurrency(
                        Number(item.revenue || 0)
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="mt-5 rounded-xl border border-dashed border-[#e5ddd4] bg-[#fcfaf7] px-6 py-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
              <IndianRupee className="h-5 w-5 text-[#b66d43]" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-[#171717]">
              No revenue yet
            </h3>

            <p className="mt-1.5 max-w-md text-sm leading-6 text-neutral-500">
              Revenue will appear here once your store
              receives its first successful payment.
            </p>

            <div className="mt-4 rounded-lg bg-white px-3.5 py-2 text-xs font-medium text-neutral-500 shadow-sm">
              {totalOrders} paid orders in the last 7 days
            </div>
          </div>
        </div>
      )}
    </section>
  );
}