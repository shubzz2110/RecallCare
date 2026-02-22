import mongoose, { Document, Types } from "mongoose";

export interface IVisit extends Document {
  clinic: Types.ObjectId;
  patient: Types.ObjectId;
  appointment?: Types.ObjectId;
  visitDate: Date;
  followUpDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VisitSchema = new mongoose.Schema<IVisit>(
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
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    visitDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    followUpDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

VisitSchema.index({ clinic: 1, visitDate: 1 });
VisitSchema.index({ patient: 1 });
VisitSchema.index({ appointment: 1 });

export const Visit = mongoose.model<IVisit>("Visit", VisitSchema);
