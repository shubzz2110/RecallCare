import { Request, Response } from "express";
import { Appointment, AppointmentStatus } from "../../models/Appointment";
import { Visit } from "../../models/Visit";

export default async function createVisitController(
  req: Request,
  res: Response,
) {
  try {
    const clinicId = req.user?.clinicId!;
    const { patientId, appointmentId, visitDate, notes, followUpDate } =
      req.body;

    // If appointmentId is provided, validate it
    if (appointmentId) {
      const appointment = await Appointment.findOne({
        _id: appointmentId,
        clinic: clinicId,
        patient: patientId,
      });

      if (!appointment)
        return res
          .status(404)
          .json({ success: false, message: "Appointment not found" });

      if (appointment.status !== AppointmentStatus.SCHEDULED)
        return res.status(400).json({
          success: false,
          message: `Cannot create visit for an appointment that is ${String(appointment?.status).toLowerCase()}`,
        });

      // Create visit and mark appointment as completed
      const visit = await Visit.create({
        clinic: clinicId,
        patient: patientId,
        appointment: appointmentId,
        visitDate: visitDate,
        followUpDate,
        notes,
      });

      appointment.status = AppointmentStatus.COMPLETED;
      await appointment.save();

      return res.status(201).json({ success: true, visit });
    }

    // Walk-in — no appointment
    const visit = await Visit.create({
      clinic: clinicId,
      patient: patientId,
      visitDate: visitDate,
      followUpDate,
      notes,
    });

    return res.status(201).json({ success: true, visit });
  } catch (error) {
    console.log("Error creating visit", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
}
