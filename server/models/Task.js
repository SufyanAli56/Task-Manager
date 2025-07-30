import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
