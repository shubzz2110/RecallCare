import { z } from "zod";

export const createVisitSchema = z.object({
  patientId: z.string(),
  visitDate: z.string(),
  notes: z.string().optional(),
  followUpDate: z.string().optional(),
  appointment: z.string().optional(),
});

export const getPatientVisitsSchema = z.object({
  patientId: z.string(),
});
