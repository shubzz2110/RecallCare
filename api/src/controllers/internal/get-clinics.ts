import { Request, Response } from "express";
import { Clinic } from "../../models/Clinic";

const getClinicsController = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const search = (req.query.search as string)?.trim() || "";
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [clinics, totalClinics] = await Promise.all([
      Clinic.find(filter)
        .populate({ path: "users", select: "name email isActive" })
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      Clinic.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalClinics / limit);

    return res.json({
      success: true,
      clinics,
      pagination: {
        page,
        limit,
        totalClinics,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.log("Error fetching clinics", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export default getClinicsController;
