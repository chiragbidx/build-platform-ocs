"use server";

import { db } from "@/lib/db/client";
import { comments } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

export const CommentInputSchema = z.object({
  entityType: z.string().min(1, "Entity type required"),
  entityId: z.string().min(1, "Entity ID required"),
  content: z.string().min(1, "Content required"),
  isInternal: z.boolean().default(false),
});

export type CommentInputType = z.infer<typeof CommentInputSchema>;

export async function listCommentsAction(entityType: string, entityId: string) {
  const session = await getAuthSession();
  if (!session) return [];

  const items = await db.query.comments.findMany({
    where: (c, { eq, and }) =>
      and(eq(c.teamId, session.teamId), eq(c.entityType, entityType), eq(c.entityId, entityId)),
    orderBy: (c, { desc }) => desc(c.createdAt),
  });

  return items;
}

export async function createCommentAction(data: CommentInputType) {
  const session = await getAuthSession();
  if (!session) return { status: 401, error: "Unauthorized" };

  const parsed = CommentInputSchema.safeParse(data);
  if (!parsed.success) {
    return { status: 400, error: parsed.error.issues[0]?.message || "Invalid form input" };
  }
  try {
    const result = await db.insert(comments).values({
      ...parsed.data,
      teamId: session.teamId,
      authorId: session.userId,
    }).returning({ id: comments.id });

    return { status: 200, id: result[0].id };
  } catch (e) {
    return { status: 500, error: "Error creating comment" };
  }
}