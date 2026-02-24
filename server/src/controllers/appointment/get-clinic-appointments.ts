import { Request, Response } from "express";
import { Appointment } from "../../models/Appointment";

export default async function getClinicAppointmentsController(
  req: Request,
  res: Response,
) {
  try {
    const appointments = await Appointment.find({
      clinic: req.user?.clinicId,
    })
      .sort({ scheduledDate: "descending" })
      .populate({
        path: "patient",
        select: "name phone",
      });
    return res.json({ success: true, appointments });
  } catch (error) {
    console.log("Error while fetching appointments", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
}
