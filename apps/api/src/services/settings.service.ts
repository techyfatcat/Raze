import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";

interface UpdateMerchantSettingsInput {
    name?: string;
    slug?: string;
    description?: string | null;
    currency?: string;
}

/*
 * --------------------------------------------------
 * GET MERCHANT SETTINGS
 * --------------------------------------------------
 */

export async function getMerchantSettings(
    merchantId: string
) {
    if (!merchantId) {
        throw new Error("merchantId is required");
    }

    const merchant =
        await prisma.merchant.findUnique({
            where: {
                id: merchantId,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                currency: true,
                createdAt: true,
                updatedAt: true,
            },
        });

    if (!merchant) {
        throw new Error("Merchant not found");
    }

    return merchant;
}

/*
 * --------------------------------------------------
 * UPDATE MERCHANT SETTINGS
 * --------------------------------------------------
 */

export async function updateMerchantSettings(
    merchantId: string,
    input: UpdateMerchantSettingsInput
) {
    if (!merchantId) {
        throw new Error("merchantId is required");
    }

    const existing =
        await prisma.merchant.findUnique({
            where: {
                id: merchantId,
            },
        });

    if (!existing) {
        throw new Error("Merchant not found");
    }

    const name =
        input.name !== undefined
            ? input.name.trim()
            : undefined;

    const slug =
        input.slug !== undefined
            ? input.slug.trim().toLowerCase()
            : undefined;

    const description =
        input.description !== undefined
            ? input.description?.trim() || null
            : undefined;

    const currency =
        input.currency !== undefined
            ? input.currency.trim().toUpperCase()
            : undefined;

    if (
        name !== undefined &&
        !name
    ) {
        throw new Error(
            "Store name cannot be empty"
        );
    }

    if (
        slug !== undefined &&
        !slug
    ) {
        throw new Error(
            "Store slug cannot be empty"
        );
    }

    if (
        slug !== undefined &&
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
            slug
        )
    ) {
        throw new Error(
            "Store slug can only contain lowercase letters, numbers, and hyphens"
        );
    }

    if (
        currency !== undefined &&
        !/^[A-Z]{3}$/.test(currency)
    ) {
        throw new Error(
            "Currency must be a valid 3-letter currency code"
        );
    }

    if (
        slug !== undefined &&
        slug !== existing.slug
    ) {
        const slugExists =
            await prisma.merchant.findFirst({
                where: {
                    slug,
                    NOT: {
                        id: merchantId,
                    },
                },
            });

        if (slugExists) {
            throw new Error(
                "This store slug is already in use"
            );
        }
    }

    const updated =
        await prisma.merchant.update({
            where: {
                id: merchantId,
            },
            data: {
                name,
                slug,
                description,
                currency,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                currency: true,
                createdAt: true,
                updatedAt: true,
            },
        });

    /*
     * --------------------------------------------------
     * AUDIT LOG
     * --------------------------------------------------
     */

    const changes: Record<
        string,
        {
            from: unknown;
            to: unknown;
        }
    > = {};

    if (
        name !== undefined &&
        name !== existing.name
    ) {
        changes.name = {
            from: existing.name,
            to: name,
        };
    }

    if (
        slug !== undefined &&
        slug !== existing.slug
    ) {
        changes.slug = {
            from: existing.slug,
            to: slug,
        };
    }

    if (
        description !== undefined &&
        description !== existing.description
    ) {
        changes.description = {
            from: existing.description,
            to: description,
        };
    }

    if (
        currency !== undefined &&
        currency !== existing.currency
    ) {
        changes.currency = {
            from: existing.currency,
            to: currency,
        };
    }

    if (Object.keys(changes).length > 0) {
        await prisma.auditLog.create({
            data: {
                merchantId,
                actionType: "SEARCH",
                description:
                    "Merchant settings updated",
                metadata: {
                    changes: changes as Prisma.InputJsonValue,
                },
            },
        });
    }

    return updated;
}