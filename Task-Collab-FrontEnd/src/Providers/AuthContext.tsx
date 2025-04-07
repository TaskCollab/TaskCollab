import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { AUTH_API_URL } from '../Utils/Constants';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

interface User {
    username: string;
    isAdmin: boolean;
    // Add other relevant user properties based on your API response
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${AUTH_API_URL}/login`, { username, password });
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('isAdmin', response.data.isAdmin);

            setUser({
                username: response.data.username,
                isAdmin: response.data.isAdmin,
                // Add other relevant properties from response.data
            });
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await axios.post(`${AUTH_API_URL}/logout`);
            localStorage.removeItem('authToken');
            localStorage.removeItem('isAdmin');
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('authToken');
            const isAdmin = localStorage.getItem('isAdmin');

            if (token && isAdmin !== null) {
                try {
                    // You might want to validate the token with your backend here
                    // For simplicity, this example assumes the token is valid if it exists.
                    setUser({
                        username: 'User', // Replace with how you get the username.
                        isAdmin: isAdmin === 'true',
                    });
                } catch (error) {
                    console.error('Token validation failed:', error);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('isAdmin');
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// ProtectedRoute component
interface ProtectedRouteProps {
    children: ReactNode;
    protectedRoutes?: string[]; // Array of routes that require authentication
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, protectedRoutes = [] }) => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate(); // Use useNavigate instead of useRouter
    const location = window.location; // get the current route.
    const currentRoute = location.pathname;

    useEffect(() => {
        if (!isLoading && protectedRoutes.includes(currentRoute) && !user) {
            // Display a toast message here
            alert('You are not logged in.');
            navigate('/'); // Use navigate instead of router.push
        }
    }, [user, isLoading, navigate, currentRoute, protectedRoutes]);

    if (isLoading) {
        return <p>Loading...</p>; // Or a loading spinner
    }

    if (protectedRoutes.includes(currentRoute) && !user) {
        return null; // Don't render anything until redirected
    }

    return <>{children}</>;
};