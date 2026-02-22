import express from "express";
import createVisitController from "../controllers/visits/create-visit";
import validate from "../middleware/validate";
import {
  createVisitSchema,
  getPatientVisitsSchema,
} from "../validations/visit";
import { authenticate, requireRole } from "../middleware/auth";
import getPatientVisitsController from "../controllers/visits/get-patient-visits";

const visitRouter = express.Router();

visitRouter.post(
  "",
  [validate({ body: createVisitSchema }), authenticate, requireRole("CLINIC")],
  createVisitController,
);

visitRouter.get(
  "/patient-visits",
  [
    validate({ query: getPatientVisitsSchema }),
    authenticate,
    requireRole("CLINIC"),
  ],
  getPatientVisitsController,
);

export default visitRouter;
