import { pgTable, text, timestamp, numeric, uniqueIndex, integer, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ─── USERS ────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id")
    .notNull()
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── TEAMS (BUSINESS) ─────────────────────────────────────────────────────
export const teams = pgTable("teams", {
  id: text("id")
    .notNull()
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const teamMembers = pgTable(
  "team_members",
  {
    id: text("id")
      .notNull()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("team_members_team_user_idx").on(table.teamId, table.userId),
  ]
);

export const teamInvitations = pgTable("team_invitations", {
  id: text("id")
    .notNull()
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  teamId: text("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role").notNull().default("member"),
  token: text("token").notNull().unique(),
  invitedByUserId: text("invited_by_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── CLIENTS ───────────────────────────────────────────────────────────────
export const clients = pgTable(
  "clients",
  {
    id: text("id")
      .notNull()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    company: text("company"),
    address: text("address"),
    taxId: text("tax_id"),
    status: text("status").notNull().default("active"), // active, archived
    billingInfo: text("billing_info"), // optional JSON
    notes: text("notes"), // top-level summary/notes
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("clients_team_name_idx").on(table.teamId, table.name),
  ]
);

export const clientNotes = pgTable(
  "client_notes",
  {
    id: text("id")
      .notNull()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    note: text("note").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  }
);

export const clientProjects = pgTable(
  "client_projects",
  {
    id: text("id")
      .notNull()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    status: text("status").notNull().default("active"), // active, completed, archived
    ownerId: text("owner_id").references(() => users.id),
    budget: numeric("budget"),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    summary: text("summary"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  }
);

export const clientProjectTasks = pgTable(
  "client_project_tasks",
  {
    id: text("id")
      .notNull()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => clientProjects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    status: text("status").notNull().default("open"), // open, in_progress, completed, cancelled
    ownerId: text("owner_id").references(() => users.id),
    dueDate: timestamp("due_date"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  }
);

// ─── PRODUCTS / SERVICES ───────────────────────────────────────────────────
export const products = pgTable(
  "products",
  {
    id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
    teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    price: numeric("price").notNull(),
    currency: text("currency").notNull().default("usd"),
    type: text("type").notNull().default("one_time"), // one_time, recurring
    interval: text("interval"), // null unless recurring: day/week/month/year
    status: text("status").notNull().default("active"), // active, archived
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("products_team_name_idx").on(table.teamId, table.name)]
);

// ─── INVOICES ──────────────────────────────────────────────────────────────
export const invoices = pgTable(
  "invoices",
  {
    id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
    teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
    clientId: text("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("draft"), // draft, sent, paid, overdue, cancelled
    total: numeric("total").notNull().default("0.00"),
    currency: text("currency").notNull().default("usd"),
    dueDate: timestamp("due_date", { withTimezone: true }),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    notes: text("notes"),
  }
);

export const invoiceLineItems = pgTable(
  "invoice_line_items",
  {
    id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
    invoiceId: text("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
    productId: text("product_id").references(() => products.id),
    name: text("name").notNull(),
    description: text("description"),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: numeric("unit_price").notNull().default("0.00"),
    total: numeric("total").notNull().default("0.00"),
  }
);

// ─── PAYMENTS ──────────────────────────────────────────────────────────────
export const payments = pgTable(
  "payments",
  {
    id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
    invoiceId: text("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
    teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
    clientId: text("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
    amount: numeric("amount").notNull(),
    currency: text("currency").notNull().default("usd"),
    status: text("status").notNull().default("pending"), // pending, succeeded, failed, cancelled
    method: text("method"), // card, ach, test, etc.
    externalId: text("external_id"), // for 3rd party providers; nullable
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    receivedAt: timestamp("received_at", { withTimezone: true }),
  }
);

// ─── SUBSCRIPTIONS ─────────────────────────────────────────────────────────
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
    teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
    clientId: text("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
    productId: text("product_id").notNull().references(() => products.id),
    status: text("status").notNull().default("active"), // active, cancelled, past_due
    startDate: timestamp("start_date", { withTimezone: true }).notNull().defaultNow(),
    endDate: timestamp("end_date", { withTimezone: true }),
    cancelAt: timestamp("cancel_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    latestInvoiceId: text("latest_invoice_id").references(() => invoices.id),
    metadata: text("metadata"),
  }
);

// ─── COMMENTS/NOTES (GENERIC) ──────────────────────────────────────────────
export const comments = pgTable(
  "comments",
  {
    id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
    teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
    authorId: text("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    entityType: text("entity_type").notNull(), // e.g. 'client', 'invoice', 'payment', 'subscription'
    entityId: text("entity_id").notNull(), // id of the entity being commented on
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    isInternal: boolean("is_internal").notNull().default(false),
  }
);

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────
export const notifications = pgTable(
  "notifications",
  {
    id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
    recipientId: text("recipient_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    teamId: text("team_id").references(() => teams.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // e.g. 'payment_received', 'invoice_overdue', etc.
    content: text("content"),
    status: text("status").notNull().default("unread"), // unread, read
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    readAt: timestamp("read_at", { withTimezone: true }),
    metadata: text("metadata"),
  }
);

// ─── ACTIVITY LOG ──────────────────────────────────────────────────────────
export const activityLog = pgTable(
  "activity_log",
  {
    id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
    teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    action: text("action").notNull(), // e.g. 'created_invoice', 'created_client'
    entityType: text("entity_type").notNull(), // 'client', 'invoice', etc.
    entityId: text("entity_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    details: text("details"),
  }
);

// ─── ANALYTICS/REPORTS ─────────────────────────────────────────────────────
// Holding table for storing generated/downloaded reports, not mandatory for MVP.
export const reports = pgTable(
  "reports",
  {
    id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
    teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
    requestedById: text("requested_by_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // revenue, payment, churn, etc.
    status: text("status").notNull().default("pending"), // pending, complete, failed
    downloadUrl: text("download_url"),
    filters: text("filters"), // serialized filter params
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  }
);