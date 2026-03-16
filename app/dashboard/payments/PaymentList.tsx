"use client";

import { useState } from "react";
import { createPaymentAction, PaymentInputSchema } from "./actions";

export default function PaymentList({ payments, invoices }: { payments: any[]; invoices: any[] }) {
  return (
    <>
      <PaymentsDisplay payments={payments} />
      <AddPaymentForm invoices={invoices} />
    </>
  );
}

function PaymentsDisplay({ payments }: { payments: any[] }) {
  if (!payments.length) {
    return (
      <div className="rounded-xl border border-muted p-8 text-center">
        <div className="text-lg mb-2 text-zinc-700 dark:text-zinc-200">No payments yet</div>
        <div className="mb-4 text-muted-foreground">You haven’t processed any payments yet.</div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {payments.map(payment => (
        <div key={payment.id} className="border rounded p-4 gap-4">
          <div>
            <strong>Status:</strong> {payment.status} <br />
            <span className="font-mono">{payment.amount} {payment.currency}</span>
            {payment.method && <span className="ml-2">via {payment.method}</span>}
            {payment.receivedAt && (
              <span className="ml-2 text-xs text-muted-foreground">Received: {new Date(payment.receivedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AddPaymentForm({ invoices }: { invoices: any[] }) {
  const [formState, setFormState] = useState({
    invoiceId: "",
    amount: "",
    method: "card",
    status: "pending",
    receivedAt: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = PaymentInputSchema.safeParse(formState);
    if (!parsed.success) {
      alert(parsed.error.issues[0]?.message);
      return;
    }
    const resp = await createPaymentAction(parsed.data);
    if (resp?.status === 200) {
      setFormState({
        invoiceId: "",
        amount: "",
        method: "card",
        status: "pending",
        receivedAt: "",
      });
      window.location.reload();
    } else {
      alert(resp?.error || "Failed to create payment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-8 p-4 border rounded-lg flex flex-col md:flex-row gap-2 items-center">
      <select
        className="border rounded px-2 py-1"
        value={formState.invoiceId}
        onChange={e => setFormState({ ...formState, invoiceId: e.target.value })}
        required
      >
        <option value="">Select invoice</option>
        {invoices.map((inv: any) => (
          <option key={inv.id} value={inv.id}>Invoice #{inv.id}</option>
        ))}
      </select>
      <input
        className="border rounded px-2 py-1"
        value={formState.amount}
        onChange={e => setFormState({ ...formState, amount: e.target.value })}
        placeholder="Amount"
        required
      />
      <select
        className="border rounded px-2 py-1"
        value={formState.method}
        onChange={e => setFormState({ ...formState, method: e.target.value })}
      >
        <option value="card">Card</option>
        <option value="test">Test</option>
        <option value="ach">ACH</option>
      </select>
      <select
        className="border rounded px-2 py-1"
        value={formState.status}
        onChange={e => setFormState({ ...formState, status: e.target.value })}
      >
        <option value="pending">Pending</option>
        <option value="succeeded">Succeeded</option>
        <option value="failed">Failed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <input
        className="border rounded px-2 py-1"
        type="date"
        value={formState.receivedAt}
        onChange={e => setFormState({ ...formState, receivedAt: e.target.value })}
        placeholder="Received at"
      />
      <button type="submit" className="rounded bg-primary text-white px-4 py-2">Simulate payment</button>
    </form>
  );
}