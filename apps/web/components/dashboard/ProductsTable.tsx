"use client";

import {
  Package,
  ShoppingBag,
} from "lucide-react";

import type { Product } from "@/app/products/page";

interface ProductsTableProps {
  products: Product[];
}

function formatPrice(
  price: number,
  currency = "INR"
) {
  try {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }
    ).format(price);
  } catch {
    return `₹${price.toLocaleString("en-IN")}`;
  }
}

function getInventoryStatus(
  inventory: number
) {
  if (inventory === 0) {
    return {
      label: "Out of stock",
      className:
        "bg-red-50 text-red-700",
    };
  }

  if (inventory <= 5) {
    return {
      label: "Low stock",
      className:
        "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "In stock",
    className:
      "bg-emerald-50 text-emerald-700",
  };
}

export default function ProductsTable({
  products,
}: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e9e1d7] bg-white px-6 py-16 text-center shadow-[0_2px_12px_rgba(0,0,0,0.025)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5eadf]">
          <ShoppingBag className="h-5 w-5 text-[#a56b45]" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">
          No products yet
        </h2>

        <p className="mx-auto mt-1 max-w-sm text-sm text-neutral-500">
          Your catalog is empty. Add your first
          product to start selling through Raze.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e9e1d7] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.025)]">
      {/* Table header */}
      <div className="flex items-center justify-between border-b border-[#eee7df] px-5 py-4">
        <div>
          <h2 className="text-base font-semibold">
            Product Catalog
          </h2>

          <p className="mt-0.5 text-xs text-neutral-500">
            {products.length}{" "}
            {products.length === 1
              ? "product"
              : "products"}{" "}
            in your catalog
          </p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#eee7df] bg-[#fcfaf7] text-left">
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Product
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Category
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Price
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Inventory
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Status
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Created
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map(
              (product) => {
                const inventoryStatus =
                  getInventoryStatus(
                    product.inventory
                  );

                return (
                  <tr
                    key={product.id}
                    className="border-b border-[#f1ebe4] last:border-b-0 hover:bg-[#fcfaf7]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f8f5f0]">
                          <Package className="h-4 w-4 text-[#a56b45]" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-neutral-900">
                            {product.name}
                          </p>

                          {product.description && (
                            <p className="mt-0.5 max-w-[250px] truncate text-xs text-neutral-400">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-neutral-600">
                        {product.category ??
                          "Uncategorized"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-neutral-900">
                        {formatPrice(
                          product.price
                        )}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-neutral-700">
                        {product.inventory}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${inventoryStatus.className}`}
                      >
                        {
                          inventoryStatus.label
                        }
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-neutral-500">
                        {new Date(
                          product.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-[#eee7df] md:hidden">
        {products.map(
          (product) => {
            const inventoryStatus =
              getInventoryStatus(
                product.inventory
              );

            return (
              <div
                key={product.id}
                className="p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f8f5f0]">
                      <Package className="h-4 w-4 text-[#a56b45]" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {product.name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-neutral-400">
                        {product.category ??
                          "Uncategorized"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${inventoryStatus.className}`}
                  >
                    {
                      inventoryStatus.label
                    }
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-400">
                      Price
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {formatPrice(
                        product.price
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-400">
                      Inventory
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {product.inventory}
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}