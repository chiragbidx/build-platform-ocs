import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";

export default async function ReportsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>
      <p className="mb-4 text-muted-foreground">
        Downloadable and interactive reports for all your StripeFlow payments, invoices, and subscriptions. Filter and export your financial data.
      </p>
      {/* Reports table, filters, and download/export (CSV/PDF) goes here */}
      <div className="rounded-xl border border-muted p-8 text-center">
        <div className="text-lg mb-2 text-zinc-700 dark:text-zinc-200">No reports yet</div>
        <div className="mb-4 text-muted-foreground">Run your first report to analyze performance.</div>
        <button className="rounded bg-primary text-white px-6 py-2 font-semibold hover:bg-primary/90">Run report</button>
      </div>
    </div>
  );
}