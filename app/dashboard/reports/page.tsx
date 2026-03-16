import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { listReportsAction, createReportAction, ReportInputSchema } from "./actions";
import { useState } from "react";

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

function AddReportForm() {
  const [formState, setFormState] = useState({
    type: "",
    filters: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = ReportInputSchema.safeParse(formState);
    if (!parsed.success) {
      alert(parsed.error.issues[0]?.message);
      return;
    }
    const resp = await createReportAction(parsed.data);
    if (resp?.status === 200) {
      setFormState({ type: "", filters: "" });
      window.location.reload();
    } else {
      alert(resp?.error || "Failed to create report");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-8 p-4 border rounded-lg flex flex-col md:flex-row gap-2 items-center">
      <input className="border rounded px-2 py-1" value={formState.type} onChange={e => setFormState({ ...formState, type: e.target.value })} placeholder="Report type (revenue, churn, etc.)" required />
      <input className="border rounded px-2 py-1" value={formState.filters} onChange={e => setFormState({ ...formState, filters: e.target.value })} placeholder="Optional filters (JSON/CSV)" />
      <button type="submit" className="rounded bg-primary text-white px-4 py-2">Run report</button>
    </form>
  );
}