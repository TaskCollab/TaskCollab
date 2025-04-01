import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UsersAPI, UserDTO, RoleDTO } from '../../API/UsersAPICall';
import { Button, Typography, Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const UserDetailsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [editedUsername, setEditedUsername] = useState<string>('');
  const [editedRole, setEditedRole] = useState<string>('');
  const [roles, setRoles] = useState<string[]>([]);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndRoles = async () => {
      try {
        const users = await UsersAPI.getAllUsers();
        const foundUser = users.find((u: UserDTO) => u.userId === userId);
        setUser(foundUser || null);
        setEditedUsername(foundUser?.username || '');
        setEditedRole(foundUser?.role || '');

        const rolesData = await UsersAPI.getAllRoles();
        setRoles(rolesData.map((r: RoleDTO) => r.roleName));
      } catch (err) {
        setError('Failed to fetch user or roles.');
        console.error('Failed to fetch user or roles:', err);
      }
    };
    fetchUserAndRoles();
  }, [userId]);

  const handleDeleteUser = async () => {
    try {
      if (user) {
        await UsersAPI.deleteUser(user.userId);
        navigate('/users');
      }
    } catch (err) {
      setError('Failed to delete user.');
      console.error('Failed to delete user:', err);
    }
  };

  const handleUpdateUser = async () => {
    try {
      if (user) {
        await UsersAPI.updateUserRole(user.userId, editedRole);
        setUser({ ...user, username: editedUsername, role: editedRole });
        navigate('/users');
      }
    } catch (err) {
      setError('Failed to update user.');
      console.error('Failed to update user:', err);
    }
  };

  if (!user) {
    return <Typography>User not found.</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        User Details
      </Typography>
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
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" sx={{ marginRight: '8px' }} onClick={handleUpdateUser}>
          Update
        </Button>
        <Button variant="contained" color="error" onClick={handleDeleteUser}>
          Delete
        </Button>
      </Box>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default UserDetailsPage;