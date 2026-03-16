import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";

export default async function ActivityLogPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Activity Log</h1>
      <p className="mb-4 text-muted-foreground">
        View activity and audit events for your business. Every key action in StripeFlow is logged transparently.
      </p>
      {/* Activity log Feed/Table goes here */}
      <div className="rounded-xl border border-muted p-8 text-center">
        <div className="text-lg mb-2 text-zinc-700 dark:text-zinc-200">No activity yet</div>
        <div className="mb-4 text-muted-foreground">As you or your team take action, logs will appear here.</div>
      </div>
    </div>
  );
}