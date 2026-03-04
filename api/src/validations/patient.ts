import { z } from "zod";

export const createPatientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
});

export const updatePatientSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  phone: z.string().min(1, "Phone number is required").optional(),
});
