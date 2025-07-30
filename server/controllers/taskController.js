import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  const { title, description, status, project, assignedTo } = req.body;
  try {
    const task = await Task.create({ title, description, status, project, assignedTo });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  const { projectId } = req.params;
  const tasks = await Task.find({ project: projectId });
  res.json(tasks);
};
