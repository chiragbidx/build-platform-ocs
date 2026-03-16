"use server";

import { db } from "@/lib/db/client";
import { clients, clientNotes, clientProjects, clientProjectTasks } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

// Fetch client data/notes/projects (server action for details page)
export async function fetchClientDetail(clientId: string) {
  const session = await getAuthSession();
  if (!session) return undefined;

  // Tenant/ACL check: you only see if team owns it
  const teamMember = await db.query.teamMembers.findFirst({
    where: (tm, { eq }) => eq(tm.userId, session.userId),
  });
  if (!teamMember) return undefined;

  const client = await db.select().from(clients).where(and(
    eq(clients.id, clientId),
    eq(clients.teamId, teamMember.teamId)
  ));
  if (!client.length) return undefined;

  // Fetch notes and projects
  const notes = await db.select().from(clientNotes).where(eq(clientNotes.clientId, clientId));
  const projects = await db.select().from(clientProjects).where(eq(clientProjects.clientId, clientId));

  // For each project, fetch tasks (for demo: flatten to id/name/list)
  const projectsWithTasks = await Promise.all(projects.map(async (proj) => {
    const tasks = await db.select().from(clientProjectTasks).where(eq(clientProjectTasks.projectId, proj.id));
    return { ...proj, tasks };
  }));

  return {
    ...client[0],
    notes,
    projects: projectsWithTasks,
  };
}

// Create a new note for a client
export async function addClientNoteAction(clientId: string, note: string) {
  const session = await getAuthSession();
  if (!session) return { error: "Unauthorized", status: 401 };

  if (!note.trim()) return { error: "Note text required", status: 400 };

  const teamMember = await db.query.teamMembers.findFirst({
    where: (tm, { eq }) => eq(tm.userId, session.userId),
  });
  if (!teamMember) return { error: "Not found", status: 404 };

  // Confirm client still in same team
  const client = await db.select().from(clients).where(and(
    eq(clients.id, clientId),
    eq(clients.teamId, teamMember.teamId)
  ));
  if (!client.length) return { error: "Client not found", status: 404 };

  await db.insert(clientNotes).values({
    clientId: clientId,
    authorId: session.userId,
    note: note.trim(),
  });

  return { status: 200 };
}