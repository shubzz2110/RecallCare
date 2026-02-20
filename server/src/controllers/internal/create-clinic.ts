import { Request, Response } from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import { FRONTEND_URL } from "../../config/env";
import { User } from "../../models/User";
import { Clinic } from "../../models/Clinic";

const createClinicController = async (req: Request, res: Response) => {
  try {
    const { clinicName, doctorName, doctorEmail, phone } = req.body;

    const existingUser = await User.findOne({ email: doctorEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const setupToken = crypto.randomBytes(32).toString("hex");

    const clinic = await Clinic.create({
      name: clinicName,
      phone: `+91${phone}`,
    });

    try {
      await User.create({
        name: doctorName,
        email: doctorEmail,
        clinic: clinic._id,
        role: "CLINIC",
        setupToken,
      });
    } catch (userError) {
      // Rollback clinic if user creation fails
      await Clinic.findByIdAndDelete(clinic._id);
      throw userError;
    }

    const setupLink = `${FRONTEND_URL}/setup-password?token=${setupToken}`;
    console.log(`[EMAIL TO CLINIC]: setup link ${setupLink}`);

    return res.json({ success: true, message: "Clinic created successfully" });
  } catch (error) {
    console.log("Error creating clinic", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export default createClinicController;
