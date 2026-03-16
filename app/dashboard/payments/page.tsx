import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";

export default async function PaymentsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <p className="mb-4 text-muted-foreground">
        Track all client payments, payment methods, failed attempts, and test/simulate payment flows for your SaaS.
      </p>
      {/* Payment list, history, and simulation/test payment UI here */}
      <div className="rounded-xl border border-muted p-8 text-center">
        <div className="text-lg mb-2 text-zinc-700 dark:text-zinc-200">No payments yet</div>
        <div className="mb-4 text-muted-foreground">You haven’t processed any payments yet.</div>
        <button className="rounded bg-primary text-white px-6 py-2 font-semibold hover:bg-primary/90">Simulate payment</button>
      </div>
    </div>
  );
}