package com.TaskCollab.Entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Set;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "roles")
public class Role implements RoleInterface {

    @SuppressWarnings("deprecation")
    @Id
    @GenericGenerator(name = "increment-gen", strategy = "increment")
    @GeneratedValue(generator = "increment-gen")
    private Integer roleId;

    @Column(nullable = false, unique = true)
    private String roleName;

    @Column(nullable = false)
    private boolean createPermission;

    @Column(nullable = false)
    private boolean readPermission;

    @Column(nullable = false)
    private boolean deletePermission;

    @Column(nullable = false)
    private boolean updatePermission;

    @JsonIgnore
    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
    private Set<Users> users;

    @Transient
    private String userName;

    // Getters and Setters (REQUIRED for Hibernate)
    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public Boolean isCreatePermission() {
        return createPermission;
    }

    public void setCreatePermission(Boolean createPermission) {
        this.createPermission = createPermission;
    }

    public Boolean isReadPermission() {
        return readPermission;
    }

    public void setReadPermission(Boolean readPermission) {
        this.readPermission = readPermission;
    }

    public Boolean isDeletePermission() {
        return deletePermission;
    }

    public void setDeletePermission(Boolean deletePermission) {
        this.deletePermission = deletePermission;
    }

    public Boolean isUpdatePermission() {
        return updatePermission;
    }

    public void setUpdatePermission(Boolean updatePermission) {
        this.updatePermission = updatePermission;
    }

    public Set<Users> getUsers() {
        return users;
    }

    public void setUsers(Set<Users> users) {
        this.users = users;
    }

    // Implementations of RoleInterface methods
    @Override
    public String getUserName() {
        return this.userName;  // Return the actual field value
    }

    @Override
    public void setUserName(String userName) {
        this.userName = userName;  // Assign the value to the field
    }
}
