import mongoose, { Document, Types } from "mongoose";

export enum AppointmentStatus {
  SCHEDULED,
  COMPLETED,
  MISSED,
  CANCELLED,
}

export interface IAppointment extends Document {
  clinic: Types.ObjectId;
  patient: Types.ObjectId;
  scheduledDate: Date;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new mongoose.Schema<IAppointment>(
  {
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus[0],
      required: true,
    } as any,
  },
  { timestamps: true },
);

AppointmentSchema.index({ clinic: 1, scheduledDate: 1 });
AppointmentSchema.index({ clinic: 1, status: 1 });
AppointmentSchema.index({ patient: 1 });

export const Appointment = mongoose.model<IAppointment>(
  "Appointment",
  AppointmentSchema,
);
