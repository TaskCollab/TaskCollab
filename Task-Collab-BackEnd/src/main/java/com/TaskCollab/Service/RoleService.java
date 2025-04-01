package com.TaskCollab.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import com.TaskCollab.Decorator.*;
import com.TaskCollab.Entity.Role;
import com.TaskCollab.Entity.RoleInterface;
import com.TaskCollab.Entity.Users;
import com.TaskCollab.dao.RoleRepository;
import com.TaskCollab.dto.RoleDTO;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @PersistenceContext
    private EntityManager entityManager;  // Inject EntityManager

    // [Code smell No.1] Long searchRoles method. Need to extract into smaller methods

    // Method 1: searchRoles method
    public Collection<RoleDTO> searchRoles(Integer roleId, String roleName, 
            Boolean createPermission, Boolean readPermission, 
            Boolean deletePermission, Boolean updatePermission, String userName) {
        
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Object[]> cq = cb.createQuery(Object[].class);
        Root<Role> role = cq.from(Role.class);
        
        Join<Role, Users> userJoin = createUserJoin(role, userName);
        List<Predicate> predicates = buildSearchPredicates(cb, role, userJoin, roleId, roleName, 
        createPermission, readPermission, 
        deletePermission, updatePermission, userName);

        List<Object[]> results = executeSearchQuery(cb, cq, role, userJoin, predicates);

        return mapToRoleDTOs(results);
    }

    // Method 2: createUserJoin method
    private Join<Role, Users> createUserJoin(Root<Role> role, String userName) {
        return (userName != null && !userName.trim().isEmpty()) 
                ? role.join("users", JoinType.INNER) 
                : role.join("users", JoinType.LEFT);
    }
    
    // Method 3: buildSearchPredicates method
    private List<Predicate> buildSearchPredicates(CriteriaBuilder cb, Root<Role> role, Join<Role, Users> userJoin, 
                                                  Integer roleId, String roleName, Boolean createPermission, 
                                                  Boolean readPermission, Boolean deletePermission, 
                                                  Boolean updatePermission, String userName) {
        List<Predicate> predicates = new ArrayList<>();

        if (roleId != null) predicates.add(cb.equal(role.get("roleId"), roleId));
        if (roleName != null && !roleName.trim().isEmpty()) 
            predicates.add(cb.equal(cb.lower(role.get("roleName")), roleName.toLowerCase()));
        if (createPermission != null) predicates.add(cb.equal(role.get("createPermission"), createPermission));
        if (readPermission != null) predicates.add(cb.equal(role.get("readPermission"), readPermission));
        if (deletePermission != null) predicates.add(cb.equal(role.get("deletePermission"), deletePermission));
        if (updatePermission != null) predicates.add(cb.equal(role.get("updatePermission"), updatePermission));
        if (userName != null && !userName.trim().isEmpty()) 
            predicates.add(cb.equal(cb.lower(userJoin.get("username")), userName.toLowerCase()));

        return predicates;
    }

    // Method 4: executeSearchQuery method
    private List<Object[]> executeSearchQuery(CriteriaBuilder cb, CriteriaQuery<Object[]> cq, 
                                              Root<Role> role, Join<Role, Users> userJoin, 
                                              List<Predicate> predicates) {
        cq.multiselect(
            role.get("roleId"),
            role.get("roleName"),
            role.get("createPermission"),
            role.get("readPermission"),
            role.get("deletePermission"),
            role.get("updatePermission"),
            userJoin.get("username")
        ).where(predicates.toArray(new Predicate[0]));

        return entityManager.createQuery(cq).getResultList();
    }

    // Method 5: mapToRoleDTOs method (Remove the duplicate definition below this)
    private List<RoleDTO> mapToRoleDTOs(List<Object[]> results) {
        return results.stream().map(result -> {
            RoleDTO dto = new RoleDTO();
            dto.setRoleId((Integer) result[0]);
            dto.setRoleName((String) result[1]);
            dto.setCreatePermission((Boolean) result[2]);
            dto.setReadPermission((Boolean) result[3]);
            dto.setDeletePermission((Boolean) result[4]);
            dto.setUpdatePermission((Boolean) result[5]);
            dto.setUserName((String) result[6]);
            return dto;
        }).collect(Collectors.toList());
    }
    
    // Method 6: createRole method
    public RoleInterface createRole(RoleDTO roleDTO) {
        Role role = convertToRoleEntity(roleDTO);
        Role savedRole = saveRole(role);
        return applyDecorators(savedRole);
    }

    // Method 7: convertToRoleEntity method
    private Role convertToRoleEntity(RoleDTO roleDTO) {
        Role role = new Role();
        role.setRoleName(roleDTO.getRoleName());
        role.setCreatePermission(roleDTO.getCreatePermission());
        role.setReadPermission(roleDTO.getReadPermission());
        role.setDeletePermission(roleDTO.getDeletePermission());
        role.setUpdatePermission(roleDTO.getUpdatePermission());
        return role;
    }

    // Method 8: saveRole method
    private Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    // Method 9: applyDecorators method
    private RoleInterface applyDecorators(Role role) {
        RoleInterface decoratedRole = (RoleInterface) role;
        decoratedRole = new LoggingRoleDecorator(decoratedRole);
        decoratedRole = new ValidationRoleDecorator(decoratedRole);
        return decoratedRole;
    }

    public boolean deleteRole(String roleName) {
        if (roleRepository.findByRoleName(roleName).isPresent()) {
            // Assuming your Role entity has a getRoleId() method:
            Integer roleId = roleRepository.findByRoleName(roleName).get().getRoleId();
            roleRepository.deleteById(roleId);
            System.out.println("Deleted Role with ID: " + roleId);
            return true;
        }
        System.out.println("Role with name " + roleName + " not found");
        return false;
    }      
}
