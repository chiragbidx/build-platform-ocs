import { z } from "zod";

export const ClientInputSchema = z.object({
  name: z.string().min(1, "Client name is required."),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  taxId: z.string().optional().or(z.literal("")),
  billingInfo: z.string().optional(),
  notes: z.string().optional(),
});

export type ClientInputType = z.infer<typeof ClientInputSchema>;