import { prisma } from "../lib/prisma.js";

interface CreatePaymentActionInput {
  merchantId: string;
  orderId: string;
  reason: string;
}

export async function createPaymentAction(
  input: CreatePaymentActionInput
) {
  const order = await prisma.order.findFirst({
    where: {
      id: input.orderId,
      merchantId: input.merchantId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "PENDING") {
    throw new Error("Order is not awaiting payment");
  }

  const action = await prisma.agentAction.create({
    data: {
      merchantId: input.merchantId,
      agentType: "PAYMENT",
      action: "PAYMENT_REQUEST",
      reason: input.reason,
      amount: order.amount,
      status: "PROPOSED",
      metadata: {
        orderId: order.id,
        currency: order.currency,
        items: order.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      merchantId: input.merchantId,
      actionType: "PAYMENT_INITIATED",
      description:
        "AI agent requested customer approval for payment",
      agentType: "PAYMENT",
      amount: order.amount,
      metadata: {
        orderId: order.id,
        agentActionId: action.id,
      },
    },
  });

  return action;
}

export async function approvePaymentAction(
  actionId: string
) {
  const action = await prisma.agentAction.findUnique({
    where: {
      id: actionId,
    },
  });

  if (!action) {
    throw new Error("Payment action not found");
  }

  if (action.agentType !== "PAYMENT") {
    throw new Error("Action is not a payment action");
  }

  if (action.status !== "PROPOSED") {
    throw new Error(
      `Payment action cannot be approved from ${action.status} state`
    );
  }

  const metadata = action.metadata;

  if (
    !metadata ||
    typeof metadata !== "object" ||
    Array.isArray(metadata)
  ) {
    throw new Error("Invalid payment action metadata");
  }

  const orderId = (metadata as { orderId?: unknown })
    .orderId;

  if (typeof orderId !== "string") {
    throw new Error("Payment action has no order");
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "PENDING") {
    throw new Error("Order is no longer payable");
  }


  if (action.amount !== order.amount) {
    throw new Error(
      "Payment amount changed after approval request"
    );
  }

  const approvedAction = await prisma.agentAction.update({
    where: {
      id: action.id,
    },
    data: {
      status: "APPROVED",
      approvedBy: "CUSTOMER",
    },
  });

  return approvedAction;
}