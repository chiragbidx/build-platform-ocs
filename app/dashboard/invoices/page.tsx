import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { listInvoicesAction, createInvoiceAction, InvoiceInputSchema } from "./actions";
import { db } from "@/lib/db/client";
import { clients, products } from "@/lib/db/schema";
import { z } from "zod";

export default async function InvoicesPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const invoices = await listInvoicesAction();
  const clientOptions = await db.query.clients.findMany({
    where: (cl, { eq }) => eq(cl.teamId, session.teamId)
  });
  const productOptions = await db.query.products.findMany({
    where: (prod, { eq }) => eq(prod.teamId, session.teamId)
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <p className="mb-4 text-muted-foreground">
        Generate and manage professional invoices, track payment status, and send reminders to clients.
      </p>
      <InvoiceList invoices={invoices} />
      <AddInvoiceForm clients={clientOptions} products={productOptions} />
    </div>
  );
}

import { useState } from "react";

function InvoiceList({ invoices }: { invoices: any[] }) {
  if (!invoices.length) {
    return (
      <div className="rounded-xl border border-muted p-8 text-center">
        <div className="text-lg mb-2 text-zinc-700 dark:text-zinc-200">No invoices yet</div>
        <div className="mb-4 text-muted-foreground">Create your first invoice to start billing clients.</div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {invoices.map(invoice => (
        <div key={invoice.id} className="border rounded p-4 flex justify-between gap-4">
          <div>
            <strong>Status:</strong> {invoice.status} <br />
            <span className="font-mono">{invoice.total} {invoice.currency}</span>
            {invoice.dueDate && (
              <div>
                <span className="text-muted-foreground mr-1">Due:</span>
                <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            {invoice.notes && (
              <div className="text-xs italic">{invoice.notes}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AddInvoiceForm({ clients, products }: { clients: any[]; products: any[] }) {
  const [formState, setFormState] = useState({
    clientId: "",
    currency: "usd",
    dueDate: "",
    notes: "",
    items: []
  });

  const [itemRows, setItemRows] = useState([
    { productId: "", name: "", description: "", quantity: 1, unitPrice: "" }
  ]);

  const handleAddLineItem = () => {
    setItemRows([...itemRows, { productId: "", name: "", description: "", quantity: 1, unitPrice: "" }]);
  };

  const handleRemoveItem = (idx: number) => {
    setItemRows(itemRows.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formState, items: itemRows };
    const parsed = InvoiceInputSchema.safeParse(data);
    if (!parsed.success) {
      alert(parsed.error.issues[0]?.message);
      return;
    }
    const resp = await createInvoiceAction(parsed.data);
    if (resp?.status === 200) {
      setFormState({
        clientId: "",
        currency: "usd",
        dueDate: "",
        notes: "",
        items: []
      });
      setItemRows([{ productId: "", name: "", description: "", quantity: 1, unitPrice: "" }]);
      window.location.reload();
    } else {
      alert(resp?.error || "Failed to create invoice");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-8 p-4 border rounded-lg space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
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
        <input
          className="border rounded px-2 py-1"
          value={formState.dueDate}
          onChange={e => setFormState({ ...formState, dueDate: e.target.value })}
          type="date"
          placeholder="Due date"
        />
        <select
          className="border rounded px-2 py-1"
          value={formState.currency}
          onChange={e => setFormState({ ...formState, currency: e.target.value })}
        >
          <option value="usd">USD</option>
        </select>
        <input
          className="border rounded px-2 py-1"
          value={formState.notes}
          onChange={e => setFormState({ ...formState, notes: e.target.value })}
          placeholder="Invoice notes"
        />
      </div>
      <div>
        <label className="font-semibold">Line Items</label>
        {itemRows.map((item, idx) => (
          <div key={idx} className="flex flex-col md:flex-row gap-2 items-center my-2">
            <select
              className="border rounded px-2 py-1"
              value={item.productId}
              onChange={e => {
                const prod = products.find((p: any) => p.id === e.target.value);
                const name = prod ? prod.name : "";
                setItemRows(rows => rows.map((it, i) => i === idx ? { ...it, productId: e.target.value, name } : it));
              }}
            >
              <option value="">Select product</option>
              {products.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input
              className="border rounded px-2 py-1"
              value={item.name}
              onChange={e => setItemRows(rows => rows.map((it, i) => i === idx ? { ...it, name: e.target.value } : it))}
              placeholder="Item name"
              required
            />
            <input
              className="border rounded px-2 py-1"
              value={item.description}
              onChange={e => setItemRows(rows => rows.map((it, i) => i === idx ? { ...it, description: e.target.value } : it))}
              placeholder="Description"
            />
            <input
              className="border rounded px-2 py-1"
              value={item.quantity}
              onChange={e => setItemRows(rows => rows.map((it, i) => i === idx ? { ...it, quantity: Number(e.target.value) } : it))}
              type="number"
              placeholder="Quantity"
              min="1"
              required
            />
            <input
              className="border rounded px-2 py-1"
              value={item.unitPrice}
              onChange={e => setItemRows(rows => rows.map((it, i) => i === idx ? { ...it, unitPrice: e.target.value } : it))}
              placeholder="Unit price"
              required
            />
            <button type="button" className="rounded border text-xs px-3 py-1 text-red-600" onClick={() => handleRemoveItem(idx)}>Remove</button>
          </div>
        ))}
        <button type="button" className="rounded bg-primary text-white px-4 py-2 mt-2 text-xs" onClick={handleAddLineItem}>Add line item</button>
      </div>
      <button type="submit" className="rounded bg-primary text-white px-6 py-2">Create Invoice</button>
    </form>
  );
}