package com.TaskCollab.Entity;

public interface RoleInterface {
    Integer getRoleId();
    void setRoleId(Integer roleId);
    String getRoleName();
    void setRoleName(String roleName);
    
    // Change these to "is" for Boolean fields
    Boolean isCreatePermission();
    void setCreatePermission(Boolean createPermission);
    Boolean isReadPermission();
    void setReadPermission(Boolean readPermission);
    Boolean isDeletePermission();
    void setDeletePermission(Boolean deletePermission);
    Boolean isUpdatePermission();
    void setUpdatePermission(Boolean updatePermission);
    
    String getUserName();
    void setUserName(String userName);
}
