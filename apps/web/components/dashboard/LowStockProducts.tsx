"use client";

import {
  AlertTriangle,
  Package,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  inventory: number;
  category?: string | null;
};

type LowStockProductsProps = {
  products: Product[];
  currency: string;
};

export default function LowStockProducts({
  products,
  currency,
}: LowStockProductsProps) {
  function formatPrice(amount: number) {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(2)}`;
    }
  }

  return (
    <div className="rounded-2xl border border-[#e9e1d7] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.025)]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff4e8]">
              <AlertTriangle className="h-4 w-4 text-[#b66d43]" />
            </div>

            <h2 className="text-lg font-semibold">
              Low Stock
            </h2>
          </div>

          <p className="mt-2 text-sm text-neutral-500">
            Products that need inventory attention.
          </p>
        </div>

        <div className="rounded-xl bg-[#f8f5f0] px-3 py-2 text-xs font-medium text-[#8b5638]">
          {products.length} items
        </div>
      </div>

      {/* Products */}
      <div className="mt-5">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e9e1d7] bg-[#fcfaf7] px-4 py-10 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
              <Package className="h-5 w-5 text-neutral-400" />
            </div>

            <p className="mt-3 text-sm font-medium text-neutral-700">
              Inventory looks good
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              No products are currently low on stock.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => {
              const isCritical =
                product.inventory <= 2;

              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-[#eee7df] bg-[#fcfaf7] p-3"
                >
                  {/* Product information */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                      <Package className="h-4 w-4 text-[#a56b45]" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-800">
                        {product.name}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        {product.category && (
                          <>
                            <span className="truncate text-xs text-neutral-400">
                              {product.category}
                            </span>

                            <span className="text-neutral-300">
                              •
                            </span>
                          </>
                        )}

                        <span className="text-xs text-neutral-500">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Inventory */}
                  <div className="ml-3 shrink-0 text-right">
                    <p
                      className={`text-sm font-semibold ${
                        isCritical
                          ? "text-red-600"
                          : "text-[#a56b45]"
                      }`}
                    >
                      {product.inventory}
                    </p>

                    <p className="text-[11px] text-neutral-400">
                      left
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}