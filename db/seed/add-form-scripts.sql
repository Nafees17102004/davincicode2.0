CREATE TABLE TAB_TABLE (
    TAB_ID INT AUTO_INCREMENT PRIMARY KEY,
    PROJECT_ID INT NOT NULL,
    PAGE_ID INT NOT NULL,
    TAB_NAME VARCHAR(100) NOT NULL,
    TAB_IMAGE_ID INT NULL,  -- can reference an images table if needed
    STATUS ENUM('active','inactive') DEFAULT 'active',
    INACTIVE_REASON VARCHAR(255) NULL,
    C2C_CDATE DATETIME DEFAULT CURRENT_TIMESTAMP,
    C2C_CUSER VARCHAR(100),
    C2C_UDATE DATETIME ON UPDATE CURRENT_TIMESTAMP,
    C2C_UUSER VARCHAR(100),
    FOREIGN KEY (PROJECT_ID) REFERENCES PROJECTS(ID) ON DELETE CASCADE,
    FOREIGN KEY (PAGE_ID) REFERENCES PAGE(PAGE_ID) ON DELETE CASCADE
);

CREATE TABLE TAB_IMAGE_TABLE (
    TAB_IMAGE_ID INT AUTO_INCREMENT PRIMARY KEY,
    IMAGE_NAME VARCHAR(150) NOT NULL,         -- e.g. 'User Tab Icon'
    IMAGE_PATH VARCHAR(255) NOT NULL,         -- e.g. '/assets/icons/user.png'
    STATUS ENUM('active','inactive') DEFAULT 'active',
    INACTIVE_REASON VARCHAR(255) NULL,
    C2C_CDATE DATETIME DEFAULT CURRENT_TIMESTAMP,
    C2C_CUSER VARCHAR(100),
    C2C_UDATE DATETIME ON UPDATE CURRENT_TIMESTAMP,
    C2C_UUSER VARCHAR(100)
);

INSERT INTO TAB_IMAGE_TABLE (IMAGE_NAME, IMAGE_PATH, C2C_CUSER)
VALUES
('User Info', '/assets/icons/user.png', 'admin'),
('Job Details', '/assets/icons/job.png', 'admin'),
('Settings', '/assets/icons/settings.png', 'admin');

INSERT INTO LIST_OF_VALUES (LOV_NAME, LOV_DESCRIPTION)
VALUES ('FIELD_SOURCE', 'Specifies where the field’s data comes from (SP, Table, Custom)'), 
('FIELD_SIZE', 'Size of input fields'),
('FIELD_ICON', 'Icons for field visuals'),
('FIELD_ORDER', 'Display order for form fields');

INSERT INTO LIST_OF_VALUES_DETAILS (LOV_ID, LOV_DET_NAME, LOV_DET_DESCP) VALUES
(1, 'SP', 'Data populated from a Stored Procedure'),
(1, 'Table', 'Data populated from a database table'),
(1, 'Custom', 'Data manually defined within the form or API');

INSERT INTO LIST_OF_VALUES_DETAILS (LOV_ID, LOV_DET_NAME, LOV_DET_DESCP) VALUES
(2, 'small', 'Small width input'),
(2, 'medium', 'Medium width input'),
(2, 'large', 'Large width input');

-- FIELD_ICON (LOV_ID = 3)
INSERT INTO LIST_OF_VALUES_DETAILS (LOV_ID, LOV_DET_NAME, LOV_DET_DESCP) VALUES
(3, 'user', 'User icon'),
(3, 'email', 'Email icon'),
(3, 'calendar', 'Calendar icon');

-- FIELD_ORDER (LOV_ID = 4)
INSERT INTO LIST_OF_VALUES_DETAILS (LOV_ID, LOV_DET_NAME, LOV_DET_DESCP) VALUES
(4, '1', 'First in order'),
(4, '2', 'Second in order'),
(4, '3', 'Third in order');

CREATE TABLE `form_event_handler_master` (
  `FORM_EVENT_HANDLER_ID` INT NOT NULL AUTO_INCREMENT,
  `EVENT_NAME` VARCHAR(100) NOT NULL, -- e.g., onChange, onClick, onBlur
  `DESCRIPTION` VARCHAR(255) DEFAULT NULL,
  `STATUS` ENUM('active', 'inactive') DEFAULT 'active',
  `C2C_CDATE` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `C2C_CUSER` VARCHAR(100) DEFAULT NULL,
  `C2C_UDATE` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `C2C_UUSER` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`FORM_EVENT_HANDLER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `form_event_handler_master` 
(`EVENT_NAME`, `DESCRIPTION`, `STATUS`, `C2C_CUSER`)
VALUES
('onChange', 'Triggered when the value of the field changes', 'active', 'system'),
('onClick', 'Triggered when the user clicks the field', 'active', 'system'),
('onFocus', 'Triggered when the field gains focus', 'active', 'system'),
('onBlur', 'Triggered when the field loses focus', 'active', 'system'),
('onInput', 'Triggered immediately when user types in input field', 'active', 'system'),
('onKeyUp', 'Triggered when a key is released while focusing on the field', 'active', 'system'),
('onKeyDown', 'Triggered when a key is pressed down while focusing on the field', 'active', 'system'),
('onSubmit', 'Triggered when the form is submitted', 'active', 'system'),
('onMouseEnter', 'Triggered when mouse enters the element area', 'active', 'system'),
('onMouseLeave', 'Triggered when mouse leaves the element area', 'active', 'system'),
('onSelect', 'Triggered when user selects text inside a field', 'active', 'system'),
('onDoubleClick', 'Triggered when user double clicks the field', 'active', 'system'),
('onScroll', 'Triggered when user scrolls within an element', 'inactive', 'system'),
('onPaste', 'Triggered when user pastes content into the field', 'active', 'system'),
('onCopy', 'Triggered when user copies content from the field', 'inactive', 'system'),
('onCut', 'Triggered when user cuts content from the field', 'inactive', 'system');

CREATE TABLE `form_field_event_handler` (
  `FORM_FIELD_EVENT_HANDLER_ID` INT NOT NULL AUTO_INCREMENT,
  `FORM_FIELD_ID` INT NOT NULL,
  `FORM_EVENT_HANDLER_ID` INT NOT NULL,
  `JS_SCRIPT_ID` INT DEFAULT NULL, -- Optional: link to js_script_library (action to execute)
  `STATUS` ENUM('active','inactive') DEFAULT 'active',
  `C2C_CDATE` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `C2C_CUSER` VARCHAR(100) DEFAULT NULL,
  `C2C_UDATE` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `C2C_UUSER` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`FORM_FIELD_EVENT_HANDLER_ID`),
  KEY `FORM_FIELD_ID` (`FORM_FIELD_ID`),
  KEY `FORM_EVENT_HANDLER_ID` (`FORM_EVENT_HANDLER_ID`),
  KEY `JS_SCRIPT_ID` (`JS_SCRIPT_ID`),
  CONSTRAINT `form_field_event_handler_ibfk_1` FOREIGN KEY (`FORM_FIELD_ID`) REFERENCES `add_form_table` (`ADD_FORM_ID`) ON DELETE CASCADE,
  CONSTRAINT `form_field_event_handler_ibfk_2` FOREIGN KEY (`FORM_EVENT_HANDLER_ID`) REFERENCES `form_event_handler_master` (`FORM_EVENT_HANDLER_ID`) ON DELETE CASCADE,
  CONSTRAINT `form_field_event_handler_ibfk_3` FOREIGN KEY (`JS_SCRIPT_ID`) REFERENCES `js_script_library` (`js_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `m_form_generation_details` (
  `Form_Gen_Details_Id` int NOT NULL AUTO_INCREMENT,
  `Project_ID` int DEFAULT NULL,
  `Module_ID` int DEFAULT NULL,
  `Layout_ID` int DEFAULT NULL,
  `Product_ID` int DEFAULT NULL,
  `Page_ID` int DEFAULT NULL,
  `Purpose` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `C2C_CDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `C2C_CUSER` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `C2C_UDATE` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `C2C_UUSER` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `C2C_STATUS` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `C2C_INACTIVE_REASON` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Form_Gen_Details_Id`),
  KEY `fk_form_project` (`Project_ID`),
  KEY `fk_form_product` (`Product_ID`),
  KEY `fk_form_layout` (`Layout_ID`),
  KEY `fk_module_id` (`Module_ID`),
  KEY `fk_form_page` (`Page_ID`),
  CONSTRAINT `fk_form_layout` FOREIGN KEY (`Layout_ID`) REFERENCES `m_layout` (`Layout_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_form_page` FOREIGN KEY (`Page_ID`) REFERENCES `page` (`PAGE_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_form_product` FOREIGN KEY (`Product_ID`) REFERENCES `m_product` (`Product_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_form_project` FOREIGN KEY (`Project_ID`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_module_id` FOREIGN KEY (`Module_ID`) REFERENCES `modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
CREATE TABLE `tab_table` (
  `TAB_ID` int NOT NULL AUTO_INCREMENT,
  `PROJECT_ID` int NOT NULL,
  `PAGE_ID` int NOT NULL,
  `TAB_NAME` varchar(150) NOT NULL,
  `TAB_IMAGE_ID` int DEFAULT NULL,
  `STATUS` enum('active','inactive') DEFAULT 'active',
  `INACTIVE_REASON` varchar(255) DEFAULT NULL,
  `C2C_CDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `C2C_CUSER` varchar(100) DEFAULT NULL,
  `C2C_UDATE` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `C2C_UUSER` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`TAB_ID`),
  KEY `PROJECT_ID` (`PROJECT_ID`),
  KEY `PAGE_ID` (`PAGE_ID`),
  KEY `TAB_IMAGE_ID` (`TAB_IMAGE_ID`),
  CONSTRAINT `tab_table_ibfk_1` FOREIGN KEY (`PROJECT_ID`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tab_table_ibfk_2` FOREIGN KEY (`PAGE_ID`) REFERENCES `page` (`PAGE_ID`) ON DELETE CASCADE,
  CONSTRAINT `tab_table_ibfk_3` FOREIGN KEY (`TAB_IMAGE_ID`) REFERENCES `tab_image_table` (`TAB_IMAGE_ID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `m_section` (
  `Section_ID` int NOT NULL AUTO_INCREMENT,
  `TAB_ID` int NOT NULL,
  `Section_Name` varchar(150) NOT NULL,
  `Section_Order` int DEFAULT '1',
  `Section_Description` varchar(255) DEFAULT NULL,
  `Status` enum('active','inactive') DEFAULT 'active',
  `Inactive_Reason` varchar(255) DEFAULT NULL,
  `C2C_CDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `C2C_CUSER` varchar(100) DEFAULT NULL,
  `C2C_UDATE` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `C2C_UUSER` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Section_ID`),
  KEY `TAB_ID` (`TAB_ID`),
  CONSTRAINT `m_section_ibfk_1` FOREIGN KEY (`TAB_ID`) REFERENCES `tab_table` (`TAB_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `m_column` (
  `Column_ID` int NOT NULL AUTO_INCREMENT,
  `Section_ID` int NOT NULL,
  `Column_Name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Column_Type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Column_Order` int DEFAULT '1',
  `Is_Required` tinyint(1) DEFAULT '0',
  `Status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `Inactive_Reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `C2C_CDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `C2C_CUSER` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `C2C_UDATE` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `C2C_UUSER` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Column_ID`),
  KEY `Section_ID` (`Section_ID`),
  CONSTRAINT `fk_section_column` FOREIGN KEY (`Section_ID`) REFERENCES `m_section` (`Section_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
