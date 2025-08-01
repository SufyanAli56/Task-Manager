import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true,
      trim: true
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
      ref: "Project",
      default: null
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtuals for formatted timestamps
taskSchema.virtual('createdAtFormatted').get(function() {
  return this.createdAt.toLocaleString();
});

taskSchema.virtual('updatedAtFormatted').get(function() {
  return this.updatedAt.toLocaleString();
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
