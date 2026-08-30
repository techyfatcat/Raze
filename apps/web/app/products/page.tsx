"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Package,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

type Merchant = {
  id: string;
  name: string;
  slug?: string;
  currency: string;
};

type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category?: string | null;
  inventory: number;
  isActive: boolean;
  createdAt?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_RAZE_API_URL ??
  "http://localhost:5000";

const MERCHANT_ID =
  process.env.NEXT_PUBLIC_RAZE_MERCHANT_ID;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [merchant, setMerchant] =
    useState<Merchant | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("ALL");

  const [showCreate, setShowCreate] =
    useState(false);

  async function loadProducts() {
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

      const [
        productsResponse,
        merchantResponse,
      ] = await Promise.all([
        fetch(
          `${API_URL}/api/merchants/${MERCHANT_ID}/products`,
          {
            cache: "no-store",
          }
        ),

        fetch(
          `${API_URL}/api/dashboard/${MERCHANT_ID}`,
          {
            cache: "no-store",
          }
        ),
      ]);

      const productsData =
        await productsResponse.json();

      const merchantData =
        await merchantResponse.json();

      if (
        !productsResponse.ok ||
        !productsData.success
      ) {
        throw new Error(
          productsData?.message ??
            "Failed to load products"
        );
      }

      if (
        merchantResponse.ok &&
        merchantData.success
      ) {
        setMerchant(
          merchantData.dashboard.merchant
        );
      }

      setProducts(
        productsData.products ?? []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category)
      .filter(
        (value): value is string =>
          Boolean(value)
      );

    return [
      "ALL",
      ...Array.from(new Set(values)),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name
          .toLowerCase()
          .includes(query) ||
        product.description
          ?.toLowerCase()
          .includes(query) ||
        product.category
          ?.toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "ALL" ||
        product.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    products,
    search,
    category,
  ]);

  const activeCount =
    products.filter(
      (product) => product.isActive
    ).length;

  const lowStockCount =
    products.filter(
      (product) =>
        product.inventory <= 5
    ).length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency:
          merchant?.currency ?? "INR",
        maximumFractionDigits: 2,
      }
    ).format(price);
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#171717]">
      <DashboardSidebar
        merchant={
          merchant ?? undefined
        }
      />

      <main className="ml-[250px] min-h-screen">
        <DashboardHeader
          merchant={
            merchant ?? undefined
          }
          onRefresh={loadProducts}
        />

        <div className="px-7 pb-10">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>

              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Products
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Manage your store catalog and
                inventory.
              </p>
            </div>

            <button
              onClick={() =>
                setShowCreate(true)
              }
              className="flex items-center gap-2 rounded-xl bg-[#a56b45] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#925b3a]"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>

          {/* Summary */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <SummaryCard
              label="Total Products"
              value={products.length}
              icon={Package}
            />

            <SummaryCard
              label="Active Products"
              value={activeCount}
              icon={Package}
            />

            <SummaryCard
              label="Low Stock"
              value={lowStockCount}
              icon={AlertCircle}
              warning={lowStockCount > 0}
            />
          </div>

          {/* Toolbar */}
          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#e9e1d7] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.025)] md:flex-row">
            <div className="flex h-10 flex-1 items-center gap-2 rounded-xl border border-[#e5ddd4] bg-[#fcfaf7] px-3">
              <Search className="h-4 w-4 text-neutral-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search products..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />

              {search && (
                <button
                  onClick={() =>
                    setSearch("")
                  }
                  type="button"
                >
                  <X className="h-4 w-4 text-neutral-400 hover:text-neutral-700" />
                </button>
              )}
            </div>

            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              className="h-10 rounded-xl border border-[#e5ddd4] bg-[#fcfaf7] px-3 text-sm outline-none"
            >
              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item === "ALL"
                      ? "All categories"
                      : item}
                  </option>
                )
              )}
            </select>

            <button
              onClick={loadProducts}
              type="button"
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e5ddd4] bg-white px-4 text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {loading && (
            <ProductsSkeleton />
          )}

          {error && !loading && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500" />

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

          {!loading &&
            !error &&
            filteredProducts.length ===
              0 && (
              <EmptyProducts
                hasFilters={
                  Boolean(search) ||
                  category !== "ALL"
                }
                onClear={() => {
                  setSearch("");
                  setCategory("ALL");
                }}
                onCreate={() =>
                  setShowCreate(true)
                }
              />
            )}

          {!loading &&
            !error &&
            filteredProducts.length >
              0 && (
              <ProductsTable
                products={
                  filteredProducts
                }
                formatPrice={
                  formatPrice
                }
              />
            )}
        </div>
      </main>

      {showCreate && (
        <CreateProductModal
          currency={
            merchant?.currency ??
            "INR"
          }
          onClose={() =>
            setShowCreate(false)
          }
          onCreated={() => {
            setShowCreate(false);
            loadProducts();
          }}
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  warning,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  warning?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#e9e1d7] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.025)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            {label}
          </p>

          <p className="mt-1 text-2xl font-semibold">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            warning
              ? "bg-red-50"
              : "bg-[#f5eadf]"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${
              warning
                ? "text-red-500"
                : "text-[#a56b45]"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

function ProductsTable({
  products,
  formatPrice,
}: {
  products: Product[];
  formatPrice: (
    price: number
  ) => string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e9e1d7] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.025)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-[#eee7df] bg-[#fcfaf7] text-left">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Product
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Category
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Price
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Inventory
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map(
              (product) => (
                <tr
                  key={product.id}
                  className="border-b border-[#f0ebe5] last:border-0 hover:bg-[#fcfaf7]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5eadf]">
                        <Package className="h-4 w-4 text-[#a56b45]" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {product.name}
                        </p>

                        {product.description && (
                          <p className="mt-0.5 max-w-[300px] truncate text-xs text-neutral-500">
                            {
                              product.description
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {product.category ? (
                      <span className="rounded-lg bg-[#f8f5f0] px-2.5 py-1 text-xs font-medium text-neutral-600">
                        {
                          product.category
                        }
                      </span>
                    ) : (
                      <span className="text-sm text-neutral-400">
                        —
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium">
                    {formatPrice(
                      product.price
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <InventoryBadge
                      inventory={
                        product.inventory
                      }
                    />
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryBadge({
  inventory,
}: {
  inventory: number;
}) {
  if (inventory === 0) {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
        Out of stock
      </span>
    );
  }

  if (inventory <= 5) {
    return (
      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
        {inventory} left
      </span>
    );
  }

  return (
    <span className="text-sm font-medium text-neutral-700">
      {inventory}
    </span>
  );
}

function EmptyProducts({
  hasFilters,
  onClear,
  onCreate,
}: {
  hasFilters: boolean;
  onClear: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#ddd3c8] bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5eadf]">
        <Package className="h-6 w-6 text-[#a56b45]" />
      </div>

      <h2 className="mt-4 text-lg font-semibold">
        {hasFilters
          ? "No products found"
          : "Your catalog is empty"}
      </h2>

      <p className="mx-auto mt-1 max-w-md text-sm text-neutral-500">
        {hasFilters
          ? "Try changing your search or category filter."
          : "Add your first product to start building your store catalog."}
      </p>

      <div className="mt-5 flex justify-center gap-3">
        {hasFilters && (
          <button
            onClick={onClear}
            className="rounded-xl border border-[#e5ddd4] bg-white px-4 py-2 text-sm font-medium text-neutral-700"
          >
            Clear filters
          </button>
        )}

        {!hasFilters && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 rounded-xl bg-[#a56b45] px-4 py-2 text-sm font-medium text-white hover:bg-[#925b3a]"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        )}
      </div>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-[#e9e1d7] bg-white">
      <div className="h-14 border-b border-[#eee7df] bg-[#fcfaf7]" />

      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="flex h-[72px] items-center gap-6 border-b border-[#f0ebe5] px-6 last:border-0"
        >
          <div className="h-10 w-10 rounded-xl bg-neutral-200" />
          <div className="h-4 w-48 rounded bg-neutral-200" />
          <div className="h-4 w-24 rounded bg-neutral-200" />
          <div className="h-4 w-20 rounded bg-neutral-200" />
          <div className="h-6 w-20 rounded-full bg-neutral-200" />
        </div>
      ))}
    </div>
  );
}

function CreateProductModal({
  currency,
  onClose,
  onCreated,
}: {
  currency: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [inventory, setInventory] =
    useState("0");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!MERCHANT_ID) {
      setError(
        "Merchant ID is not configured."
      );
      return;
    }

    if (!name.trim()) {
      setError(
        "Product name is required."
      );
      return;
    }

    const parsedPrice =
      Number(price);

    const parsedInventory =
      Number(inventory);

    if (
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0
    ) {
      setError(
        "Enter a valid price."
      );
      return;
    }

    if (
      !Number.isInteger(
        parsedInventory
      ) ||
      parsedInventory < 0
    ) {
      setError(
        "Inventory must be a non-negative integer."
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response =
        await fetch(
          `${API_URL}/api/merchants/${MERCHANT_ID}/products`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name: name.trim(),
              description:
                description.trim() ||
                undefined,
              price: parsedPrice,
              category:
                category.trim() ||
                undefined,
              inventory:
                parsedInventory,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data?.message ??
            "Failed to create product"
        );
      }

      onCreated();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create product"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-[#e9e1d7] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#eee7df] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold">
              Add Product
            </h2>

            <p className="mt-0.5 text-sm text-neutral-500">
              Add a product to your catalog.
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#f8f5f0]"
          >
            <X className="h-4 w-4 text-neutral-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6"
        >
          <Field
            label="Product name"
            value={name}
            onChange={setName}
            placeholder="e.g. Wireless Headphones"
            required
          />

          <Field
            label="Description"
            value={description}
            onChange={setDescription}
            placeholder="Short product description"
            textarea
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label={`Price (${currency})`}
              value={price}
              onChange={setPrice}
              placeholder="999"
              type="number"
              required
            />

            <Field
              label="Inventory"
              value={inventory}
              onChange={setInventory}
              placeholder="10"
              type="number"
            />
          </div>

          <Field
            label="Category"
            value={category}
            onChange={setCategory}
            placeholder="e.g. Electronics"
          />

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#e5ddd4] bg-white px-4 py-2.5 text-sm font-medium text-neutral-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#a56b45] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#925b3a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Creating..."
                : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}
      </span>

      {textarea ? (
        <textarea
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none rounded-xl border border-[#e5ddd4] bg-[#fcfaf7] px-3 py-2.5 text-sm outline-none transition focus:border-[#b98563] focus:ring-2 focus:ring-[#b98563]/10"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          required={required}
          min={
            type === "number"
              ? "0"
              : undefined
          }
          step={
            type === "number"
              ? "0.01"
              : undefined
          }
          className="w-full rounded-xl border border-[#e5ddd4] bg-[#fcfaf7] px-3 py-2.5 text-sm outline-none transition focus:border-[#b98563] focus:ring-2 focus:ring-[#b98563]/10"
        />
      )}
    </label>
  );
}