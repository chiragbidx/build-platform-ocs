"use server";

import { db } from "@/lib/db/client";
import { invoices, invoiceLineItems, clients, products } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

export const InvoiceInputSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  currency: z.string().default("usd"),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().optional(),
      name: z.string().min(1, "Line item name required"),
      description: z.string().optional(),
      quantity: z.number().default(1),
      unitPrice: z.string(),
    })
  ),
});

export type InvoiceInputType = z.infer<typeof InvoiceInputSchema>;

export async function listInvoicesAction() {
  const session = await getAuthSession();
  if (!session) return [];

  // Simple: list invoices for this team, include client and line items
  const invs = await db.query.invoices.findMany({
    where: (inv, { eq }) => eq(inv.teamId, session.teamId),
    orderBy: (inv, { desc }) => desc(inv.createdAt),
  });

  // Optionally: join client names, status, total, etc.
  return invs;
}

export async function createInvoiceAction(data: InvoiceInputType) {
  const session = await getAuthSession();
  if (!session) return { status: 401, error: "Unauthorized" };

  const parsed = InvoiceInputSchema.safeParse(data);
  if (!parsed.success) {
    return { status: 400, error: parsed.error.issues[0]?.message || "Invalid form input" };
  }

  try {
    // Compute total from items
    const total = parsed.data.items.reduce((acc, item) => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.unitPrice) || 0;
      return acc + qty * price;
    }, 0);

    const [inv] = await db.insert(invoices).values({
      clientId: parsed.data.clientId,
      teamId: session.teamId,
      total,
      currency: parsed.data.currency,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      notes: parsed.data.notes,
    }).returning({ id: invoices.id });

    for (const item of parsed.data.items) {
      await db.insert(invoiceLineItems).values({
        invoiceId: inv.id,
        productId: item.productId,
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: Number(item.unitPrice) * (item.quantity || 1),
      });
    }

    return { status: 200, id: inv.id };
  } catch (e) {
    return { status: 500, error: "Error creating invoice" };
  }
}