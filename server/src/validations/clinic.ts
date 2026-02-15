import z from "zod";

export const createClinicSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  phone: z.string().min(10),
});
