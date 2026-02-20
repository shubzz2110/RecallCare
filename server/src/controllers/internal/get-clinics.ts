import { Request, Response } from "express";
import { Clinic } from "../../models/Clinic";

const getClinicsController = async (req: Request, res: Response) => {
  try {
    const clinics = await Clinic.find().populate({
      path: "users",
      select: "name email isActive",
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
