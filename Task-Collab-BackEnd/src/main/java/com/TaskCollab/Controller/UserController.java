package com.TaskCollab.Controller;

import com.TaskCollab.Entity.Users;
import com.TaskCollab.Entity.Role;
import com.TaskCollab.Service.UserControllerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserControllerService userControllerService;

    @Autowired
    public UserController(UserControllerService userControllerService) {
        this.userControllerService = userControllerService;
    }

    // ✅ Get user by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.username == #id")
    public ResponseEntity<Users> getUserById(@PathVariable Long id) {
        Users user = userControllerService.getUserById(id);
        return (user != null) ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    // ✅ Get all users (Admin Only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Users>> getAllUsers() {
        List<Users> users = userControllerService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // ✅ Create User (Admin Only)
    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Users> createUser(@RequestBody Users user) {
        Users createdUser = userControllerService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }

    // ✅ Update User
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.username == #id")
    public ResponseEntity<Users> updateUser(@PathVariable Long id, @RequestBody Users updatedUser) {
        Users user = userControllerService.updateUser(id, updatedUser);
        return (user != null) ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    // ✅ Delete User (Admin Only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        boolean deleted = userControllerService.deleteUser(id);
        return deleted ? ResponseEntity.ok("User deleted successfully.") : ResponseEntity.notFound().build();
    }

    // ✅ Update User Role (Admin Only)
    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Users> updateUserRole(@PathVariable Long id, @RequestBody Role newRole) {
        Users updatedUser = userControllerService.updateUserRole(id, newRole);
        return (updatedUser != null) ? ResponseEntity.ok(updatedUser) : ResponseEntity.notFound().build();
    }
}
