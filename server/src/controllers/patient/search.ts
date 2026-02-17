import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export default async function searchPatientController(
  req: Request,
  res: Response,
) {
  try {
    const { phone } = req.query as any;

    const patient = await prisma.patient.findUnique({
      where: { phone },
      select: { name: true, phone: true },
    });
    return res.json({ success: true, patient });
  } catch (error) {
    console.log("Error while searching a patient", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
}
