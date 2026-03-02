import express from "express";
import loginController from "../controllers/auth/login";
import validate from "../middleware/validate";
import { loginSchema, setPasswordSchema } from "../validations/auth";
import refreshTokenController from "../controllers/auth/refresh-token";
import logoutController from "../controllers/auth/logout";
import setPassword from "../controllers/auth/set-password";

const authRouter = express.Router();

authRouter.post("/login", [validate({ body: loginSchema })], loginController);
authRouter.post("/token/refresh", refreshTokenController);
authRouter.post("/logout", logoutController);
authRouter.post(
  "/set-password",
  validate({ body: setPasswordSchema }),
  setPassword,
);

export default authRouter;
