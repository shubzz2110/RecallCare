import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export async function getPatientController(req: Request, res: Response) {
  try {
    const { patientId } = req.params;
    const patient = await prisma.patient.findUnique({
      where: { id: String(patientId) },
    });
    return res.json({ success: true, patient });
  } catch (error) {
    console.log("Error while fetching the patient", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
}
