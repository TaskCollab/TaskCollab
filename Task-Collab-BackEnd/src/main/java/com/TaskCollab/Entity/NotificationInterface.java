package com.TaskCollab.Entity;

import java.time.LocalDateTime;

public interface NotificationInterface {
    public Long getNotificationId();
    public void setNotificationId(Long notificationId);

    public String getContent();
    public void setContent(String content);

    public String getType();
    public void setType(String type);


    public boolean isReadStatus();
    public void setReadStatus(boolean readStatus);

    public String getNotificationTitle();
    public void setNotificationTitle(String notificationTitle);

    public String getUserName();
    public void setUserName(String userName);

    public Long getUserID();
    public void setUserID(Long userID);
}
