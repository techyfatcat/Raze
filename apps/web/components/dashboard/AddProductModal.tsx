"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Loader2,
  X,
} from "lucide-react";

import type { Product } from "@/app/products/page";

const API_URL =
  process.env.NEXT_PUBLIC_RAZE_API_URL ??
  "http://localhost:5000";

const MERCHANT_ID =
  process.env.NEXT_PUBLIC_RAZE_MERCHANT_ID;

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (
    product: Product
  ) => void;
}

export default function AddProductModal({
  open,
  onClose,
  onCreated,
}: AddProductModalProps) {
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

  const [error, setError] =
    useState<string | null>(null);

  const [submitting, setSubmitting] =
    useState(false);

  if (!open) {
    return null;
  }

  function resetForm() {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setInventory("0");
    setError(null);
  }

  function handleClose() {
    if (submitting) {
      return;
    }

    resetForm();
    onClose();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!MERCHANT_ID) {
      setError(
        "NEXT_PUBLIC_RAZE_MERCHANT_ID is not configured."
      );
      return;
    }

    const parsedPrice =
      Number(price);

    const parsedInventory =
      Number(inventory);

    if (
      !name.trim() ||
      !price
    ) {
      setError(
        "Product name and price are required."
      );
      return;
    }

    if (
      !Number.isFinite(
        parsedPrice
      ) ||
      parsedPrice < 0
    ) {
      setError(
        "Please enter a valid price."
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
      setSubmitting(true);
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

      onCreated(
        data.product
      );

      resetForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create product"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-[#e9e1d7] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eee7df] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold">
              Add Product
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Add a product to your store catalog.
            </p>
          </div>

          <button
            onClick={handleClose}
            disabled={submitting}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-[#f8f5f0] hover:text-neutral-700 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-5"
        >
          <div className="space-y-4">
            <Field
              label="Product name"
              required
            >
              <input
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="e.g. Wireless Headphones"
                className="input"
                autoFocus
              />
            </Field>

            <Field label="Description">
              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Describe your product..."
                rows={3}
                className="input resize-none"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Price"
                required
              >
                <input
                  value={price}
                  onChange={(event) =>
                    setPrice(
                      event.target.value
                    )
                  }
                  placeholder="999"
                  type="number"
                  min="0"
                  step="0.01"
                  className="input"
                />
              </Field>

              <Field label="Inventory">
                <input
                  value={inventory}
                  onChange={(event) =>
                    setInventory(
                      event.target.value
                    )
                  }
                  type="number"
                  min="0"
                  step="1"
                  className="input"
                />
              </Field>
            </div>

            <Field label="Category">
              <input
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                placeholder="e.g. Electronics"
                className="input"
              />
            </Field>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="h-10 rounded-xl border border-[#e5ddd4] bg-white px-4 text-sm font-medium text-neutral-600 transition hover:bg-[#f8f5f0] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex h-10 items-center gap-2 rounded-xl bg-[#171717] px-5 text-sm font-medium text-white transition hover:bg-[#2d2d2d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {submitting
                ? "Adding..."
                : "Add Product"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e5ddd4;
          border-radius: 0.75rem;
          background: white;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 150ms ease,
            box-shadow 150ms ease;
        }

        .input::placeholder {
          color: #a3a3a3;
        }

        .input:focus {
          border-color: #a56b45;
          box-shadow: 0 0 0 3px
            rgba(165, 107, 69, 0.1);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}

        {required && (
          <span className="ml-1 text-[#a56b45]">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}