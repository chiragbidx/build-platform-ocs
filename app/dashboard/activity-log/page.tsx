import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { listActivityLogAction } from "./actions";

export default async function ActivityLogPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const logs = await listActivityLogAction();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Activity Log</h1>
      <p className="mb-4 text-muted-foreground">
        A record of recent activity, audit actions, and security events across your team’s StripeFlow workspace.
      </p>
      <LogList logs={logs} />
    </div>
  );
}

function LogList({ logs }: { logs: any[] }) {
  if (!logs.length) {
    return (
      <div className="rounded-xl border border-muted p-8 text-center">
        <div className="text-lg mb-2 text-zinc-700 dark:text-zinc-200">No activity yet</div>
        <div className="mb-4 text-muted-foreground">Recent user sign-ins, changes, and account updates will show here.</div>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {logs.map((entry: any) => (
        <div key={entry.id} className="border rounded p-4">
          <div>
            <span className="font-mono text-sm">{entry.action}</span> — {entry.entityType} #{entry.entityId}
          </div>
          <div className="text-xs mt-1 text-muted-foreground">
            {entry.details} &bull; {new Date(entry.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}