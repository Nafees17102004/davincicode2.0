CREATE DATABASE davinci_code;
USE davinci_code;

CREATE TABLE languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    inactive_reason VARCHAR(255) NULL
);

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_code varchar(30) unique not null,
    name VARCHAR(150) UNIQUE NOT NULL,
    language_id INT NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    inactive_reason VARCHAR(255) NULL,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);

CREATE TABLE modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    module_desc varchar(255),
    status ENUM('active','inactive') DEFAULT 'active',
    inactive_reason VARCHAR(255) NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE (project_id, name) -- module name unique within project
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
inactive_reason VARCHAR(255) NULL
);


CREATE TABLE CODE_SNIPPET (
    Snippet_ID INT AUTO_INCREMENT PRIMARY KEY,
    Snippet_Name VARCHAR(100) unique  NOT NULL,   -- e.g., "CRUD", "Model", "Validation"
    Snippet TEXT NOT NULL,                -- actual code snippet
    status ENUM('active','inactive') DEFAULT 'active',
	inactive_reason VARCHAR(255) NULL
);

