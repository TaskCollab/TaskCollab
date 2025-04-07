package com.TaskCollab.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.TaskCollab.Entity.Role;
import com.TaskCollab.Entity.Users;
import com.TaskCollab.config.SecurityConfig;
import com.TaskCollab.dao.RoleRepository;
import com.TaskCollab.dao.UserRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final NotificationService notificationService;

    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.notificationService = notificationService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));

        // Combine role name and CRUD permissions
        Set<GrantedAuthority> authorities = new HashSet<>();
        Set<Role> roles = user.getRole() == null ? new HashSet<>() : new HashSet<>(Set.of(user.getRole()));
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getRoleName()));

            if (role.isCreatePermission()) authorities.add(new SimpleGrantedAuthority("CREATE"));
            if (role.isReadPermission()) authorities.add(new SimpleGrantedAuthority("READ"));
            if (role.isUpdatePermission()) authorities.add(new SimpleGrantedAuthority("UPDATE"));
            if (role.isDeletePermission()) authorities.add(new SimpleGrantedAuthority("DELETE"));
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }

    // Get user by username
    public Users getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    // Get user by ID
    public Users getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Get all users
    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    // Create a new user (Stores raw password)
    public Users createUser(Users user) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String rawPassword = user.getPassword();
        String hashedPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(hashedPassword); // Correctly set the hashed password
        return userRepository.save(user);
    }

    // Update user details (Stores raw password)
    public Users updateUser(Long id, Users updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            user.setPassword(updatedUser.getPassword());
            return userRepository.save(user);
        }).orElse(null);
    }

    // Delete user
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Assign Role to a user by Role ID
    public Users updateUserRole(Long userId, String roleName) {
        Optional<Users> optionalUser = userRepository.findById(userId);
        Optional<Role> optionalRole = roleRepository.findByRoleName(roleName);

        if (optionalUser.isPresent() && optionalRole.isPresent()) {
            Users user = optionalUser.get();
            Role role = optionalRole.get();
            user.setRole(role);
            Users updatedUser = userRepository.save(user);

            // Create a notification for the user
            try {
                notificationService.createNotification(
                        updatedUser.getUsername(), // Use username
                        "Your role has been updated to: " + role.getRoleName(),
                        "Role Update",
                        "Role Updated"
                );
            } catch (IllegalArgumentException e) {
                // Log the error or handle it as appropriate for your application
                System.err.println("Error creating notification: " + e.getMessage());
            }

            return updatedUser;
        }
        return null; // or throw an exception indicating user or role not found
    }
}