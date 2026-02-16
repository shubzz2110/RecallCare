import z from "zod";

export const createClinicSchema = z.object({
  clinicName: z.string().min(3),
  doctorName: z.string().min(3),
  doctorEmail: z.email(),
  phone: z.string().min(10),
});
