import Project from "../models/Project.js";

// Helper for error handling
const handleError = (res, err, statusCode = 400) => {
  console.error(err.message);
  res.status(statusCode).json({ success: false, error: err.message });
};

// ✅ Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    handleError(res, err, 500);
  }
};

// ✅ Create a new project
export const createProject = async (req, res) => {
  try {
    if (!req.body.name) throw new Error("Project name is required");

    const project = new Project({
      name: req.body.name,
      description: req.body.description || "",
      status: req.body.status || "active",
    });

    const saved = await project.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    handleError(res, err);
  }
};

// ✅ Update a project
export const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
      },
      { new: true, runValidators: true }
    );

    if (!updated) throw new Error("Project not found");

    res.json({ success: true, data: updated });
  } catch (err) {
    handleError(res, err);
  }
};

// ✅ Delete a project
export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) throw new Error("Project not found");

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    handleError(res, err);
  }
};

// ✅ Health check
export const healthCheck = (req, res) => {
  res.status(200).json({ status: "Projects API online" });
};
