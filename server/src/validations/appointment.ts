import { z } from "zod";

export const createAppointmentSchema = z.object({
  patientId: z.string(),
  scheduledDate: z.string(),
});
