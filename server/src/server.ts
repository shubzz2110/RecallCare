import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "node:http";
// import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db";

import authRoutes from "./routes/auth";
import internalRoutes from "./routes/internal";
import patientRoutes from "./routes/patient";
import clinicRoutes from "./routes/clinic";
import visitRoutes from "./routes/visit";
import appointmentRoutes from "./routes/appointment";

const PORT = 4000;

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:4000", "http://localhost:5173"],
    credentials: true,
  }),
);

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/internal", internalRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/clinics", clinicRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/appointments", appointmentRoutes);

const startServer = async () => {
  try {
    await connectToDatabase();
    server.listen(PORT, () => {
      console.log(
        `Recallcare Backend server running on http://localhost:${PORT}`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
