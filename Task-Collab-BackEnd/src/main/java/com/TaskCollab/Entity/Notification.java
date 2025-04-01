package com.TaskCollab.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "Notification")
public class Notification implements NotificationInterface {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @Column(name = "read_status", nullable = false)
    private boolean readStatus;

    @Column(name = "notification_title", nullable = false, length = 50)
    private String notificationTitle;

    // Getters and Setters (Lombok @Data handles these)

    @Override
    public Long getNotificationId() {
        return notificationId;
    }

    @Override
    public void setNotificationId(Long notificationId) {
        this.notificationId = notificationId;
    }

    @Override
    public String getContent() {
        return content;
    }

    @Override
    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String getType() {
        return type;
    }

    @Override
    public void setType(String type) {
        this.type = type;
    }

    @Override
    public boolean isReadStatus() {
        return readStatus;
    }

    @Override
    public void setReadStatus(boolean readStatus) {
        this.readStatus = readStatus;
    }

    @Override
    public String getNotificationTitle() {
        return notificationTitle;
    }

    @Override
    public void setNotificationTitle(String notificationTitle) {
        this.notificationTitle = notificationTitle;
    }

    @Override
    public String getUserName() {
        return this.user.getUsername();
    }

    @Override
    public void setUserName(String userName) {
        this.user.setUsername(userName);
    }

    @Override
    public Long getUserID() {
        return this.user.getUserId();
    }

    @Override
    public void setUserID(Long userId) {
        if (this.user == null) {
            this.user = new Users();
        }
        this.user.setUserId(userId);
    }
}