import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
const getClinicsController = async (req: Request, res: Response) => {
  try {
    const clinics = await prisma.clinic.findMany({
      include: {
        users: {
          select: { name: true, email: true, isActive: true },
        },
      },
    });
    return res.json({ success: true, clinics });
  } catch (error) {
    console.log("Error fetching clinics", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export default getClinicsController;
