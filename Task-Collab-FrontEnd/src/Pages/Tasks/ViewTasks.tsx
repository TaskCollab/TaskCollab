import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, Skeleton, Snackbar, TextField, InputAdornment } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search'; // Import Search icon
import ClearIcon from '@mui/icons-material/Clear'; // Import Clear icon
import TasksTable from './TasksTable';
import { TaskAPI } from '../../API/TasksAPICall';
import CreateTask from './CreateTask';
import { useNavigate } from 'react-router-dom';

// Keep your Task type
type Task = {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Completed';
  locked: boolean;
};

// Helper function to format tasks (avoids repetition)
const formatTasks = (tasksData: any[]): Task[] => {
  return tasksData.map((task: any) => ({
    id: task.id.toString(),
    title: task.taskTitle,
    // Ensure assignedTo is handled correctly (might be object or just ID)
    assignee: task.assignedTo?.toString() ?? 'Unassigned', // Example handling if assignedTo can be complex/null
    dueDate: task.deadline ? task.deadline.split('T')[0] : 'N/A', // Handle potential null deadline
    priority: task.priority as 'High' | 'Medium' | 'Low',
    status: task.status as 'Open' | 'In Progress' | 'Completed',
    locked: false, // Assuming lock state isn't part of search/fetch DTO
  }));
};


const ViewTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for the search input
  const navigate = useNavigate();

  // Function to fetch all tasks
  const fetchAllTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await TaskAPI.getUserTasks();
      setTasks(formatTasks(data)); // Use helper function
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
      setTasks([]); // Clear tasks on error
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is stable

  // Initial fetch on component mount
  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]); // Depend on fetchAllTasks

  // Function to handle search
  const handleSearch = async () => {
    // Basic search: only by title using the searchTerm
    // You could expand this to take more criteria from different inputs if needed
    if (!searchTerm.trim()) {
      // If search term is empty, fetch all tasks
      fetchAllTasks();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Modify criteria based on your backend needs.
      // Here we search only by title.
      const searchCriteria = { taskTitle: searchTerm };
      const data = await TaskAPI.searchTasks(searchCriteria);
      setTasks(formatTasks(data)); // Use helper function
    } catch (error) {
      console.error('Error searching tasks:', error);
      setError('Failed to search tasks. Please try again.');
      setTasks([]); // Clear tasks on search error
    } finally {
      setLoading(false);
    }
  };

  // Function to clear search and fetch all tasks
  const handleClearSearch = () => {
    setSearchTerm('');
    fetchAllTasks();
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };


  // Update, Delete, Lock handlers remain the same...
  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const updateData = {
        taskTitle: updatedTask.title,
        assignedTo: updatedTask.assignee, // Ensure this matches backend expectation (ID?)
        deadline: `${updatedTask.dueDate}T00:00:00`, // Or appropriate format
        status: updatedTask.status,
        priority: updatedTask.priority,
      };
      await TaskAPI.updateTask(parseInt(updatedTask.id), updateData);
      // Re-fetch or update locally depending on whether search is active
      // For simplicity, just update local state for now
      setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await TaskAPI.deleteTask(parseInt(taskId));
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const handleLockTask = async (taskId: string) => {
    try {
      // Note: Lock state is purely client-side in this example
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, locked: !task.locked } : task))
      );
    } catch (error) {
      console.error('Error locking task:', error);
      setError('Failed to toggle lock status');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap', // Allow wrapping on smaller screens
          gap: 2, // Add gap between items
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '2.5rem', // Consider using theme typography variants
            fontWeight: 500,
            color: 'primary.main',
          }}
        >
          Task Management
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5 }}> {/* Add gap between buttons */}
          {isAdmin && (
            <Button
              variant="outlined" // Maybe outlined fits better next to others
              startIcon={<GroupIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                py: 1,
                px: 2, // Adjust padding
              }}
              // onClick={() => navigate('/manage-users')} // Example navigation
            >
              Manage Users
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ textTransform: 'none', borderRadius: 2, py: 1, px: 2 }} // Adjust padding
          >
            New Task
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
         <TextField
             label="Search Tasks by Title"
             variant="outlined"
             fullWidth
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             onKeyPress={handleSearchKeyPress} // Trigger search on Enter
             size="small" // Make it less tall
             InputProps={{
               startAdornment: (
                 <InputAdornment position="start">
                   <SearchIcon />
                 </InputAdornment>
               ),
               endAdornment: searchTerm ? ( // Show clear button only if there's text
                 <InputAdornment position="end">
                   <Button
                     onClick={handleClearSearch}
                     size="small"
                     sx={{minWidth: 'auto', padding: '2px'}} // Make button compact
                     aria-label="clear search"
                   >
                     <ClearIcon fontSize="small" />
                   </Button>
                 </InputAdornment>
               ) : null,
             }}
         />
         <Button variant="contained" onClick={handleSearch} sx={{ py: 1, px: 3 }}>
           Search
         </Button>
      </Box>


      {/* Create Task Dialog */}
      <CreateTask
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onTaskCreated={(newTaskData) => { // Expect raw data from API
          // When a task is created, decide whether to append or refetch
          // Simplest: refetch all to ensure consistency (especially with sorting/filtering)
          fetchAllTasks();
          // Or, format and prepend if confident:
          // const formattedNewTask = formatTasks([newTaskData])[0];
          // setTasks((prev) => [formattedNewTask, ...prev]);
        }}
        isAdmin={isAdmin}
      />

      {/* Tasks Table or Loading Skeleton */}
      {loading ? (
        <Box sx={{ width: '100%' }}>
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={56} sx={{ mb: 1 }} />
          ))}
        </Box>
      ) : (
        <TasksTable
          tasks={tasks}
          isAdmin={isAdmin}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onLockTask={handleLockTask}
          navigate={navigate}
        />
      )}

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
};

export default ViewTasks;