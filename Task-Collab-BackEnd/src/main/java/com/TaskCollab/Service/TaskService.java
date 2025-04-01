package com.TaskCollab.Service;

import com.TaskCollab.Decorator.LoggingTaskDecorator;
import com.TaskCollab.Decorator.ValidationTaskDecorator;
import com.TaskCollab.dto.TaskDTO;
import com.TaskCollab.Entity.Task;
import com.TaskCollab.Entity.TaskInterface;
import com.TaskCollab.dao.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TaskRepository taskRepository;

    
    // Retrieve a specific task by its ID
    public TaskInterface getTaskById(Long taskId) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        return taskOpt.map(task -> {
            TaskInterface decoratedTask = task;
            decoratedTask = new LoggingTaskDecorator(decoratedTask);
            decoratedTask = new ValidationTaskDecorator(decoratedTask);
            return decoratedTask;
        }).orElse(null);
    }

    // Create a new task
    public TaskInterface createTask(TaskDTO taskDTO) {
        Task task = new Task();
        task.setTask_Title(taskDTO.getTaskTitle());
        task.setDescription(taskDTO.getDescription());
        task.setAssigned_To(taskDTO.getAssignedTo());
        task.setStatus(taskDTO.getStatus());
        task.setDeadline(taskDTO.getDeadline());
        task.setPriority(taskDTO.getPriority());

        Task savedTask = taskRepository.save(task);

        notificationService.createNotification(taskDTO.getAssignedTo(), "A new task was created with title - "  + taskDTO.getTaskTitle(), "Information", "New Ticket was created for you");

        TaskInterface decoratedTask = savedTask;
        decoratedTask = new LoggingTaskDecorator(decoratedTask);
        decoratedTask = new ValidationTaskDecorator(decoratedTask);

        return decoratedTask;
    }

// Update existing task by ID
public TaskInterface updateTask(Long taskId, TaskDTO taskDTO) {
    Optional<Task> existingTaskOpt = taskRepository.findById(taskId);

    return existingTaskOpt.map(existingTask -> {
        existingTask.setTask_Title(taskDTO.getTaskTitle());
        existingTask.setDescription(taskDTO.getDescription());
        existingTask.setAssigned_To(taskDTO.getAssignedTo());
        existingTask.setStatus(taskDTO.getStatus());
        existingTask.setDeadline(taskDTO.getDeadline());
        existingTask.setPriority(taskDTO.getPriority());

        Task updatedTask = taskRepository.save(existingTask);

        // Create a notification for the assigned user
        try {
            notificationService.createNotification(
                updatedTask.getAssigned_To(), // Use username
                "Task '" + updatedTask.getTask_Title() + "' has been updated.",
                "Task Update",
                "Task Updated"
            );
        } catch (IllegalArgumentException e) {
            // Log the error or handle it as appropriate for your application
            System.err.println("Error creating notification: " + e.getMessage());
        }

        TaskInterface decoratedTask = updatedTask;
        decoratedTask = new LoggingTaskDecorator(decoratedTask);
        decoratedTask = new ValidationTaskDecorator(decoratedTask);

        return decoratedTask;
    }).orElse(null);
}


public boolean deleteTask(Long task_Id) {
    Optional<Task> taskOpt = taskRepository.findById(task_Id);

    if (taskOpt.isPresent()) {
        Task taskToDelete = taskOpt.get(); 
        taskRepository.deleteById(task_Id);
        System.out.println("Deleted Task with ID: " + task_Id);

        try {
            notificationService.createNotification(
                taskToDelete.getAssigned_To(), 
                "Task '" + taskToDelete.getTask_Title() + "' has been deleted.",
                "Task Deletion",
                "Task Deleted"
            );
        } catch (IllegalArgumentException e) {
            System.err.println("Error creating notification: " + e.getMessage());
        }

        return true;
    }

    System.out.println("Task ID " + task_Id + " not found.");
    return false;
}

    public List<TaskInterface> getTasksByUsername(String username) {
        List<Task> tasks = taskRepository.findByAssigned_To(username);
        return tasks.stream().map(task -> {
            TaskInterface decoratedTask = task;
            decoratedTask = new LoggingTaskDecorator(decoratedTask);
            decoratedTask = new ValidationTaskDecorator(decoratedTask);
            return decoratedTask;
        }).collect(Collectors.toList());
    }
}