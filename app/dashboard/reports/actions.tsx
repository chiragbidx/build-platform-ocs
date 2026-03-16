"use server";

import { db } from "@/lib/db/client";
import { reports } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

export const ReportInputSchema = z.object({
  type: z.string().min(1, "Type required"),
  filters: z.string().optional(),
});

export type ReportInputType = z.infer<typeof ReportInputSchema>;

export async function listReportsAction() {
  const session = await getAuthSession();
  if (!session) return [];

  const items = await db.query.reports.findMany({
    where: (r, { eq }) => eq(r.teamId, session.teamId),
    orderBy: (r, { desc }) => desc(r.createdAt),
  });

  return items;
}

export async function createReportAction(data: ReportInputType) {
  const session = await getAuthSession();
  if (!session) return { status: 401, error: "Unauthorized" };

  const parsed = ReportInputSchema.safeParse(data);
  if (!parsed.success) {
    return { status: 400, error: parsed.error.issues[0]?.message || "Invalid form input" };
  }
  try {
    const result = await db.insert(reports).values({
      type: parsed.data.type,
      filters: parsed.data.filters,
      teamId: session.teamId,
      requestedById: session.userId,
    }).returning({ id: reports.id });

    return { status: 200, id: result[0].id };
  } catch (e) {
    return { status: 500, error: "Error creating report" };
  }
}