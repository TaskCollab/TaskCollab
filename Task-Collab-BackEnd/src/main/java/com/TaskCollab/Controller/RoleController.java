package com.TaskCollab.Controller;

import com.TaskCollab.dto.RoleDTO;
import com.TaskCollab.Entity.RoleInterface;
import com.TaskCollab.Service.RoleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    
    @Autowired
    private RoleService roleService;


    @PostMapping("/search")
    public ResponseEntity<List<RoleDTO>> searchRoles(@RequestBody RoleDTO searchCriteria) { 
        Integer roleId = searchCriteria.getRoleId();
        String roleName = searchCriteria.getRoleName();
        Boolean createPermission = searchCriteria.isCreatePermission();
        Boolean readPermission = searchCriteria.isReadPermission();
        Boolean deletePermission = searchCriteria.isDeletePermission();
        Boolean updatePermission = searchCriteria.isUpdatePermission();
        String userName = searchCriteria.getUserName();
        
        List<RoleDTO> roles = roleService.searchRoles(roleId, roleName, createPermission, readPermission, deletePermission, updatePermission, userName)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(roles);
    }

    // POST request to create a new role
    @PostMapping("/create")
    public ResponseEntity<RoleDTO> createRole(@RequestBody RoleDTO roleDTO) {
        RoleInterface role = roleService.createRole(roleDTO);
        return ResponseEntity.ok(convertToDTO(role));
    }

    // DELETE request to delete a role by name
    @PostMapping("/delete/{roleName}")
    public ResponseEntity<String> deleteRole(@PathVariable String roleName) {
        boolean isDeleted = roleService.deleteRole(roleName);
        if (isDeleted) {
            return ResponseEntity.ok("Role deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Role not found");
        }
    }


    // Helper method to convert RoleInterface to RoleDTO
    private RoleDTO convertToDTO(RoleInterface role) {
        RoleDTO dto = new RoleDTO();
        dto.setRoleId(role.getRoleId());
        dto.setRoleName(role.getRoleName());
        dto.setCreatePermission(role.isCreatePermission());
        dto.setReadPermission(role.isReadPermission());
        dto.setDeletePermission(role.isDeletePermission());
        dto.setUpdatePermission(role.isUpdatePermission());
        dto.setUserName(role.getUserName());
        return dto;
    }

    

}
