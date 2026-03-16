"use client";

import { useRef, useState } from "react";
import { createClientAction, ClientInputSchema } from "@/app/dashboard/clients/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function ClientsForm({ afterCreate }: { afterCreate?: () => void }) {
  const [status, setStatus] = useState<null | { success?: string; error?: string }>(null);

  const form = useForm<z.infer<typeof ClientInputSchema>>({
    resolver: zodResolver(ClientInputSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      taxId: "",
      notes: "",
      billingInfo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ClientInputSchema>) {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, (v ?? "").toString()));
    const result = await createClientAction(fd);
    if (result?.error) {
      setStatus({ error: result.error });
    } else {
      setStatus({ success: "Client created!" });
      form.reset();
      afterCreate?.();
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 bg-background border rounded-xl space-y-4 max-w-xl mx-auto mt-8">
      <div className="space-y-2">
        <Label htmlFor="name">Client Name*</Label>
        <Input id="name" {...form.register("name")} placeholder="Acme Corp" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" {...form.register("email")} type="email" placeholder="example@client.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input id="company" {...form.register("company")} placeholder="Acme Corporation" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" {...form.register("phone")} placeholder="+1 555-1234" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" {...form.register("address")} placeholder="123 Main St, City" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="taxId">Tax ID</Label>
        <Input id="taxId" {...form.register("taxId")} placeholder="VAT/Tax ID" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" {...form.register("notes")} placeholder="Key client notes..." />
      </div>
      <div className="pt-4 flex justify-end gap-2">
        <Button type="submit" className="font-semibold">Create client</Button>
      </div>
      {status?.success ? (
        <div className="mt-2 text-green-700 dark:text-green-400 font-medium">{status.success}</div>
      ) : status?.error ? (
        <div className="mt-2 text-red-700 dark:text-red-400 font-medium">{status.error}</div>
      ) : null}
    </form>
  );
}