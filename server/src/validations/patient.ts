import { z } from "zod";

export const patientSearchSchema = z.object({
  phone: z.string().min(10),
});

export const createPatientSchema = z.object({
  phone: z.string().min(10),
  name: z.string(),
  notes: z.string().optional(),
});

export const getPatientSchema = z.object({
  patientId: z.string(),
});
