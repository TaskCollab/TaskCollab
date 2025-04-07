// src/components/users/RoleManagementModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, FormControlLabel } from '@mui/material';
import { UsersAPI, RoleDTO } from '../../API/UsersAPICall';


interface RoleManagementModalProps {
  open: boolean;
  onClose: () => void;
  onRolesUpdated: () => void;
}

const RoleManagementModal: React.FC<RoleManagementModalProps> = ({ open, onClose, onRolesUpdated }) => {
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState({
    createPermission: true,
    readPermission: true,
    updatePermission: true,
    deletePermission: true,
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await UsersAPI.getAllRoles();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    if (open) fetchRoles();
  }, [open]);

  const handleCreateRole = async () => {
    if (!newRoleName) return;
    try {
      const roleDTO = {
        roleName: newRoleName,
        createPermission: newRolePermissions.createPermission,
        readPermission: newRolePermissions.readPermission,
        updatePermission: newRolePermissions.updatePermission,
        deletePermission: newRolePermissions.deletePermission,
      };

      await UsersAPI.createRole(roleDTO);

      setNewRoleName('');
      setNewRolePermissions({ createPermission: true, readPermission: true, updatePermission: true, deletePermission: true });
      const updatedRoles = await UsersAPI.getAllRoles();
      setRoles(updatedRoles);
      if (onRolesUpdated) {
        onRolesUpdated();
      }
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Role Management</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <TextField label="New Role Name" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} fullWidth />
          <div>
            <FormControlLabel control={<Checkbox checked={newRolePermissions.createPermission} onChange={(e) => setNewRolePermissions({ ...newRolePermissions, createPermission: e.target.checked })} />} label="Create" />
            <FormControlLabel control={<Checkbox checked={newRolePermissions.readPermission} onChange={(e) => setNewRolePermissions({ ...newRolePermissions, readPermission: e.target.checked })} />} label="Read" />
            <FormControlLabel control={<Checkbox checked={newRolePermissions.updatePermission} onChange={(e) => setNewRolePermissions({ ...newRolePermissions, updatePermission: e.target.checked })} />} label="Update" />
            <FormControlLabel control={<Checkbox checked={newRolePermissions.deletePermission} onChange={(e) => setNewRolePermissions({ ...newRolePermissions, deletePermission: e.target.checked })} />} label="Delete" />
          </div>
          <Button variant="contained" onClick={handleCreateRole}>
            Create Role
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.roleName}>
                  <TableCell>{role.roleName}</TableCell>
                  <TableCell>
                    {role.createPermission && 'Create'} {role.readPermission && 'Read'} {role.updatePermission && 'Update'} {role.deletePermission && 'Delete'}
                  </TableCell>
                  <TableCell>
                    <Button color="error" onClick={async () => {
                      await UsersAPI.deleteRole(role.roleName);
                      setRoles((prev) => prev.filter((r) => r.roleName !== role.roleName));
                    }}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleManagementModal;