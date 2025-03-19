package com.TaskCollab.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.TaskCollab.Entity.Users;
import com.TaskCollab.Entity.Role;
import com.TaskCollab.dao.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserControllerService {

    private final UserRepository userRepository;
    private final UserService userService;

    @Autowired
    public UserControllerService(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    // Get user by ID
    public Users getUserById(Long id) {
        return userService.getUserById(id);
    }

    // Get all users
    public List<Users> getAllUsers() {
        return userService.getAllUsers();
    }

    // Create a new user
    public Users createUser(Users user) {
        return userService.createUser(user);
    }

    // Update user details
    public Users updateUser(Long id, Users updatedUser) {
        return userService.updateUser(id, updatedUser);
    }

    // Delete user
    public boolean deleteUser(Long id) {
        return userService.deleteUser(id);
    }

    // Assign Role to a user
    public Users updateUserRole(Long userId, Role newRole) {
        Optional<Users> optionalUser = userRepository.findById(userId);
        Optional<Role> optionalRole = Optional.ofNullable(newRole);

        if (optionalUser.isPresent() && optionalRole.isPresent()) {
            Users user = optionalUser.get();
            user.setRole(optionalRole.get());
            return userRepository.save(user);
        }
        return null;
    }
}
