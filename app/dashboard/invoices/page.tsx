import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";

export default async function InvoicesPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <p className="mb-4 text-muted-foreground">
        Generate and manage professional invoices, track payment status, and send reminders to clients.
      </p>
      {/* Invoice list and CRUD UI goes here */}
      <div className="rounded-xl border border-muted p-8 text-center">
        <div className="text-lg mb-2 text-zinc-700 dark:text-zinc-200">No invoices yet</div>
        <div className="mb-4 text-muted-foreground">Create your first invoice to start billing clients.</div>
        <button className="rounded bg-primary text-white px-6 py-2 font-semibold hover:bg-primary/90">Create invoice</button>
      </div>
    </div>
  );
}