import mongoose, { Document, Types } from "mongoose";

export interface IClinic extends Document {
  name: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClinicSchema = new mongoose.Schema<IClinic>(
  {
    name: {
      type: String,
      required: true,
    },
    phone: { type: String, minLength: [10, "Invalid phone"] },
    address: { type: String },
    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ClinicSchema.virtual("users", {
  ref: "User",
  localField: "_id",
  foreignField: "clinic",
});

export const Clinic = mongoose.model<IClinic>("Clinic", ClinicSchema);
