import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
} from '@mui/material';
import { Edit, Delete, Lock, LockOpen, Save, Cancel } from '@mui/icons-material';
import { toast } from 'react-toastify'; // Import toast from react-toastify

interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Completed';
  locked: boolean;
}

interface TaskRowProps {
  task: Task;
  isAdmin: boolean;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
  onLock: (taskId: string) => void;
  lockTaskApi: (taskId: string, locked: boolean) => Promise<void>; // Add the lockTaskApi
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  isAdmin,
  onUpdate,
  onDelete,
  onLock,
  lockTaskApi, // Receive the api call as a prop
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>({ ...task });

  const handleChange = (field: keyof Task, value: string) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = () => {
    setIsEditing(false);
    onUpdate(editedTask);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedTask({ ...task });
  };

  const handleLock = async () => {
    if (!isAdmin) {
      toast.error('You are not authorized to lock tasks.');
      return;
    }

    try {
      await lockTaskApi(task.id, !task.locked); // Call the API
      onLock(task.id); // Update the state
    } catch (error) {
      console.error('Failed to lock/unlock task:', error);
      toast.error('Failed to lock/unlock task.');
    }
  };

  return (
    <TableRow>
      <TableCell>
        {isEditing ? (
          <TextField
            value={editedTask.title}
            onChange={(e) => handleChange('title', e.target.value)}
            fullWidth
          />
        ) : (
          task.title
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <TextField
            value={editedTask.assignee}
            onChange={(e) => handleChange('assignee', e.target.value)}
            fullWidth
          />
        ) : (
          task.assignee
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <TextField
            type="date"
            value={editedTask.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            fullWidth
          />
        ) : (
          task.dueDate
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={editedTask.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            fullWidth
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        ) : (
          task.priority
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={editedTask.status}
            onChange={(e) => handleChange('status', e.target.value)}
            fullWidth
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        ) : (
          task.status
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <>
            <IconButton onClick={saveChanges} color="primary">
              <Save />
            </IconButton>
            <IconButton onClick={cancelEdit} color="secondary">
              <Cancel />
            </IconButton>
          </>
        ) : (
          <>
            {!task.locked && (
              <>
                <IconButton onClick={() => setIsEditing(true)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => onDelete(task.id)} color="secondary">
                  <Delete />
                </IconButton>
              </>
            )}
            {isAdmin && (
              <IconButton onClick={handleLock} color="default">
                {task.locked ? <Lock /> : <LockOpen />}
              </IconButton>
            )}
          </>
        )}
      </TableCell>
    </TableRow>
  );
};

export default TaskRow;