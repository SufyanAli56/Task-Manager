import express from "express";
import { 
  createTask, 
  getTasks, 
  updateTask, 
  deleteTask 
} from "../controllers/taskController.js";

const router = express.Router();

// CRUD Routes
router.get("/", getTasks);        // GET all tasks
router.post("/", createTask);     // CREATE task
router.put("/:id", updateTask);   // UPDATE task
router.delete("/:id", deleteTask);// DELETE task

export default router;
