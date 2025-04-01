package com.TaskCollab.dto;

import com.TaskCollab.Entity.NotificationInterface;

public class NotificationDTO implements NotificationInterface{
    private String username;
    private Long userId;
    private Long notificationId;
    private String content;
    private String type;
    private boolean readStatus;
    private String notificationTitle;

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
        return this.username;
    }

    @Override
    public void setUserName(String userName) {
        this.username = userName;
    }

    @Override
    public Long getUserID() {
        return this.userId;
    }

    @Override
    public void setUserID(Long userID) {
        this.userId = userID;
    }

}
