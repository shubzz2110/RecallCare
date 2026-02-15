import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import crypto from "crypto";
import { FRONTEND_URL } from "../../config/env";

const createClinicController = async (req: Request, res: Response) => {
  // try {
  //   const { name, email, phone } = req.body;
  //   const isclinicExists = await prisma.clinic.findUnique({ where: email });
  //   // Check clinic email existence
  //   if (isclinicExists)
  //     return res.status(400).json({
  //       success: false,
  //       message: "Clinic with this email already exists",
  //     });
  //   // Creating a temporary setup token
  //   const setupToken = crypto.randomBytes(32).toString("hex");
  //   // Create a clinic and send create password link via email
  //   await prisma.clinic.create({
  //     data: {
  //       name,
  //       email,
  //       phone,
  //       password: null,
  //       setupToken,
  //     },
  //   });
  //   const setupLink = `${FRONTEND_URL}/setup-password?token=${setupToken}`;
  //   console.log(setupLink);
  //   return res.json({ success: true, message: "Clinic Created" });
  // } catch (error) {
  //   console.log("Error creating clinic", error);
  //   return res
  //     .status(500)
  //     .json({ success: false, message: "Internal server error", error });
  // }
};

export default createClinicController;
