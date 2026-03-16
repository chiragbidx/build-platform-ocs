import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { listSubscriptionsAction, createSubscriptionAction, SubscriptionInputSchema } from "./actions";
import { db } from "@/lib/db/client";
import { clients, products } from "@/lib/db/schema";
import { useState } from "react";

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

function AddSubscriptionForm({ clients, products }: { clients: any[]; products: any[] }) {
  const [formState, setFormState] = useState({
    clientId: "",
    productId: "",
    status: "active",
    startDate: "",
    endDate: "",
    cancelAt: "",
    metadata: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = SubscriptionInputSchema.safeParse(formState);
    if (!parsed.success) {
      alert(parsed.error.issues[0]?.message);
      return;
    }
    const resp = await createSubscriptionAction(parsed.data);
    if (resp?.status === 200) {
      setFormState({
        clientId: "",
        productId: "",
        status: "active",
        startDate: "",
        endDate: "",
        cancelAt: "",
        metadata: "",
      });
      window.location.reload();
    } else {
      alert(resp?.error || "Failed to create subscription");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-8 p-4 border rounded-lg flex flex-col md:flex-row gap-2 items-center">
      <select
        className="border rounded px-2 py-1"
        value={formState.clientId}
        onChange={e => setFormState({ ...formState, clientId: e.target.value })}
        required
      >
        <option value="">Select client</option>
        {clients.map((c: any) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <select
        className="border rounded px-2 py-1"
        value={formState.productId}
        onChange={e => setFormState({ ...formState, productId: e.target.value })}
        required
      >
        <option value="">Select product</option>
        {products.map((p: any) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <select
        className="border rounded px-2 py-1"
        value={formState.status}
        onChange={e => setFormState({ ...formState, status: e.target.value })}
      >
        <option value="active">Active</option>
        <option value="cancelled">Cancelled</option>
        <option value="past_due">Past Due</option>
      </select>
      <input
        className="border rounded px-2 py-1"
        type="date"
        value={formState.startDate}
        onChange={e => setFormState({ ...formState, startDate: e.target.value })}
        placeholder="Start date"
      />
      <input
        className="border rounded px-2 py-1"
        type="date"
        value={formState.endDate}
        onChange={e => setFormState({ ...formState, endDate: e.target.value })}
        placeholder="End date"
      />
      <input
        className="border rounded px-2 py-1"
        type="date"
        value={formState.cancelAt}
        onChange={e => setFormState({ ...formState, cancelAt: e.target.value })}
        placeholder="Cancel at"
      />
      <input
        className="border rounded px-2 py-1"
        value={formState.metadata}
        onChange={e => setFormState({ ...formState, metadata: e.target.value })}
        placeholder="Metadata/notes"
      />
      <button type="submit" className="rounded bg-primary text-white px-4 py-2">Add Subscription</button>
    </form>
  );
}