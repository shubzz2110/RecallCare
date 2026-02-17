import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "node:http";
// import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

// Routes imports
import internalRoutes from "./routes/internal";
import authRoutes from "./routes/auth";
import testRoute from "./routes/test";
import patientRoutes from "./routes/patient";

const PORT = process.env.PORT || 8000;

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
app.use("/api", testRoute);
app.use("/api/patients", patientRoutes);

const startServer = async () => {
  try {
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
