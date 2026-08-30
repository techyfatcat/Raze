import {
  CreditCard,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

type Overview = {
  revenue: number;
  totalOrders: number;
  paidOrders: number;
  failedOrders: number;
  conversionRate: number;
  totalProducts: number;
  activeProducts: number;
  pendingAgentActions: number;
  completedAgentActions: number;
  totalCampaigns: number;
};

export default function OverviewCards({
  overview,
  currency,
}: {
  overview: Overview;
  currency: string;
}) {
  const cards = [
    {
      title: "Total Revenue",
      value: formatMoney(
        overview.revenue,
        currency
      ),
      subtitle: "From paid orders",
      icon: CreditCard,
    },
    {
      title: "Orders",
      value: overview.totalOrders.toLocaleString(),
      subtitle: `${overview.paidOrders} paid`,
      icon: ShoppingCart,
    },
    {
      title: "Conversion Rate",
      value: `${overview.conversionRate}%`,
      subtitle: "Paid / total orders",
      icon: TrendingUp,
    },
    {
      title: "Products",
      value: overview.totalProducts.toLocaleString(),
      subtitle: `${overview.activeProducts} active`,
      icon: Package,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-[#e9e1d7] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.025)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7eee7]">
                <Icon className="h-5 w-5 text-[#ad6945]" />
              </div>
            </div>

            <p className="mt-4 text-sm text-neutral-500">
              {card.title}
            </p>

            <p className="mt-1 text-2xl font-semibold tracking-tight">
              {card.value}
            </p>

            <p className="mt-1 text-xs text-neutral-400">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function formatMoney(
  amount: number,
  currency: string
) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}