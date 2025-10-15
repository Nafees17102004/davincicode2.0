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

CREATE TABLE TAB_TABLE (
    TAB_ID INT AUTO_INCREMENT PRIMARY KEY,
    PROJECT_ID INT NOT NULL,
    PAGE_ID INT NOT NULL,
    TAB_NAME VARCHAR(150) NOT NULL,
    TAB_IMAGE_ID INT NULL,
    STATUS ENUM('active','inactive') DEFAULT 'active',
    INACTIVE_REASON VARCHAR(255) NULL,
    C2C_CDATE DATETIME DEFAULT CURRENT_TIMESTAMP,
    C2C_CUSER VARCHAR(100),
    C2C_UDATE DATETIME ON UPDATE CURRENT_TIMESTAMP,
    C2C_UUSER VARCHAR(100),
    FOREIGN KEY (PROJECT_ID) REFERENCES PROJECTS(ID) ON DELETE CASCADE,
    FOREIGN KEY (PAGE_ID) REFERENCES PAGE(PAGE_ID) ON DELETE CASCADE,
    FOREIGN KEY (TAB_IMAGE_ID) REFERENCES TAB_IMAGE_TABLE(TAB_IMAGE_ID) ON DELETE SET NULL
);


INSERT INTO TAB_TABLE (PROJECT_ID, PAGE_ID, TAB_NAME, TAB_IMAGE_ID, C2C_CUSER)
VALUES
(1, 1, 'Personal Information', NULL, 'admin'),
(1, 1, 'Account Settings', NULL, 'admin'),
(1, 1, 'Contact Details', NULL, 'admin');

CREATE TABLE ADD_FORM_TABLE (
    ADD_FORM_ID INT AUTO_INCREMENT PRIMARY KEY,
    TAB_ID INT NOT NULL,
    FIELD_SOURCE_LOV_DET_ID INT NULL,   -- e.g., dropdown/textbox source
    FIELD_NAME VARCHAR(100) NOT NULL,
    FIELD_SIZE_LOV_DET_ID INT NULL,     -- e.g., small, medium, large
    FIELD_ICON_LOV_DET_ID INT NULL,     -- e.g., user, email icon
    PLACEHOLDER VARCHAR(255) NULL,
    FIELD_ORDER_LOV_DET_ID INT NULL,    -- defines display order
    STATUS ENUM('active','inactive') DEFAULT 'active',
    INACTIVE_REASON VARCHAR(255) NULL,
    C2C_CDATE DATETIME DEFAULT CURRENT_TIMESTAMP,
    C2C_CUSER VARCHAR(100),
    C2C_UDATE DATETIME ON UPDATE CURRENT_TIMESTAMP,
    C2C_UUSER VARCHAR(100),
    FOREIGN KEY (TAB_ID) REFERENCES TAB_TABLE(TAB_ID) ON DELETE CASCADE,
    FOREIGN KEY (FIELD_SOURCE_LOV_DET_ID) REFERENCES LIST_OF_VALUES_DETAILS(LOV_DET_ID) ON DELETE SET NULL,
    FOREIGN KEY (FIELD_SIZE_LOV_DET_ID) REFERENCES LIST_OF_VALUES_DETAILS(LOV_DET_ID) ON DELETE SET NULL,
    FOREIGN KEY (FIELD_ICON_LOV_DET_ID) REFERENCES LIST_OF_VALUES_DETAILS(LOV_DET_ID) ON DELETE SET NULL,
    FOREIGN KEY (FIELD_ORDER_LOV_DET_ID) REFERENCES LIST_OF_VALUES_DETAILS(LOV_DET_ID) ON DELETE SET NULL
);

CREATE TABLE FORM_VALIDATION_TABLE (
    FORM_FIELD_VALIDATION_ID INT AUTO_INCREMENT PRIMARY KEY,
    FORM_FIELD_ID INT NOT NULL,             -- FK from ADD_FORM_TABLE
    JS_SCRIPT_ID INT NULL,                  -- e.g., reference to reusable JS validator
    VALIDATION_RULE VARCHAR(255) NULL,      -- optional rule description
    STATUS ENUM('active','inactive') DEFAULT 'active',
    C2C_CDATE DATETIME DEFAULT CURRENT_TIMESTAMP,
    C2C_CUSER VARCHAR(100),
    C2C_UDATE DATETIME ON UPDATE CURRENT_TIMESTAMP,
    C2C_UUSER VARCHAR(100),
    FOREIGN KEY (FORM_FIELD_ID) REFERENCES ADD_FORM_TABLE(ADD_FORM_ID) ON DELETE CASCADE,
    FOREIGN KEY (JS_SCRIPT_ID) REFERENCES JS_SCRIPT_LIBRARY(JS_SCRIPT_ID) ON DELETE SET NULL
);

CREATE TABLE FORM_EVENT_HANDLER (
    FORM_FIELD_EVENT_HANDLER_ID INT AUTO_INCREMENT PRIMARY KEY,
    FORM_FIELD_ID INT NOT NULL,                    -- FK from ADD_FORM_TABLE
    EVENT_HANDLER_LOV_ID INT NOT NULL,             -- e.g., 'onChange', 'onBlur'
    JS_SCRIPT_ID INT NULL,                         -- JS or custom function ref
    ACTION_DESCRIPTION VARCHAR(255) NULL,          -- e.g., "Fetch related data"
    STATUS ENUM('active','inactive') DEFAULT 'active',
    C2C_CDATE DATETIME DEFAULT CURRENT_TIMESTAMP,
    C2C_CUSER VARCHAR(100),
    C2C_UDATE DATETIME ON UPDATE CURRENT_TIMESTAMP,
    C2C_UUSER VARCHAR(100),
    FOREIGN KEY (FORM_FIELD_ID) REFERENCES ADD_FORM_TABLE(ADD_FORM_ID) ON DELETE CASCADE,
    FOREIGN KEY (EVENT_HANDLER_LOV_ID) REFERENCES LIST_OF_VALUES(LOV_ID) ON DELETE SET NULL,
    FOREIGN KEY (JS_SCRIPT_ID) REFERENCES JS_SCRIPT_LIBRARY(JS_SCRIPT_ID) ON DELETE SET NULL
);




// code update for overall query optimization //

-- ==========================================================
-- 🔥 CLEAN SETUP
-- ==========================================================
DROP DATABASE IF EXISTS davinci_code;
CREATE DATABASE davinci_code;
USE davinci_code;

-- ==========================================================
-- 1️⃣ LANGUAGES TABLE
-- ==========================================================
CREATE TABLE languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    inactive_reason VARCHAR(255),
    C2C_Cdate DATETIME,
    C2C_Cuser VARCHAR(100),
    C2C_Udate DATETIME,
    C2C_Uuser INT
);

INSERT INTO languages (name, status) VALUES
('Node.js', 'active'),
('Python', 'active'),
('Java', 'active'),
('React', 'active'),
('C#', 'inactive');

-- ==========================================================
-- 2️⃣ PROJECTS TABLE
-- ==========================================================
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(150) UNIQUE NOT NULL,
    language_id INT NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    inactive_reason VARCHAR(255),
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    C2C_Cdate DATETIME,
    C2C_Cuser VARCHAR(100),
    C2C_Udate DATETIME,
    C2C_Uuser INT
);

INSERT INTO projects (project_code, name, language_id, status) VALUES
('ERP001', 'ERP System', 1, 'active'),
('CMS001', 'Content Management System', 2, 'active'),
('ECO001', 'E-Commerce Platform', 3, 'active'),
('HRM001', 'HR Management System', 1, 'inactive');

-- ==========================================================
-- 3️⃣ MODULES TABLE
-- ==========================================================
CREATE TABLE modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    module_desc VARCHAR(255),
    status ENUM('active','inactive') DEFAULT 'active',
    inactive_reason VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE (project_id, name),
    C2C_Cdate DATETIME,
    C2C_Cuser VARCHAR(100),
    C2C_Udate DATETIME,
    C2C_Uuser INT
);

INSERT INTO modules (project_id, name, status) VALUES
(1, 'Inventory', 'active'),
(1, 'Finance', 'active'),
(2, 'Page Builder', 'active'),
(2, 'User Management', 'inactive'),
(3, 'Product Catalog', 'active'),
(3, 'Checkout', 'active'),
(4, 'Employee Records', 'inactive');

-- ==========================================================
-- 4️⃣ FIELD_TYPE TABLE
-- ==========================================================
CREATE TABLE FIELD_TYPE (
    FIELD_TYPE_ID INT AUTO_INCREMENT PRIMARY KEY,
    FIELD_NAME VARCHAR(30) UNIQUE NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    inactive_reason VARCHAR(255),
    C2C_Cdate DATETIME,
    C2C_Cuser VARCHAR(100),
    C2C_Udate DATETIME,
    C2C_Uuser INT
);

INSERT INTO FIELD_TYPE (FIELD_NAME, status) VALUES
('Textbox', 'active'),
('Password Box', 'active'),
('Textarea', 'active'),
('Dropdown', 'active'),
('Radio Button', 'active');

-- ==========================================================
-- 5️⃣ CODE_SNIPPET TABLE
-- ==========================================================
CREATE TABLE CODE_SNIPPET (
    Snippet_ID INT AUTO_INCREMENT PRIMARY KEY,
    Snippet_Name VARCHAR(100) UNIQUE NOT NULL,
    Snippet TEXT NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    inactive_reason VARCHAR(255),
    C2C_Cdate DATETIME,
    C2C_Cuser VARCHAR(100),
    C2C_Udate DATETIME,
    C2C_Uuser INT
);

INSERT INTO CODE_SNIPPET (Snippet_Name, Snippet, status) VALUES
('Textbox', '<input type="text" id="{name}" name="{name}" value={formData.{name}} onChange={handleChange} className="form-control" />', 'active'),
('Password Box', '<input type="password" id="{name}" name="{name}" value={formData.{name}} onChange={handleChange} className="form-control" />', 'active'),
('Textarea', '<textarea id="{name}" name="{name}" value={formData.{name}} onChange={handleChange} className="form-control"></textarea>', 'active'),
('Dropdown', '<select id="{name}" name="{name}" value={formData.{name}} onChange={handleChange} className="form-control">{options.map((opt, idx) => (<option key={idx} value={opt.value}>{opt.label}</option>))}</select>', 'active'),
('Radio Button', '{options.map((opt, idx) => (<input type="radio" name="{name}" value={opt.value}" checked={formData.{name} === opt.value} onChange={handleChange} key={idx} />))}', 'active');

-- ==========================================================
-- 6️⃣ FIELD_SNIPPET_MAP
-- ==========================================================
CREATE TABLE FIELD_SNIPPET_MAP (
    MAP_ID INT AUTO_INCREMENT PRIMARY KEY,
    FIELD_TYPE_ID INT NOT NULL,
    SNIPPET_ID INT NOT NULL,
    LANGUAGE_ID INT NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    inactive_reason VARCHAR(255),
    C2C_Cdate DATETIME,
    C2C_Cuser VARCHAR(100),
    C2C_Udate DATETIME,
    C2C_Uuser INT,
    FOREIGN KEY (FIELD_TYPE_ID) REFERENCES FIELD_TYPE(FIELD_TYPE_ID) ON DELETE CASCADE,
    FOREIGN KEY (SNIPPET_ID) REFERENCES CODE_SNIPPET(Snippet_ID) ON DELETE CASCADE,
    FOREIGN KEY (LANGUAGE_ID) REFERENCES languages(id) ON DELETE CASCADE,
    UNIQUE (FIELD_TYPE_ID, LANGUAGE_ID)
);

INSERT INTO FIELD_SNIPPET_MAP (FIELD_TYPE_ID, SNIPPET_ID, language_id, status) VALUES
(1, 1, 4, 'active'),
(2, 2, 4, 'active'),
(3, 3, 4, 'active'),
(4, 4, 4, 'active'),
(5, 5, 4, 'active');

-- ==========================================================
-- 7️⃣ PAGE TABLE
-- ==========================================================
CREATE TABLE PAGE (
    PAGE_ID INT AUTO_INCREMENT PRIMARY KEY,
    PROJECT_ID INT NOT NULL,
    PAGE_NAME VARCHAR(100) UNIQUE NOT NULL,
    PAGE_CODE VARCHAR(50) UNIQUE NOT NULL,
    DESCRIPTION TEXT,
    STATUS ENUM('active','inactive') DEFAULT 'active',
    INACTIVE_REASON VARCHAR(255),
    cDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    cUser VARCHAR(100),
    uDate DATETIME ON UPDATE CURRENT_TIMESTAMP,
    uUser VARCHAR(100),
    FOREIGN KEY (PROJECT_ID) REFERENCES projects(id) ON DELETE CASCADE
);

-- ==========================================================
-- 8️⃣ LIST OF VALUES (LOV)
-- ==========================================================
CREATE TABLE LIST_OF_VALUES (
    LOV_ID INT AUTO_INCREMENT PRIMARY KEY,
    LOV_NAME VARCHAR(200) UNIQUE NOT NULL,
    LOV_DESCRIPTION VARCHAR(255),
    LOV_STATUS ENUM('active','inactive') DEFAULT 'active',
    INACTIVE_REASON VARCHAR(255),
    cDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    cUser VARCHAR(100),
    uDate DATETIME ON UPDATE CURRENT_TIMESTAMP,
    uUser VARCHAR(100)
);

CREATE TABLE LIST_OF_VALUES_DETAILS (
    LOV_DET_ID INT AUTO_INCREMENT PRIMARY KEY,
    LOV_ID INT NOT NULL,
    LOV_DET_NAME VARCHAR(200) NOT NULL,
    LOV_DET_DESCP VARCHAR(255),
    LOV_DET_STATUS ENUM('active','inactive') DEFAULT 'active',
    INACTIVE_REASON VARCHAR(255),
    cDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    cUser VARCHAR(100),
    uDate DATETIME ON UPDATE CURRENT_TIMESTAMP,
    uUser VARCHAR(100),
    FOREIGN KEY (LOV_ID) REFERENCES LIST_OF_VALUES(LOV_ID) ON DELETE CASCADE
);

INSERT INTO LIST_OF_VALUES (LOV_NAME, LOV_DESCRIPTION, cUser) VALUES
('Gender', 'Defines available gender options', 'admin'),
('User Role', 'Defines roles available in the system', 'admin'),
('Country', 'List of supported countries', 'admin');

INSERT INTO LIST_OF_VALUES_DETAILS (LOV_ID, LOV_DET_NAME, cUser) VALUES
(1, 'Male', 'admin'),
(1, 'Female', 'admin'),
(1, 'Other', 'admin'),
(2, 'Admin', 'admin'),
(2, 'Manager', 'admin'),
(2, 'Employee', 'admin'),
(3, 'India', 'admin'),
(3, 'USA', 'admin'),
(3, 'Singapore', 'admin');

-- ==========================================================
-- 9️⃣ TAB IMAGE TABLE
-- ==========================================================
CREATE TABLE TAB_IMAGE_TABLE (
    TAB_IMAGE_ID INT AUTO_INCREMENT PRIMARY KEY,
    IMAGE_NAME VARCHAR(150) NOT NULL,
    IMAGE_PATH VARCHAR(255) NOT NULL,
    STATUS ENUM('active','inactive') DEFAULT 'active',
    INACTIVE_REASON VARCHAR(255),
    C2C_CDATE DATETIME DEFAULT CURRENT_TIMESTAMP,
    C2C_CUSER VARCHAR(100),
    C2C_UDATE DATETIME ON UPDATE CURRENT_TIMESTAMP,
    C2C_UUSER VARCHAR(100)
);

INSERT INTO TAB_IMAGE_TABLE (IMAGE_NAME, IMAGE_PATH, C2C_CUSER) VALUES
('User Info', '/assets/icons/user.png', 'admin'),
('Job Details', '/assets/icons/job.png', 'admin');

-- ==========================================================
-- 🔟 TAB TABLE
-- ==========================================================
CREATE TABLE TAB_TABLE (
    TAB_ID INT AUTO_INCREMENT PRIMARY KEY,
    PROJECT_ID INT NOT NULL,
    PAGE_ID INT NOT NULL,
    TAB_NAME VARCHAR(150) NOT NULL,
    TAB_IMAGE_ID INT,
    STATUS ENUM('active','inactive') DEFAULT 'active',
    INACTIVE_REASON VARCHAR(255),
    C2C_CDATE DATETIME DEFAULT CURRENT_TIMESTAMP,
    C2C_CUSER VARCHAR(100),
    C2C_UDATE DATETIME ON UPDATE CURRENT_TIMESTAMP,
    C2C_UUSER VARCHAR(100),
    FOREIGN KEY (PROJECT_ID) REFERENCES PROJECTS(ID) ON DELETE CASCADE,
    FOREIGN KEY (PAGE_ID) REFERENCES PAGE(PAGE_ID) ON DELETE CASCADE,
    FOREIGN KEY (TAB_IMAGE_ID) REFERENCES TAB_IMAGE_TABLE(TAB_IMAGE_ID) ON DELETE SET NULL
);

-- ==========================================================
-- 11️⃣ JS SCRIPT LIBRARY
-- ==========================================================
CREATE TABLE js_script_library (
    js_id INT AUTO_INCREMENT PRIMARY KEY,
    js_name VARCHAR(150) NOT NULL,
    js_script TEXT NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    c2c_cdate DATETIME DEFAULT CURRENT_TIMESTAMP,
    c2c_cuser VARCHAR(100),
    c2c_udate DATETIME ON UPDATE CURRENT_TIMESTAMP,
    c2c_uuser VARCHAR(100)
);

INSERT INTO js_script_library (js_name, js_script, c2c_cuser) VALUES
('Email Validator', 'function validateEmail(v){return /^[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,}$/.test(v);}', 'admin'),
('Password Strength Check', 'function checkPasswordStrength(p){return p.length>=8;}', 'admin'),
('Show Alert', 'function showAlert(msg){alert(msg);}', 'admin'),
('Fetch Dropdown Options', 'async function fetchOptions(url){const r=await fetch(url);return await r.json();}', 'admin');

-- ==========================================================
-- 12️⃣ ADD FORM TABLE
-- ==========================================================
CREATE TABLE add_form_table (
    add_form_id INT AUTO_INCREMENT PRIMARY KEY,
    tab_id INT NOT NULL,
    field_label VARCHAR(255) NOT NULL,
    field_type VARCHAR(100),
    field_name VARCHAR(255),
    placeholder VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    c2c_cdate DATETIME DEFAULT CURRENT_TIMESTAMP,
    c2c_cuser VARCHAR(100),
    c2c_udate DATETIME ON UPDATE CURRENT_TIMESTAMP,
    c2c_uuser VARCHAR(100),
    FOREIGN KEY (tab_id) REFERENCES tab_table(tab_id) ON DELETE CASCADE
);

INSERT INTO add_form_table (tab_id, field_label, field_type, field_name, placeholder, c2c_cuser) VALUES
(1, 'Email Address', 'Textbox', 'email', 'Enter your email', 'admin'),
(1, 'Password', 'Password Box', 'password', 'Enter your password', 'admin'),
(1, 'Gender', 'Dropdown', 'gender', 'Select gender', 'admin'),
(1, 'Country', 'Dropdown', 'country', 'Select country', 'admin'),
(1, 'About You', 'Textarea', 'about', 'Write about yourself', 'admin');

-- ==========================================================
-- 13️⃣ FORM VALIDATION TABLE
-- ==========================================================
CREATE TABLE form_validation_table (
    form_field_validation_id INT AUTO_INCREMENT PRIMARY KEY,
    form_field_id INT NOT NULL,
    js_id INT,
    validation_rule VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    c2c_cdate DATETIME DEFAULT CURRENT_TIMESTAMP,
    c2c_cuser VARCHAR(100),
    c2c_udate DATETIME ON UPDATE CURRENT_TIMESTAMP,
    c2c_uuser VARCHAR(100),
    FOREIGN KEY (form_field_id) REFERENCES add_form_table(add_form_id) ON DELETE CASCADE,
    FOREIGN KEY (js_id) REFERENCES js_script_library(js_id) ON DELETE SET NULL
);

INSERT INTO form_validation_table (form_field_id, js_id, validation_rule, c2c_cuser) VALUES
(1, 1, 'Must be a valid email address', 'admin'),
(2, 2, 'Minimum 8 characters', 'admin');

-- ==========================================================
-- 14️⃣ FORM EVENT HANDLER TABLE
-- ==========================================================
CREATE TABLE form_event_handler (
    form_event_handler_id INT AUTO_INCREMENT PRIMARY KEY,
    form_field_id INT NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    js_id INT,
    action_description VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    c2c_cdate DATETIME DEFAULT CURRENT_TIMESTAMP,
    c2c_cuser VARCHAR(100),
    c2c_udate DATETIME ON UPDATE CURRENT_TIMESTAMP,
    c2c_uuser VARCHAR(100),
    FOREIGN KEY (form_field_id) REFERENCES add_form_table(add_form_id) ON DELETE CASCADE,
    FOREIGN KEY (js_id) REFERENCES js_script_library(js_id) ON DELETE SET NULL
);

INSERT INTO form_event_handler (form_field_id, event_name, js_id, action_description, c2c_cuser) VALUES
(3, 'onChange', 4, 'Fetch gender options dynamically', 'admin'),
(4, 'onChange', 4, 'Fetch country options dynamically', 'admin'),
(1, 'onBlur', 3, 'Show email validation alert', 'admin');
