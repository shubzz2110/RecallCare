import mongoose, { Document, Types } from "mongoose";

export interface IPatient extends Document {
  name: string;
  phone: string;
  notes?: string;
  clinic: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new mongoose.Schema<IPatient>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
  },
  { timestamps: true },
);

PatientSchema.index({ phone: 1, clinic: 1 }, { unique: true });
PatientSchema.index({ name: 1 });
PatientSchema.index({ clinic: 1 });

export const Patient = mongoose.model<IPatient>("Patient", PatientSchema);
