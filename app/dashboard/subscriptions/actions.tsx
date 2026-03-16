"use server";

import { db } from "@/lib/db/client";
import { subscriptions, clients, products } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

export const SubscriptionInputSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  productId: z.string().min(1, "Product is required"),
  status: z.string().default("active"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  cancelAt: z.string().optional(),
  metadata: z.string().optional(),
});

export type SubscriptionInputType = z.infer<typeof SubscriptionInputSchema>;

export async function listSubscriptionsAction() {
  const session = await getAuthSession();
  if (!session) return [];

  const items = await db.query.subscriptions.findMany({
    where: (sub, { eq }) => eq(sub.teamId, session.teamId),
    orderBy: (sub, { desc }) => desc(sub.createdAt)
  });

  return items;
}

export async function createSubscriptionAction(data: SubscriptionInputType) {
  const session = await getAuthSession();
  if (!session) return { status: 401, error: "Unauthorized" };

  const parsed = SubscriptionInputSchema.safeParse(data);
  if (!parsed.success) {
    return { status: 400, error: parsed.error.issues[0]?.message || "Invalid form input" };
  }

  try {
    const result = await db.insert(subscriptions).values({
      ...parsed.data,
      teamId: session.teamId,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : undefined,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
      cancelAt: parsed.data.cancelAt ? new Date(parsed.data.cancelAt) : undefined,
    }).returning({ id: subscriptions.id });

    return { status: 200, id: result[0].id };
  } catch (e) {
    return { status: 500, error: "Error creating subscription" };
  }
}