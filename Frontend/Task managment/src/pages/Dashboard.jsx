import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton,
  Select, MenuItem, Paper, ThemeProvider, createTheme, CssBaseline, Switch,
  FormControlLabel, Snackbar, Alert, CircularProgress, Drawer, Box, Tabs, Tab,
  Divider, Chip, Grid, Card, CardContent, Avatar, AppBar, Toolbar, LinearProgress,
  Tooltip as MuiTooltip
} from "@mui/material";
import {
  Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Check as CheckIcon,
  Close as CloseIcon, Menu as MenuIcon, Task as TaskIcon, Work as ProjectIcon,
  Dashboard as DashboardIcon, CheckCircle as CheckCircleIcon, TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon
} from "@mui/icons-material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

const API_BASE_URL = "http://localhost:5000/api";

// Chart data initialization
const initialStatusData = [
  { name: 'Completed', value: 0, color: '#4caf50' },
  { name: 'In Progress', value: 0, color: '#ff9800' },
  { name: 'Pending', value: 0, color: '#f44336' }
];

const initialActivityData = [
  { name: 'Jan', tasks: 0, projects: 0, completed: 0 },
  { name: 'Feb', tasks: 0, projects: 0, completed: 0 },
  { name: 'Mar', tasks: 0, projects: 0, completed: 0 },
  { name: 'Apr', tasks: 0, projects: 0, completed: 0 },
  { name: 'May', tasks: 0, projects: 0, completed: 0 },
  { name: 'Jun', tasks: 0, projects: 0, completed: 0 }
];

const initialCompletionData = [
  { name: 'Jan', completion: 0 },
  { name: 'Feb', completion: 0 },
  { name: 'Mar', completion: 0 },
  { name: 'Apr', completion: 0 },
  { name: 'May', completion: 0 },
  { name: 'Jun', completion: 0 }
];

const initialPriorityData = [
  { name: 'High', value: 0, color: '#d81b60' },
  { name: 'Medium', value: 0, color: '#ffb300' },
  { name: 'Low', value: 0, color: '#4caf50' }
];

// New color theme
const getTheme = (darkMode) => createTheme({
  palette: {
    mode: darkMode ? "dark" : "light",
    primary: { main: darkMode ? "#64b5f6" : "#1976d2" }, // Blue
    secondary: { main: darkMode ? "#b39ddb" : "#7e57c2" }, // Purple
    background: {
      default: darkMode ? "#0d1a26" : "linear-gradient(to right, #e3f2fd, #bbdefb)",
      paper: darkMode ? "#1c2526" : "#ffffff"
    },
    success: { main: "#4caf50" }, // Green for completed
    warning: { main: "#ffb300" }, // Amber for in-progress
    error: { main: "#d81b60" }, // Pink for high priority/pending
    text: {
      primary: darkMode ? "#e0e0e0" : "#1a237e",
      secondary: darkMode ? "#b0bec5" : "#455a64"
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: -0.5 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500, lineHeight: 1.6 },
    body2: { lineHeight: 1.7 },
    button: {
      fontWeight: 600,
      fontSize: '0.95rem',
      textTransform: 'none'
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: darkMode 
            ? '0 6px 24px rgba(0,0,0,0.6)' 
            : '0 6px 24px rgba(0,0,0,0.15)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 20px',
          fontWeight: 600,
          fontSize: '0.95rem',
          lineHeight: 1.6,
          background: darkMode 
            ? 'linear-gradient(to right, #1976d2, #64b5f6)'
            : 'linear-gradient(to right, #1565c0, #1976d2)',
          backgroundSize: '200% 100%',
          backgroundPosition: 'left center',
          color: '#ffffff',
          transition: 'background-position 0.4s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          boxShadow: darkMode 
            ? '0 3px 12px rgba(100, 181, 246, 0.3)'
            : '0 3px 12px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            backgroundPosition: 'right center',
            transform: 'translateY(-3px)',
            boxShadow: darkMode 
              ? '0 6px 20px rgba(100, 181, 246, 0.4)'
              : '0 6px 20px rgba(25, 118, 210, 0.4)'
          },
          '&:disabled': {
            background: darkMode 
              ? 'linear-gradient(to right, #263238, #37474f)'
              : 'linear-gradient(to right, #b0bec5, #cfd8dc)',
            color: darkMode ? '#78909c' : '#90a4ae',
            boxShadow: 'none'
          }
        },
        outlined: {
          borderWidth: 2,
          borderColor: darkMode ? '#64b5f6' : '#1976d2',
          color: darkMode ? '#64b5f6' : '#1976d2',
          background: 'transparent',
          '&:hover': {
            background: darkMode 
              ? 'rgba(100, 181, 246, 0.15)'
              : 'rgba(25, 118, 210, 0.15)',
            borderColor: darkMode ? '#90caf9' : '#1565c0'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: darkMode 
              ? '0 8px 32px rgba(0,0,0,0.6)' 
              : '0 8px 32px rgba(0,0,0,0.2)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: '0 0 16px 16px',
          background: darkMode 
            ? 'linear-gradient(to right, #1c2526, #263238)'
            : 'linear-gradient(to right, #ffffff, #e3f2fd)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginBottom: 8,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateX(6px)',
            backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease-in-out',
            '&:hover fieldset': {
              borderColor: darkMode ? '#64b5f6' : '#1976d2'
            }
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '& .MuiOutlinedInput-root': {
            borderRadius: 12
          }
        }
      }
    }
  }
});

export default function Dashboard() {
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
    activityData: [...initialActivityData],
    completionData: [...initialCompletionData],
    priorityData: [...initialPriorityData]
  });
  const token = localStorage.getItem("token");

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

  useEffect(() => {
    if (tasks.length > 0 || projects.length > 0) {
      const completed = tasks.filter(t => t.status === 'completed').length;
      const inProgress = tasks.filter(t => t.status === 'in-progress').length;
      const pending = tasks.filter(t => t.status === 'pending').length;
      const highPriority = tasks.filter(t => t.priority === 'high').length;
      const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
      const lowPriority = tasks.filter(t => t.priority === 'low').length;

      const updatedStatusData = [
        { name: 'Completed', value: completed, color: '#4caf50' },
        { name: 'In Progress', value: inProgress, color: '#ff9800' },
        { name: 'Pending', value: pending, color: '#f44336' }
      ];

      const updatedActivityData = initialActivityData.map((month, idx) => ({
        ...month,
        tasks: Math.floor(tasks.length * (0.5 + Math.random() * 0.5) / (idx + 1)),
        projects: Math.floor(projects.length * (0.3 + Math.random() * 0.3) / (idx + 1)),
        completed: Math.floor(completed * (0.4 + Math.random() * 0.4) / (idx + 1))
      }));

      const updatedCompletionData = initialCompletionData.map((month, idx) => ({
        ...month,
        completion: Math.floor((completed / (tasks.length || 1)) * 100 * (0.7 + Math.random() * 0.3))
      }));

      const updatedPriorityData = [
        { name: 'High', value: highPriority, color: '#d81b60' },
        { name: 'Medium', value: mediumPriority, color: '#ffb300' },
        { name: 'Low', value: lowPriority, color: '#4caf50' }
      ];

      // Debug priorityData
      console.log("Updated Priority Data:", updatedPriorityData);

      setChartData({
        statusData: updatedStatusData,
        activityData: updatedActivityData,
        completionData: updatedCompletionData,
        priorityData: updatedPriorityData
      });
    }
  }, [tasks, projects]);

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
        { title: title.trim(), description: description.trim(), status: "pending", priority: "medium" },
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

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev => prev.map(task => task._id === taskId ? (res.data.data || res.data) : task));
      showSuccess("Task status updated");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to update task status");
    }
  };

  const handlePriorityChange = async (taskId, newPriority) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/tasks/${taskId}`,
        { priority: newPriority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev => prev.map(task => task._id === taskId ? (res.data.data || res.data) : task));
      showSuccess("Task priority updated");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to update task priority");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "success.main";
      case "in-progress": return "warning.main";
      default: return "error.main";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "error.main";
      case "medium": return "warning.main";
      case "low": return "success.main";
      default: return "text.primary";
    }
  };

  const showError = (message) => setSnackbar({ open: true, message, severity: "error" });
  const showSuccess = (message) => setSnackbar({ open: true, message, severity: "success" });
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box sx={{ width: 260, p: 2.5, height: '100%', bgcolor: darkMode ? '#1c2526' : '#ffffff' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 3, bgcolor: darkMode ? '#263238' : '#e3f2fd', borderRadius: 12 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
            <DashboardIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
            Project Hub
          </Typography>
        </Box>
      </motion.div>
      <Divider sx={{ my: 2, opacity: 0.2 }} />
      <Tabs
        orientation="vertical"
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{
          '& .MuiTab-root': {
            py: 1.5,
            px: 2.5,
            borderRadius: 12,
            mb: 1,
            color: 'text.primary', // Default text color
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              transform: 'scale(1.02)',
              color: 'primary.main' // Blue on hover
            }
          },
          '& .Mui-selected': {
            bgcolor: darkMode ? 'primary.main' : 'primary.light',
            color: '#ffffff', // White when selected
            transform: 'scale(1.02)',
            '&:hover': {
              color: '#ffffff' // Maintain white on hover when selected
            }
          }
        }}
      >
        {[
          { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon sx={{ fontSize: 24 }} /> },
          { value: 'tasks', label: 'Tasks', icon: <TaskIcon sx={{ fontSize: 24 }} /> },
          { value: 'projects', label: 'Projects', icon: <ProjectIcon sx={{ fontSize: 24 }} /> }
        ].map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            icon={tab.icon}
            label={tab.label}
            iconPosition="start"
            sx={{ justifyContent: 'flex-start', minHeight: 56 }}
          />
        ))}
      </Tabs>
    </Box>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, borderRadius: 8, bgcolor: darkMode ? '#263238' : '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color || 'text.secondary' }}>
              {entry.name}: {entry.value}{entry.unit || ''}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <ThemeProvider theme={getTheme(darkMode)}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 260,
              borderRight: 'none',
              bgcolor: darkMode ? '#1c2526' : '#ffffff',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            },
            display: { sm: 'none' }
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            width: 260,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 260,
              borderRight: 'none',
              bgcolor: darkMode ? '#1c2526' : '#ffffff',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            },
            display: { xs: 'none', sm: 'block' }
          }}
          open
        >
          {drawer}
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <AppBar
              position="sticky"
              elevation={0}
              sx={{
                bgcolor: 'transparent',
                background: darkMode
                  ? 'linear-gradient(to right, #1c2526, #263238)'
                  : 'linear-gradient(to right, #ffffff, #e3f2fd)',
                borderRadius: '0 0 16px 16px',
                mb: 4
              }}
            >
              <Toolbar sx={{ minHeight: 72, px: { xs: 2, sm: 3, md: 4 } }}>
                <IconButton
                  color="inherit"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'none' } }}
                >
                  <MenuIcon sx={{ fontSize: 28, color: 'text.primary' }} />
                </IconButton>
                <Typography
                  variant="h5"
                  sx={{
                    flexGrow: 1,
                    fontWeight: 700,
                    letterSpacing: -0.5,
                    color: 'text.primary'
                  }}
                >
                  {activeTab === 'tasks' ? 'Task Management' :
                   activeTab === 'projects' ? 'Project Management' : 'Dashboard'}
                </Typography>
                <FormControlLabel
                  control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
                  label="Dark Mode"
                  sx={{ color: 'text.primary', mr: 1 }}
                />
              </Toolbar>
            </AppBar>
          </motion.div>

          <Container maxWidth="xl" sx={{ py: 4 }}>
            <AnimatePresence mode="wait">
              {activeTab === 'tasks' && (
                <motion.div
                  key="tasks"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Paper sx={{ p: { xs: 3, sm: 4 }, mb: 4, borderRadius: 16 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                      Add New Task
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        label="Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading}
                        variant="outlined"
                        sx={{ flex: '1 1 200px' }}
                      />
                      <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                        variant="outlined"
                        sx={{ flex: '1 1 200px' }}
                      />
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleAddTask}
                          disabled={loading || !title.trim()}
                          sx={{ height: 56, minWidth: 140 }}
                        >
                          {loading ? <CircularProgress size={24} /> : "Add Task"}
                        </Button>
                      </motion.div>
                    </Box>
                  </Paper>

                  <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 16 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                      Tasks
                    </Typography>
                    {loading && !tasks.length ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress size={48} color="primary" />
                      </Box>
                    ) : tasks.length === 0 ? (
                      <Typography align="center" sx={{ py: 4, color: 'text.secondary', fontSize: 16 }}>
                        No tasks found
                      </Typography>
                    ) : (
                      <List disablePadding>
                        <AnimatePresence>
                          {tasks.map((task, index) => (
                            <motion.div
                              key={task._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <ListItem
                                divider
                                sx={{
                                  py: 2.5,
                                  px: 3,
                                  bgcolor: editingTask === task._id ? 'action.hover' : 'inherit'
                                }}
                              >
                                {editingTask === task._id ? (
                                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '100%' }}>
                                    <TextField
                                      fullWidth
                                      value={editTitle}
                                      onChange={(e) => setEditTitle(e.target.value)}
                                      sx={{ flex: '1 1 200px' }}
                                      disabled={loading}
                                    />
                                    <TextField
                                      fullWidth
                                      value={editDescription}
                                      onChange={(e) => setEditDescription(e.target.value)}
                                      sx={{ flex: '1 1 200px' }}
                                      disabled={loading}
                                    />
                                    <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
                                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                          variant="contained"
                                          size="small"
                                          onClick={() => handleUpdateTask(task._id)}
                                          startIcon={<CheckIcon />}
                                          disabled={loading || !editTitle.trim()}
                                          sx={{ px: 3 }}
                                        >
                                          Save
                                        </Button>
                                      </motion.div>
                                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                          variant="outlined"
                                          size="small"
                                          onClick={() => setEditingTask(null)}
                                          startIcon={<CloseIcon />}
                                          disabled={loading}
                                          sx={{ px: 3 }}
                                        >
                                          Cancel
                                        </Button>
                                      </motion.div>
                                    </Box>
                                  </Box>
                                ) : (
                                  <>
                                    <ListItemText
                                      primary={
                                        <Typography
                                          variant="subtitle1"
                                          sx={{
                                            fontWeight: 500,
                                            color: getStatusColor(task.status),
                                            textDecoration: task.status === "completed" ? "line-through" : "none"
                                          }}
                                        >
                                          {task.title}
                                        </Typography>
                                      }
                                      secondary={
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                                          <Typography variant="body2" color="text.secondary">
                                            {task.description || "No description"}
                                          </Typography>
                                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                            <Chip
                                              label={task.status}
                                              size="small"
                                              color={
                                                task.status === 'completed' ? 'success' :
                                                task.status === 'in-progress' ? 'warning' : 'error'
                                              }
                                              sx={{ borderRadius: 6, fontWeight: 500 }}
                                            />
                                            <Chip
                                              label={task.priority}
                                              size="small"
                                              color={
                                                task.priority === 'high' ? 'error' :
                                                task.priority === 'medium' ? 'warning' : 'success'
                                              }
                                              sx={{ borderRadius: 6, fontWeight: 500 }}
                                            />
                                          </Box>
                                        </Box>
                                      }
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                      <Select
                                        value={task.status}
                                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                        size="small"
                                        sx={{ minWidth: 120 }}
                                        disabled={loading}
                                      >
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="in-progress">In Progress</MenuItem>
                                        <MenuItem value="completed">Completed</MenuItem>
                                      </Select>
                                      <Select
                                        value={task.priority || 'medium'}
                                        onChange={(e) => handlePriorityChange(task._id, e.target.value)}
                                        size="small"
                                        sx={{ minWidth: 100 }}
                                        disabled={loading}
                                      >
                                        <MenuItem value="high">High</MenuItem>
                                        <MenuItem value="medium">Medium</MenuItem>
                                        <MenuItem value="low">Low</MenuItem>
                                      </Select>
                                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <MuiTooltip title="Edit Task">
                                          <IconButton
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
                                        </MuiTooltip>
                                      </motion.div>
                                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <MuiTooltip title="Delete Task">
                                          <IconButton
                                            onClick={() => handleDeleteTask(task._id)}
                                            color="error"
                                            disabled={loading}
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </MuiTooltip>
                                      </motion.div>
                                    </Box>
                                  </>
                                )}
                              </ListItem>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </List>
                    )}
                  </Paper>
                </motion.div>
              )}

              {activeTab === 'projects' && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Paper sx={{ p: { xs: 3, sm: 4 }, mb: 4, borderRadius: 16 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                      Add New Project
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        label="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        disabled={loading}
                        variant="outlined"
                        sx={{ flex: '1 1 200px' }}
                      />
                      <TextField
                        fullWidth
                        label="Description"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        disabled={loading}
                        variant="outlined"
                        sx={{ flex: '1 1 200px' }}
                      />
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleAddProject}
                          disabled={loading || !projectName.trim()}
                          sx={{ height: 56, minWidth: 140 }}
                        >
                          {loading ? <CircularProgress size={24} /> : "Add Project"}
                        </Button>
                      </motion.div>
                    </Box>
                  </Paper>

                  <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 16 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                      Projects
                    </Typography>
                    {loading && !projects.length ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress size={48} color="primary" />
                      </Box>
                    ) : projects.length === 0 ? (
                      <Typography align="center" sx={{ py: 4, color: 'text.secondary', fontSize: 16 }}>
                        No projects found
                      </Typography>
                    ) : (
                      <List disablePadding>
                        <AnimatePresence>
                          {projects.map((project, index) => (
                            <motion.div
                              key={project._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <ListItem
                                divider
                                sx={{
                                  py: 2.5,
                                  px: 3,
                                  bgcolor: editingProject === project._id ? 'action.hover' : 'inherit'
                                }}
                              >
                                {editingProject === project._id ? (
                                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '100%' }}>
                                    <TextField
                                      fullWidth
                                      label="Project Name"
                                      value={editTitle}
                                      onChange={(e) => setEditTitle(e.target.value)}
                                      sx={{ flex: '1 1 200px' }}
                                      disabled={loading}
                                    />
                                    <TextField
                                      fullWidth
                                      label="Description"
                                      value={editDescription}
                                      onChange={(e) => setEditDescription(e.target.value)}
                                      sx={{ flex: '1 1 200px' }}
                                      disabled={loading}
                                    />
                                    <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
                                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                          variant="contained"
                                          size="small"
                                          onClick={() => handleUpdateProject(project._id)}
                                          startIcon={<CheckIcon />}
                                          disabled={loading || !editTitle.trim()}
                                          sx={{ px: 3 }}
                                        >
                                          Save
                                        </Button>
                                      </motion.div>
                                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                          variant="outlined"
                                          size="small"
                                          onClick={() => setEditingProject(null)}
                                          startIcon={<CloseIcon />}
                                          disabled={loading}
                                          sx={{ px: 3 }}
                                        >
                                          Cancel
                                        </Button>
                                      </motion.div>
                                    </Box>
                                  </Box>
                                ) : (
                                  <>
                                    <ListItemText
                                      primary={
                                        <Typography
                                          variant="subtitle1"
                                          sx={{ fontWeight: 500, color: 'primary.main' }}
                                        >
                                          {project.name}
                                        </Typography>
                                      }
                                      secondary={
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                                          <Typography variant="body2" color="text.secondary">
                                            {project.description || "No description"}
                                          </Typography>
                                          <LinearProgress
                                            variant="determinate"
                                            value={project.progress || 0}
                                            sx={{
                                              height: 6,
                                              borderRadius: 3,
                                              mt: 1,
                                              bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                              '& .MuiLinearProgress-bar': {
                                                bgcolor: 'primary.main'
                                              }
                                            }}
                                          />
                                        </Box>
                                      }
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                      <Chip
                                        label={`${project.tasks?.length || 0} tasks`}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                        sx={{ borderRadius: 6, fontWeight: 500 }}
                                      />
                                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <MuiTooltip title="Edit Project">
                                          <IconButton
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
                                        </MuiTooltip>
                                      </motion.div>
                                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <MuiTooltip title="Delete Project">
                                          <IconButton
                                            onClick={() => handleDeleteProject(project._id)}
                                            color="error"
                                            disabled={loading}
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </MuiTooltip>
                                      </motion.div>
                                    </Box>
                                  </>
                                )}
                              </ListItem>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </List>
                    )}
                  </Paper>
                </motion.div>
              )}

              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[
                      { title: 'Total Tasks', value: tasks.length, icon: <TaskIcon sx={{ fontSize: 32 }} />, color: 'primary.main' },
                      { title: 'Completed', value: tasks.filter(t => t.status === 'completed').length, icon: <CheckCircleIcon sx={{ fontSize: 32 }} />, color: 'success.main' },
                      { title: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, icon: <TrendingUpIcon sx={{ fontSize: 32 }} />, color: 'warning.main' },
                      { title: 'Projects', value: projects.length, icon: <ProjectIcon sx={{ fontSize: 32 }} />, color: 'secondary.main' }
                    ].map((card, index) => (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                          <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', py: 3, px: 2.5, gap: 2 }}>
                              <Avatar sx={{ bgcolor: card.color, width: 56, height: 56 }}>
                                {card.icon}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                  {card.title}
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                  {card.value}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>

                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Paper sx={{ p: { xs: 3, sm: 4 }, height: 400, borderRadius: 16 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                            <BarChartIcon sx={{ fontSize: 24 }} />
                            Task Status Distribution
                          </Typography>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={chartData.statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                labelLine={{ stroke: darkMode ? '#b0bec5' : '#455a64' }}
                              >
                                {chartData.statusData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                              <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                iconSize={12}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </Paper>
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <Paper sx={{ p: { xs: 3, sm: 4 }, height: 400, borderRadius: 16 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                            <BarChartIcon sx={{ fontSize: 24 }} />
                            Task Priority Distribution
                          </Typography>
                          {chartData.priorityData.every(entry => entry.value === 0) ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                              <Typography variant="body1" color="text.secondary">
                                No priority data available
                              </Typography>
                            </Box>
                          ) : (
                            <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                <Pie
                                  data={chartData.priorityData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={100}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                  labelLine={{ stroke: darkMode ? '#b0bec5' : '#455a64' }}
                                >
                                  {chartData.priorityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                  verticalAlign="bottom"
                                  height={36}
                                  iconType="circle"
                                  iconSize={12}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          )}
                        </Paper>
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <Paper sx={{ p: { xs: 3, sm: 4 }, height: 400, borderRadius: 16 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                            <BarChartIcon sx={{ fontSize: 24 }} />
                            Activity Overview
                          </Typography>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={chartData.activityData}
                              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                              <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                style={{ fontSize: 12, fill: 'text.secondary' }}
                              />
                              <YAxis
                                axisLine={false}
                                tickLine={false}
                                style={{ fontSize: 12, fill: 'text.secondary' }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                iconSize={12}
                              />
                              <Bar
                                dataKey="tasks"
                                fill="#4caf50"
                                name="Tasks"
                                stackId="a"
                                radius={[0, 0, 4, 4]}
                                barSize={20}
                              />
                              <Bar
                                dataKey="projects"
                                fill="#81c784"
                                name="Projects"
                                stackId="a"
                                radius={[0, 0, 4, 4]}
                                barSize={20}
                              />
                              <Bar
                                dataKey="completed"
                                fill="#2196f3"
                                name="Completed"
                                stackId="a"
                                radius={[4, 4, 0, 0]}
                                barSize={20}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </Paper>
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        <Paper sx={{ p: { xs: 3, sm: 4 }, height: 400, borderRadius: 16 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                            <TrendingUpIcon sx={{ fontSize: 24 }} />
                            Completion Rate Trend
                          </Typography>
                          <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                              data={chartData.completionData}
                              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                              <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                style={{ fontSize: 12, fill: 'text.secondary' }}
                              />
                              <YAxis
                                axisLine={false}
                                tickLine={false}
                                style={{ fontSize: 12, fill: 'text.secondary' }}
                                unit="%"
                              />
                              <Tooltip content={<CustomTooltip />} formatter={(value) => [`${value}%`, 'Completion Rate']} />
                              <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                iconSize={12}
                              />
                              <Area
                                type="monotone"
                                dataKey="completion"
                                stroke="#1976d2"
                                fill="#1976d2"
                                fillOpacity={0.3}
                                name="Completion Rate"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </Paper>
                      </motion.div>
                    </Grid>
                    <Grid item xs={12}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.0 }}
                      >
                        <Paper sx={{ p: { xs: 3, sm: 4 }, height: 400, borderRadius: 16 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                            <TrendingUpIcon sx={{ fontSize: 24 }} />
                            Task & Project Trends
                          </Typography>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                              data={chartData.activityData}
                              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                              <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                style={{ fontSize: 12, fill: 'text.secondary' }}
                              />
                              <YAxis
                                axisLine={false}
                                tickLine={false}
                                style={{ fontSize: 12, fill: 'text.secondary' }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                iconSize={12}
                              />
                              <Line
                                type="monotone"
                                dataKey="tasks"
                                stroke="#4caf50"
                                name="Tasks"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="projects"
                                stroke="#81c784"
                                name="Projects"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="completed"
                                stroke="#2196f3"
                                name="Completed"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </Paper>
                      </motion.div>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                      >
                        <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 16 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                            <TaskIcon sx={{ fontSize: 24 }} />
                            Recent Tasks
                          </Typography>
                          {tasks.slice(0, 5).length > 0 ? (
                            <List disablePadding>
                              <AnimatePresence>
                                {tasks.slice(0, 5).map((task, index) => (
                                  <motion.div
                                    key={task._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                  >
                                    <ListItem
                                      divider
                                      sx={{ py: 2.5, px: 3 }}
                                    >
                                      <ListItemText
                                        primary={
                                          <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                            {task.title}
                                          </Typography>
                                        }
                                        secondary={
                                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary">
                                              {task.description || "No description"}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                              <Chip
                                                label={task.status}
                                                size="small"
                                                color={
                                                  task.status === 'completed' ? 'success' :
                                                  task.status === 'in-progress' ? 'warning' : 'error'
                                                }
                                                sx={{ borderRadius: 6, fontWeight: 500 }}
                                              />
                                              <Chip
                                                label={task.priority}
                                                size="small"
                                                color={
                                                  task.priority === 'high' ? 'error' :
                                                  task.priority === 'medium' ? 'warning' : 'success'
                                                }
                                                sx={{ borderRadius: 6, fontWeight: 500 }}
                                              />
                                            </Box>
                                          </Box>
                                        }
                                      />
                                    </ListItem>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </List>
                          ) : (
                            <Typography color="text.secondary" sx={{ py: 2 }}>
                              No recent tasks
                            </Typography>
                          )}
                        </Paper>
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.4 }}
                      >
                        <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 16 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                            <ProjectIcon sx={{ fontSize: 24 }} />
                            Recent Projects
                          </Typography>
                          {projects.slice(0, 5).length > 0 ? (
                            <List disablePadding>
                              <AnimatePresence>
                                {projects.slice(0, 5).map((project, index) => (
                                  <motion.div
                                    key={project._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                  >
                                    <ListItem
                                      divider
                                      sx={{ py: 2.5, px: 3 }}
                                    >
                                      <ListItemText
                                        primary={
                                          <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                            {project.name}
                                          </Typography>
                                        }
                                        secondary={
                                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary">
                                              {project.description || "No description"}
                                            </Typography>
                                            <LinearProgress
                                              variant="determinate"
                                              value={project.progress || 0}
                                              sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                mt: 1,
                                                bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                  bgcolor: 'primary.main'
                                                }
                                              }}
                                            />
                                          </Box>
                                        }
                                      />
                                      <Chip
                                        label={`${project.tasks?.length || 0} tasks`}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                        sx={{ borderRadius: 6, fontWeight: 500 }}
                                      />
                                    </ListItem>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </List>
                          ) : (
                            <Typography color="text.secondary" sx={{ py: 2 }}>
                              No recent projects
                            </Typography>
                          )}
                        </Paper>
                      </motion.div>
                    </Grid>
                  </Grid>
                </motion.div>
              )}
            </AnimatePresence>

            <Snackbar
              open={snackbar.open}
              autoHideDuration={4000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                sx={{
                  width: '100%',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  bgcolor: darkMode ? '#263238' : '#ffffff',
                  color: 'text.primary'
                }}
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