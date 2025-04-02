// src/components/users/UsersTable.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import UserRow from './UserRow';
import { UserDTO, RoleDTO } from '../../API/UsersAPICall'; // Ensure the file exists and matches the correct case-sensitive path


interface UsersTableProps {
  users: UserDTO[];
  roles: RoleDTO[];
  onUpdateRole: (userId: string, newRole: string) => void;
  onDelete: (userId: string) => void;
  onEdit: (user: UserDTO) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, roles, onUpdateRole, onDelete, onEdit }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Admin Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <UserRow key={user.userId} user={user} roles={roles} onUpdateRole={onUpdateRole} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersTable;