import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { 
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
      enum: ["active", "on-hold", "completed"], 
      default: "active" 
    },
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model("Project", projectSchema);
