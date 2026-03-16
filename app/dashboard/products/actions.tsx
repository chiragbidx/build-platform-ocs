"use server";

import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { ProductInputSchema, ProductInputType } from "./productSchema";

export async function listProductsAction() {
  const session = await getAuthSession();
  if (!session) return [];

  const items = await db.query.products.findMany({
    where: (prod, { eq }) => eq(prod.teamId, session.teamId),
    orderBy: (prod, { asc }) => asc(prod.createdAt),
  });

  return items;
}

export async function createProductAction(data: ProductInputType) {
  const session = await getAuthSession();
  if (!session) return { status: 401, error: "Unauthorized" };

  const parsed = ProductInputSchema.safeParse(data);
  if (!parsed.success) {
    return { status: 400, error: parsed.error.issues[0]?.message || "Invalid form input" };
  }

  try {
    const result = await db.insert(products).values({
      ...parsed.data,
      teamId: session.teamId,
    }).returning({ id: products.id });

    return { status: 200, id: result[0].id };
  } catch (e) {
    return { status: 500, error: "Error creating product" };
  }
}

export async function updateProductAction(id: string, data: ProductInputType) {
  const session = await getAuthSession();
  if (!session) return { status: 401, error: "Unauthorized" };

  const parsed = ProductInputSchema.safeParse(data);
  if (!parsed.success) {
    return { status: 400, error: parsed.error.issues[0]?.message || "Invalid form input" };
  }

  try {
    await db.update(products)
      .set({ ...parsed.data })
      .where((prod, { eq }) => eq(prod.id, id) && eq(prod.teamId, session.teamId));
    return { status: 200, id };
  } catch (e) {
    return { status: 500, error: "Error updating product" };
  }
}

export async function deleteProductAction(id: string) {
  const session = await getAuthSession();
  if (!session) return { status: 401, error: "Unauthorized" };

  try {
    await db.delete(products)
      .where((prod, { eq }) => eq(prod.id, id) && eq(prod.teamId, session.teamId));
    return { status: 200 };
  } catch (e) {
    return { status: 500, error: "Error deleting product" };
  }
}