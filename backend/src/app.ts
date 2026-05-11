import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Load env before importing config
dotenv.config();

import { config } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";

const app = express();

// ──────────────────────────────────────────────────────────────
// Middlewares
// ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ──────────────────────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────────────────────
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Esports Tournament API is running!" });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    db: "Connected" 
  });
});

// Auth Routes
app.use("/api/auth", authRoutes);

// ──────────────────────────────────────────────────────────────
// Error Handling
// ──────────────────────────────────────────────────────────────

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `Route ${req.originalUrl} không tồn tại.`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
