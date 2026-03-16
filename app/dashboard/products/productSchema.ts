import { z } from "zod";

export const ProductInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price"),
  currency: z.string().default("usd"),
  type: z.enum(["one_time", "recurring"]),
  interval: z.string().optional(),
  status: z.string().default("active"),
});

export type ProductInputType = z.infer<typeof ProductInputSchema>;