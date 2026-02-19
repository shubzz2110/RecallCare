import { Request, Response } from "express";

export default async function CreateAppointment(req: Request, res: Response) {
  try {
    const {} = req.body;
  } catch (error) {
    console.log("Error creating appointment", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
}
