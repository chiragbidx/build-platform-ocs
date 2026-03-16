"use client";

import { useState } from "react";
import { SubscriptionInputSchema, createSubscriptionAction } from "./actions";

export default function AddSubscriptionForm({
  clients,
  products
}: {
  clients: any[];
  products: any[];
}) {
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