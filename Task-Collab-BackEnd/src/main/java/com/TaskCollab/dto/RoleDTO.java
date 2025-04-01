package com.TaskCollab.dto;

import com.TaskCollab.Entity.RoleInterface;
import lombok.Data;

@Data
public class RoleDTO implements RoleInterface {
    private Integer roleId;
    private String roleName;
    // Use Boolean, not boolean, to allow null values.
    private Boolean createPermission;
    private Boolean readPermission;
    private Boolean deletePermission;
    private Boolean updatePermission;
    private String userName;

    @Override
    public Boolean isCreatePermission() {
        return createPermission;
    }

    @Override
    public Boolean isReadPermission() {
        return readPermission;
    }

    @Override
    public Boolean isDeletePermission() {
        return deletePermission;
    }

    @Override
    public Boolean isUpdatePermission() {
        return updatePermission;
    }
}
