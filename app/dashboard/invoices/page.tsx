import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { listInvoicesAction } from "./actions";
import { db } from "@/lib/db/client";

import dynamic from "next/dynamic";
const InvoiceList = dynamic(() => import("./InvoiceList"), { ssr: false });

export default async function InvoicesPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const invoices = await listInvoicesAction();
  const clientOptions = await db.query.clients.findMany({
    where: (cl, { eq }) => eq(cl.teamId, session.teamId)
  });
  const productOptions = await db.query.products.findMany({
    where: (prod, { eq }) => eq(prod.teamId, session.teamId)
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <p className="mb-4 text-muted-foreground">
        Generate and manage professional invoices, track payment status, and send reminders to clients.
      </p>
      <InvoiceList invoices={invoices} clients={clientOptions} products={productOptions} />
    </div>
  );
}