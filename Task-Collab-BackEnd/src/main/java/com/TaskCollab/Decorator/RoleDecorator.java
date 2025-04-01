package com.TaskCollab.Decorator;

import com.TaskCollab.Entity.RoleInterface;

public abstract class RoleDecorator implements RoleInterface{
    protected RoleInterface decoratedRole;

    public RoleDecorator(RoleInterface decoratedRole) {
        this.decoratedRole = decoratedRole;
    }

    @Override
    public Integer getRoleId() {
        return decoratedRole.getRoleId();
    }

    @Override
    public void setRoleId(Integer roleId) {
        decoratedRole.setRoleId(roleId);
    }

    @Override
    public String getRoleName() {
        return decoratedRole.getRoleName();
    }

    @Override
    public void setRoleName(String roleName) {
        decoratedRole.setRoleName(roleName);
    }

    @Override
    public Boolean isCreatePermission() {
        return decoratedRole.isCreatePermission();
    }

    @Override
    public void setCreatePermission(Boolean createPermission) {
        decoratedRole.setCreatePermission(createPermission);
    }

    @Override
    public Boolean isReadPermission() {
        return decoratedRole.isReadPermission();
    }

    @Override
    public void setReadPermission(Boolean readPermission) {
        decoratedRole.setReadPermission(readPermission);
    }

    @Override
    public Boolean isDeletePermission() {
        return decoratedRole.isDeletePermission();
    }

    @Override
    public void setDeletePermission(Boolean deletePermission) {
        decoratedRole.setDeletePermission(deletePermission);
    }

    @Override
    public Boolean isUpdatePermission() {
        return decoratedRole.isUpdatePermission();
    }

    @Override
    public void setUpdatePermission(Boolean updatePermission) {
        decoratedRole.setUpdatePermission(updatePermission);
    }

    @Override
    public String getUserName() {
        return decoratedRole.getUserName();
    }

    @Override
    public void setUserName(String userName) {
        decoratedRole.setUserName(userName);
    }
}
