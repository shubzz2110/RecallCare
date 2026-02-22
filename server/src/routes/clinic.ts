import express from "express";
import { getClinicController } from "../controllers/clinic/get-clinic";
import validate from "../middleware/validate";
import { getClinicSchema } from "../validations/clinic";
import { authenticate, requireRole } from "../middleware/auth";

const clinicRouter = express.Router();

clinicRouter.get(
  "/:clinicId",
  [validate({ params: getClinicSchema }), authenticate, requireRole("CLINIC")],
  getClinicController,
);

export default clinicRouter;
