package com.TaskCollab.Decorator;

import com.TaskCollab.Entity.TaskInterface;
import java.time.LocalDateTime;

public abstract class TaskDecorator implements TaskInterface {
    protected TaskInterface decoratedTask;

    public TaskDecorator(TaskInterface decoratedTask) {
        this.decoratedTask = decoratedTask;
    }

    @Override
    public Long getTask_Id() {
        return decoratedTask.getTask_Id();
    }

    @Override
    public void setTask_Id(Long task_Id) {
        decoratedTask.setTask_Id(task_Id);
    }

    @Override
    public String getPriority() {
        return decoratedTask.getPriority();
    }

    @Override  
    public void setPriority(String priority) {
        decoratedTask.setPriority(priority);
    }

    @Override
    public String getTask_Title() {
        return decoratedTask.getTask_Title();
    }

    @Override
    public void setTask_Title(String task_Title) {
        decoratedTask.setTask_Title(task_Title);
    }

    @Override
    public String getDescription() {
        return decoratedTask.getDescription();
    }

    @Override
    public void setDescription(String description) {
        decoratedTask.setDescription(description);
    }

    @Override
    public String getAssigned_To() {
        return decoratedTask.getAssigned_To();
    }

    @Override
    public void setAssigned_To(String assigned_To) {
        decoratedTask.setAssigned_To(assigned_To);
    }

    @Override
    public String getStatus() {
        return decoratedTask.getStatus();
    }

    @Override
    public void setStatus(String status) {
        decoratedTask.setStatus(status);
    }

    @Override
    public LocalDateTime getDeadline() {
        return decoratedTask.getDeadline();
    }

    @Override
    public void setDeadline(LocalDateTime deadline) {
        decoratedTask.setDeadline(deadline);
    }
}