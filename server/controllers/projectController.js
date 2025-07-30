import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  const { name, description } = req.body;

  try {
    const project = await Project.create({ name, description, owner: req.user._id, members: [req.user._id] });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  const projects = await Project.find({ members: req.user._id });
  res.json(projects);
};
