import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { Prisma } from "../../generated/prisma/client";

export default async function getClinicPatients(req: Request, res: Response) {
  try {
    const clinicId = req.user?.clinicId!;
    const { skip, take, search } = req.query;

    const where: Prisma.PatientWhereInput = {
      clinicId,
      ...(search && {
        OR: [
          { name: { contains: String(search), mode: "insensitive" } },
          { phone: { contains: String(search), mode: "insensitive" } },
        ],
      }),
    };

    const [patients, patientsCount] = await prisma.$transaction([
      prisma.patient.findMany({
        where,
        skip: skip ? Number(skip) : undefined,
        take: take ? Number(take) : undefined,
      }),
      prisma.patient.count({ where }),
    ]);

    return res.json({ success: true, patients, patientsCount });
  } catch (error) {
    console.log("Error while fetching the patients", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
}
