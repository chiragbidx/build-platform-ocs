import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";

export default async function ClientsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <p className="mb-4 text-muted-foreground">
        Manage your business’s customers: add, track, and view all client profiles and payment activity.
      </p>
      {/* Client list and CRUD UI will go here */}
      <div className="rounded-xl border border-muted p-8 text-center">
        <div className="text-lg mb-2 text-zinc-700 dark:text-zinc-200">No clients yet</div>
        <div className="mb-4 text-muted-foreground">Get started by adding your first client.</div>
        <button className="rounded bg-primary text-white px-6 py-2 font-semibold hover:bg-primary/90">Add client</button>
      </div>
    </div>
  );
}