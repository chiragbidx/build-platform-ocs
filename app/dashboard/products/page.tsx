import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";

export default async function ProductsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products & Services</h1>
      <p className="mb-4 text-muted-foreground">
        Define and manage billable products or services: set prices, update details, and organize what you offer clients.
      </p>
      {/* Product list and CRUD UI will go here */}
      <div className="rounded-xl border border-muted p-8 text-center">
        <div className="text-lg mb-2 text-zinc-700 dark:text-zinc-200">No products/services yet</div>
        <div className="mb-4 text-muted-foreground">Add a product or service to get started.</div>
        <button className="rounded bg-primary text-white px-6 py-2 font-semibold hover:bg-primary/90">Add product/service</button>
      </div>
    </div>
  );
}