import { Request, Response } from "express";
import { Patient } from "../../models/Patient";

export default async function getClinicPatients(req: Request, res: Response) {
  try {
    const clinicId = req.user?.clinicId;
    const { skip, take, search } = req.query;

    const searchStr = search ? String(search) : null;

    const filter = {
      clinic: clinicId,
      ...(searchStr && {
        $or: [
          { name: { $regex: searchStr, $options: "i" } },
          { phone: { $regex: searchStr, $options: "i" } },
        ],
      }),
    };

    const [patients, patientsCount] = await Promise.all([
      Patient.find(filter)
        .skip(skip ? Number(skip) : 0)
        .limit(take ? Number(take) : 0),
      Patient.countDocuments(filter),
    ]);

    return res.json({ success: true, patients, patientsCount });
  } catch (error) {
    console.log("Error while fetching the patients", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
}
