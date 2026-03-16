"use client";

import { useEffect, useState } from "react";
import { listClientsAction } from "@/app/dashboard/clients/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Client = {
  id: string;
  name: string;
  email?: string | null;
  company?: string | null;
  status: string;
  createdAt: string;
};

export function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      setLoading(true);
      const result = await listClientsAction();
      setClients(result ?? []);
      setLoading(false);
    }
    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading clients...
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="rounded-xl border border-muted p-8 text-center bg-muted/30">
        <div className="text-lg mb-2 text-zinc-700 dark:text-zinc-200">No clients yet</div>
        <div className="mb-4 text-muted-foreground">Get started by adding your first client.</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-muted bg-muted/30 mt-6">
      <table className="w-full">
        <thead>
          <tr className="bg-muted">
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Name</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Company</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Email</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Status</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-card/50 group transition">
              <td className="p-3 font-semibold">
                <Link href={`/dashboard/clients/${client.id}`} className="underline underline-offset-2">
                  {client.name}
                </Link>
              </td>
              <td className="p-3">{client.company || <span className="text-muted-foreground">—</span>}</td>
              <td className="p-3">{client.email || <span className="text-muted-foreground">—</span>}</td>
              <td className="p-3">
                <span
                  className={{
                    active: "text-emerald-600 dark:text-emerald-400",
                    archived: "text-muted-foreground line-through",
                  }[client.status] || "text-muted-foreground"}
                >
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </span>
              </td>
              <td className="p-3 text-right">
                <Button size="sm" asChild>
                  <Link href={`/dashboard/clients/${client.id}`}>Details</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}