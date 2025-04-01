package com.TaskCollab.dao;

import com.TaskCollab.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserUserIdAndReadStatusFalse(Long userId); // Corrected method name

    Optional<Notification> findByNotificationId(Long notificationId);
}