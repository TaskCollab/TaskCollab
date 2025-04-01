import React, { useState } from 'react';
import { TableRow, TableCell, Select, MenuItem, IconButton, SelectChangeEvent, Modal, Box, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface RoleType {
  roleId: number;
  roleName: string;
}

interface UserType {
  userId: number;
  username: string;
  isAdmin?: boolean;
  role: RoleType;
}

interface UserRowProps {
  user: UserType;
  roles: RoleType[];
  onUpdateRole: (userId: number, newRoleId: number) => void;
  onDelete: (userId: number) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, roles, onUpdateRole, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleRoleChange = (event: SelectChangeEvent<number>) => {
    const newRoleId = Number(event.target.value);
    onUpdateRole(user.userId, newRoleId);
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
          <Select
            value={user.role.roleId}
            onChange={handleRoleChange}
            size="small"
          >
            {roles.map(role => (
              <MenuItem key={role.roleId} value={role.roleId}>
                {role.roleName}
              </MenuItem>
            ))}
          </Select>
        </TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="View User Details"
            color="primary"
            size="small"
            onClick={handleOpenModal}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="Delete User"
            color="error"
            size="small"
            onClick={() => onDelete(user.userId)}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <Modal open={modalOpen} onClose={handleCloseModal}>
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
            <Button variant="contained" color="primary">
              Edit
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default UserRow;