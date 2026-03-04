import { Request, Response } from "express";
import { Patient } from "../../models/Patient";

export async function updatePatientController(req: Request, res: Response) {
  try {
    const patientId = req.params.id;
    const clinicId = req.user?.clinicId;
    const { name, phone } = req.body;

    const patient = await Patient.findOne({ _id: patientId, clinic: clinicId });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    if (name) patient.name = name;
    if (phone) patient.phone = phone;

    const updatedPatient = await patient.save();

    return res.json({ success: true, data: updatedPatient });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
}
