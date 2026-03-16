"use server";

import { db } from "@/lib/db/client";
import { notifications } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";

export async function listNotificationsAction() {
  const session = await getAuthSession();
  if (!session) return [];

  const items = await db.query.notifications.findMany({
    where: (n, { eq }) => eq(n.recipientId, session.userId),
    orderBy: (n, { desc }) => desc(n.createdAt)
  });

  return items;
}

export async function markNotificationReadAction(id: string) {
  const session = await getAuthSession();
  if (!session) return { status: 401, error: "Unauthorized" };

  try {
    await db.update(notifications)
      .set({ status: "read", readAt: new Date() })
      .where((n, { eq }) => eq(n.id, id) && eq(n.recipientId, session.userId));
    return { status: 200 };
  } catch (e) {
    return { status: 500, error: "Error marking as read" };
  }
}