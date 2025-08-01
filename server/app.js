import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Task Manager API Running ✅");
});

export default app; // ✅ export the app
