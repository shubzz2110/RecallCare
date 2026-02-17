import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export default async function getClinicPatients(req: Request, res: Response) {
  try {
    const clinicId = req.user?.clinicId!;
    const { skip, take, search } = req.query;

    const patients = await prisma.patient.findMany({
      where: {
        clinicId,
        ...(search && {
          OR: [
            { name: { contains: String(search), mode: "insensitive" } },
            { phone: { contains: String(search), mode: "insensitive" } },
          ],
        }),
      },
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });

    return res.json({ success: true, patients });
  } catch (error) {
    console.log("Error while fetching the patients", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
}
