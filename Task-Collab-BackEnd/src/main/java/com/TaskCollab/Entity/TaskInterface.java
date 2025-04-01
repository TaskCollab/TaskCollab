package com.TaskCollab.Entity;

import java.time.LocalDateTime;

public interface TaskInterface {
    Long getTask_Id();
    void setTask_Id(Long task_Id);
    String getTask_Title();
    void setTask_Title(String task_Title);
    String getDescription();
    void setDescription(String description);
    String getAssigned_To();
    void setAssigned_To(String assigned_To);
    String getStatus();
    void setStatus(String status);
    LocalDateTime getDeadline();
    void setDeadline(LocalDateTime deadline);
    String getPriority();
    void setPriority(String priority);
}