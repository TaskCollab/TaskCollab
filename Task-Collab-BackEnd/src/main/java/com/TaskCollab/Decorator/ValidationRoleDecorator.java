package com.TaskCollab.Decorator;

import com.TaskCollab.Entity.RoleInterface;

public class ValidationRoleDecorator extends RoleDecorator {

    public ValidationRoleDecorator(RoleInterface decoratedRole) {
        super(decoratedRole);
    }

    @Override
    public void setRoleName(String roleName) {
        if (roleName == null || roleName.isEmpty()) {
            throw new IllegalArgumentException("Role name cannot be empty");
        }
        super.setRoleName(roleName);
    }
}
