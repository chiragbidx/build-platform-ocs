"use server";

import { db } from "@/lib/db/client";
import { activityLog } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";

export async function listActivityLogAction() {
  const session = await getAuthSession();
  if (!session) return [];

  const entries = await db.query.activityLog.findMany({
    where: (log, { eq }) => eq(log.teamId, session.teamId),
    orderBy: (log, { desc }) => desc(log.createdAt),
  });
  return entries;
}