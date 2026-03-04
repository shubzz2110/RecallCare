import { Request, Response } from "express";
import { Patient } from "../../models/Patient";

export async function createPatientController(req: Request, res: Response) {
  try {
    const { name, phone } = req.body;
    const clinicId = req.user?.clinicId;

    const isPatientExists = await Patient.findOne({
      phone,
      clinic: clinicId,
    });

    if (isPatientExists) {
      return res.status(409).json({
        success: false,
        message: "Patient already exists with this phone number",
      });
    }

    const newPatient = new Patient({
      name,
      phone,
      clinic: clinicId,
    });

    const savedPatient = await newPatient.save();

    return res.status(201).json({ success: true, data: savedPatient });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
}
