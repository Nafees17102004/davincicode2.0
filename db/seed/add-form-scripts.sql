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

INSERT INTO ADD_FORM_TABLE 
(TAB_ID, FIELD_SOURCE_LOV_DET_ID, FIELD_NAME, FIELD_SIZE_LOV_DET_ID, FIELD_ICON_LOV_DET_ID, PLACEHOLDER, FIELD_ORDER_LOV_DET_ID, C2C_CUSER)
VALUES
(1, 1, 'emp_data', 4, 7, 'Enter employee data', 10, 'admin'),
(1, 1, 'emp_name', 4, 7, 'Enter full name', 10, 'admin'),
(1, 2, 'emp_gender', 4, 8, 'Select gender', 11, 'admin'),
(1, 3, 'emp_join_date', 5, 9, 'Select joining date', 12, 'admin');

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
