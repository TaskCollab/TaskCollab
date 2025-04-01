import axios from 'axios';

const TASK_API_URL = 'http://localhost:8080/api/tasks/create';


export const createTask = async (taskData: { taskTitle: string; description: string; assignedTo: string; status: string; deadline: string; priority: string}) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios.post(TASK_API_URL, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in createTask API call', error);
    throw error;
  }
};

