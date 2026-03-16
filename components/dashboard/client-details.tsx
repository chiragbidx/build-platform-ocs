"use client";

import { useEffect, useState } from "react";
import { fetchClientDetail } from "@/app/dashboard/clients/[clientId]/actions";
import { useParams } from "next/navigation";
import { ClientNotes } from "@/components/dashboard/client-notes";
import { ClientProjects } from "@/components/dashboard/client-projects";

export function ClientDetails() {
  const { clientId } = useParams();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      if (!clientId || typeof clientId !== "string") return;
      setLoading(true);
      const data = await fetchClientDetail(clientId);
      setClient(data);
      setLoading(false);
    }
    getData();
  }, [clientId]);

  if (loading) {
    return <div className="py-12 text-center text-muted-foreground">Loading client details...</div>;
  }

  if (!client) {
    return <div className="p-12 text-center text-destructive">Client not found or permission denied.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{client.name}</h1>
      <div className="mb-4 text-muted-foreground">
        <span className="font-semibold">Company: </span>{client.company || <span className="text-muted-foreground">—</span>}<br />
        <span className="font-semibold">Email: </span>{client.email || <span className="text-muted-foreground">—</span>}<br />
        <span className="font-semibold">Phone: </span>{client.phone || <span className="text-muted-foreground">—</span>}<br />
        <span className="font-semibold">Address: </span>{client.address || <span className="text-muted-foreground">—</span>}
      </div>
      <div className="mb-6">
        <span className="font-semibold">Notes: </span>{client.notes || <span className="text-muted-foreground">—</span>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Recent Notes</h2>
          <ClientNotes clientId={client.id} initialNotes={client.notes || []} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          <ClientProjects projects={client.projects || []} />
        </div>
      </div>
    </div>
  );
}