package com.TaskCollab.dto;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskDTO {
    private Long id;
    private String taskTitle;
    private String description;
    private String assignedTo;
    private String status;
    private LocalDateTime deadline;
    private String priority;
}
