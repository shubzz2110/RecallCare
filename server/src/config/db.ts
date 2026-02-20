import mongoose from "mongoose";
import { MONGO_URI } from "./env";

const connectToDatabase = async () => {
  const mongoURI = MONGO_URI!;

  if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
