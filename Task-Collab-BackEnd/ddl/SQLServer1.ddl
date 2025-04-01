CREATE DATABASE TaskSys;
GO

USE TaskSys;
GO

DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Roles;
DROP TABLE IF EXISTS Task;
DROP TABLE IF EXISTS Conversation;
DROP TABLE IF EXISTS ConversationParticipant;
DROP TABLE IF EXISTS Message;
DROP TABLE IF EXISTS Notification;
DROP TABLE IF EXISTS Eventlog;
DROP TABLE IF EXISTS user_roles; 


CREATE TABLE Roles (
   role_Id INT NOT NULL PRIMARY KEY,
   role_Name NVARCHAR(255) NOT NULL,
   create_permission BIT NOT NULL,
   read_permission BIT NOT NULL,
   delete_permission BIT NOT NULL,
   update_permission BIT NOT NULL
);


CREATE TABLE Users (
   user_Id BIGINT IDENTITY(101,1) NOT NULL PRIMARY KEY,
   username NVARCHAR(255) UNIQUE NOT NULL,
   password NVARCHAR(255) NOT NULL,
   role_Id INT NULL,        -- Changed from NOT NULL to NULL
   is_Admin BIT NULL,
   FOREIGN KEY (role_Id) REFERENCES Roles(role_Id) ON DELETE SET NULL
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL, -- Corrected data type to BIGINT to match Users.userId
    role_id INT NOT NULL,    -- Corrected data type to INT to match roles.roleId
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_Id) ON DELETE CASCADE, -- Corrected reference to Users(user_Id)
    FOREIGN KEY (role_id) REFERENCES Roles(role_Id) ON DELETE CASCADE   -- Corrected reference to roles(role_Id)
);


CREATE TABLE Task (
   task_Id BIGINT IDENTITY(1000,1) NOT NULL PRIMARY KEY,
   task_Title NVARCHAR(255) NOT NULL,
   description NVARCHAR(MAX),
   assigned_To NVARCHAR(255) NULL,
   status NVARCHAR(50),
   deadline DATETIME,
   FOREIGN KEY (assigned_To) REFERENCES Users(username) ON DELETE SET NULL
);

CREATE TABLE Conversation (
   conversationId BIGINT NOT NULL PRIMARY KEY,
   createdAt DATETIME,
   lastUpdatedAt DATETIME
);

CREATE TABLE ConversationParticipant (
   conversationId BIGINT NOT NULL,
   user_Id BIGINT NOT NULL,
   PRIMARY KEY (conversationId, user_Id),
   FOREIGN KEY (conversationId) REFERENCES Conversation(conversationId) ON DELETE CASCADE,
   FOREIGN KEY (user_Id) REFERENCES Users(user_Id) ON DELETE CASCADE
);

CREATE TABLE Message (
   messageId BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
   conversationId BIGINT NOT NULL,
   user_Id BIGINT NOT NULL,
   content NVARCHAR(MAX) NOT NULL,
   sendAt DATETIME NOT NULL DEFAULT GETDATE(),
   FOREIGN KEY (conversationId) REFERENCES Conversation(conversationId) ON DELETE CASCADE,
   FOREIGN KEY (user_Id) REFERENCES Users(user_Id) ON DELETE CASCADE
);

CREATE TABLE Notification (
   notification_id BIGINT NOT NULL PRIMARY KEY IDENTITY(100,1),
   user_Id BIGINT NOT NULL,
   content NVARCHAR(MAX) NOT NULL,
   type NVARCHAR(50) NOT NULL,
   read_status BIT NOT NULL DEFAULT 0,
   notification_title NVARCHAR(50) NOT NULL,
   FOREIGN KEY (user_Id) REFERENCES Users(user_Id) ON DELETE CASCADE
);

CREATE TABLE Eventlog (
   logId BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
   user_Id BIGINT NULL,
   logContent NVARCHAR(MAX) NOT NULL,
   eventTime DATETIME NOT NULL DEFAULT GETDATE(),
   FOREIGN KEY (user_Id) REFERENCES Users(user_Id) ON DELETE SET NULL
);


-- Insert roles
INSERT INTO roles (role_Id, role_Name, create_permission, read_permission, delete_permission, update_permission) VALUES
(1, 'Admin', 1, 1, 1, 1),
(2, 'Manager', 1, 1, 0, 1),
(3, 'Employee', 0, 1, 0, 0);

-- Insert users
INSERT INTO Users (username, password, role_Id, is_Admin) VALUES
('admin_user', '$2a$12$yygN6MmF18cFsczAoCBGruND1ox2ct9AhkLFgMuT/rrIl1A.n8LRO', 1, 1), 
('manager_user', 'hashedpassword2', 2, 0),
('employee_user', 'hashedpassword3', 3, 0);

-- Insert user roles (assuming users can have multiple roles)
INSERT INTO user_roles (user_id, role_id) VALUES
(101, 1),
(102, 2),
(103, 3);

-- Insert tasks
INSERT INTO Task (task_Title, description, assigned_To, status, deadline) VALUES
('Fix Server Issues', 'Resolve reported server crashes', 'admin_user', 'In Progress', '2025-02-15 17:00:00'),
('Update Documentation', 'Revise API docs with latest changes', 'admin_user', 'Pending', '2025-02-18 12:00:00'),
('Develop New Feature', 'Implement the requested UI update', 'admin_user', 'Completed', '2025-02-10 09:00:00');

-- Insert conversations
INSERT INTO Conversation (conversationId, createdAt, lastUpdatedAt) VALUES
(201, '2025-02-01 10:00:00', '2025-02-10 14:30:00'),
(202, '2025-02-03 12:15:00', '2025-02-11 09:20:00');

-- Insert conversation participants
INSERT INTO ConversationParticipant (conversationId, user_Id) VALUES
(201, 101),
(201, 102),
(202, 103),
(202, 101);

-- Insert messages
INSERT INTO Message (conversationId, user_Id, content, sendAt) VALUES
(201, 101, 'Hey, we need to fix the server ASAP.', '2025-02-10 14:31:00'),
(201, 102, 'I will check the logs and update you.', '2025-02-10 14:35:00'),
(202, 103, 'Feature update is done, please review.', '2025-02-11 09:21:00');

-- Insert notifications
INSERT INTO Notification (user_Id, content, type, read_status, notification_title) VALUES
(101, 'New task assigned: Fix Server Issues', 'Task', 0, 'New Task'),
(102, 'Your task deadline is approaching', 'Reminder', 0, 'Task Reminder'),
(103, 'Manager left a comment on your work', 'Comment', 1, 'Comment Received');

-- Insert event logs
INSERT INTO Eventlog (user_Id, logContent, eventTime) VALUES
(101, 'Logged in from web portal', '2025-02-10 09:00:00'),
(102, 'Updated documentation task status', '2025-02-10 12:45:00'),
(103, 'Submitted feature update for review', '2025-02-11 09:25:00');