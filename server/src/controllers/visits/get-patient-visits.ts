import { Request, Response } from "express";
import { Visit } from "../../models/Visit";

export default async function getPatientVisitsController(
  req: Request,
  res: Response,
) {
  try {
    const patientId = req.query.patientId!;
    const clinicId = req.user?.clinicId!;

    const visits = await Visit.find({
      clinic: clinicId,
      patient: patientId,
    }).sort({ visitDate: "desc" });

    return res.json({ success: true, visits });
  } catch (error) {
    console.log("Error while fetching the patient visits", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
}
