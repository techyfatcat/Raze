"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Package,
  Plus,
  RefreshCw,
  XCircle,
} from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProductsTable from "@/components/dashboard/ProductsTable";
import AddProductModal from "@/components/dashboard/AddProductModal";

const API_URL =
  process.env.NEXT_PUBLIC_RAZE_API_URL ??
  "http://localhost:5000";

const MERCHANT_ID =
  process.env.NEXT_PUBLIC_RAZE_MERCHANT_ID;

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category?: string | null;
  inventory: number;
  isActive: boolean;
  createdAt: string;
  attributes?: Record<string, unknown> | null;
};

type Merchant = {
  id: string;
  name: string;
  slug: string;
  currency: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [merchant, setMerchant] =
    useState<Merchant | undefined>(undefined);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const loadProducts = useCallback(async () => {
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
        `${API_URL}/api/merchants/${MERCHANT_ID}/products`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message ??
            "Failed to load products"
        );
      }

      setProducts(data.products ?? []);

      /*
       * The products endpoint currently does not
       * return merchant information.
       *
       * Keep the header working even without it.
       */
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function handleProductCreated(
    product: Product
  ) {
    setProducts((prev) => [
      product,
      ...prev,
    ]);

    setShowAddModal(false);
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#171717]">

      {/* Shared merchant sidebar */}
      <DashboardSidebar
        merchant={merchant}
      />

      {/* Main dashboard area */}
      <main className="ml-[250px] min-h-screen">

        {/* Shared dashboard header */}
        <DashboardHeader
          merchant={merchant}
          onRefresh={loadProducts}
        />

        <div className="px-7 pb-10 pt-7">

          {/* Page Header */}
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Products
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Manage your store catalog and inventory.
              </p>
            </div>

            <div className="flex items-center gap-2">

              <button
                onClick={loadProducts}
                disabled={loading}
                className="flex h-10 items-center gap-2 rounded-xl border border-[#e5ddd4] bg-white px-3 text-sm font-medium text-neutral-600 transition hover:bg-[#fcfaf7] hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
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

              <button
                onClick={() =>
                  setShowAddModal(true)
                }
                className="flex h-10 items-center gap-2 rounded-xl bg-[#171717] px-4 text-sm font-medium text-white transition hover:bg-[#2d2d2d]"
              >
                <Plus className="h-4 w-4" />

                Add Product
              </button>

            </div>
          </div>

          {/* Summary */}
          {!loading && !error && (
            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">

              <SummaryCard
                icon={Package}
                label="Total Products"
                value={products.length}
              />

              <SummaryCard
                icon={Package}
                label="Active Products"
                value={
                  products.filter(
                    (product) =>
                      product.isActive
                  ).length
                }
              />

              <SummaryCard
                icon={AlertCircle}
                label="Low Stock"
                value={
                  products.filter(
                    (product) =>
                      product.isActive &&
                      product.inventory <= 5
                  ).length
                }
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
                    Unable to load products
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                </div>

              </div>

              <button
                onClick={loadProducts}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Try again
              </button>

            </div>
          )}

          {/* Loading */}
          {loading && (
            <ProductsSkeleton />
          )}

          {/* Products */}
          {!loading && !error && (
            <div className="mt-6">
              <ProductsTable
                products={products}
              />
            </div>
          )}

        </div>
      </main>

      {/* Add Product Modal */}
      <AddProductModal
        open={showAddModal}
        onClose={() =>
          setShowAddModal(false)
        }
        onCreated={handleProductCreated}
      />

    </div>
  );
}

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

function ProductsSkeleton() {
  return (
    <div className="mt-6 animate-pulse rounded-2xl border border-[#e9e1d7] bg-white">

      <div className="border-b border-[#eee7df] p-5">
        <div className="h-5 w-32 rounded bg-neutral-200" />

        <div className="mt-2 h-4 w-52 rounded bg-neutral-100" />
      </div>

      <div className="space-y-4 p-5">

        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-12 rounded-xl bg-neutral-100"
            />
          )
        )}

      </div>

    </div>
  );
}