import { Request, Response } from "express";
import { Appointment } from "../../models/Appointment";

export default async function createAppointmentController(
  req: Request,
  res: Response,
) {
  try {
    const { patientId, scheduledDate } = req.body;
    await Appointment.create({
      patient: patientId,
      scheduledDate: scheduledDate,
      clinic: req.user?.clinicId!,
    });
    return res.json({ success: true, message: "Appointment created" });
  } catch (error) {
    console.log("Error while creating appointment", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
}
