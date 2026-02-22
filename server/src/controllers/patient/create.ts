import { Request, Response } from "express";
import { Patient } from "../../models/Patient";

export default async function createPatientController(
  req: Request,
  res: Response,
) {
  try {
    const { phone, name, notes } = req.body;
    const patient = await Patient.create({
      phone,
      name,
      notes,
      clinic: req.user?.clinicId!,
    });
    return res.json({ success: true, message: "Patient created", patient });
  } catch (error) {
    console.log("Error while creating a patient", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
}
