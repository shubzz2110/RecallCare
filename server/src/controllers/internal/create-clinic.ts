import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import crypto from "crypto";
import { FRONTEND_URL } from "../../config/env";
import bcrypt from "bcryptjs";

const createClinicController = async (req: Request, res: Response) => {
  try {
    const { clinicName, doctorName, doctorEmail, phone } = req.body;

    // Check for email exists
    const user = await prisma.user.findUnique({
      where: { email: doctorEmail },
    });

    if (user)
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });

    const setupToken = crypto.randomBytes(32).toString("hex");

    // Creating clinic and user in the transaction
    await prisma.$transaction(async (tx) => {
      const clinic = await tx.clinic.create({
        data: {
          name: clinicName,
          phone: `+91${phone}`,
        },
      });

      const user = await tx.user.create({
        data: {
          name: doctorName,
          email: doctorEmail,
          clinicId: clinic.id,
          role: "CLINIC",
          setupToken: setupToken,
        },
      });
      return { clinic, user };
    });

    const setupLink = `${FRONTEND_URL}/setup-password?token=${setupToken}`;
    console.log(setupLink);

    console.log(
      `[EMAIL TO CLINIC]: Your account with Recallcare has been created, please click on ${setupLink} to set up password and onboard`,
    );
    return res.json({ success: true, message: "Clinic created successfully" });
  } catch (error) {
    console.log("Error creating clinic", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export default createClinicController;
