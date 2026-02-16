import express from "express";
import createClinicController from "../controllers/internal/create-clinic";
import validate from "../middleware/validate";
import { createClinicSchema } from "../validations/clinic";
import getClinicsController from "../controllers/internal/get-clinics";
import { authenticate, requireRole } from "../middleware/auth";

const internalRouter = express.Router();

internalRouter.post(
  "/clinics",
  [authenticate, validate({ body: createClinicSchema }), requireRole("ADMIN")],
  createClinicController,
);

internalRouter.get(
  "/clinics",
  [authenticate, requireRole("ADMIN")],
  getClinicsController,
);

export default internalRouter;
