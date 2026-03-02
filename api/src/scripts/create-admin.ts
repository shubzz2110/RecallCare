import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/User";
import mongoose from "mongoose";
import connectToDatabase from "../config/db";

async function main() {
  connectToDatabase();
  const email = "homkar1997@gmail.com";
  const password = "AdminPassword123!";
  const name = "Shubham Homkar";

  // check if already exists
  const existing = await User.findOne({ email });

  if (existing) {
    console.log("Admin already exists");
    return;
  }

  await User.create({
    email,
    name,
    password: password,
    role: "ADMIN",
    isActive: true,
  });

  console.log("Admin user created successfully!");
  console.log("Login email:", email);
  console.log("Login password:", password);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await mongoose.disconnect();
    console.log("Database connection closed successfully");
  });
