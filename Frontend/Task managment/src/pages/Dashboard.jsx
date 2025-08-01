import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

// MUI Imports
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Typography,
  Grid,
  Paper,
  ListItem,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from "@mui/icons-material";

// API Configuration
const API_BASE_URL = "http://localhost:5000/api"; // Adjust based on your backend URL

export default function Dashboard() {
  const { token, logout } = useContext(AuthContext);

  // State management
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState({
    projects: { online: false, loading: true },
    tasks: { online: false, loading: true },
  });

  const [tab, setTab] = useState(0); // 0 = Dashboard, 1 = Projects, 2 = Tasks

  // Task management
  const [newTask, setNewTask] = useState({ 
    title: "", 
    status: "pending",
    projectId: "" 
  });
  const [editingTask, setEditingTask] = useState(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  // Project management
  const [newProject, setNewProject] = useState({ name: "" });
  const [editingProject, setEditingProject] = useState(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  // UI state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    content: "",
    onConfirm: () => {},
  });

  const drawerWidth = 240;

  // Verify API status
  const checkApiStatus = async () => {
    try {
      const [projectsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/projects/health`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        // Assuming tasks health check is same as projects for this example
      ]);

      setApiStatus({
        projects: { online: projectsRes.status === 200, loading: false },
        tasks: { online: projectsRes.status === 200, loading: false },
      });
    } catch (err) {
      setApiStatus({
        projects: { online: false, loading: false },
        tasks: { online: false, loading: false },
      });
      showSnackbar("Failed to connect to API services", "error");
    }
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, tasksRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProjects(projectsRes.data || []);
      setTasks(tasksRes.data || []);

      // Set default project for new task if available
      if (projectsRes.data?.length > 0) {
        setNewTask(prev => ({ ...prev, projectId: projectsRes.data[0]._id }));
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      showSnackbar("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      checkApiStatus();
      fetchData();
    }
  }, [token]);

  // Helper functions
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const openConfirmDialog = (title, content, onConfirm) => {
    setConfirmDialog({ open: true, title, content, onConfirm });
  };

  // Task CRUD operations
  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      showSnackbar("Task title cannot be empty", "error");
      return;
    }
    
    try {
      const res = await axios.post(
        `${API_BASE_URL}/tasks`,
        newTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) => [...prev, res.data]);
      setNewTask({ title: "", status: "pending", projectId: projects[0]?._id || "" });
      showSnackbar("Task added successfully!");
    } catch (err) {
      console.error("Error adding task:", err);
      showSnackbar("Failed to add task", "error");
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask?.title.trim()) {
      showSnackbar("Task title cannot be empty", "error");
      return;
    }
    
    try {
      const res = await axios.put(
        `${API_BASE_URL}/tasks/${editingTask._id}`,
        editingTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(tasks.map(t => t._id === editingTask._id ? res.data : t));
      setEditingTask(null);
      setTaskDialogOpen(false);
      showSnackbar("Task updated successfully!");
    } catch (err) {
      console.error("Error updating task:", err);
      showSnackbar("Failed to update task", "error");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/tasks/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(tasks.filter(t => t._id !== taskId));
      showSnackbar("Task deleted successfully!");
    } catch (err) {
      console.error("Error deleting task:", err);
      showSnackbar("Failed to delete task", "error");
    }
  };

  // Project CRUD operations
  const handleAddProject = async () => {
    if (!newProject.name.trim()) {
      showSnackbar("Project name cannot be empty", "error");
      return;
    }
    
    try {
      const res = await axios.post(
        `${API_BASE_URL}/projects`,
        newProject,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjects((prev) => [...prev, res.data]);
      setNewProject({ name: "" });
      showSnackbar("Project added successfully!");
    } catch (err) {
      console.error("Error adding project:", err);
      showSnackbar("Failed to add project", "error");
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject?.name.trim()) {
      showSnackbar("Project name cannot be empty", "error");
      return;
    }
    
    try {
      const res = await axios.put(
        `${API_BASE_URL}/projects/${editingProject._id}`,
        editingProject,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjects(projects.map(p => p._id === editingProject._id ? res.data : p));
      setEditingProject(null);
      setProjectDialogOpen(false);
      showSnackbar("Project updated successfully!");
    } catch (err) {
      console.error("Error updating project:", err);
      showSnackbar("Failed to update project", "error");
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      // First delete all tasks associated with this project
      const projectTasks = tasks.filter(t => t.projectId === projectId);
      await Promise.all(
        projectTasks.map(task => 
          axios.delete(`${API_BASE_URL}/tasks/${task._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );

      // Then delete the project
      await axios.delete(
        `${API_BASE_URL}/projects/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjects(projects.filter(p => p._id !== projectId));
      setTasks(tasks.filter(t => t.projectId !== projectId));
      showSnackbar("Project and its tasks deleted successfully!");
    } catch (err) {
      console.error("Error deleting project:", err);
      showSnackbar("Failed to delete project", "error");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Data calculations
  const totalProjects = projects.length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const recentTasks = tasks.slice(-5).reverse();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9fafb" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(to bottom, #2563eb, #1e40af)",
            color: "white",
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            fontWeight: "bold",
            fontSize: 24,
            borderBottom: "1px solid #3b82f6",
          }}
        >
          Task Manager
        </Box>

        <List sx={{ flex: 1 }}>
          {[
            { text: "Dashboard", index: 0 },
            { text: "Projects", index: 1 },
            { text: "Tasks", index: 2 },
          ].map((item) => (
            <ListItemButton
              key={item.text}
              selected={tab === item.index}
              onClick={() => setTab(item.index)}
              sx={{
                borderRadius: 1,
                my: 0.5,
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            API Status:
          </Typography>
          <Typography variant="body2" color={apiStatus.projects.online ? "success.light" : "error.light"}>
            • Projects: {apiStatus.projects.online ? "Online" : "Offline"}
          </Typography>
          <Typography variant="body2" color={apiStatus.tasks.online ? "success.light" : "error.light"}>
            • Tasks: {apiStatus.tasks.online ? "Online" : "Offline"}
          </Typography>
        </Box>

        <Button
          onClick={logout}
          variant="contained"
          color="error"
          sx={{ m: 2 }}
        >
          Logout
        </Button>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, overflowY: "auto" }}>
        {tab === 0 && (
          <>
            <Typography variant="h4" fontWeight="bold" color="text.primary" mb={4}>
              Dashboard
            </Typography>

            {/* API Status Indicator */}
            {(!apiStatus.projects.online || !apiStatus.tasks.online) && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                Some services are unavailable. Data may not be up to date.
              </Alert>
            )}

            {/* Project Summary Cards */}
            <Grid container spacing={3} mb={4}>
              {[
                { title: "Total Projects", value: totalProjects, color: "primary.main" },
                { title: "Pending Tasks", value: pendingTasks, color: "warning.main" },
                { title: "Completed Tasks", value: completedTasks, color: "success.main" },
              ].map((card, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      boxShadow: 3,
                      transition: "0.3s",
                      "&:hover": { boxShadow: 6 },
                    }}
                  >
                    <Typography variant="subtitle1" color="text.secondary" mb={1}>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color={card.color}>
                      {card.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Add Task */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                mb: 4,
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Add New Task
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setEditingTask(null);
                    setTaskDialogOpen(true);
                  }}
                >
                  Add Task
                </Button>
              </Box>
            </Paper>

            {/* Recent Tasks */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="text.primary" mb={2}>
                Recent Tasks
              </Typography>

              {recentTasks.length === 0 ? (
                <Typography color="text.secondary">No tasks found</Typography>
              ) : (
                <List>
                  {recentTasks.map((task) => (
                    <ListItem
                      key={task._id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        py: 1.5,
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <Box>
                        <Typography>{task.title}</Typography>
                        {task.projectId && (
                          <Typography variant="caption" color="text.secondary">
                            Project: {projects.find(p => p._id === task.projectId)?.name || "Unknown"}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip
                          label={task.status}
                          color={
                            task.status === "completed"
                              ? "success"
                              : task.status === "pending"
                              ? "warning"
                              : "error"
                          }
                          size="small"
                        />
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingTask(task);
                            setTaskDialogOpen(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            openConfirmDialog(
                              "Delete Task",
                              "Are you sure you want to delete this task?",
                              () => handleDeleteTask(task._id)
                            );
                          }}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </>
        )}

        {tab === 1 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h4">Projects</Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingProject(null);
                  setProjectDialogOpen(true);
                }}
              >
                Add Project
              </Button>
            </Box>

            {projects.length === 0 ? (
              <Typography color="text.secondary">No projects found</Typography>
            ) : (
              <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                {projects.map((project) => (
                  <ListItem
                    key={project._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 1.5,
                      borderBottom: "1px solid #e5e7eb",
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          edge="end"
                          onClick={() => {
                            setEditingProject(project);
                            setProjectDialogOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => {
                            openConfirmDialog(
                              "Delete Project",
                              "This will delete the project and all its associated tasks. Are you sure?",
                              () => handleDeleteProject(project._id)
                            );
                          }}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Box>
                    }
                  >
                    <Box>
                      <Typography>{project.name || "Unnamed Project"}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {tasks.filter(t => t.projectId === project._id).length} tasks
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}

        {tab === 2 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h4">All Tasks</Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingTask(null);
                  setTaskDialogOpen(true);
                }}
              >
                Add Task
              </Button>
            </Box>

            {tasks.length === 0 ? (
              <Typography color="text.secondary">No tasks found</Typography>
            ) : (
              <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                {tasks.map((task) => (
                  <ListItem
                    key={task._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 1.5,
                      borderBottom: "1px solid #e5e7eb",
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          edge="end"
                          onClick={() => {
                            setEditingTask(task);
                            setTaskDialogOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => {
                            openConfirmDialog(
                              "Delete Task",
                              "Are you sure you want to delete this task?",
                              () => handleDeleteTask(task._id)
                            );
                          }}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Box>
                    }
                  >
                    <Box>
                      <Typography>{task.title}</Typography>
                      {task.projectId && (
                        <Typography variant="caption" color="text.secondary">
                          Project: {projects.find(p => p._id === task.projectId)?.name || "Unknown"}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      label={task.status}
                      color={
                        task.status === "completed"
                          ? "success"
                          : task.status === "pending"
                          ? "warning"
                          : "error"
                      }
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </Box>

      {/* Task Dialog */}
      <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)}>
        <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            variant="outlined"
            value={editingTask?.title || newTask.title}
            onChange={(e) => 
              editingTask 
                ? setEditingTask({...editingTask, title: e.target.value})
                : setNewTask({...newTask, title: e.target.value})
            }
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={editingTask?.status || newTask.status}
              label="Status"
              onChange={(e) => 
                editingTask 
                  ? setEditingTask({...editingTask, status: e.target.value})
                  : setNewTask({...newTask, status: e.target.value})
              }
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          
          {projects.length > 0 && (
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={editingTask?.projectId || newTask.projectId}
                label="Project"
                onChange={(e) => 
                  editingTask 
                    ? setEditingTask({...editingTask, projectId: e.target.value})
                    : setNewTask({...newTask, projectId: e.target.value})
                }
              >
                {projects.map(project => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={editingTask ? handleUpdateTask : handleAddTask}
            variant="contained"
          >
            {editingTask ? "Update Task" : "Add Task"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Project Dialog */}
      <Dialog open={projectDialogOpen} onClose={() => setProjectDialogOpen(false)}>
        <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            fullWidth
            variant="outlined"
            value={editingProject?.name || newProject.name}
            onChange={(e) => 
              editingProject 
                ? setEditingProject({...editingProject, name: e.target.value})
                : setNewProject({...newProject, name: e.target.value})
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProjectDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={editingProject ? handleUpdateProject : handleAddProject}
            variant="contained"
          >
            {editingProject ? "Update Project" : "Add Project"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({...confirmDialog, open: false})}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({...confirmDialog, open: false})}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              confirmDialog.onConfirm();
              setConfirmDialog({...confirmDialog, open: false});
            }}
            color="error"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
