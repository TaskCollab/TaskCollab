import React, { useState, useEffect, ChangeEvent } from 'react';
import {
    Box,
    Button,
    Typography,
    Skeleton,
    Snackbar,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent, // Import SelectChangeEvent
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import TasksTable from './TasksTable';
import { TaskAPI } from '../../API/TasksAPICall';
import CreateTask from './CreateTask';
import { useNavigate, Link } from 'react-router-dom';

type Task = {
    id: string;
    title: string;
    assignee: string;
    dueDate: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Open' | 'In Progress' | 'Completed';
    locked: boolean;
};

const ViewTasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [searchTitle, setSearchTitle] = useState<string>('');
    const [filterAssignee, setFilterAssignee] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterDate, setFilterDate] = useState<string>('');
    const [filterPriority, setFilterPriority] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
              if(localStorage.getItem('isAdmin') === 'false'){ 
                const data = await TaskAPI.getUserTasks();
                const formattedTasks = data.map((task: any) => ({
                    id: task.id.toString(),
                    title: task.taskTitle,
                    assignee: task.assignedTo.toString(),
                    dueDate: task.deadline.split('T')[0],
                    priority: task.priority as 'High' | 'Medium' | 'Low',
                    status: task.status as 'Open' | 'In Progress' | 'Completed',
                    locked: false,
                }));
                setTasks(formattedTasks);
                setFilteredTasks(formattedTasks);

                const adminStatus = localStorage.getItem('isAdmin');
                const admin = adminStatus === 'true'; // Important: Compare with string 'true'
                setIsAdmin(admin);
              } else{
                const data = await TaskAPI.getAllTasks();
                const formattedTasks = data.map((task: any) => ({
                    id: task.id.toString(),
                    title: task.taskTitle,
                    assignee: task.assignedTo.toString(),
                    dueDate: task.deadline.split('T')[0],
                    priority: task.priority as 'High' | 'Medium' | 'Low',
                    status: task.status as 'Open' | 'In Progress' | 'Completed',
                    locked: false,
                }));
                setTasks(formattedTasks);
                setFilteredTasks(formattedTasks);

                const adminStatus = localStorage.getItem('isAdmin');
                const admin = adminStatus === 'true'; // Important: Compare with string 'true'
                setIsAdmin(admin);
              
            }
          }catch (error) {
                console.error('Error fetching tasks:', error);
                setError('Failed to load tasks');
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    useEffect(() => {
        const titleFilter = searchTitle.toLowerCase();

        const filtered = tasks.filter((task) => {
            let assigneeMatch = true;
            let statusMatch = true;
            let dateMatch = true;
            let priorityMatch = true;

            // Title Filter
            if (!task.title.toLowerCase().includes(titleFilter)) {
                return false;
            }

            // Assignee Filter
            if (filterAssignee && filterAssignee !== 'All' && task.assignee !== filterAssignee) {
                assigneeMatch = false;
            }

            // Status Filter
            if (filterStatus && filterStatus !== 'All' && task.status !== filterStatus) {
                statusMatch = false;
            }

            // Date Filter
            if (filterDate && filterDate !== 'All') {
                const today = new Date();
                const taskDate = new Date(task.dueDate);

                switch (filterDate) {
                    case 'Today':
                        dateMatch = taskDate.toDateString() === today.toDateString();
                        break;
                    case 'This Week':
                        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                        dateMatch = taskDate >= startOfWeek && taskDate <= endOfWeek;
                        break;
                    case 'Next Week':
                        const startOfNextWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7));
                        const endOfNextWeek = new Date(today.setDate(today.getDate() - today.getDay() + 13));
                        dateMatch = taskDate >= startOfNextWeek && taskDate <= endOfNextWeek;
                        break;
                }
            }

            // Priority Filter
            if (filterPriority && filterPriority !== 'All' && task.priority !== filterPriority) {
                priorityMatch = false;
            }

            return assigneeMatch && statusMatch && dateMatch && priorityMatch;
        });

        setFilteredTasks(filtered);
    }, [searchTitle, filterAssignee, filterStatus, filterDate, filterPriority, tasks]);

    const handleTitleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTitle(e.target.value);
    };

    const handleAssigneeFilter = (e: SelectChangeEvent<string>) => {
        setFilterAssignee(e.target.value);
    };

    const handleStatusFilter = (e: SelectChangeEvent<string>) => {
        setFilterStatus(e.target.value);
    };

    const handleDateFilter = (e: SelectChangeEvent<string>) => {
        setFilterDate(e.target.value);
    };

    const handlePriorityFilter = (e: SelectChangeEvent<string>) => {
        setFilterPriority(e.target.value);
    };

    const handleUpdateTask = async (updatedTask: Task) => {
        try {
            const updateData = {
                taskTitle: updatedTask.title,
                assignedTo: updatedTask.assignee,
                deadline: `${updatedTask.dueDate}T23:59:59`,
                status: updatedTask.status,
                priority: updatedTask.priority,
            };
            await TaskAPI.updateTask(parseInt(updatedTask.id), updateData);
            setTasks((prev) =>
                prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
            );
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
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId ? { ...task, locked: !task.locked } : task
                )
            );
        } catch (error) {
            console.error('Error locking task:', error);
            setError('Failed to toggle lock status');
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 1200, margin: '0 auto' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: '2.5rem',
                        fontWeight: 500,
                        color: 'primary.main',
                    }}
                >
                    Task Management
                </Typography>

                <Box>
                    {isAdmin && (
                        <Button
                            variant="contained"
                            startIcon={<GroupIcon />}
                            component={Link}
                            to="/users"
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                py: 1,
                                px: 3,
                                mr: 2,
                            }}
                        >
                            Manage Users
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateDialogOpen(true)}
                        sx={{ textTransform: 'none', borderRadius: 2, py: 1, px: 3 }}
                    >
                        New Task
                    </Button>
                </Box>
            </Box>

            <CreateTask
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onTaskCreated={(newTaskRaw) => {
                    const newTask: Task = {
                        id: newTaskRaw.id.toString(),
                        title: newTaskRaw.taskTitle,
                        assignee: newTaskRaw.assignedTo.toString(),
                        dueDate: newTaskRaw.deadline.split('T')[0],
                        priority: newTaskRaw.priority as 'High' | 'Medium' | 'Low',
                        status: newTaskRaw.status as 'Open' | 'In Progress' | 'Completed',
                        locked: false,
                    };
                    setTasks((prev) => [newTask, ...prev]);
                }}
                isAdmin={isAdmin}
            />

            {loading ? (
                <Box sx={{ width: '100%' }}>
                    {[...Array(5)].map((_, index) => (
                        <Skeleton key={index} variant="rectangular" height={56} sx={{ mb: 1 }} />
                    ))}
                </Box>
            ) : (
                <>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                        <TextField
                            label="Search by Title"
                            variant="outlined"
                            size="small"
                            value={searchTitle}
                            onChange={handleTitleSearch}
                            sx={{ width: 300 }}
                        />
                        <FormControl variant="outlined" size="small" sx={{ width: 200 }}>
                            <InputLabel>Assigned User</InputLabel>
                            <Select
                                value={filterAssignee}
                                label="Assigned User"
                                onChange={handleAssigneeFilter}
                            >
                                <MenuItem value="All">All</MenuItem>

                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" size="small" sx={{ width: 200 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={filterStatus}
                                label="Status"
                                onChange={handleStatusFilter}
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Open">Open</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" size="small" sx={{ width: 200 }}>
                            <InputLabel>Date</InputLabel>
                            <Select
                                value={filterDate}
                                label="Date"
                                onChange={handleDateFilter}
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Today">Today</MenuItem>
                                <MenuItem value="This Week">This Week</MenuItem>
                                <MenuItem value="Next Week">Next Week</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" size="small" sx={{ width: 200 }}>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={filterPriority}
                                label="Priority"
                                onChange={handlePriorityFilter}
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="Low">Low</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <TasksTable
                        tasks={filteredTasks}
                        navigate={navigate}
                    />
                </>
            )}

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