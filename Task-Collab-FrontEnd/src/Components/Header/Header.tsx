import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  Modal,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CreateTask from '../../Pages/Tasks/CreateTask';
import { createTask } from '../../API/HeaderAPICall';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationAPI } from '../../API/NotificationAPICall';
import { Notification } from '../../Utils/NotificationTypes';

type Task = {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Completed';
  locked: boolean;
};

interface NewTask {
  taskTitle: string;
  description: string;
  assignedTo: string;
  status: string;
  deadline: string;
  priority: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(true);

  const fetchNotifications = async () => {
    try {
      const data = await NotificationAPI.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.readStatus).length);
      const adminStatus = localStorage.getItem('isAdmin');
      const admin = adminStatus === 'false'; 
      setIsAdmin(admin);
      console.log(admin)
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleNotificationOpen = async () => {
    try {
      const allNotifications = await NotificationAPI.getNotifications();
      setNotifications(
        allNotifications.map((n: Notification) => ({ ...n, readStatus: true }))
      );
      setUnreadCount(0);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error opening notifications:', error);
    }
  };

  const handleNotificationClose = () => {
    setIsModalOpen(false);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const notif = notifications.find((n) => n.notificationId === notificationId);
      if (!notif || notif.readStatus) {
        return;
      }
      await NotificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n: Notification) =>
          n.notificationId === notificationId ? { ...n, readStatus: true } : n
        )
      );
      setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleTaskCreated = async (newTask: NewTask) => {
    try {
      const deadlineDate = new Date(newTask.deadline).toISOString();
      await createTask({ ...newTask, deadline: deadlineDate });
      setTasks((prev) => [newTask, ...prev] as Task[]);
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>


        <Typography variant="h6" sx={{ flexGrow: 0, TextAlign: 'left'}}>
          <Button color="inherit" onClick={() => navigate('/home')}>Home</Button>
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton size="large" color="inherit" onClick={handleNotificationOpen} sx={{ mr: 2 }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* {isAdmin && (
          <Button color="inherit" component={Link} to="/users">Manage Users</Button>
        )} */}
      </Toolbar>



      <Modal open={isModalOpen} onClose={handleNotificationClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">Notifications</Typography>
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification.notificationId}
                component="button"
                onClick={() => {
                  handleMarkAsRead(notification.notificationId);
                  handleNotificationClose();
                }}
                sx={{
                  textAlign: 'left',
                  width: '100%',
                  display: 'block',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 1,
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                <ListItemText primary={notification.notificationTitle} secondary={notification.content} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </AppBar>
  );
};

export default Header;