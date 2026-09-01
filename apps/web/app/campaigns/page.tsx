"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Bot,
  Megaphone,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Target,
  Trash2,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_RAZE_API_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

const MERCHANT_ID =
  process.env.NEXT_PUBLIC_RAZE_MERCHANT_ID;

type CampaignStatus =
  | "DRAFT"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED";

type CampaignTarget = {
  type:
    | "PRODUCT"
    | "SLOW_MOVING"
    | "CUSTOM";
  productId?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  days?: number;
  instruction?: string;
};

type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category?: string | null;
  inventory: number;
  isActive: boolean;
};

type Campaign = {
  id: string;
  merchantId: string;
  name: string;
  description?: string | null;
  target: CampaignTarget;
  status: CampaignStatus | string;
  expectedRevenue?: number | null;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  name: string;
  description: string;
  targetType:
    | "PRODUCT"
    | "SLOW_MOVING"
    | "CUSTOM";
  productId: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  days: string;
  instruction: string;
  expectedRevenue: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  targetType: "PRODUCT",
  productId: "",
  priority: "MEDIUM",
  days: "30",
  instruction: "",
  expectedRevenue: "",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<
    Campaign[]
  >([]);

  const [products, setProducts] = useState<
    Product[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] =
    useState(false);

  const [editingCampaign, setEditingCampaign] =
    useState<Campaign | null>(null);

  const [form, setForm] =
    useState<FormState>(EMPTY_FORM);

  const [openMenu, setOpenMenu] =
    useState<string | null>(null);

  const merchantId = MERCHANT_ID;

  /*
   * --------------------------------------------------
   * LOAD CAMPAIGNS + PRODUCTS
   * --------------------------------------------------
   */

  const loadData = useCallback(async () => {
    if (!merchantId) {
      setError(
        "NEXT_PUBLIC_RAZE_MERCHANT_ID is not configured."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const campaignUrl =
        `${API_URL}/api/merchants/${encodeURIComponent(
          merchantId
        )}/campaigns`;

      const productUrl =
        `${API_URL}/api/merchants/${encodeURIComponent(
          merchantId
        )}/products`;

      const [
        campaignResponse,
        productResponse,
      ] = await Promise.all([
        fetch(campaignUrl, {
          cache: "no-store",
        }),

        fetch(productUrl, {
          cache: "no-store",
        }),
      ]);

      /*
       * Read text first so an Express HTML 404
       * does not cause:
       *
       * Unexpected token '<'
       */

      const campaignText =
        await campaignResponse.text();

      const productText =
        await productResponse.text();

      let campaignData: any = null;
      let productData: any = null;

      try {
        campaignData =
          campaignText
            ? JSON.parse(campaignText)
            : null;
      } catch {
        throw new Error(
          `Campaign API returned ${campaignResponse.status}: ${
            campaignText.slice(0, 150) ||
            "Invalid response"
          }`
        );
      }

      try {
        productData =
          productText
            ? JSON.parse(productText)
            : null;
      } catch {
        throw new Error(
          `Product API returned ${productResponse.status}: ${
            productText.slice(0, 150) ||
            "Invalid response"
          }`
        );
      }

      if (!campaignResponse.ok) {
        throw new Error(
          campaignData?.message ||
            `Failed to load campaigns (${campaignResponse.status})`
        );
      }

      if (!productResponse.ok) {
        throw new Error(
          productData?.message ||
            `Failed to load products (${productResponse.status})`
        );
      }

      const campaignList =
        Array.isArray(campaignData)
          ? campaignData
          : campaignData?.campaigns ??
            campaignData?.data ??
            [];

      const productList =
        Array.isArray(productData)
          ? productData
          : productData?.products ??
            productData?.data ??
            [];

      setCampaigns(campaignList);
      setProducts(productList);
    } catch (err) {
      console.error(
        "Campaign load error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load campaign data"
      );
    } finally {
      setLoading(false);
    }
  }, [merchantId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /*
   * --------------------------------------------------
   * SUMMARY
   * --------------------------------------------------
   */

  const summary = useMemo(() => {
    const active = campaigns.filter(
      (campaign) =>
        campaign.status === "ACTIVE"
    ).length;

    const paused = campaigns.filter(
      (campaign) =>
        campaign.status === "PAUSED"
    ).length;

    const expectedRevenue =
      campaigns.reduce(
        (total, campaign) =>
          total +
          (campaign.expectedRevenue ?? 0),
        0
      );

    return {
      total: campaigns.length,
      active,
      paused,
      expectedRevenue,
    };
  }, [campaigns]);

  /*
   * --------------------------------------------------
   * OPEN CREATE MODAL
   * --------------------------------------------------
   */

  function openCreateModal() {
    setEditingCampaign(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  /*
   * --------------------------------------------------
   * OPEN EDIT MODAL
   * --------------------------------------------------
   */

  function openEditModal(
    campaign: Campaign
  ) {
    const target =
      campaign.target ?? {
        type: "PRODUCT",
      };

    setEditingCampaign(campaign);

    setForm({
      name: campaign.name ?? "",
      description:
        campaign.description ?? "",
      targetType:
        target.type ?? "PRODUCT",
      productId:
        target.productId ?? "",
      priority:
        target.priority ?? "MEDIUM",
      days:
        target.days?.toString() ?? "30",
      instruction:
        target.instruction ?? "",
      expectedRevenue:
        campaign.expectedRevenue != null
          ? String(
              campaign.expectedRevenue
            )
          : "",
    });

    setShowModal(true);
    setOpenMenu(null);
  }

  /*
   * --------------------------------------------------
   * CREATE / UPDATE
   * --------------------------------------------------
   */

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!merchantId) {
      setError(
        "Merchant ID is not configured."
      );
      return;
    }

    if (!form.name.trim()) {
      setError(
        "Campaign name is required."
      );
      return;
    }

    if (
      form.targetType === "PRODUCT" &&
      !form.productId
    ) {
      setError(
        "Please select a product."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const target: CampaignTarget = {
        type: form.targetType,
        priority: form.priority,
      };

      if (form.targetType === "PRODUCT") {
        target.productId =
          form.productId;
      }

      if (
        form.targetType ===
        "SLOW_MOVING"
      ) {
        const days = Number(form.days);

        if (
          !Number.isInteger(days) ||
          days <= 0
        ) {
          throw new Error(
            "Days must be a positive integer."
          );
        }

        target.days = days;
      }

      if (
        form.targetType === "CUSTOM"
      ) {
        target.instruction =
          form.instruction.trim();

        if (!target.instruction) {
          throw new Error(
            "Please provide campaign instructions."
          );
        }
      }

      const payload = {
        merchantId,
        name: form.name.trim(),
        description:
          form.description.trim() ||
          undefined,
        target,
        expectedRevenue:
          form.expectedRevenue.trim()
            ? Number(
                form.expectedRevenue
              )
            : undefined,
      };

      const url = editingCampaign
        ? `${API_URL}/api/merchants/${encodeURIComponent(
            merchantId
          )}/campaigns/${editingCampaign.id}`
        : `${API_URL}/api/merchants/${encodeURIComponent(
            merchantId
          )}/campaigns`;

      const response = await fetch(url, {
        method: editingCampaign
          ? "PUT"
          : "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text =
        await response.text();

      let data: any = null;

      try {
        data = text
          ? JSON.parse(text)
          : null;
      } catch {
        throw new Error(
          `Campaign API returned ${response.status}: ${
            text.slice(0, 150) ||
            "Invalid response"
          }`
        );
      }

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Failed to save campaign"
        );
      }

      setShowModal(false);
      setEditingCampaign(null);
      setForm(EMPTY_FORM);

      await loadData();
    } catch (err) {
      console.error(
        "Save campaign error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save campaign"
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * --------------------------------------------------
   * UPDATE STATUS
   * --------------------------------------------------
   */

  async function updateStatus(
    campaign: Campaign,
    status: CampaignStatus
  ) {
    if (!merchantId) return;

    try {
      setOpenMenu(null);

      const response = await fetch(
        `${API_URL}/api/merchants/${encodeURIComponent(
          merchantId
        )}/campaigns/${campaign.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            merchantId,
            status,
          }),
        }
      );

      const text =
        await response.text();

      let data: any = null;

      try {
        data = text
          ? JSON.parse(text)
          : null;
      } catch {
        throw new Error(
          `Campaign API returned ${response.status}: ${
            text.slice(0, 150) ||
            "Invalid response"
          }`
        );
      }

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Failed to update campaign"
        );
      }

      await loadData();
    } catch (err) {
      console.error(
        "Update campaign status error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update campaign"
      );
    }
  }

  /*
   * --------------------------------------------------
   * DELETE
   * --------------------------------------------------
   */

  async function deleteCampaign(
    campaign: Campaign
  ) {
    if (!merchantId) return;

    const confirmed =
      window.confirm(
        `Delete "${campaign.name}"?`
      );

    if (!confirmed) return;

    try {
      setOpenMenu(null);

      const response = await fetch(
        `${API_URL}/api/merchants/${encodeURIComponent(
          merchantId
        )}/campaigns/${campaign.id}`,
        {
          method: "DELETE",
        }
      );

      const text =
        await response.text();

      let data: any = null;

      try {
        data = text
          ? JSON.parse(text)
          : null;
      } catch {
        throw new Error(
          `Campaign API returned ${response.status}: ${
            text.slice(0, 150) ||
            "Invalid response"
          }`
        );
      }

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Failed to delete campaign"
        );
      }

      await loadData();
    } catch (err) {
      console.error(
        "Delete campaign error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete campaign"
      );
    }
  }

  /*
   * --------------------------------------------------
   * TARGET LABEL
   * --------------------------------------------------
   */

  function getTargetLabel(
    campaign: Campaign
  ) {
    const target =
      campaign.target;

    if (!target) {
      return "General";
    }

    if (target.type === "PRODUCT") {
      const product =
        products.find(
          (item) =>
            item.id ===
            target.productId
        );

      return product?.name ??
        "Specific product";
    }

    if (
      target.type ===
      "SLOW_MOVING"
    ) {
      return `Slow-moving · ${
        target.days ?? 30
      } days`;
    }

    return "Custom AI instruction";
  }

  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#171717]">
      <main className="min-h-screen">
        <div className="px-7 py-7">
          {/* Header */}
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-[#a56b45]">
                Growth
              </p>

              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Campaigns
              </h1>

              <p className="mt-1 max-w-xl text-sm text-neutral-500">
                Tell Raze what products to
                promote and let the AI agent
                naturally surface them during
                customer conversations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
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
                onClick={
                  openCreateModal
                }
                className="flex h-10 items-center gap-2 rounded-xl bg-[#171717] px-4 text-sm font-medium text-white transition hover:bg-[#2d2d2d]"
              >
                <Plus className="h-4 w-4" />

                New Campaign
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

              <div className="min-w-0">
                <p className="font-semibold text-red-800">
                  Something went wrong
                </p>

                <p className="mt-1 break-words text-sm text-red-600">
                  {error}
                </p>
              </div>

              <button
                onClick={() =>
                  setError("")
                }
                className="ml-auto text-red-400 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Summary */}
          {!loading && (
            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                icon={Megaphone}
                label="Total Campaigns"
                value={summary.total}
              />

              <SummaryCard
                icon={Activity}
                label="Active"
                value={summary.active}
              />

              <SummaryCard
                icon={Pause}
                label="Paused"
                value={summary.paused}
              />

              <SummaryCard
                icon={TrendingUp}
                label="Expected Revenue"
                value={formatCurrency(
                  summary.expectedRevenue
                )}
              />
            </div>
          )}

          {/* AI explanation */}
          <div className="mt-6 rounded-2xl border border-[#e7d8ca] bg-[#f3e7dc] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
                <Bot className="h-4 w-4 text-[#a56b45]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#3b2920]">
                  Campaigns guide the AI,
                  not the customer
                </p>

                <p className="mt-1 max-w-3xl text-sm leading-6 text-[#755f51]">
                  Raze only promotes campaign
                  products when they make sense
                  for what the customer is asking
                  for. A campaign never forces an
                  irrelevant recommendation.
                </p>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <CampaignSkeleton />
          ) : campaigns.length === 0 ? (
            <EmptyState
              onCreate={openCreateModal}
            />
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#e9e1d7] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.025)]">
              <div className="border-b border-[#eee7df] px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">
                      Campaign activity
                    </h2>

                    <p className="mt-0.5 text-xs text-neutral-500">
                      Active campaigns are
                      automatically available to
                      the customer-facing AI agent.
                    </p>
                  </div>

                  <span className="rounded-full bg-[#f5eadf] px-3 py-1 text-xs font-medium text-[#8c5738]">
                    {summary.active} active
                  </span>
                </div>
              </div>

              <div className="divide-y divide-[#eee7df]">
                {campaigns.map(
                  (campaign) => (
                    <CampaignRow
                      key={campaign.id}
                      campaign={campaign}
                      targetLabel={getTargetLabel(
                        campaign
                      )}
                      menuOpen={
                        openMenu ===
                        campaign.id
                      }
                      onMenu={() =>
                        setOpenMenu(
                          openMenu ===
                            campaign.id
                            ? null
                            : campaign.id
                        )
                      }
                      onEdit={() =>
                        openEditModal(
                          campaign
                        )
                      }
                      onPause={() =>
                        updateStatus(
                          campaign,
                          "PAUSED"
                        )
                      }
                      onResume={() =>
                        updateStatus(
                          campaign,
                          "ACTIVE"
                        )
                      }
                      onComplete={() =>
                        updateStatus(
                          campaign,
                          "COMPLETED"
                        )
                      }
                      onDelete={() =>
                        deleteCampaign(
                          campaign
                        )
                      }
                    />
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <CampaignModal
          form={form}
          setForm={setForm}
          products={products}
          editing={!!editingCampaign}
          saving={saving}
          onClose={() => {
            if (!saving) {
              setShowModal(false);
              setEditingCampaign(null);
              setForm(EMPTY_FORM);
            }
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

/*
 * --------------------------------------------------
 * SUMMARY CARD
 * --------------------------------------------------
 */

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-[#e9e1d7] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.025)]">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5eadf]">
          <Icon className="h-4 w-4 text-[#a56b45]" />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-neutral-500">
            {label}
          </p>

          <p className="mt-0.5 truncate text-xl font-semibold">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/*
 * --------------------------------------------------
 * CAMPAIGN ROW
 * --------------------------------------------------
 */

function CampaignRow({
  campaign,
  targetLabel,
  menuOpen,
  onMenu,
  onEdit,
  onPause,
  onResume,
  onComplete,
  onDelete,
}: {
  campaign: Campaign;
  targetLabel: string;
  menuOpen: boolean;
  onMenu: () => void;
  onEdit: () => void;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="relative px-5 py-5 transition hover:bg-[#fcfaf7]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5eadf]">
            <Megaphone className="h-4 w-4 text-[#a56b45]" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-semibold">
                {campaign.name}
              </h3>

              <StatusBadge
                status={campaign.status}
              />
            </div>

            <p className="mt-1 line-clamp-1 text-sm text-neutral-500">
              {campaign.description ||
                "No campaign description"}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#e9e1d7] bg-[#fcfaf7] px-2.5 py-1.5">
                <Target className="h-3.5 w-3.5" />
                {targetLabel}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#e9e1d7] bg-[#fcfaf7] px-2.5 py-1.5">
                <Zap className="h-3.5 w-3.5" />
                {campaign.target
                  ?.priority ??
                  "MEDIUM"}{" "}
                priority
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:w-[360px]">
          <Metric
            label="Expected"
            value={
              campaign.expectedRevenue !=
              null
                ? formatCurrency(
                    campaign.expectedRevenue
                  )
                : "—"
            }
          />

          <Metric
            label="Target"
            value={
              campaign.target
                ?.type ?? "—"
            }
          />

          <Metric
            label="Created"
            value={formatDate(
              campaign.createdAt
            )}
          />
        </div>

        <div className="relative">
          <button
            onClick={onMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5ddd4] bg-white text-neutral-500 transition hover:bg-[#fcfaf7] hover:text-neutral-900"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-xl border border-[#e5ddd4] bg-white p-1.5 shadow-xl">
              <MenuButton
                icon={Pencil}
                label="Edit campaign"
                onClick={onEdit}
              />

              {campaign.status ===
                "ACTIVE" && (
                <MenuButton
                  icon={Pause}
                  label="Pause campaign"
                  onClick={onPause}
                />
              )}

              {campaign.status ===
                "PAUSED" && (
                <MenuButton
                  icon={Play}
                  label="Resume campaign"
                  onClick={onResume}
                />
              )}

              {campaign.status !==
                "COMPLETED" && (
                <MenuButton
                  icon={ArrowUpRight}
                  label="Mark completed"
                  onClick={onComplete}
                />
              )}

              <MenuButton
                icon={Trash2}
                label="Delete campaign"
                danger
                onClick={onDelete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/*
 * --------------------------------------------------
 * STATUS
 * --------------------------------------------------
 */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const classes =
    status === "ACTIVE"
      ? "bg-[#e8f3e9] text-[#3d7545]"
      : status === "PAUSED"
        ? "bg-[#f3eee8] text-[#87694f]"
        : status === "COMPLETED"
          ? "bg-[#ececec] text-[#555]"
          : "bg-[#f5eadf] text-[#8c5738]";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${classes}`}
    >
      {status}
    </span>
  );
}

/*
 * --------------------------------------------------
 * METRIC
 * --------------------------------------------------
 */

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[11px] text-neutral-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-medium text-neutral-700">
        {value}
      </p>
    </div>
  );
}

/*
 * --------------------------------------------------
 * MENU BUTTON
 * --------------------------------------------------
 */

function MenuButton({
  icon: Icon,
  label,
  danger,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-9 w-full items-center gap-2 rounded-lg px-3 text-left text-xs transition ${
        danger
          ? "text-red-500 hover:bg-red-50"
          : "text-neutral-600 hover:bg-[#f8f5f0] hover:text-neutral-900"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />

      {label}
    </button>
  );
}

/*
 * --------------------------------------------------
 * MODAL
 * --------------------------------------------------
 */

function CampaignModal({
  form,
  setForm,
  products,
  editing,
  saving,
  onClose,
  onSubmit,
}: {
  form: FormState;
  setForm: React.Dispatch<
    React.SetStateAction<FormState>
  >;
  products: Product[];
  editing: boolean;
  saving: boolean;
  onClose: () => void;
  onSubmit: (
    event: React.FormEvent
  ) => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#e5ddd4] bg-[#f8f5f0] shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-[#e5ddd4] bg-white px-6 py-5">
          <div>
            <p className="text-xs font-medium text-[#a56b45]">
              AI Growth
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              {editing
                ? "Edit campaign"
                : "Create campaign"}
            </h2>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5ddd4] text-neutral-500 hover:bg-[#f8f5f0] disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="overflow-y-auto p-6"
        >
          <div className="space-y-5">
            {/* Name */}
            <Field label="Campaign name">
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                placeholder="e.g. Move slow-selling sneakers"
                className={inputClass}
              />
            </Field>

            {/* Description */}
            <Field label="Description">
              <textarea
                value={
                  form.description
                }
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description:
                      event.target.value,
                  }))
                }
                placeholder="Tell the AI what this campaign is trying to achieve..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </Field>

            {/* Target type */}
            <Field label="What should the AI promote?">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <TargetOption
                  active={
                    form.targetType ===
                    "PRODUCT"
                  }
                  icon={Target}
                  title="Specific product"
                  description="Promote one product"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      targetType:
                        "PRODUCT",
                    }))
                  }
                />

                <TargetOption
                  active={
                    form.targetType ===
                    "SLOW_MOVING"
                  }
                  icon={TrendingUp}
                  title="Slow-moving"
                  description="Improve product visibility"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      targetType:
                        "SLOW_MOVING",
                    }))
                  }
                />

                <TargetOption
                  active={
                    form.targetType ===
                    "CUSTOM"
                  }
                  icon={Bot}
                  title="Custom"
                  description="Give the AI instructions"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      targetType:
                        "CUSTOM",
                    }))
                  }
                />
              </div>
            </Field>

            {/* Product */}
            {form.targetType ===
              "PRODUCT" && (
              <Field label="Product">
                <select
                  value={
                    form.productId
                  }
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      productId:
                        event.target.value,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="">
                    Select a product
                  </option>

                  {products
                    .filter(
                      (product) =>
                        product.isActive
                    )
                    .map((product) => (
                      <option
                        key={
                          product.id
                        }
                        value={
                          product.id
                        }
                      >
                        {product.name} ·{" "}
                        {formatCurrency(
                          product.price
                        )}
                      </option>
                    ))}
                </select>
              </Field>
            )}

            {/* Slow moving */}
            {form.targetType ===
              "SLOW_MOVING" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="No sales within">
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={
                        form.days
                      }
                      onChange={(event) =>
                        setForm(
                          (prev) => ({
                            ...prev,
                            days: event
                              .target
                              .value,
                          })
                        )
                      }
                      className={`${inputClass} pr-16`}
                    />

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                      days
                    </span>
                  </div>
                </Field>

                <Field label="Priority">
                  <PrioritySelect
                    value={
                      form.priority
                    }
                    onChange={(
                      value
                    ) =>
                      setForm(
                        (prev) => ({
                          ...prev,
                          priority:
                            value,
                        })
                      )
                    }
                  />
                </Field>
              </div>
            )}

            {/* Product priority */}
            {form.targetType ===
              "PRODUCT" && (
              <Field label="Priority">
                <PrioritySelect
                  value={
                    form.priority
                  }
                  onChange={(value) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        priority:
                          value,
                      })
                    )
                  }
                />
              </Field>
            )}

            {/* Custom */}
            {form.targetType ===
              "CUSTOM" && (
              <>
                <Field label="AI instructions">
                  <textarea
                    value={
                      form.instruction
                    }
                    onChange={(event) =>
                      setForm(
                        (prev) => ({
                          ...prev,
                          instruction:
                            event.target
                              .value,
                        })
                      )
                    }
                    placeholder="Example: When customers ask for gifts under ₹2000, naturally recommend our leather wallet."
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                </Field>

                <Field label="Priority">
                  <PrioritySelect
                    value={
                      form.priority
                    }
                    onChange={(
                      value
                    ) =>
                      setForm(
                        (prev) => ({
                          ...prev,
                          priority:
                            value,
                        })
                      )
                    }
                  />
                </Field>
              </>
            )}

            {/* Expected revenue */}
            <Field label="Expected revenue (optional)">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={
                    form.expectedRevenue
                  }
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      expectedRevenue:
                        event.target
                          .value,
                    }))
                  }
                  placeholder="50000"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </Field>
          </div>

          {/* Footer */}
          <div className="mt-7 flex justify-end gap-2 border-t border-[#e5ddd4] pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-10 rounded-xl border border-[#e5ddd4] bg-white px-4 text-sm font-medium text-neutral-600 hover:bg-[#fcfaf7] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex h-10 items-center gap-2 rounded-xl bg-[#171717] px-5 text-sm font-medium text-white hover:bg-[#2d2d2d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving && (
                <RefreshCw className="h-4 w-4 animate-spin" />
              )}

              {editing
                ? "Save changes"
                : "Create campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/*
 * --------------------------------------------------
 * TARGET OPTION
 * --------------------------------------------------
 */

function TargetOption({
  active,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-3 text-left transition ${
        active
          ? "border-[#c77b4b] bg-[#f5eadf]"
          : "border-[#e5ddd4] bg-white hover:border-[#d4c5b8]"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon
          className={`h-4 w-4 ${
            active
              ? "text-[#a56b45]"
              : "text-neutral-400"
          }`}
        />

        <span className="text-xs font-semibold">
          {title}
        </span>
      </div>

      <p className="mt-1 text-[11px] leading-4 text-neutral-500">
        {description}
      </p>
    </button>
  );
}

/*
 * --------------------------------------------------
 * PRIORITY
 * --------------------------------------------------
 */

function PrioritySelect({
  value,
  onChange,
}: {
  value:
    | "LOW"
    | "MEDIUM"
    | "HIGH";
  onChange: (
    value:
      | "LOW"
      | "MEDIUM"
      | "HIGH"
  ) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(
          event.target.value as
            | "LOW"
            | "MEDIUM"
            | "HIGH"
        )
      }
      className={inputClass}
    >
      <option value="LOW">
        Low
      </option>

      <option value="MEDIUM">
        Medium
      </option>

      <option value="HIGH">
        High
      </option>
    </select>
  );
}

/*
 * --------------------------------------------------
 * FIELD
 * --------------------------------------------------
 */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-neutral-600">
        {label}
      </span>

      {children}
    </label>
  );
}

/*
 * --------------------------------------------------
 * EMPTY STATE
 * --------------------------------------------------
 */

function EmptyState({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-[#d9cec2] bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5eadf]">
        <Megaphone className="h-5 w-5 text-[#a56b45]" />
      </div>

      <h2 className="mt-4 text-lg font-semibold">
        No campaigns yet
      </h2>

      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-neutral-500">
        Create a campaign to tell Raze which
        products deserve more visibility. The AI
        will use it naturally during customer
        conversations.
      </p>

      <button
        onClick={onCreate}
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#171717] px-4 text-sm font-medium text-white hover:bg-[#2d2d2d]"
      >
        <Plus className="h-4 w-4" />
        Create campaign
      </button>
    </div>
  );
}

/*
 * --------------------------------------------------
 * SKELETON
 * --------------------------------------------------
 */

function CampaignSkeleton() {
  return (
    <div className="mt-6 animate-pulse overflow-hidden rounded-2xl border border-[#e9e1d7] bg-white">
      <div className="border-b border-[#eee7df] p-5">
        <div className="h-5 w-36 rounded bg-neutral-200" />
        <div className="mt-2 h-4 w-64 rounded bg-neutral-100" />
      </div>

      <div className="divide-y divide-[#eee7df]">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-5"
          >
            <div className="h-10 w-10 rounded-xl bg-neutral-100" />

            <div className="flex-1">
              <div className="h-4 w-48 rounded bg-neutral-200" />
              <div className="mt-2 h-3 w-72 rounded bg-neutral-100" />
            </div>

            <div className="hidden h-4 w-20 rounded bg-neutral-100 sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

/*
 * --------------------------------------------------
 * HELPERS
 * --------------------------------------------------
 */

const inputClass =
  "h-10 w-full rounded-xl border border-[#e5ddd4] bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#c77b4b] focus:ring-2 focus:ring-[#c77b4b]/10";

function formatCurrency(
  value: number
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(value);
}

function formatDate(
  value: string
) {
  try {
    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(value));
  } catch {
    return "—";
  }
}