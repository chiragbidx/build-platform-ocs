import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { ClientDetails } from "@/components/dashboard/client-details";

export default async function ClientDetailPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");
  return (
    <div className="p-6">
      <ClientDetails />
    </div>
  );
}