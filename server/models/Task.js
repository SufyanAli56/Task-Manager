import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "in-progress", "completed"], 
    default: "pending" 
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
