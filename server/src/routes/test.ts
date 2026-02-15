import express, { Request, Response } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { prisma } from "../config/prisma";
const router = express.Router();

router.get(
  "/test",
  [authenticate, requireRole("ADMIN")],
  async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany();
      return res.json({ users });
    } catch (error) {
      console.log(error);
    }
  },
);

export default router;
