import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { listReportsAction } from "./actions";
import AddReportForm from "./AddReportForm";

export default async function ReportsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const reports = await listReportsAction();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>
      <p className="mb-4 text-muted-foreground">
        Downloadable and interactive reports for all your StripeFlow payments, invoices, and subscriptions. Filter and export your financial data.
      </p>
      <ReportList reports={reports} />
      <AddReportForm />
    </div>
  );
}

function ReportList({ reports }: { reports: any[] }) {
  if (!reports.length) {
    return (
      <div className="rounded-xl border border-muted p-8 text-center">
        <div className="text-lg mb-2 text-zinc-700 dark:text-zinc-200">No reports yet</div>
        <div className="mb-4 text-muted-foreground">Run your first report to analyze performance.</div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {reports.map((r: any) => (
        <div key={r.id} className="border rounded p-4 flex flex-col md:flex-row justify-between gap-2 items-center">
          <div>
            <strong>{r.type}</strong>
            <div className="text-xs text-muted-foreground">{r.createdAt && (new Date(r.createdAt).toLocaleString())}</div>
            {r.filters && <div className="text-xs">Filters: {r.filters}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}