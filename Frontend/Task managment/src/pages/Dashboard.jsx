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
  CircularProgress
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from "@mui/icons-material";

const API_BASE_URL = "http://localhost:5000/api";

const getTheme = (darkMode) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#90caf9" : "#1976d2" },
      secondary: { main: darkMode ? "#f48fb1" : "#dc004e" },
      background: {
        default: darkMode ? "#121212" : "#f5f5f5",
        paper: darkMode ? "#1e1e1e" : "#ffffff"
      }
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 600 }
    }
  });

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data.data || res.data); // Handle both response formats
    } catch (err) {
      showError("Failed to fetch tasks");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const showError = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: "error"
    });
  };

  const showSuccess = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: "success"
    });
  };

  const handleAddTask = async () => {
    if (!title.trim()) {
      showError("Task title cannot be empty");
      return;
    }

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
      console.error("Error adding task:", err);
    }
  };

  const handleUpdateTask = async (taskId) => {
    if (!editTitle.trim()) {
      showError("Task title cannot be empty");
      return;
    }

    try {
      const res = await axios.put(
        `${API_BASE_URL}/tasks/${taskId}`,
        { title: editTitle.trim(), description: editDescription.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTasks(prev => 
        prev.map(task => task._id === taskId ? (res.data.data || res.data) : task)
      );
      setEditingTask(null);
      showSuccess("Task updated successfully");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to update task");
      console.error("Error updating task:", err);
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
      console.error("Error deleting task:", err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev => 
        prev.map(task => task._id === taskId ? (res.data.data || res.data) : task)
      );
    } catch (err) {
      showError(err.response?.data?.error || "Failed to update status");
      console.error("Error updating status:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success.main";
      case "in-progress":
        return "warning.main";
      default:
        return "text.primary";
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <ThemeProvider theme={getTheme(darkMode)}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Task Dashboard
            </Typography>
            <FormControlLabel
              control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
              label="Dark Mode"
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <TextField
              fullWidth
              label="Task Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddTask}
              sx={{ height: "56px" }}
              disabled={loading || !title.trim()}
            >
              {loading ? <CircularProgress size={24} /> : "Add Task"}
            </Button>
          </div>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          {loading && tasks.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <CircularProgress />
            </div>
          ) : tasks.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ py: 2 }}>
              No tasks found. Add a task to get started!
            </Typography>
          ) : (
            <List>
              {tasks.map((task) => (
                <ListItem
                  key={task._id}
                  divider
                  sx={{
                    backgroundColor: editingTask === task._id ? "action.hover" : "inherit",
                    transition: "background-color 0.3s ease"
                  }}
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

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
    </ThemeProvider>
  );
}