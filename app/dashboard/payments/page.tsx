import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { listPaymentsAction } from "./actions";
import { db } from "@/lib/db/client";
import PaymentList from "./PaymentList";

export default async function PaymentsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const payments = await listPaymentsAction();
  const invoiceOptions = await db.query.invoices.findMany({
    where: (inv, { eq }) => eq(inv.teamId, session.teamId)
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <p className="mb-4 text-muted-foreground">
        Track all client payments, payment methods, failed attempts, and test/simulate payment flows for your SaaS.
      </p>
      <PaymentList payments={payments} invoices={invoiceOptions} />
    </div>
  );
}