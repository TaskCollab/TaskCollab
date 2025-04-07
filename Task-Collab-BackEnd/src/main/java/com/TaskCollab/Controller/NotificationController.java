package com.TaskCollab.Controller;

import com.TaskCollab.Entity.Notification;
import com.TaskCollab.Entity.NotificationInterface;
import com.TaskCollab.Entity.Users;
import com.TaskCollab.Service.NotificationService;
import com.TaskCollab.Service.UserService;
import com.TaskCollab.config.JwtProperties;
import com.TaskCollab.dto.NotificationDTO;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;

import com.TaskCollab.dao.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    @Autowired
    private UserService userservice;

    @Autowired
    private JwtProperties jwtProperties;

    @Autowired
    public NotificationController(NotificationRepository notificationRepository, NotificationService notificationService) {
        this.notificationRepository = notificationRepository;
        this.notificationService = notificationService;
    }

    @GetMapping("/user")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String secret = jwtProperties.getSecret();
        String username = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        Users userId = userservice.getUserByUsername(username);
        List<NotificationDTO> notifications = notificationService.getNotificationByUserId(userId.getUserId());
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/markAsRead/{id}")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long id) {
        notificationService.markNotificationAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/markAsRead/{notificationId}")
    public ResponseEntity<NotificationDTO> markNotificationAsReadAndReturn(@PathVariable Long notificationId) {
        NotificationInterface updatedNotification = notificationService.updateNotification(notificationId);
        if (updatedNotification != null) {
            return ResponseEntity.ok(convertToDTO(updatedNotification));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private NotificationDTO convertToDTO(NotificationInterface notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setNotificationId(notification.getNotificationId());
        dto.setNotificationTitle(notification.getNotificationTitle());
        dto.setUserName(notification.getUserName());
        dto.setReadStatus(notification.isReadStatus());
        dto.setContent(notification.getContent());
        dto.setType(notification.getType());
        return dto;
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserUserIdAndReadStatusFalse(userId); // Corrected method call
        return ResponseEntity.ok(unreadNotifications);
    }
}