import { Request, Response } from "express";
import { Clinic } from "../../models/Clinic";

export async function getClinicController(req: Request, res: Response) {
  try {
    const { clinicId } = req.params;
    const clinic = await Clinic.findOne({ _id: String(clinicId) }).select(
      "name",
    );
    return res.json({ success: true, clinic });
  } catch (error) {
    console.log("Error while fetching the clinic", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
}
