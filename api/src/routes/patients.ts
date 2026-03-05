import express from "express";

const patientsRouter = express.Router();

import { createPatientController } from "../controllers/patient/create-patient";
import validate from "../middleware/validate";
import {
  createPatientSchema,
  updatePatientSchema,
} from "../validations/patient";
import { authenticate, requireRole } from "../middleware/auth";
import { getClinicPatientsController } from "../controllers/patient/get-clinic-patients";
import { updatePatientController } from "../controllers/patient/update-patient";
import { deletePatientController } from "../controllers/patient/delete-patient";

patientsRouter.post(
  "/",
  [
    validate({ body: createPatientSchema }),
    authenticate,
    requireRole("CLINIC"),
  ],
  createPatientController,
);

patientsRouter.get(
  "/",
  [authenticate, requireRole("CLINIC")],
  getClinicPatientsController,
);

patientsRouter.put(
  "/:id",
  [
    validate({ body: updatePatientSchema }),
    authenticate,
    requireRole("CLINIC"),
  ],
  updatePatientController,
);

patientsRouter.delete(
  "/:id",
  [authenticate, requireRole("CLINIC")],
  deletePatientController,
);

export default patientsRouter;
