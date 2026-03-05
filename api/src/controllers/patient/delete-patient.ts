import { Request, Response } from "express";
import { Patient } from "../../models/Patient";

export async function deletePatientController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const patient = await Patient.deleteOne({ _id: id });

    if (patient.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    return res.json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    console.log("Error deleting patient: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
}
