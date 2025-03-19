package com.TaskCollab.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.TaskCollab.Entity.Role;
import com.TaskCollab.Entity.Users;
import com.TaskCollab.dao.UserRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

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
    return userRepository.save(user); // ✅ No hashing, stores raw password
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

}
