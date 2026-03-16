import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { listProductsAction, createProductAction, updateProductAction, deleteProductAction, ProductInputSchema } from "./actions";
import { z } from "zod";

export default async function ProductsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const products = await listProductsAction();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products & Services</h1>
      <p className="mb-4 text-muted-foreground">
        Define and manage billable products or services: set prices, update details, and organize what you offer clients.
      </p>
      <ProductList products={products} />
      <AddProductForm />
    </div>
  );
}

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";

function ProductList({ products }: { products: any[] }) {
  if (!products.length) {
    return (
      <div className="rounded-xl border border-muted p-8 text-center">
        <div className="text-lg mb-2 text-zinc-700 dark:text-zinc-200">No products/services yet</div>
        <div className="mb-4 text-muted-foreground">Add a product or service to get started.</div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductRow key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductRow({ product }: { product: any }) {
  const [editing, setEditing] = useState(false);
  const [formState, setFormState] = useState(product);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = ProductInputSchema.safeParse(formState);
    if (!parsed.success) {
      alert(parsed.error.issues[0]?.message);
      return;
    }
    const resp = await updateProductAction(product.id, parsed.data);
    if (resp?.status === 200) setEditing(false);
    else alert(resp?.error || "Failed to update");
  };

  return (
    <div className="border rounded p-4 flex flex-col md:flex-row md:items-center gap-4">
      {editing ? (
        <form onSubmit={handleEdit} className="flex flex-col md:flex-row gap-2 flex-1">
          <input className="border rounded px-2 py-1" value={formState.name} onChange={e => setFormState({ ...formState, name: e.target.value })} />
          <input className="border rounded px-2 py-1" value={formState.description || ""} onChange={e => setFormState({ ...formState, description: e.target.value })} placeholder="Description" />
          <input className="border rounded px-2 py-1" value={formState.price} onChange={e => setFormState({ ...formState, price: e.target.value })} placeholder="Price" />
          <select className="border rounded px-2 py-1" value={formState.currency} onChange={e => setFormState({ ...formState, currency: e.target.value })}>
            <option value="usd">USD</option>
          </select>
          <select className="border rounded px-2 py-1" value={formState.type} onChange={e => setFormState({ ...formState, type: e.target.value })}>
            <option value="one_time">One Time</option>
            <option value="recurring">Recurring</option>
          </select>
          {formState.type === "recurring" && (
            <input className="border rounded px-2 py-1" value={formState.interval || ""} onChange={e => setFormState({ ...formState, interval: e.target.value })} placeholder="Interval (e.g., month, year)" />
          )}
          <button type="submit" className="rounded bg-primary text-white px-4 py-2">Save</button>
          <button type="button" className="rounded border px-4 py-2 ml-2" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <div className="flex-1">
            <strong>{product.name}</strong> — {product.description || <span className="italic text-muted-foreground">No description</span>}<br />
            <span className="font-mono">{product.price} {product.currency} {product.type}{product.interval ? ` / ${product.interval}` : ""}</span>
          </div>
          <button className="rounded border px-4 py-2 text-xs" onClick={() => setEditing(true)}>Edit</button>
          <button className="rounded border px-4 py-2 text-xs ml-2 text-red-600" onClick={async () => {
            if (confirm("Delete this product?")) {
              await deleteProductAction(product.id);
              window.location.reload();
            }
          }}>Delete</button>
        </>
      )}
    </div>
  );
}

function AddProductForm() {
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    price: "",
    currency: "usd",
    type: "one_time",
    interval: "",
    status: "active",
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = ProductInputSchema.safeParse(formState);
    if (!parsed.success) {
      alert(parsed.error.issues[0]?.message);
      return;
    }
    const resp = await createProductAction(parsed.data);
    if (resp?.status === 200) {
      setFormState({ name: "", description: "", price: "", currency: "usd", type: "one_time", interval: "", status: "active" });
      window.location.reload();
    } else {
      alert(resp?.error || "Failed to create product");
    }
  };

  return (
    <form onSubmit={handleAddProduct} className="my-8 p-4 border rounded-lg flex flex-col md:flex-row gap-2 items-center">
      <input className="border rounded px-2 py-1" value={formState.name} onChange={e => setFormState({ ...formState, name: e.target.value })} placeholder="Name" />
      <input className="border rounded px-2 py-1" value={formState.description} onChange={e => setFormState({ ...formState, description: e.target.value })} placeholder="Description" />
      <input className="border rounded px-2 py-1" value={formState.price} onChange={e => setFormState({ ...formState, price: e.target.value })} placeholder="Price" />
      <select className="border rounded px-2 py-1" value={formState.currency} onChange={e => setFormState({ ...formState, currency: e.target.value })}>
        <option value="usd">USD</option>
      </select>
      <select className="border rounded px-2 py-1" value={formState.type} onChange={e => setFormState({ ...formState, type: e.target.value })}>
        <option value="one_time">One Time</option>
        <option value="recurring">Recurring</option>
      </select>
      {formState.type === "recurring" && (
        <input className="border rounded px-2 py-1" value={formState.interval} onChange={e => setFormState({ ...formState, interval: e.target.value })} placeholder="Interval (e.g., month, year)" />
      )}
      <button type="submit" className="rounded bg-primary text-white px-4 py-2">Add Product</button>
    </form>
  );
}