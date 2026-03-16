import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { listProductsAction } from "./actions";
import ProductList from "./ProductList";

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
    </div>
  );
}