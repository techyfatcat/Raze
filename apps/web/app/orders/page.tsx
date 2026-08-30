"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronRight,
  Clock3,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  User,
  XCircle,
} from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const API_URL =
  process.env.NEXT_PUBLIC_RAZE_API_URL ??
  "http://localhost:5000";

const MERCHANT_ID =
  process.env.NEXT_PUBLIC_RAZE_MERCHANT_ID;

type OrderStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | string;

type Order = {
  id: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;

  customer?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;

  items: {
    id: string;
    quantity: number;
    price: number;

    product: {
      id: string;
      name: string;
    } | null;
  }[];
};

type Merchant = {
  id: string;
  name: string;
  slug?: string;
  currency: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [merchant, setMerchant] =
    useState<Merchant | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  async function loadOrders() {
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
        `${API_URL}/api/orders/${MERCHANT_ID}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message ??
            "Failed to load orders"
        );
      }

      setOrders(data.orders ?? []);
      setMerchant(data.merchant ?? null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        order.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const customerName =
        order.customer?.name ?? "";

      const customerEmail =
        order.customer?.email ?? "";

      const orderId =
        order.id.toLowerCase();

      return (
        orderId.includes(query) ||
        customerName
          .toLowerCase()
          .includes(query) ||
        customerEmail
          .toLowerCase()
          .includes(query)
      );
    });
  }, [
    orders,
    search,
    statusFilter,
  ]);

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#171717]">
      <DashboardSidebar
        merchant={merchant ?? undefined}
      />

      <main className="ml-[250px] min-h-screen">
        <DashboardHeader
          merchant={merchant ?? undefined}
          onRefresh={loadOrders}
        />

        <div className="px-7 pb-10">
          {/* Page heading */}
          <div className="mb-7 pt-1">

            <div className="mt-1 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  Orders
                </h1>

                <p className="mt-1 text-sm text-neutral-500">
                  View and manage orders from
                  your store.
                </p>
              </div>

              <button
                onClick={loadOrders}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-[#e9e1d7] bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-[#fcfaf7] disabled:cursor-not-allowed disabled:opacity-50"
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
          </div>

          {/* Error */}
          {error && !loading && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-start gap-3">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                <div>
                  <p className="font-semibold text-red-800">
                    Unable to load orders
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>

                  <button
                    onClick={loadOrders}
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <OrdersSkeleton />
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Stats */}
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatCard
                  icon={ShoppingBag}
                  label="Total Orders"
                  value={orders.length}
                />

                <StatCard
                  icon={Clock3}
                  label="Pending"
                  value={
                    orders.filter(
                      (order) =>
                        order.status ===
                        "PENDING"
                    ).length
                  }
                />

                <StatCard
                  icon={Package}
                  label="Paid"
                  value={
                    orders.filter(
                      (order) =>
                        order.status ===
                        "PAID"
                    ).length
                  }
                />
              </div>

              {/* Orders card */}
              <div className="overflow-hidden rounded-2xl border border-[#e9e1d7] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.025)]">
                {/* Toolbar */}
                <div className="border-b border-[#eee7df] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">
                        All Orders
                      </h2>

                      <p className="mt-1 text-sm text-neutral-500">
                        {filteredOrders.length}{" "}
                        {filteredOrders.length ===
                        1
                          ? "order"
                          : "orders"}{" "}
                        shown
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                        <input
                          value={search}
                          onChange={(event) =>
                            setSearch(
                              event.target.value
                            )
                          }
                          placeholder="Search orders..."
                          className="h-10 w-full rounded-xl border border-[#e5ddd4] bg-[#fcfaf7] pl-9 pr-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-[#c98a62] sm:w-[260px]"
                        />
                      </div>

                      {/* Filter */}
                      <select
                        value={statusFilter}
                        onChange={(event) =>
                          setStatusFilter(
                            event.target.value
                          )
                        }
                        className="h-10 rounded-xl border border-[#e5ddd4] bg-[#fcfaf7] px-3 text-sm text-neutral-700 outline-none focus:border-[#c98a62]"
                      >
                        <option value="ALL">
                          All statuses
                        </option>

                        <option value="PENDING">
                          Pending
                        </option>

                        <option value="PAID">
                          Paid
                        </option>

                        <option value="FAILED">
                          Failed
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Empty */}
                {filteredOrders.length === 0 && (
                  <OrdersEmptyState
                    hasFilters={
                      search.length > 0 ||
                      statusFilter !== "ALL"
                    }
                    clearFilters={() => {
                      setSearch("");
                      setStatusFilter(
                        "ALL"
                      );
                    }}
                  />
                )}

                {/* Table */}
                {filteredOrders.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px]">
                      <thead>
                        <tr className="border-b border-[#eee7df] bg-[#fcfaf7] text-left">
                          <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                            Order
                          </th>

                          <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                            Customer
                          </th>

                          <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                            Items
                          </th>

                          <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                            Amount
                          </th>

                          <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                            Status
                          </th>

                          <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                            Date
                          </th>

                          <th className="px-5 py-3" />
                        </tr>
                      </thead>

                      <tbody>
                        {filteredOrders.map(
                          (order) => (
                            <OrderRow
                              key={order.id}
                              order={order}
                            />
                          )
                        )}
                      </tbody>
                    </table>
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

function StatCard({
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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7ede4]">
          <Icon className="h-5 w-5 text-[#b66d43]" />
        </div>

        <div>
          <p className="text-xs font-medium text-neutral-500">
            {label}
          </p>

          <p className="mt-1 text-2xl font-semibold">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function OrderRow({
  order,
}: {
  order: Order;
}) {
  const itemCount = order.items.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

  const customerName =
    order.customer?.name ||
    "Guest customer";

  const customerEmail =
    order.customer?.email ||
    "No email";

  const formatCurrency = (
    amount: number,
    currency: string
  ) => {
    try {
      return new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }
      ).format(amount);
    } catch {
      return `${currency} ${amount.toLocaleString(
        "en-IN"
      )}`;
    }
  };

  return (
    <tr className="border-b border-[#f0ebe5] transition last:border-0 hover:bg-[#fcfaf7]">
      {/* Order */}
      <td className="px-5 py-4">
        <div>
          <p className="font-medium text-[#171717]">
            #{order.id.slice(0, 8)}
          </p>

          <p className="mt-1 text-xs text-neutral-400">
            {order.items.length}{" "}
            {order.items.length === 1
              ? "product"
              : "products"}
          </p>
        </div>
      </td>

      {/* Customer */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5eadf]">
            <User className="h-4 w-4 text-[#a56b45]" />
          </div>

          <div>
            <p className="text-sm font-medium">
              {customerName}
            </p>

            <p className="mt-0.5 max-w-[180px] truncate text-xs text-neutral-400">
              {customerEmail}
            </p>
          </div>
        </div>
      </td>

      {/* Items */}
      <td className="px-5 py-4">
        <div>
          <p className="text-sm text-neutral-700">
            {itemCount}{" "}
            {itemCount === 1
              ? "item"
              : "items"}
          </p>

          <p className="mt-1 max-w-[180px] truncate text-xs text-neutral-400">
            {order.items
              .map(
                (item) =>
                  item.product?.name ??
                  "Product"
              )
              .join(", ")}
          </p>
        </div>
      </td>

      {/* Amount */}
      <td className="px-5 py-4">
        <p className="text-sm font-semibold">
          {formatCurrency(
            Number(order.amount),
            order.currency
          )}
        </p>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <StatusBadge
          status={order.status}
        />
      </td>

      {/* Date */}
      <td className="px-5 py-4">
        <p className="text-sm text-neutral-600">
          {new Date(
            order.createdAt
          ).toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          )}
        </p>

        <p className="mt-1 text-xs text-neutral-400">
          {new Date(
            order.createdAt
          ).toLocaleTimeString(
            "en-IN",
            {
              hour: "numeric",
              minute: "2-digit",
            }
          )}
        </p>
      </td>

      {/* Action */}
      <td className="px-5 py-4">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-[#f5eadf] hover:text-[#a56b45]">
          <ChevronRight className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const config: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {
    PAID: {
      label: "Paid",
      className:
        "bg-[#edf6ee] text-[#4f7f53]",
    },

    PENDING: {
      label: "Pending",
      className:
        "bg-[#fff7e8] text-[#a16f21]",
    },

    FAILED: {
      label: "Failed",
      className:
        "bg-[#fff0f0] text-[#b84a4a]",
    },
  };

  const current =
    config[status] ?? {
      label: status,
      className:
        "bg-neutral-100 text-neutral-600",
    };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${current.className}`}
    >
      {current.label}
    </span>
  );
}

function OrdersEmptyState({
  hasFilters,
  clearFilters,
}: {
  hasFilters: boolean;
  clearFilters: () => void;
}) {
  return (
    <div className="px-6 py-16">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7ede4]">
          {hasFilters ? (
            <Search className="h-6 w-6 text-[#b66d43]" />
          ) : (
            <ShoppingBag className="h-6 w-6 text-[#b66d43]" />
          )}
        </div>

        <h3 className="mt-4 text-base font-semibold">
          {hasFilters
            ? "No matching orders"
            : "No orders yet"}
        </h3>

        <p className="mt-1.5 text-sm leading-6 text-neutral-500">
          {hasFilters
            ? "Try changing your search or status filter."
            : "Orders will appear here once customers start purchasing from your store."}
        </p>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="mt-4 rounded-lg bg-[#171717] px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({
          length: 3,
        }).map((_, index) => (
          <div
            key={index}
            className="h-[90px] rounded-2xl bg-white"
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e9e1d7] bg-white">
        <div className="h-20 border-b border-[#eee7df] bg-[#fcfaf7]" />

        <div className="space-y-0">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-[76px] border-b border-[#f0ebe5]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}