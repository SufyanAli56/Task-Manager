import Task from "../models/Task.js";

// Helper function for error handling
const handleError = (res, error, statusCode = 400) => {
  console.error("Error:", error.message);
  res.status(statusCode).json({ 
    success: false,
    error: error.message 
  });
};

export const getTasks = async (req, res) => {
  try {
    // Add filtering by project if needed
    const query = req.query.projectId 
      ? { projectId: req.query.projectId }
      : {};
    
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .populate('projectId', 'name'); // Optional: populate project name
    
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    handleError(res, err, 500);
  }
};

export const createTask = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title) {
      throw new Error("Title is required");
    }

    // Create task with default values
    const taskData = {
      title: req.body.title,
      description: req.body.description || "",
      status: req.body.status || "pending",
      projectId: req.body.projectId || null
    };

    const task = new Task(taskData);
    const savedTask = await task.save();
    
    res.status(201).json({
      success: true,
      data: savedTask
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        projectId: req.body.projectId
      },
      { new: true, runValidators: true } // Return updated doc and validate
    );

    if (!task) {
      throw new Error("Task not found");
    }

    res.json({
      success: true,
      data: task
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      throw new Error("Task not found");
    }

    res.json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (err) {
    handleError(res, err);
  }
};