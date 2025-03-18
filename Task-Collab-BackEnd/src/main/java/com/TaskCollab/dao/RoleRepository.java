package com.TaskCollab.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.TaskCollab.Entity.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
}
