import express from "express";
import { getProjects, createProject, healthCheck } from "../controllers/projectController.js";

const router = express.Router();

router.get("/", getProjects);
router.post("/", createProject);
router.get("/health", healthCheck);

export default router;
