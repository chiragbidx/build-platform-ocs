import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";

export default async function SubscriptionsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>
      <p className="mb-4 text-muted-foreground">
        Manage recurring billing plans, assign subscriptions to clients, handle upgrades and cancellations.
      </p>
      {/* Subscription list and management UI goes here */}
      <div className="rounded-xl border border-muted p-8 text-center">
        <div className="text-lg mb-2 text-zinc-700 dark:text-zinc-200">No subscriptions yet</div>
        <div className="mb-4 text-muted-foreground">Create a subscription plan and assign to your first client.</div>
        <button className="rounded bg-primary text-white px-6 py-2 font-semibold hover:bg-primary/90">Create subscription</button>
      </div>
    </div>
  );
}