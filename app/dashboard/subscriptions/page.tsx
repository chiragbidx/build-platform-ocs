import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { listSubscriptionsAction } from "./actions";
import { db } from "@/lib/db/client";
import AddSubscriptionForm from "./AddSubscriptionForm";

export default async function SubscriptionsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const subscriptions = await listSubscriptionsAction();
  const clientOptions = await db.query.clients.findMany({
    where: (cl, { eq }) => eq(cl.teamId, session.teamId)
  });
  const productOptions = await db.query.products.findMany({
    where: (prod, { eq }) => eq(prod.teamId, session.teamId)
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>
      <p className="mb-4 text-muted-foreground">
        Manage recurring billing plans, assign subscriptions to clients, handle upgrades and cancellations.
      </p>
      <SubscriptionList subscriptions={subscriptions} />
      <AddSubscriptionForm clients={clientOptions} products={productOptions} />
    </div>
  );
}

function SubscriptionList({ subscriptions }: { subscriptions: any[] }) {
  if (!subscriptions.length) {
    return (
      <div className="rounded-xl border border-muted p-8 text-center">
        <div className="text-lg mb-2 text-zinc-700 dark:text-zinc-200">No subscriptions yet</div>
        <div className="mb-4 text-muted-foreground">Create a subscription plan and assign to your first client.</div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {subscriptions.map(sub => (
        <div key={sub.id} className="border rounded p-4 flex justify-between gap-4">
          <div>
            <strong>Plan:</strong> {sub.productId} <br />
            <strong>Client:</strong> {sub.clientId} <br />
            <strong>Status:</strong> {sub.status} <br />
            <strong>Start:</strong> {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : "-"}
            {sub.endDate && <span> – End: {new Date(sub.endDate).toLocaleDateString()}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}