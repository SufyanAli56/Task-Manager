import express from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  healthCheck,
} from "../controllers/projectController.js";

const router = express.Router();

// CRUD Routes
router.get("/", getProjects);       // GET all projects
router.post("/", createProject);    // CREATE project
router.put("/:id", updateProject);  // UPDATE project
router.delete("/:id", deleteProject); // DELETE project

// Health check
router.get("/health", healthCheck);

export default router;
