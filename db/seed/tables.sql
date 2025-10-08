CREATE DATABASE davinci_code;
USE davinci_code;

CREATE TABLE languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    inactive_reason VARCHAR(255) NULL,
    C2C_Cdate DATETIME NULL,
    C2C_Cuser VARCHAR(100) NULL,
    C2C_Udate DATETIME NULL,
    C2C_Uuser INT NULL
);

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_code varchar(30) unique not null,
    name VARCHAR(150) UNIQUE NOT NULL,
    language_id INT NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    inactive_reason VARCHAR(255) NULL,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    C2C_Cdate DATETIME NULL,
    C2C_Cuser VARCHAR(100) NULL,
    C2C_Udate DATETIME NULL,
    C2C_Uuser INT NULL
);

CREATE TABLE modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    module_desc varchar(255),
    status ENUM('active','inactive') DEFAULT 'active',
    inactive_reason VARCHAR(255) NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE (project_id, name),
    C2C_Cdate DATETIME NULL,
    C2C_Cuser VARCHAR(100) NULL,
    C2C_Udate DATETIME NULL,
    C2C_Uuser INT NULL
);


-- Insert Languages
INSERT INTO languages (name, status) VALUES
('Node.js', 'active'),
('Python', 'active'),
('Java', 'active'),
('React', 'active'),
('C#', 'inactive');

-- Insert Projects
INSERT INTO projects (project_code, name, language_id, status) VALUES
('ERP001', 'ERP System', 1, 'active'),
('CMS001', 'Content Management System', 2, 'active'),
('ECO001', 'E-Commerce Platform', 3, 'active'),
('HRM001', 'HR Management System', 1, 'inactive');

-- Insert Modules
INSERT INTO modules (project_id, name, status) VALUES
(1, 'Inventory', 'active'),
(1, 'Finance', 'active'),
(2, 'Page Builder', 'active'),
(2, 'User Management', 'inactive'),
(3, 'Product Catalog', 'active'),
(3, 'Checkout', 'active'),
(4, 'Employee Records', 'inactive');


create table FIELD_TYPE(
FIELD_TYPE_ID int auto_increment primary key,
FIELD_NAME varchar(30) unique not null,
status ENUM('active','inactive') DEFAULT 'active',
inactive_reason VARCHAR(255) NULL,
C2C_Cdate DATETIME NULL,
C2C_Cuser VARCHAR(100) NULL,
C2C_Udate DATETIME NULL,
C2C_Uuser INT NULL
);

INSERT INTO FIELD_TYPE (FIELD_NAME, status) VALUES
('Textbox', 'active'),
('Password Box', 'active'),
('Textarea', 'active'),
('Dropdown', 'active'),
('Radio Button', 'active');


CREATE TABLE CODE_SNIPPET (
    Snippet_ID INT AUTO_INCREMENT PRIMARY KEY,
    Snippet_Name VARCHAR(100) unique  NOT NULL,   -- e.g., "CRUD", "Model", "Validation"
    Snippet TEXT NOT NULL,                -- actual code snippet
    status ENUM('active','inactive') DEFAULT 'active',
	inactive_reason VARCHAR(255) NULL,
    C2C_Cdate DATETIME NULL,
    C2C_Cuser VARCHAR(100) NULL,
    C2C_Udate DATETIME NULL,
    C2C_Uuser INT NULL
);

<<<<<<< HEAD
INSERT INTO CODE_SNIPPET (Snippet_Name, Snippet, status) VALUES
-- Textbox
('Textbox', '<input type="text" id="{name}" name="{name}" value={formData.{name}} onChange={handleChange} className="form-control" />', 'active'),

-- Password Box
('Password Box', '<input type="password" id="{name}" name="{name}" value={formData.{name}} onChange={handleChange} className="form-control" />', 'active'),

-- Textarea
('Textarea', '<textarea id="{name}" name="{name}" value={formData.{name}} onChange={handleChange} className="form-control"></textarea>', 'active'),

-- Dropdown
('Dropdown', '<select id="{name}" name="{name}" value={formData.{name}} onChange={handleChange} className="form-control">{options.map((opt, idx) => (<option key={idx} value={opt.value}>{opt.label}</option>))}</select>', 'active'),

-- Radio Button
('Radio Button', '{options.map((opt, idx) => (<input type="radio" name="{name}" value={opt.value} checked={formData.{name} === opt.value} onChange={handleChange} key={idx} />))}', 'active');

CREATE TABLE FIELD_SNIPPET_MAP (
    MAP_ID INT AUTO_INCREMENT PRIMARY KEY,
    FIELD_TYPE_ID INT NOT NULL,
    SNIPPET_ID INT NOT NULL,
    LANGUAGE_ID INT NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    inactive_reason VARCHAR(255) NULL,
    C2C_Cdate DATETIME NULL,
    C2C_Cuser VARCHAR(100) NULL,
    C2C_Udate DATETIME NULL,
    C2C_Uuser INT NULL,
    FOREIGN KEY (FIELD_TYPE_ID) REFERENCES FIELD_TYPE(FIELD_TYPE_ID) ON DELETE CASCADE,
    FOREIGN KEY (SNIPPET_ID) REFERENCES CODE_SNIPPET(Snippet_ID) ON DELETE CASCADE,
    FOREIGN KEY (LANGUAGE_ID) REFERENCES languages(id) ON DELETE CASCADE,
    UNIQUE (FIELD_TYPE_ID, LANGUAGE_ID) -- ensure one snippet per field+language
);

INSERT INTO FIELD_SNIPPET_MAP (FIELD_TYPE_ID, SNIPPET_ID, language_id, status) VALUES
(  1, 5, 4, 'active');

-- Password Box → React snippet
INSERT INTO FIELD_SNIPPET_MAP (FIELD_TYPE_ID, SNIPPET_ID, language_id, status) VALUES
(2, 6, 4, 'active');

-- Textarea → React snippet
INSERT INTO FIELD_SNIPPET_MAP (FIELD_TYPE_ID, SNIPPET_ID, language_id, status) VALUES
(3, 7, 4, 'active');

-- Dropdown → React snippet
INSERT INTO FIELD_SNIPPET_MAP (FIELD_TYPE_ID, SNIPPET_ID, language_id, status) VALUES
(4, 8, 4, 'active');

-- Radio Button → React snippet
INSERT INTO FIELD_SNIPPET_MAP (FIELD_TYPE_ID, SNIPPET_ID, language_id, status) VALUES
(5, 9, 4, 'active');
=======
>>>>>>> f7790b03f55000638e67639ab79e5a1f26076afd

CREATE TABLE PAGE (
    PAGE_ID INT AUTO_INCREMENT PRIMARY KEY,
    PROJECT_ID INT NOT NULL,                         -- 🔗 Linked to projects.id
    PAGE_NAME VARCHAR(100) UNIQUE NOT NULL,          -- e.g. 'Employee Registration'
    PAGE_CODE VARCHAR(50) UNIQUE NOT NULL,           -- e.g. 'EMP_REG'
    DESCRIPTION TEXT NULL,
    STATUS ENUM('active', 'inactive') DEFAULT 'active',
    INACTIVE_REASON VARCHAR(255) NULL,
    cDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    cUser VARCHAR(100),
    uDate DATETIME ON UPDATE CURRENT_TIMESTAMP,
    uUser VARCHAR(100),
    FOREIGN KEY (PROJECT_ID) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE LIST_OF_VALUES (
    LOV_ID INT AUTO_INCREMENT PRIMARY KEY,
    LOV_NAME VARCHAR(200) UNIQUE NOT NULL,            -- e.g., 'Gender', 'User Role'
    LOV_DESCRIPTION VARCHAR(255) NULL,                -- e.g., 'Defines all gender types'
    LOV_STATUS ENUM('active','inactive') DEFAULT 'active',
    INACTIVE_REASON VARCHAR(255) NULL,
    cDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    cUser VARCHAR(100),
    uDate DATETIME ON UPDATE CURRENT_TIMESTAMP,
    uUser VARCHAR(100)
);

CREATE TABLE LIST_OF_VALUES_DETAILS (
    LOV_DET_ID INT AUTO_INCREMENT PRIMARY KEY,
    LOV_ID INT NOT NULL,                              -- 🔗 FK → LIST_OF_VALUES
    LOV_DET_NAME VARCHAR(200) NOT NULL,               -- e.g., 'Male', 'Female'
    LOV_DET_DESCP VARCHAR(255) NULL,                  -- Optional description
    LOV_DET_STATUS ENUM('active','inactive') DEFAULT 'active',
    INACTIVE_REASON VARCHAR(255) NULL,
    cDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    cUser VARCHAR(100),
    uDate DATETIME ON UPDATE CURRENT_TIMESTAMP,
    uUser VARCHAR(100),
    FOREIGN KEY (LOV_ID) REFERENCES LIST_OF_VALUES(LOV_ID) ON DELETE CASCADE
);

INSERT INTO LIST_OF_VALUES (LOV_NAME, LOV_DESCRIPTION, cUser)
VALUES
('Gender', 'Defines available gender options', 'admin'),
('User Role', 'Defines roles available in the system', 'admin'),
('Account Status', 'Indicates whether a user account is active or suspended', 'admin'),
('Country', 'List of supported countries', 'admin');

-- Gender
INSERT INTO LIST_OF_VALUES_DETAILS (LOV_ID, LOV_DET_NAME, LOV_DET_DESCP, cUser)
VALUES
(1, 'Male', 'Male gender', 'admin'),
(1, 'Female', 'Female gender', 'admin'),
(1, 'Other', 'Other gender identity', 'admin');

-- User Role
INSERT INTO LIST_OF_VALUES_DETAILS (LOV_ID, LOV_DET_NAME, LOV_DET_DESCP, cUser)
VALUES
(2, 'Admin', 'Has full access to the system', 'admin'),
(2, 'Manager', 'Can manage team and reports', 'admin'),
(2, 'Employee', 'Regular user access', 'admin');

-- Account Status
INSERT INTO LIST_OF_VALUES_DETAILS (LOV_ID, LOV_DET_NAME, LOV_DET_DESCP, cUser)
VALUES
(3, 'Active', 'User account is active', 'admin'),
(3, 'Suspended', 'User account is temporarily disabled', 'admin'),
(3, 'Deactivated', 'User account is permanently disabled', 'admin');

-- Country
INSERT INTO LIST_OF_VALUES_DETAILS (LOV_ID, LOV_DET_NAME, LOV_DET_DESCP, cUser)
VALUES
(4, 'India', 'Country code: IN', 'admin'),
(4, 'United States', 'Country code: US', 'admin'),
(4, 'Singapore', 'Country code: SG', 'admin');




