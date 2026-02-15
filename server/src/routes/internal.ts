import express from "express";
import createClinicController from "../controllers/internal/create-clinic";
import validate from "../middleware/validate";
import { createClinicSchema } from "../validations/clinic";

const internalRouter = express.Router();

internalRouter.post(
  "/clinics",
  [validate({ body: createClinicSchema })],
  createClinicController,
);

export default internalRouter;
