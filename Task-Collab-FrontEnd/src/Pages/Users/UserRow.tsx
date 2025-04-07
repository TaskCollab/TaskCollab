// src/components/users/UserRow.tsx
import React, { useState } from 'react';
import { TableRow, TableCell, Select, MenuItem, IconButton, SelectChangeEvent, Modal, Box, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { UserDTO, RoleDTO } from '../../API/UsersAPICall'; // Ensure the file exists and matches the correct case-sensitive path

interface UserRowProps {
  user: UserDTO;
  roles: RoleDTO[];
  onUpdateRole: (userId: string, newRole: string) => void;
  onDelete: (userId: string) => void;
  onEdit: (user: UserDTO) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, roles, onUpdateRole, onDelete, onEdit }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    onUpdateRole(user.userId, event.target.value);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <TableRow hover key={user.userId}>
        <TableCell>{user.username}</TableCell>
        <TableCell>
          <Select value={user.role.roleName} onChange={handleRoleChange} size="small">
            {roles.map((role) => (
              <MenuItem key={role.roleId} value={role.roleName}>
                {role.roleName}
              </MenuItem>
            ))}
          </Select>
        </TableCell>
        <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
        <TableCell align="right">
          <IconButton aria-label="View User Details" color="primary" size="small" onClick={handleOpenModal}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="Delete User" color="error" size="small" onClick={() => onDelete(user.userId)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">
            User Details
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>User ID:</strong> {user.userId}
          </Typography>
          <Typography>
            <strong>Username:</strong> {user.username}
          </Typography>
          <Typography>
            <strong>Role:</strong> {user.role.roleName}
          </Typography>
          <Typography>
            <strong>Is Admin:</strong> {user.isAdmin ? 'Yes' : 'No'}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseModal} sx={{ mr: 1 }}>
              Close
            </Button>
            <Button variant="contained" color="primary" onClick={() => onEdit(user)}>
              Edit
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default UserRow;