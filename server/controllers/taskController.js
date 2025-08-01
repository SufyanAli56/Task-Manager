import Task from "../models/Task.js";


export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks); // Always return array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const healthCheck = (req, res) => {
  res.status(200).json({ status: "Tasks API online" });
};
