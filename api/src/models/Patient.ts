import mongoose, { Document, Types } from "mongoose";

export interface IPatient extends Document {
  name: string;
  phone: string;
  clinic: Types.ObjectId;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new mongoose.Schema<IPatient>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

patientSchema.index({ phone: 1, clinic: 1 }, { unique: true });
patientSchema.index({ name: 1 });
patientSchema.index({ clinic: 1 });

export const Patient = mongoose.model<IPatient>("Patient", patientSchema);
