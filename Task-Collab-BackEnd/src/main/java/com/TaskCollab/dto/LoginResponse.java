package com.TaskCollab.dto;

public class LoginResponse {
    private String token;
    private Boolean isAdmin;

    // Constructor
    public LoginResponse(String token, Boolean isAdmin) {
        this.token = token;
        this.isAdmin = isAdmin;
    }

    // Getter
    public String getToken() {
        return token;
    }

    // Setter 
    public void setToken(String token) {
        this.token = token;
    }

    // Getter
    public Boolean getIsAdmin() {
        return isAdmin;
    }
    // Setter
    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }
}