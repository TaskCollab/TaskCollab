package com.TaskCollab.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Users")  // Ensure the table name matches your database
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-generate IDs
    private Long userId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "role_Id", nullable = false)  // Foreign key for Role
    private Role role;

    private boolean isAdmin;

    public Users() {}

    // Getters and Setters (REQUIRED for Hibernate)
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() {  
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean getIsAdmin() { return isAdmin; }
    public void setIsAdmin(boolean isAdmin) { this.isAdmin = isAdmin; }
}
