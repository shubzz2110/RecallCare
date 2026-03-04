import mongoose, { Document, Types } from "mongoose";

export interface PatientVisit extends Document {
  patient: Types.ObjectId;
  clinic: Types.ObjectId;
  visitDate: Date;
  followUpDate?: Date;
  docterNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const patientVisitSchema = new mongoose.Schema<PatientVisit>(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    visitDate: { type: Date, required: true },
    followUpDate: { type: Date },
    docterNotes: { type: String },
  },
  { timestamps: true },
);

patientVisitSchema.index({ patient: 1 });
patientVisitSchema.index({ clinic: 1 });
patientVisitSchema.index({ visitDate: -1 });

export const PatientVisitModel = mongoose.model<PatientVisit>(
  "PatientVisit",
  patientVisitSchema,
);
