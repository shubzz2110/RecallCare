import express from "express";
import createAppointmentController from "../controllers/appointment/create-appointment";
import validate from "../middleware/validate";
import { createAppointmentSchema } from "../validations/appointment";
import { authenticate, requireRole } from "../middleware/auth";
import getClinicAppointmentsController from "../controllers/appointment/get-clinic-appointments";

const appointmentRouter = express.Router();

appointmentRouter.post(
  "",
  [
    validate({ body: createAppointmentSchema }),
    authenticate,
    requireRole("CLINIC"),
  ],
  createAppointmentController,
);

appointmentRouter.get(
  "/clinic-appointments",
  [authenticate, requireRole("CLINIC")],
  getClinicAppointmentsController,
);

export default appointmentRouter;
