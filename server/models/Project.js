import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, default: "active" },
});

export default mongoose.model("Project", projectSchema);
