"use server";

import { db } from "@/lib/db/client";
import { clients, clientNotes, clientProjects } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";
import { eq, and } from "drizzle-orm";

// Zod schemas
export const ClientInputSchema = z.object({
  name: z.string().min(1, "Client name is required."),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  taxId: z.string().optional().or(z.literal("")),
  billingInfo: z.string().optional(),
  notes: z.string().optional(),
});

export type ClientInputType = z.infer<typeof ClientInputSchema>;

export async function createClientAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) return { error: "Unauthorized", status: 401 };

  const parsed = ClientInputSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { status: 400, error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  // Lookup user's team (assuming owner/admin/member of a single workspace/team)
  const userTeams = await db.query.teamMembers.findMany({
    where: (tm, { eq }) => eq(tm.userId, session.userId),
    with: { team: true },
  });
  const userTeam = userTeams[0]?.team;
  if (!userTeam)
    return { status: 403, error: "Team not found. Cannot create clients." };

  // Create client
  const result = await db.insert(clients).values({
    ...parsed.data,
    teamId: userTeam.id,
  }).returning({ id: clients.id });

  return { status: 200, id: result[0]?.id };
}

export async function listClientsAction() {
  const session = await getAuthSession();
  if (!session) return [];

  // Get user's teams for multi-tenant isolation
  const teamMember = await db.query.teamMembers.findFirst({
    where: (tm, { eq }) => eq(tm.userId, session.userId)
  });
  if (!teamMember) return [];

  const allClients = await db.select().from(clients).where(eq(clients.teamId, teamMember.teamId));
  return allClients;
}

export async function updateClientAction(clientId: string, formData: FormData) {
  const session = await getAuthSession();
  if (!session) return { error: "Unauthorized", status: 401 };

  const parsed = ClientInputSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { status: 400, error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  // Team-safety: check client belongs to user's team
  const clientRow = await db.select().from(clients).where(eq(clients.id, clientId));
  if (!clientRow.length) return { status: 404, error: "Client not found" };

  const client = clientRow[0];

  const userTeam = await db.query.teamMembers.findFirst({
    where: (tm, { eq }) => eq(tm.userId, session.userId)
  });
  if (!userTeam || client.teamId !== userTeam.teamId) {
    return { status: 403, error: "Forbidden. You do not have access to this client." };
  }

  await db.update(clients)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(clients.id, clientId));

  return { status: 200, id: clientId };
}

export async function archiveClientAction(clientId: string) {
  const session = await getAuthSession();
  if (!session) return { error: "Unauthorized", status: 401 };

  // Team-safety: check ownership, then archive
  const clientRow = await db.select().from(clients).where(eq(clients.id, clientId));
  if (!clientRow.length) return { status: 404, error: "Client not found" };
  const client = clientRow[0];

  const userTeam = await db.query.teamMembers.findFirst({
    where: (tm, { eq }) => eq(tm.userId, session.userId)
  });
  if (!userTeam || client.teamId !== userTeam.teamId) {
    return { status: 403, error: "Forbidden. You do not have access to this client." };
  }

  await db.update(clients)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(clients.id, clientId));

  return { status: 200, id: clientId };
}