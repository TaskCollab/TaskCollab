package com.TaskCollab.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "task")
public class Task implements TaskInterface {

    @Override
    public Long getTask_Id() {
        return task_Id;
    }

    @Override
    public void setTask_Id(Long task_Id) {
        this.task_Id = task_Id;
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_Id")
    private Long task_Id;

    private String task_Title;
    private String description;
    private String assigned_To;
    private String status;
    private LocalDateTime deadline;
    @Column(name = "locked")
    private boolean locked = false;

    @Column(name = "priority")
    private String priority;

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }


    public String getTask_Title() {
        return task_Title;
    }

    public void setTask_Title(String task_Title) {
        this.task_Title = task_Title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAssigned_To() {
        return assigned_To;
    }

    public void setAssigned_To(String assigned_To) {
        this.assigned_To = assigned_To;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public boolean isLocked() {
        return locked;
    }
    public void setLocked(boolean locked) {
        this.locked = locked;
    }
}