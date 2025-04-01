package com.TaskCollab.Service;

import com.TaskCollab.Entity.Notification;
import com.TaskCollab.Entity.NotificationInterface;
import com.TaskCollab.Entity.Users;
import com.TaskCollab.dto.NotificationDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.CriteriaUpdate;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @PersistenceContext
    private EntityManager entityManager;

    public List<NotificationDTO> getNotificationByUserId(Long userId) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Tuple> cq = cb.createTupleQuery();
        Root<Notification> notificationRoot = cq.from(Notification.class);
        Join<Notification, Users> userJoin = notificationRoot.join("user", JoinType.INNER);

        cq.multiselect(
                notificationRoot.get("notificationId").alias("notificationId"),
                userJoin.get("username").alias("userName"),
                notificationRoot.get("content").alias("content"),
                notificationRoot.get("type").alias("type"),
                notificationRoot.get("readStatus").alias("readStatus"),
                notificationRoot.get("notificationTitle").alias("notificationTitle")
        ).where(cb.equal(userJoin.get("userId"), userId));

        List<Tuple> result = entityManager.createQuery(cq).getResultList();

        return result.stream().map(tuple -> {
            NotificationDTO dto = new NotificationDTO();
            dto.setNotificationId(tuple.get("notificationId", Long.class));
            dto.setUserName(tuple.get("userName", String.class));
            dto.setContent(tuple.get("content", String.class));
            dto.setType(tuple.get("type", String.class));
            dto.setReadStatus(tuple.get("readStatus", Boolean.class));
            dto.setNotificationTitle(tuple.get("notificationTitle", String.class));
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public NotificationInterface updateNotification(Long notificationId) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaUpdate<Notification> update = cb.createCriteriaUpdate(Notification.class);
        Root<Notification> root = update.from(Notification.class);

        update.set("readStatus", true);
        update.where(cb.equal(root.get("notificationId").as(Long.class), notificationId));

        int updatedRows = entityManager.createQuery(update).executeUpdate();

        if (updatedRows > 0) {
            return entityManager.find(Notification.class, notificationId);
        }

        return null;
    }

    @Transactional
    public void markNotificationAsRead(Long notificationId) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaUpdate<Notification> update = cb.createCriteriaUpdate(Notification.class);
        Root<Notification> root = update.from(Notification.class);

        update.set("readStatus", true);
        update.where(cb.equal(root.get("notificationId").as(Long.class), notificationId));

        entityManager.createQuery(update).executeUpdate();
    }

    @Transactional
    public void createNotification(String username, String content, String type, String notificationTitle) {
        Users user = entityManager.createQuery(
                "SELECT u FROM Users u WHERE u.username = :username", Users.class)
            .setParameter("username", username)
            .getResultList()
            .stream()
            .findFirst()
            .orElse(null);
    
        if (user == null) {
            // Handle user not found (e.g., throw an exception, log an error)
            throw new IllegalArgumentException("User with username " + username + " not found.");
        }
    
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setContent(content);
        notification.setType(type);
        notification.setReadStatus(false);
        notification.setNotificationTitle(notificationTitle);
    
        entityManager.persist(notification);
    }
}