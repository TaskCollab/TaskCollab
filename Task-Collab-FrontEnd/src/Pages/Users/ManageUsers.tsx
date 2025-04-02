// src/components/users/ManageUsers.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl, // Add this
  InputLabel, // Add this
  Select, // Add this
  MenuItem, // Add this
} from '@mui/material';
  import UsersTable from './UsersTable';
import RoleManagementModal from './RoleManagementModal';
import CreateUserDialog from './CreateUserDialogue';
import { UsersAPI, UserDTO, RoleDTO } from '../../API/UsersAPICall';
import AddIcon from '@mui/icons-material/Add';
import ManageRolesIcon from '@mui/icons-material/AssignmentInd';
import GenericModal from '../../Components/Modal/GenericModal';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserDTO[]>([]);
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<UserDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [roleManagementOpen, setRoleManagementOpen] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserDTO | null>(null);
  const [editedUsername, setEditedUsername] = useState('');
  const [editedRole, setEditedRole] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, rolesData] = await Promise.all([
          UsersAPI.getAllUsers(),
          UsersAPI.getAllRoles(),
        ]);
        setUsers(usersData);
        setFilteredUsers(usersData);
        setRoles(rolesData);
      } catch (err) {
        setError('Failed to load data.');
        console.error('Failed to load data:', err);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(users.filter((user) => user.username.toLowerCase().includes(query)));
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await UsersAPI.updateUserRole(userId, newRole);
      const updatedUsers = users.map((u) => (u.userId === userId ? { ...u, role: {roleName: newRole, roleId: roles.find(role => role.roleName === newRole)?.roleId || 0} } : u));
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (err) {
      setError('Failed to update role.');
      console.error('Failed to update role:', err);
    }
  };

  const handleDeleteClick = (userId: string) => {
    const user = users.find((u) => u.userId === userId) || null;
    setUserToDelete(user);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await UsersAPI.deleteUser(userToDelete.userId);
      setUsers((prev) => prev.filter((u) => u.userId !== userToDelete.userId));
      setFilteredUsers((prev) => prev.filter((u) => u.userId !== userToDelete.userId));
    } catch (err) {
      setError('Failed to delete user.');
      console.error('Failed to delete user:', err);
    } finally {
      setConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const handleUserCreated = async (userData: { username: string; password: string; role: number }, clearFields: () => void) => {
    try {
      await UsersAPI.createUser(userData);
      const updatedUsers = await UsersAPI.getAllUsers();
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setCreateUserOpen(false);
      clearFields();
    } catch (err) {
      setError('Failed to create user.');
      console.error('Failed to create user:', err);
    }
  };

  const handleEditClick = (user: UserDTO) => {
    setUserToEdit(user);
    setEditedUsername(user.username);
    setEditedRole(user.role.roleName);
    setEditUserOpen(true);
  };

  const handleUserUpdated = async () => {
    if (!userToEdit) return;
    try {
      await UsersAPI.updateUserRole(userToEdit.userId, editedRole);
      const updatedUsers = users.map((user) =>
        user.userId === userToEdit.userId ? { ...user, username: editedUsername, role: {roleName: editedRole, roleId: roles.find(role => role.roleName === editedRole)?.roleId || 0} } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setEditUserOpen(false);
    } catch (err) {
      setError('Failed to update user.');
      console.error('Failed to update user:', err);
    }
  };

  const handleRolesUpdated = async () => {
    try {
      const rolesData = await UsersAPI.getAllRoles();
      setRoles(rolesData);
    } catch (err) {
      setError('Failed to update roles.');
      console.error('Failed to update roles:', err);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Manage Users
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" startIcon={<ManageRolesIcon />} onClick={() => setRoleManagementOpen(true)} sx={{ textTransform: 'none' }}>
          Manage Roles
        </Button>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateUserOpen(true)} sx={{ textTransform: 'none' }}>
          New User
        </Button>
      </Box>

      <TextField label="Search Users" variant="outlined" size="small" value={searchQuery} onChange={handleSearchChange} sx={{ mb: 2, width: '100%', maxWidth: 400 }} />

      <UsersTable users={filteredUsers} roles={roles} onUpdateRole={handleUpdateRole} onDelete={handleDeleteClick} onEdit={handleEditClick} />

      <RoleManagementModal open={roleManagementOpen} onClose={() => setRoleManagementOpen(false)} onRolesUpdated={handleRolesUpdated} />

      <GenericModal show={confirmOpen} onHide={() => setConfirmOpen(false)} id="confirm-deletion-modal" content={
        <div>
          <p>{`Are you sure you want to delete user "${userToDelete?.username}"?`}</p>
          <Button onClick={handleConfirmDelete} variant="contained">Confirm</Button>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
        </div>
      } />

      <CreateUserDialog open={createUserOpen} onClose={() => setCreateUserOpen(false)} onCreate={handleUserCreated} roles={roles} />

      <Dialog open={editUserOpen} onClose={() => setEditUserOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField label="Username" value={editedUsername} onChange={(e) => setEditedUsername(e.target.value)} fullWidth margin="normal" />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={editedRole}
              label="Role"
              onChange={(e) => setEditedRole(e.target.value)}
            >
              {roles.map((role) => (
                <MenuItem key={role.roleId} value={role.roleName}>
                  {role.roleName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserOpen(false)}>Cancel</Button>
          <Button onClick={handleUserUpdated} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
};

export default ManageUsers;