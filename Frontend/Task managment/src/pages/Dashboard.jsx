import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Select,
  MenuItem,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Drawer,
  Box,
  Tabs,
  Tab,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
  Badge
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Task as TaskIcon,
  Work as ProjectIcon,
  Dashboard as DashboardIcon,
  Assessment as ChartIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon
} from "@mui/icons-material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const API_BASE_URL = "http://localhost:5000/api";

// Chart data initialization
const initialStatusData = [
  { name: 'Completed', value: 0, color: '#4caf50' },
  { name: 'In Progress', value: 0, color: '#ff9800' },
  { name: 'Pending', value: 0, color: '#f44336' }
];

const initialActivityData = [
  { name: 'Jan', tasks: 0, projects: 0 },
  { name: 'Feb', tasks: 0, projects: 0 },
  { name: 'Mar', tasks: 0, projects: 0 },
  { name: 'Apr', tasks: 0, projects: 0 },
  { name: 'May', tasks: 0, projects: 0 },
  { name: 'Jun', tasks: 0, projects: 0 }
];

// Theme setup
const getTheme = (darkMode) => createTheme({
  palette: {
    mode: darkMode ? "dark" : "light",
    primary: { main: darkMode ? "#81c784" : "#2e7d32" },
    secondary: { main: darkMode ? "#a5d6a7" : "#4caf50" },
    background: {
      default: darkMode ? "#121212" : "#f5f9f5",
      paper: darkMode ? "#1e1e1e" : "#ffffff"
    },
    success: { main: "#4caf50" }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 }
  }
});

export default function Dashboard() {
  // State declarations
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chartData, setChartData] = useState({
    statusData: [...initialStatusData],
    activityData: [...initialActivityData]
  });
  const token = localStorage.getItem("token");

  // Data fetching effects
  useEffect(() => {
    if (activeTab === "tasks") {
      fetchTasks();
    } else if (activeTab === "projects") {
      fetchProjects();
    } else if (activeTab === "dashboard") {
      fetchTasks();
      fetchProjects();
    }
  }, [activeTab]);

  // Chart data effect
  useEffect(() => {
    if (tasks.length > 0 || projects.length > 0) {
      const completed = tasks.filter(t => t.status === 'completed').length;
      const inProgress = tasks.filter(t => t.status === 'in-progress').length;
      const pending = tasks.filter(t => t.status === 'pending').length;
      
      const updatedStatusData = [
        { name: 'Completed', value: completed, color: '#4caf50' },
        { name: 'In Progress', value: inProgress, color: '#ff9800' },
        { name: 'Pending', value: pending, color: '#f44336' }
      ];

      const updatedActivityData = initialActivityData.map((month, idx) => ({
        ...month,
        tasks: Math.floor(tasks.length * (0.5 + Math.random() * 0.5) / (idx + 1)),
        projects: Math.floor(projects.length * (0.3 + Math.random() * 0.3) / (idx + 1))
      }));

      setChartData({
        statusData: updatedStatusData,
        activityData: updatedActivityData
      });
    }
  }, [tasks, projects]);

  // CRUD operations
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data.data || res.data);
    } catch (err) {
      showError("Failed to fetch tasks");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data.data || res.data);
    } catch (err) {
      showError("Failed to fetch projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!title.trim()) return showError("Task title cannot be empty");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/tasks`,
        { title: title.trim(), description: description.trim(), status: "pending" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev => [...prev, res.data.data || res.data]);
      setTitle("");
      setDescription("");
      showSuccess("Task added successfully");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to add task");
    }
  };

  const handleAddProject = async () => {
    if (!projectName.trim()) return showError("Project name cannot be empty");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/projects`,
        { name: projectName.trim(), description: projectDescription.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(prev => [...prev, res.data.data || res.data]);
      setProjectName("");
      setProjectDescription("");
      showSuccess("Project added successfully");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to add project");
    }
  };

  const handleUpdateTask = async (taskId) => {
    if (!editTitle.trim()) return showError("Task title cannot be empty");
    try {
      const res = await axios.put(
        `${API_BASE_URL}/tasks/${taskId}`,
        { title: editTitle.trim(), description: editDescription.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev => prev.map(task => task._id === taskId ? (res.data.data || res.data) : task));
      setEditingTask(null);
      showSuccess("Task updated successfully");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to update task");
    }
  };

  const handleUpdateProject = async (projectId) => {
    if (!editTitle.trim()) return showError("Project name cannot be empty");
    try {
      const res = await axios.put(
        `${API_BASE_URL}/projects/${projectId}`,
        { name: editTitle.trim(), description: editDescription.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(prev => prev.map(project => project._id === projectId ? (res.data.data || res.data) : project));
      setEditingProject(null);
      showSuccess("Project updated successfully");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to update project");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(prev => prev.filter(task => task._id !== taskId));
      showSuccess("Task deleted successfully");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to delete task");
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`${API_BASE_URL}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(prev => prev.filter(project => project._id !== projectId));
      showSuccess("Project deleted successfully");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to delete project");
    }
  };

  // UI Helper Functions
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "success.main";
      case "in-progress": return "warning.main";
      default: return "text.primary";
    }
  };

  const showError = (message) => setSnackbar({ open: true, message, severity: "error" });
  const showSuccess = (message) => setSnackbar({ open: true, message, severity: "success" });
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // UI Components
  const drawer = (
    <Box sx={{ width: 250, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
          <DashboardIcon />
        </Avatar>
        <Typography variant="h6">Project Manager</Typography>
      </Box>
      <Divider />
      <Tabs
        orientation="vertical"
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mt: 2 }}
      >
        <Tab value="dashboard" icon={<DashboardIcon />} label="Dashboard" />
        <Tab value="tasks" icon={<TaskIcon />} label="Tasks" />
        <Tab value="projects" icon={<ProjectIcon />} label="Projects" />
      </Tabs>
    </Box>
  );

  return (
    <ThemeProvider theme={getTheme(darkMode)}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: 250 } }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            width: 250,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: 250 },
            display: { xs: 'none', sm: 'block' }
          }}
          open
        >
          {drawer}
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton
                color="inherit"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                {activeTab === 'tasks' ? 'Task Management' : 
                 activeTab === 'projects' ? 'Project Management' : 'Dashboard'}
              </Typography>
              <FormControlLabel
                control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
                label="Dark Mode"
              />
            </Box>

            {/* Main Content */}
            {activeTab === 'tasks' && (
              <>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Task Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={loading}
                    />
                    <TextField
                      fullWidth
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={loading}
                    />
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddTask}
                      disabled={loading || !title.trim()}
                      sx={{ height: "56px" }}
                    >
                      {loading ? <CircularProgress size={24} /> : "Add Task"}
                    </Button>
                  </Box>
                </Paper>

                <Paper elevation={3} sx={{ p: 3 }}>
                  {loading && !tasks.length ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress />
                    </Box>
                  ) : tasks.length === 0 ? (
                    <Typography align="center" sx={{ py: 2 }}>No tasks found</Typography>
                  ) : (
                    <List>
                      {tasks.map((task) => (
                        <ListItem
                          key={task._id}
                          divider
                          sx={{ bgcolor: editingTask === task._id ? "action.hover" : "inherit" }}
                        >
                          {editingTask === task._id ? (
                            <>
                              <TextField
                                fullWidth
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                sx={{ mr: 2 }}
                                disabled={loading}
                              />
                              <TextField
                                fullWidth
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                sx={{ mr: 2 }}
                                disabled={loading}
                              />
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => handleUpdateTask(task._id)}
                                startIcon={<CheckIcon />}
                                disabled={loading || !editTitle.trim()}
                              >
                                {loading ? <CircularProgress size={20} /> : "Save"}
                              </Button>
                              <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={() => setEditingTask(null)}
                                startIcon={<CloseIcon />}
                                sx={{ ml: 1 }}
                                disabled={loading}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      fontWeight: "medium",
                                      color: getStatusColor(task.status),
                                      textDecoration:
                                        task.status === "completed" ? "line-through" : "none"
                                    }}
                                  >
                                    {task.title}
                                  </Typography>
                                }
                                secondary={
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontStyle: task.description ? "normal" : "italic" }}
                                  >
                                    {task.description || "No description"}
                                  </Typography>
                                }
                              />
                              <Select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                size="small"
                                sx={{ width: 150, mr: 2 }}
                                disabled={loading}
                              >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="in-progress">In Progress</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                              </Select>
                              <ListItemSecondaryAction>
                                <IconButton
                                  edge="end"
                                  onClick={() => {
                                    setEditingTask(task._id);
                                    setEditTitle(task.title);
                                    setEditDescription(task.description || "");
                                  }}
                                  color="primary"
                                  disabled={loading}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  onClick={() => handleDeleteTask(task._id)}
                                  color="error"
                                  disabled={loading}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </>
            )}

            {activeTab === 'projects' && (
              <>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Project Name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      disabled={loading}
                    />
                    <TextField
                      fullWidth
                      label="Description"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      disabled={loading}
                    />
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddProject}
                      disabled={loading || !projectName.trim()}
                      sx={{ height: "56px" }}
                    >
                      {loading ? <CircularProgress size={24} /> : "Add Project"}
                    </Button>
                  </Box>
                </Paper>

                <Paper elevation={3} sx={{ p: 3 }}>
                  {loading && !projects.length ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress />
                    </Box>
                  ) : projects.length === 0 ? (
                    <Typography align="center" sx={{ py: 2 }}>No projects found</Typography>
                  ) : (
                    <List>
                      {projects.map((project) => (
                        <ListItem
                          key={project._id}
                          divider
                          sx={{ bgcolor: editingProject === project._id ? "action.hover" : "inherit" }}
                        >
                          {editingProject === project._id ? (
                            <>
                              <TextField
                                fullWidth
                                label="Project Name"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                sx={{ mr: 2 }}
                                disabled={loading}
                              />
                              <TextField
                                fullWidth
                                label="Description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                sx={{ mr: 2 }}
                                disabled={loading}
                              />
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => handleUpdateProject(project._id)}
                                startIcon={<CheckIcon />}
                                disabled={loading || !editTitle.trim()}
                              >
                                {loading ? <CircularProgress size={20} /> : "Save"}
                              </Button>
                              <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={() => setEditingProject(null)}
                                startIcon={<CloseIcon />}
                                sx={{ ml: 1 }}
                                disabled={loading}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      fontWeight: "medium",
                                      color: "primary.main"
                                    }}
                                  >
                                    {project.name}
                                  </Typography>
                                }
                                secondary={
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontStyle: project.description ? "normal" : "italic" }}
                                  >
                                    {project.description || "No description"}
                                  </Typography>
                                }
                              />
                              <Chip 
                                label={`${project.tasks?.length || 0} tasks`} 
                                size="small" 
                                sx={{ mr: 2 }}
                                color="primary"
                              />
                              <ListItemSecondaryAction>
                                <IconButton
                                  edge="end"
                                  onClick={() => {
                                    setEditingProject(project._id);
                                    setEditTitle(project.name);
                                    setEditDescription(project.description || "");
                                  }}
                                  color="primary"
                                  disabled={loading}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  onClick={() => handleDeleteProject(project._id)}
                                  color="error"
                                  disabled={loading}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </>
            )}

            {activeTab === 'dashboard' && (
              <>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                            <TaskIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6">Total Tasks</Typography>
                            <Typography variant="h4">{tasks.length}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                            <CheckCircleIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6">Completed</Typography>
                            <Typography variant="h4">
                              {tasks.filter(t => t.status === 'completed').length}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                            <TrendingUpIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6">In Progress</Typography>
                            <Typography variant="h4">
                              {tasks.filter(t => t.status === 'in-progress').length}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                            <ProjectIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6">Projects</Typography>
                            <Typography variant="h4">{projects.length}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>Task Status</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={chartData.statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {chartData.statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>Activity</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.activityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="tasks" fill="#4caf50" name="Tasks" />
                          <Bar dataKey="projects" fill="#81c784" name="Projects" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Recent Tasks</Typography>
                      {tasks.slice(0, 5).length > 0 ? (
                        <List>
                          {tasks.slice(0, 5).map(task => (
                            <ListItem key={task._id} divider>
                              <ListItemText
                                primary={task.title}
                                secondary={task.description || "No description"}
                              />
                              <Chip 
                                label={task.status} 
                                size="small" 
                                color={
                                  task.status === 'completed' ? 'success' : 
                                  task.status === 'in-progress' ? 'warning' : 'default'
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography color="text.secondary">No recent tasks</Typography>
                      )}
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Recent Projects</Typography>
                      {projects.slice(0, 5).length > 0 ? (
                        <List>
                          {projects.slice(0, 5).map(project => (
                            <ListItem key={project._id} divider>
                              <ListItemText
                                primary={project.name}
                                secondary={project.description || "No description"}
                              />
                              <Chip 
                                label={`${project.tasks?.length || 0} tasks`} 
                                size="small" 
                                color="primary"
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography color="text.secondary">No recent projects</Typography>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </>
            )}

            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
            >
              <Alert 
                onClose={handleCloseSnackbar} 
                severity={snackbar.severity}
                sx={{ width: '100%' }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}