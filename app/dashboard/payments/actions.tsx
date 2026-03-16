"use server";

import { db } from "@/lib/db/client";
import { payments, invoices } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

export const PaymentInputSchema = z.object({
  invoiceId: z.string().min(1, "Invoice is required"),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  method: z.string().min(1, "Payment method required"),
  status: z.string().default("pending"),
  receivedAt: z.string().optional(),
});

export type PaymentInputType = z.infer<typeof PaymentInputSchema>;

export async function listPaymentsAction() {
  const session = await getAuthSession();
  if (!session) return [];

  const items = await db.query.payments.findMany({
    where: (p, { eq }) => eq(p.teamId, session.teamId),
    orderBy: (p, { desc }) => desc(p.createdAt),
  });

  return items;
}

export async function createPaymentAction(data: PaymentInputType) {
  const session = await getAuthSession();
  if (!session) return { status: 401, error: "Unauthorized" };

  const parsed = PaymentInputSchema.safeParse(data);
  if (!parsed.success) {
    return { status: 400, error: parsed.error.issues[0]?.message || "Invalid form input" };
  }

  try {
    const result = await db.insert(payments).values({
      ...parsed.data,
      amount: parsed.data.amount,
      teamId: session.teamId,
      receivedAt: parsed.data.receivedAt ? new Date(parsed.data.receivedAt) : undefined,
    }).returning({ id: payments.id });

    return { status: 200, id: result[0].id };
  } catch (e) {
    return { status: 500, error: "Error creating payment" };
  }
}