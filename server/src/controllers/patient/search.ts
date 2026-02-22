import { Request, Response } from "express";
import { Patient } from "../../models/Patient";

export default async function searchPatientController(
  req: Request,
  res: Response,
) {
  try {
    const { phone } = req.query as any;

    const patient = await Patient.findOne({ phone }).select(["name", "phone"]);
    return res.json({ success: true, patient });
  } catch (error) {
    console.log("Error while searching a patient", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
}
