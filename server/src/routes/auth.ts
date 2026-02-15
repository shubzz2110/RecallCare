import express from "express";
import loginController from "../controllers/auth/login";
import validate from "../middleware/validate";
import { loginSchema } from "../validations/auth";
import refreshTokenController from "../controllers/auth/refresh";
import logoutController from "../controllers/auth/logout";

const authRouter = express.Router();

authRouter.post("/login", [validate({ body: loginSchema })], loginController);
authRouter.post("/token/refresh", refreshTokenController);
authRouter.post("/logout", logoutController);

export default authRouter;
