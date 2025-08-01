import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true  // Automatically trims whitespace
  },
  description: {
    type: String,
    default: "",
    trim: true
  },
  status: { 
    type: String, 
    enum: ["pending", "in-progress", "completed"], 
    default: "pending" 
  },
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Project" 
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },  // Include virtuals when converted to JSON
  toObject: { virtuals: true } // Include virtuals when converted to objects
});

// Virtual for formatted createdAt date
taskSchema.virtual('createdAtFormatted').get(function() {
  return this.createdAt.toLocaleString();
});

// Virtual for formatted updatedAt date
taskSchema.virtual('updatedAtFormatted').get(function() {
  return this.updatedAt.toLocaleString();
});

const Task = mongoose.model("Task", taskSchema);

export default Task;