import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Login from './Pages/auth/Login.tsx';
import Tasks from './Pages/Tasks/ViewTasks.tsx';
import TaskDetails from './Pages/Tasks/TaskDetails.tsx'; // Import TaskDetails
import Header from './Components/Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import ManageUsers from './Pages/Users/ManageUsers';
import { AuthProvider, ProtectedRoute } from '../src/Providers/AuthContext'; // adjust path


function App() {

  const protectedRoutes = ['/protected', '/dashboard', '/admin']; // Add your protected routes

  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <AuthProvider>
          <ProtectedRoute protectedRoutes={protectedRoutes} />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/home" element={<Tasks />} />
            <Route path="/" element={<Login />} />
            <Route path="/users" element={<ManageUsers />} />
            <Route path="/tasks/:taskId" element={<TaskDetails />} /> {/* Add TaskDetails route */}
            </Routes>
            </LocalizationProvider>
        </AuthProvider>

            {/* Page that requires login (any logged-in user can access) */}
            {/* <Route
              path="/user"
              element={
                <ProtectedRoute requireLogin={true}>
                  <UserPage />
                </ProtectedRoute>
              }
            /> */}

            {/* Page that requires the user to be an admin */}
            {/* <Route
              path="/admin"
              element={
                <ProtectedRoute requireLogin={true} requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            /> */}
          {/* </Routes>
        </LocalizationProvider> */}
      </div>
    </Router>
  );
}

export default App;