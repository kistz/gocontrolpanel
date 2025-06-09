import { z } from "zod";

export const CreateInterfaceSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export type CreateInterfaceSchemaType = z.infer<typeof CreateInterfaceSchema>;
