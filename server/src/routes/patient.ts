import express from "express";
import validate from "../middleware/validate";
import {
  createPatientSchema,
  patientSearchSchema,
} from "../validations/patient";
import { authenticate, requireRole } from "../middleware/auth";
import searchPatientController from "../controllers/patient/search";
import createPatientController from "../controllers/patient/create";
import getClinicPatients from "../controllers/patient/get-clinic-patients";

const patientRouter = express.Router();

patientRouter.get(
  "/search-patient",
  [
    validate({ query: patientSearchSchema }),
    authenticate,
    requireRole("CLINIC"),
  ],
  searchPatientController,
);

patientRouter.post(
  "",
  [
    validate({ body: createPatientSchema }),
    authenticate,
    requireRole("CLINIC"),
  ],
  createPatientController,
);

patientRouter.get("", [authenticate, requireRole("CLINIC")], getClinicPatients);

export default patientRouter;
