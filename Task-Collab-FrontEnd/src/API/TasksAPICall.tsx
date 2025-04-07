import axios from "axios";
import { TASK_API_URL } from "../Utils/Constants";

const taskApiClient = axios.create({
  baseURL: TASK_API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

type TaskSearchCriteria = {
  taskTitle?: string;
  description?: string;
  assignedTo?: number | string; // Adjust type based on backend expectation (ID or name?)
  status?: 'Open' | 'In Progress' | 'Completed';
  deadline?: string; // Format like 'YYYY-MM-DD' if sending just date
};



const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error('API Error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'An API error occurred');
  }
  console.error('Unexpected error:', error);
  throw new Error('An unexpected error occurred');
};

taskApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const TaskAPI = {
  getUserTasks: async () => {
    const response = await taskApiClient.get("/my-tasks");
    return response.data;
  },

  getAllTasks: async () => {
    const response = await taskApiClient.get("/all-tasks");
    return response.data;
  },

   async searchTasks(criteria: TaskSearchCriteria): Promise<any[]> { //TODO: FIX THIS API CALL
    // Ensure deadline is formatted correctly if provided, or omit if null/undefined
    const body: any = {};
    if (criteria.taskTitle) body.taskTitle = criteria.taskTitle;
    if (criteria.description) body.description = criteria.description;
    if (criteria.assignedTo) body.assignedTo = criteria.assignedTo;
    if (criteria.status) body.status = criteria.status;
    // Backend expects deadline as string? Adjust formatting as needed.
    // If you send just 'YYYY-MM-DD', ensure backend handles it or send full ISO string.
    if (criteria.deadline) body.deadline = `${criteria.deadline}T00:00:00`; // Example formatting

    try {
      const response = await fetch(`${TASK_API_URL}search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add other necessary headers like Authorization if required
          // 'Authorization': `Bearer ${your_token}`
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        // Throw an error with more context if possible
        const errorData = await response.text(); // Or response.json() if backend sends structured error
        console.error("Search API Error Response:", errorData);
        throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to search tasks:", error);
      // Re-throw the error so the component can catch it
      throw error;
    }
  },

  createTask: async (taskData: TaskDTO) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(TASK_API_URL + "create", taskData, { // TASK_API_URL is the base URL
          headers: {
              Authorization: `Bearer ${token}`, // Add the Authorization header
          },
      });
      return response.data;
  } catch (error) {
      console.error("Error in createTask API call", error);
      throw error;
  }
},

lockTask: async (taskId: number, locked: boolean) => {
  try {
    const response = await taskApiClient.put(`/lock/${taskId}?lock=${locked}`); // Corrected API call
    return response.data;
  } catch (error) {
    handleApiError(error);
    return null;
  }
},

  getTask: async (id: number) => {
    const response = await taskApiClient.get(`${id}`);
    return response.data;
  },

  updateTask: async (id: number, taskData: Partial<TaskDTO>) => {
    const response = await taskApiClient.put(`/update/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: number) => {
    const response = await taskApiClient.delete(`delete/${id}`);
    return response.data;
  }
};

interface TaskDTO {
  taskTitle: string;
  description: string;
  assignedTo: string;
  status: string;
  priority: string;
  deadline: string;
}

export interface Task extends TaskDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
}