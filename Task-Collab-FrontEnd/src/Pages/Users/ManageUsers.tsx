import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import UsersTable from './UsersTable';
import  GenericModal  from '../../Components/Modal/GenericModal';
import { UsersAPI } from '../../API/UsersAPICall';
// Ensure the correct path to UsersAPICall is used
import { UserDTO } from '../../API/UsersAPICall';
import RoleManagementModal from './RoleManagementModal';
import CreateUserDialog from './CreateUserDialogue';
import AddIcon from '@mui/icons-material/Add';
import ManageRolesIcon from '@mui/icons-material/AssignmentInd';
import EditIcon from '@mui/icons-material/Edit';

interface RoleType {
  roleName: string;
}

interface UserType {
  userId: string;
  username: string;
  isAdmin: boolean;
  role: string;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [roleObjects, setRoleObjects] = useState<{ roleId: number; roleName: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [roleManagementOpen, setRoleManagementOpen] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserType | null>(null);
  const [editedUsername, setEditedUsername] = useState('');
  const [editedRole, setEditedRole] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, rolesData] = await Promise.all([
          UsersAPI.getAllUsers(),
          UsersAPI.getAllRoles(),
        ]);

        const formattedUsers = usersData.map((user: UserDTO) => ({
          userId: user.userId.toString(),
          username: user.username,
          isAdmin: user.role === 'ADMIN',
          role: user.role,
        }));

        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
        setRoles(rolesData.map((r: any) => r.roleName));
        setRoleObjects(rolesData.map((r: any) => ({ roleId: r.roleId, roleName: r.roleName })));
      } catch (error) {
        setError('Failed to load users');
        console.error('Failed to fetch users:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(users.filter((user) => user.username.toLowerCase().includes(query)));
  };

  const handleUpdateRole = async (userId: string, newRoleName: string) => {
    try {
      await UsersAPI.updateUserRole(userId, newRoleName);
      setUsers((prevUsers) => prevUsers.map((u) => (u.userId === userId ? { ...u, role: newRoleName } : u)));
    } catch (error) {
      setError('Failed to update user role');
      console.error('Failed to update user role:', error);
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
    } catch (error) {
      setError('Failed to delete user');
      console.error('Failed to delete user:', error);
    } finally {
      setConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const handleUserCreated = async (
    userData: { username: string; password: string; role: number },
    clearFields: () => void
  ) => {
    try {
      await UsersAPI.createUser(userData);
      const usersData = await UsersAPI.getAllUsers();
      const formattedUsers = usersData.map((user: UserDTO) => ({
        userId: user.userId.toString(),
        username: user.username,
        isAdmin: user.role === 'ADMIN',
        role: user.role,
      }));
      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
      setCreateUserOpen(false);
      clearFields();
    } catch (error) {
      setError('Failed to create user');
      console.error('Failed to create user:', error);
    }
  };

  const handleEditClick = (user: UserType) => {
    setUserToEdit(user);
    setEditedUsername(user.username);
    setEditedRole(user.role);
    setEditUserOpen(true);
  };

  const handleUserUpdated = async () => {
    if (!userToEdit) return;
    try {
      await UsersAPI.updateUserRole(userToEdit.userId, editedRole);
      const updatedUsers = users.map((user) =>
        user.userId === userToEdit.userId ? { ...user, username: editedUsername, role: editedRole } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setEditUserOpen(false);
    } catch (error) {
      setError('Failed to update user');
      console.error('Failed to update user:', error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Manage Users
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<ManageRolesIcon />}
          onClick={() => setRoleManagementOpen(true)}
          sx={{ textTransform: 'none' }}
        >
          Manage Roles
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateUserOpen(true)}
          sx={{ textTransform: 'none' }}
        >
          New User
        </Button>
      </Box>

      <TextField
        label="Search Users"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 2, width: '100%', maxWidth: 400 }}
      />

      <UsersTable
        users={filteredUsers}
        roles={roles}
        onUpdateRole={handleUpdateRole}
        onDelete={handleDeleteClick}
        // onEdit={handleEditClick}
      />

      <RoleManagementModal open={roleManagementOpen} onClose={() => setRoleManagementOpen(false)} />

      <GenericModal
  show={confirmOpen}
  onHide={() => setConfirmOpen(false)}
  id="confirm-deletion-modal"
  content={
    <div>
      <p>{`Are you sure you want to delete user "${userToDelete?.username}"?`}</p>
      <Button onClick={handleConfirmDelete} variant="contained">Confirm</Button>
      <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
    </div>
  }
/>

      <CreateUserDialog
        open={createUserOpen}
        onClose={() => setCreateUserOpen(false)}
        onCreate={handleUserCreated}
        roles={roleObjects}
      />

      <Dialog open={editUserOpen} onClose={() => setEditUserOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
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
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserOpen(false)}>Cancel</Button>
          <Button onClick={handleUserUpdated} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ManageUsers;