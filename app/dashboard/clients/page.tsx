import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { ClientsForm } from "@/components/dashboard/clients-form";
import { ClientsList } from "@/components/dashboard/clients-list";

export default async function ClientsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <p className="mb-4 text-muted-foreground">
        Manage your business’s customers: add, track, and view all client profiles and payment activity.
      </p>
      <ClientsForm />
      <ClientsList />
    </div>
  );
}