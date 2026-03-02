import mongoose, { Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

export enum Role {
  "CLINIC",
  "ADMIN",
}

export interface IUser extends Document {
  name?: string;
  email: string;
  role: string;
  password?: string;
  setupToken?: string;
  isActive: boolean;
  clinic?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      immutable: true,
    },
    role: {
      type: String,
      enum: ["CLINIC", "ADMIN"],
      default: "CLINIC",
      required: true,
    },
    password: {
      type: String,
      select: false,
    },
    setupToken: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
    },
  },
  { timestamps: true },
);

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User = mongoose.model<IUser>("User", UserSchema);
