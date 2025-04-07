package com.TaskCollab.Decorator;

import com.TaskCollab.Entity.TaskInterface;
import java.time.LocalDateTime;

public class ValidationTaskDecorator extends TaskDecorator {

    public ValidationTaskDecorator(TaskInterface decoratedTask) {
        super(decoratedTask);
    }

    @Override
    public void setTask_Title(String task_Title) {
        if (task_Title == null || task_Title.isEmpty()) {
            throw new IllegalArgumentException("Task title cannot be empty");
        }
        super.setTask_Title(task_Title);
    }

    @Override
    public void setDescription(String description) {
        if (description == null || description.isEmpty()) {
            throw new IllegalArgumentException("Task description cannot be empty");
        }
        super.setDescription(description);
    }

    @Override
    public void setDeadline(LocalDateTime deadline) {
        if (deadline == null) {
            throw new IllegalArgumentException("Task deadline cannot be null");
        }
        super.setDeadline(deadline);
    }

    @Override
    public void setStatus(String status) {
        if (status == null || status.isEmpty()) {
            throw new IllegalArgumentException("Task status cannot be empty");
        }
        super.setStatus(status);
    }

    @Override
    public String getPriority() {
        // Implement validation logic here, or delegate.
        if (super.getPriority() == null || super.getPriority().isEmpty()){
            throw new IllegalArgumentException("Priority cannot be empty");
        }

        return super.getPriority();
    }

    @Override
    public void setPriority(String priority) {
        // Implement validation logic here, or delegate.
        if (priority == null || priority.isEmpty()){
            throw new IllegalArgumentException("Priority cannot be empty");
        }
        super.setPriority(priority);
    }
}