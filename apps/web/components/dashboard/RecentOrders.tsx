"use client";

import {
  ArrowUpRight,
  ClipboardList,
} from "lucide-react";

type OrderItem = {
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
  } | null;
};

type Order = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;

  customer?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;

  items?: OrderItem[];
};

type RecentOrdersProps = {
  orders: Order[];
};

export default function RecentOrders({
  orders,
}: RecentOrdersProps) {
  const safeOrders =
    Array.isArray(orders)
      ? orders
      : [];

  const formatMoney = (
    amount: number,
    currency: string
  ) => {
    try {
      return new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency:
            currency || "INR",
          maximumFractionDigits: 0,
        }
      ).format(Number(amount || 0));
    } catch {
      return `${currency || "INR"} ${Number(
        amount || 0
      ).toLocaleString("en-IN")}`;
    }
  };

  const formatDate = (
    date: string
  ) => {
    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "—";
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClasses = (
    status: string
  ) => {
    switch (
      status.toUpperCase()
    ) {
      case "PAID":
        return "bg-green-50 text-green-700 border-green-100";

      case "FAILED":
        return "bg-red-50 text-red-700 border-red-100";

      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-100";

      case "CANCELLED":
        return "bg-neutral-100 text-neutral-600 border-neutral-200";

      default:
        return "bg-blue-50 text-blue-700 border-blue-100";
    }
  };

  const getCustomerName = (
    order: Order
  ) => {
    if (
      order.customer?.name
    ) {
      return order.customer.name;
    }

    if (
      order.customer?.email
    ) {
      return order.customer.email;
    }

    return "Guest customer";
  };

  const getItemsSummary = (
    order: Order
  ) => {
    if (
      !order.items ||
      order.items.length === 0
    ) {
      return "No items";
    }

    const first =
      order.items[0];

    const name =
      first.product?.name ??
      "Product";

    const additional =
      order.items.length - 1;

    if (additional > 0) {
      return `${name} + ${additional} more`;
    }

    return `${name} × ${first.quantity}`;
  };

  return (
    <section className="rounded-2xl border border-[#e9e1d7] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.025)]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5eadf]">
              <ClipboardList className="h-4 w-4 text-[#b66d43]" />
            </div>

            <h2 className="text-lg font-semibold">
              Recent Orders
            </h2>
          </div>

          <p className="mt-2 text-sm text-neutral-500">
            Latest orders from your store
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-[#a56b45] transition hover:bg-[#fcf6f0]"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Empty state */}
      {safeOrders.length === 0 ? (
        <div className="mt-6 flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-dashed border-[#e9e1d7] bg-[#fcfaf7]">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
            <ClipboardList className="h-5 w-5 text-[#b66d43]" />
          </div>

          <p className="mt-3 text-sm font-medium">
            No orders yet
          </p>

          <p className="mt-1 max-w-xs text-center text-xs text-neutral-500">
            Orders will appear here as
            customers purchase products
            from your store.
          </p>
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-[#eee7df] text-left">
                <th className="pb-3 pr-4 text-xs font-medium text-neutral-400">
                  Order
                </th>

                <th className="pb-3 pr-4 text-xs font-medium text-neutral-400">
                  Customer
                </th>

                <th className="pb-3 pr-4 text-xs font-medium text-neutral-400">
                  Items
                </th>

                <th className="pb-3 pr-4 text-xs font-medium text-neutral-400">
                  Amount
                </th>

                <th className="pb-3 pr-4 text-xs font-medium text-neutral-400">
                  Status
                </th>

                <th className="pb-3 text-xs font-medium text-neutral-400">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {safeOrders.map(
                order => (
                  <tr
                    key={order.id}
                    className="border-b border-[#f0ebe5] last:border-0"
                  >
                    {/* Order */}
                    <td className="py-4 pr-4">
                      <p className="font-medium">
                        #
                        {order.id.slice(
                          -8
                        )}
                      </p>

                      <p className="mt-0.5 text-[11px] text-neutral-400">
                        {order.id}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="py-4 pr-4">
                      <p className="max-w-[150px] truncate text-sm font-medium">
                        {getCustomerName(
                          order
                        )}
                      </p>

                      {order.customer
                        ?.email && (
                        <p className="mt-0.5 max-w-[150px] truncate text-xs text-neutral-400">
                          {
                            order
                              .customer
                              .email
                          }
                        </p>
                      )}
                    </td>

                    {/* Items */}
                    <td className="py-4 pr-4">
                      <p className="max-w-[180px] truncate text-sm text-neutral-600">
                        {getItemsSummary(
                          order
                        )}
                      </p>

                      {order.items &&
                        order.items.length >
                          0 && (
                          <p className="mt-0.5 text-xs text-neutral-400">
                            {
                              order
                                .items
                                .length
                            }{" "}
                            product
                            {order
                              .items
                              .length !==
                            1
                              ? "s"
                              : ""}
                          </p>
                        )}
                    </td>

                    {/* Amount */}
                    <td className="py-4 pr-4">
                      <p className="whitespace-nowrap text-sm font-semibold">
                        {formatMoney(
                          order.amount,
                          order.currency
                        )}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 text-xs text-neutral-500">
                      {formatDate(
                        order.createdAt
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}