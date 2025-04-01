package com.TaskCollab.Decorator;

import com.TaskCollab.Entity.RoleInterface;

public class LoggingRoleDecorator extends RoleDecorator{

    public LoggingRoleDecorator(RoleInterface decoratedRole) {
        super(decoratedRole);
    }

    @Override
    public void setRoleName(String roleName) {
        System.out.println("Logging: Setting role name to " + roleName);
        super.setRoleName(roleName);
    }
}
