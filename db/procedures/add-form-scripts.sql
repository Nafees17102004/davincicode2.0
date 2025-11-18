DELIMITER $$

CREATE PROCEDURE SP_GET_TAB_IMAGE (
    IN p_TAB_IMAGE_ID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'Error: Unable to fetch tab images.' AS message;
    END;

    IF p_TAB_IMAGE_ID IS NULL THEN
        -- Return all active images
        SELECT 
            TAB_IMAGE_ID,
            IMAGE_NAME,
            IMAGE_PATH,
            STATUS
        FROM TAB_IMAGE_TABLE
        WHERE STATUS = 'active'
        ORDER BY IMAGE_NAME;
    ELSE
        -- Return specific image
        SELECT 
            TAB_IMAGE_ID,
            IMAGE_NAME,
            IMAGE_PATH,
            STATUS
        FROM TAB_IMAGE_TABLE
        WHERE TAB_IMAGE_ID = p_TAB_IMAGE_ID;
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE SP_INSERT_TAB_TABLE (
    IN p_PROJECT_ID INT,
    IN p_PAGE_ID INT,
    IN p_TAB_NAME VARCHAR(150),
    IN p_TAB_IMAGE_ID INT,
    IN p_CUSER VARCHAR(100)
)
BEGIN
    DECLARE v_exists INT DEFAULT 0;
    DECLARE v_image_exists INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: Unable to insert tab. Please check your data.' AS message;
    END;

    -- Basic Validations
    IF p_PROJECT_ID IS NULL OR p_PAGE_ID IS NULL OR p_TAB_NAME IS NULL OR p_TAB_NAME = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Project ID, Page ID, and Tab Name are required.';
    END IF;

    -- Check duplicate name within the same page
    SELECT COUNT(*) INTO v_exists
    FROM TAB_TABLE
    WHERE PAGE_ID = p_PAGE_ID AND TAB_NAME = p_TAB_NAME;

    IF v_exists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A tab with this name already exists on this page.';
    END IF;

    -- Check if image exists (if provided)
    IF p_TAB_IMAGE_ID IS NOT NULL THEN
        SELECT COUNT(*) INTO v_image_exists FROM TAB_IMAGE_TABLE WHERE TAB_IMAGE_ID = p_TAB_IMAGE_ID;
        IF v_image_exists = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid TAB_IMAGE_ID — image not found.';
        END IF;
    END IF;

    -- Insert record
    START TRANSACTION;
        INSERT INTO TAB_TABLE (PROJECT_ID, PAGE_ID, TAB_NAME, TAB_IMAGE_ID, C2C_CUSER)
        VALUES (p_PROJECT_ID, p_PAGE_ID, p_TAB_NAME, p_TAB_IMAGE_ID, p_CUSER);
    COMMIT;

    SELECT 'Tab inserted successfully!' AS message;
END$$

DELIMITER ;

CALL SP_INSERT_TAB_TABLE(1, 1, 'Employee Info', 1, 'admin');

DELIMITER $$

CREATE PROCEDURE SP_INSERT_ADD_FORM_TABLE (
    IN p_TAB_ID INT,
    IN p_FIELD_SOURCE_LOV_DET_ID INT,
    IN p_FIELD_NAME VARCHAR(100),
    IN p_FIELD_SIZE_LOV_DET_ID INT,
    IN p_FIELD_ICON_LOV_DET_ID INT,
    IN p_PLACEHOLDER VARCHAR(255),
    IN p_FIELD_ORDER_LOV_DET_ID INT,
    IN p_C2C_CUSER VARCHAR(100)
)
BEGIN
    DECLARE v_err_msg TEXT DEFAULT '';
    DECLARE v_tab_exists INT DEFAULT 0;
    DECLARE v_field_exists INT DEFAULT 0;

    -- Error handler
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SET v_err_msg = CONCAT('SQL Exception occurred while inserting ADD_FORM_TABLE record. Details: ', COALESCE(v_err_msg, 'Unknown error'));
        SELECT FALSE AS success, v_err_msg AS message;
    END;

    START TRANSACTION;

    -- ✅ 1. Validate required fields
    IF p_TAB_ID IS NULL OR p_TAB_ID = 0 THEN
        SET v_err_msg = 'TAB_ID cannot be NULL or 0.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    IF p_FIELD_NAME IS NULL OR p_FIELD_NAME = '' THEN
        SET v_err_msg = 'FIELD_NAME cannot be empty.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    IF p_C2C_CUSER IS NULL OR p_C2C_CUSER = '' THEN
        SET v_err_msg = 'Created user (C2C_CUSER) cannot be empty.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    -- ✅ 2. Check if TAB_ID exists
    SELECT COUNT(*) INTO v_tab_exists
    FROM TAB_TABLE
    WHERE TAB_ID = p_TAB_ID;

    IF v_tab_exists = 0 THEN
        SET v_err_msg = CONCAT('TAB_ID ', p_TAB_ID, ' does not exist in TAB_TABLE.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    -- ✅ 3. Check if FIELD_NAME already exists for same TAB_ID
    SELECT COUNT(*) INTO v_field_exists
    FROM ADD_FORM_TABLE
    WHERE FIELD_NAME = p_FIELD_NAME AND TAB_ID = p_TAB_ID;

    IF v_field_exists > 0 THEN
        SET v_err_msg = CONCAT('FIELD_NAME "', p_FIELD_NAME, '" already exists for this TAB_ID.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    -- ✅ 4. Optional: Validate referenced LOV_DET_IDs if provided
    IF p_FIELD_SOURCE_LOV_DET_ID IS NOT NULL AND p_FIELD_SOURCE_LOV_DET_ID NOT IN (SELECT LOV_DET_ID FROM LIST_OF_VALUES_DETAILS) THEN
        SET v_err_msg = 'Invalid FIELD_SOURCE_LOV_DET_ID reference.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    IF p_FIELD_SIZE_LOV_DET_ID IS NOT NULL AND p_FIELD_SIZE_LOV_DET_ID NOT IN (SELECT LOV_DET_ID FROM LIST_OF_VALUES_DETAILS) THEN
        SET v_err_msg = 'Invalid FIELD_SIZE_LOV_DET_ID reference.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    IF p_FIELD_ICON_LOV_DET_ID IS NOT NULL AND p_FIELD_ICON_LOV_DET_ID NOT IN (SELECT LOV_DET_ID FROM LIST_OF_VALUES_DETAILS) THEN
        SET v_err_msg = 'Invalid FIELD_ICON_LOV_DET_ID reference.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    IF p_FIELD_ORDER_LOV_DET_ID IS NOT NULL AND p_FIELD_ORDER_LOV_DET_ID NOT IN (SELECT LOV_DET_ID FROM LIST_OF_VALUES_DETAILS) THEN
        SET v_err_msg = 'Invalid FIELD_ORDER_LOV_DET_ID reference.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    -- ✅ 5. Perform insert
    INSERT INTO ADD_FORM_TABLE (
        TAB_ID,
        FIELD_SOURCE_LOV_DET_ID,
        FIELD_NAME,
        FIELD_SIZE_LOV_DET_ID,
        FIELD_ICON_LOV_DET_ID,
        PLACEHOLDER,
        FIELD_ORDER_LOV_DET_ID,
        STATUS,
        C2C_CUSER,
        C2C_CDATE
    )
    VALUES (
        p_TAB_ID,
        p_FIELD_SOURCE_LOV_DET_ID,
        p_FIELD_NAME,
        p_FIELD_SIZE_LOV_DET_ID,
        p_FIELD_ICON_LOV_DET_ID,
        p_PLACEHOLDER,
        p_FIELD_ORDER_LOV_DET_ID,
        'active',
        p_C2C_CUSER,
        NOW()
    );

    COMMIT;

    SELECT TRUE AS success,
           CONCAT('Field "', p_FIELD_NAME, '" successfully added to TAB_ID ', p_TAB_ID, '.') AS message;

END $$

DELIMITER ;

select * from add_form_table;

CALL SP_INSERT_ADD_FORM_TABLE(
    1,                   -- p_TAB_ID
    2,                 -- p_FIELD_SOURCE_LOV_DET_ID
    'emp_password',       -- p_FIELD_NAME
    4,                 -- p_FIELD_SIZE_LOV_DET_ID
    7,                 -- p_FIELD_ICON_LOV_DET_ID
    'Enter your password',  -- p_PLACEHOLDER
    11,                 -- p_FIELD_ORDER_LOV_DET_ID
    'admin'          -- p_C2C_CUSER
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

DELIMITER $$
CREATE PROCEDURE SP_GET_FIELD_SOURCE(IN l_lov_id int)
BEGIN 
  SELECT 
    ld.LOV_DET_ID,
    ld.LOV_DET_NAME
  FROM 
    list_of_values_details AS ld
  LEFT JOIN 
    list_of_values AS l 
  ON 
    ld.LOV_ID = l.LOV_ID
  WHERE 
    l.LOV_ID = l_lov_id;
END $$
DELIMITER ;


CALL SP_GET_FIELD_SOURCE(1);

DELIMITER $$

CREATE PROCEDURE SP_BIND_DROPDOWN(
    IN p_List_Name VARCHAR(100),
    IN p_LOV_Name VARCHAR(100)
)
BEGIN
    DECLARE v_LOV_ID INT;
    DECLARE v_ActiveStatus ENUM('active','inactive') DEFAULT 'active';

    -- Validate input
    IF p_List_Name IS NULL OR TRIM(p_List_Name) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'List_Name cannot be null or empty';
    END IF;

    -- Dynamically handle dropdown source
    IF p_List_Name = 'LIST_OF_VALUES_DETAILS' THEN

        -- Check if LOV_Name is provided
        IF p_LOV_Name IS NULL OR TRIM(p_LOV_Name) = '' THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'LOV_Name must be provided for LIST_OF_VALUES_DETAILS';
        END IF;

        -- Find corresponding LOV_ID
        SELECT LOV_ID INTO v_LOV_ID
        FROM LIST_OF_VALUES
        WHERE LOV_NAME = p_LOV_Name
        AND LOV_STATUS = v_ActiveStatus
        LIMIT 1;

        -- Validate LOV_ID existence
        IF v_LOV_ID IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid LOV_NAME provided or inactive LOV';
        END IF;

        -- Return dropdown options
        SELECT 0 AS Id, '-- Select --' AS Name
        UNION
        SELECT LOV_DET_ID AS Id, LOV_DET_NAME AS Name
        FROM LIST_OF_VALUES_DETAILS
        WHERE LOV_ID = v_LOV_ID
        AND LOV_DET_STATUS = v_ActiveStatus
        ORDER BY Name;

    ELSEIF p_List_Name = 'TAB_TABLE' THEN
        SELECT 0 AS Id, '-- Select --' AS Name
        UNION
        SELECT TAB_ID AS Id, TAB_NAME AS Name
        FROM TAB_TABLE
        WHERE STATUS = v_ActiveStatus
        ORDER BY Name;

    ELSEIF p_List_Name = 'TAB_IMAGE_TABLE' THEN
        SELECT 0 AS Id, '-- Select --' AS Name
        UNION
        SELECT TAB_IMAGE_ID AS Id, TAB_IMAGE_NAME AS Name
        FROM TAB_IMAGE_TABLE
        WHERE STATUS = v_ActiveStatus
        ORDER BY Name;

    ELSEIF p_List_Name = 'ADD_FORM_TABLE' THEN
        SELECT 0 AS Id, '-- Select --' AS Name
        UNION
        SELECT ADD_FORM_ID AS Id, FIELD_NAME AS Name
        FROM ADD_FORM_TABLE
        WHERE STATUS = v_ActiveStatus
        ORDER BY Name;

    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid List_Name provided';
    END IF;
END $$

DELIMITER ;

CALL SP_BIND_DROPDOWN("LIST_OF_VALUES_DETAILS", "field_source");


--updated procedure

CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_INSERT_UPDATE_TAB_TABLE`(
    IN p_TAB_ID INT,               -- NULL for insert, value for update
    IN p_PROJECT_ID INT,
    IN p_PAGE_ID INT,
    IN p_TAB_NAME VARCHAR(150),
    IN p_TAB_IMAGE_ID INT,
    IN p_CUSER VARCHAR(100)
)
BEGIN
    DECLARE v_exists INT DEFAULT 0;
    DECLARE v_project_exists INT DEFAULT 0;
    DECLARE v_page_exists INT DEFAULT 0;
    DECLARE v_image_exists INT DEFAULT 0;
    DECLARE v_tab_exists INT DEFAULT 0;

	
    -- ✅ Specific Error Handler for Foreign Key Constraint (Error Code 1452)
    DECLARE EXIT HANDLER FOR 1452
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Foreign key constraint failed — check PROJECT_ID, PAGE_ID, or IMAGE_ID.';
    END;

    -- ✅ Specific Error Handler for Duplicate Key (Error Code 1062)
    DECLARE EXIT HANDLER FOR 1062
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Duplicate entry — unique constraint violated.';
    END;
	
    
    -- ✅ Basic Validations
    IF p_PROJECT_ID IS NULL OR p_PAGE_ID IS NULL OR p_TAB_NAME IS NULL OR p_TAB_NAME = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Project ID, Page ID, and Tab Name are required.';
    END IF;
	
    -- ✅ Check if Project Exists
    SELECT COUNT(*) INTO v_project_exists FROM PROJECTS WHERE id = p_PROJECT_ID; 
    IF v_project_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid PROJECT_ID — project not found.';
    END IF;

    -- ✅ Check if Page Exists
    SELECT COUNT(*) INTO v_page_exists FROM PAGE WHERE PAGE_ID = p_PAGE_ID;
    IF v_page_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid PAGE_ID — page not found.';
    END IF;

    -- ✅ Validate Image if Provided
    IF p_TAB_IMAGE_ID IS NOT NULL THEN
        SELECT COUNT(*) INTO v_image_exists FROM TAB_IMAGE_TABLE WHERE TAB_IMAGE_ID = p_TAB_IMAGE_ID;
        IF v_image_exists = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid TAB_IMAGE_ID — image not found.';
        END IF;
    END IF;

    -- ✅ Check if UPDATE operation is valid (only if TAB_ID is passed)
    IF p_TAB_ID IS NOT NULL THEN
        SELECT COUNT(*) INTO v_tab_exists FROM TAB_TABLE WHERE TAB_ID = p_TAB_ID;
        IF v_tab_exists = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid TAB_ID — no record found to update.';
        END IF;
    END IF;
    
     

    -- ✅ Check Duplicate Tab Name within SAME PROJECT + SAME PAGE
    SELECT COUNT(*) INTO v_exists
    FROM TAB_TABLE
    WHERE PROJECT_ID = p_PROJECT_ID       -- ✅ Added this condition
      AND PAGE_ID = p_PAGE_ID 
      AND TAB_NAME = p_TAB_NAME
      AND (p_TAB_ID IS NULL OR TAB_ID <> p_TAB_ID); -- Exclude self on update

    IF v_exists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A tab with this name already exists on this page in the same project.';
    END IF;

    -- ✅ START Transaction
    START TRANSACTION;

    IF p_TAB_ID IS NULL THEN
        -- INSERT BLOCK
        INSERT INTO TAB_TABLE (PROJECT_ID, PAGE_ID, TAB_NAME, TAB_IMAGE_ID, C2C_CUSER)
        VALUES (p_PROJECT_ID, p_PAGE_ID, p_TAB_NAME, p_TAB_IMAGE_ID, p_CUSER);
        COMMIT;
        SELECT 'Tab inserted successfully!' AS message;
    ELSE
        -- UPDATE BLOCK
        UPDATE TAB_TABLE
        SET PROJECT_ID = p_PROJECT_ID,
            PAGE_ID = p_PAGE_ID,
            TAB_NAME = p_TAB_NAME,
            TAB_IMAGE_ID = p_TAB_IMAGE_ID,
            C2C_CUSER = p_CUSER
        WHERE TAB_ID = p_TAB_ID;
        COMMIT;
        SELECT 'Tab updated successfully!' AS message;
    END IF;
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_INSERT_FORM_FIELD_WITH_VALIDATIONS`(
    IN p_TAB_ID INT,
    IN p_FIELD_SOURCE_ID INT,
    IN p_FIELD_TYPE_ID INT,
    IN p_SP_NAME VARCHAR(255),
    IN p_SP_PARAM VARCHAR(255),
    IN p_TABLE_NAME VARCHAR(255),
    IN p_TABLE_COLUMNS VARCHAR(255),
    IN p_CUSTOM_NAME VARCHAR(255),
    IN p_FIELD_NAME VARCHAR(100),
    IN p_FIELD_SIZE_ID INT,
    IN p_FIELD_ICON_ID INT,
    IN p_PLACEHOLDER VARCHAR(255),
    IN p_FIELD_ORDER_ID INT,
    IN p_STORED_PROCEDURE VARCHAR(255),
    IN p_VALIDATION_IDS JSON,       -- e.g. '[1,4,6]'
    IN p_EVENT_HANDLER VARCHAR(255),
    IN p_CUSER VARCHAR(100)
)
BEGIN
    DECLARE v_err_msg TEXT DEFAULT '';
    DECLARE v_tab_exists INT DEFAULT 0;
    DECLARE v_field_exists INT DEFAULT 0;
    DECLARE v_FORM_FIELD_ID INT DEFAULT 0;

    -- Error handler
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SET v_err_msg = CONCAT('SQL Exception occurred while inserting form field. Details: ', COALESCE(v_err_msg, 'Unknown error'));
        SELECT FALSE AS success, v_err_msg AS message;
    END;

    START TRANSACTION;

    -- ===================================================
    -- 1. Validate Required Fields
    -- ===================================================
    IF p_TAB_ID IS NULL OR p_TAB_ID = 0 THEN
        SET v_err_msg = 'TAB_ID cannot be NULL or 0.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    IF p_FIELD_SOURCE_ID IS NULL OR p_FIELD_SOURCE_ID = 0 THEN
        SET v_err_msg = 'FIELD_SOURCE_ID cannot be NULL or 0.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    IF p_FIELD_TYPE_ID IS NULL OR p_FIELD_TYPE_ID = 0 THEN
        SET v_err_msg = 'FIELD_TYPE_ID cannot be NULL or 0.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    IF p_FIELD_NAME IS NULL OR TRIM(p_FIELD_NAME) = '' THEN
        SET v_err_msg = 'FIELD_NAME cannot be empty.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    IF p_CUSER IS NULL OR TRIM(p_CUSER) = '' THEN
        SET v_err_msg = 'Created user (CUSER) cannot be empty.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    -- ===================================================
    -- 2. Existence Checks
    -- ===================================================
    SELECT COUNT(*) INTO v_tab_exists FROM TAB_TABLE WHERE TAB_ID = p_TAB_ID;
    IF v_tab_exists = 0 THEN
        SET v_err_msg = CONCAT('TAB_ID ', p_TAB_ID, ' does not exist in TAB_TABLE.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    SELECT COUNT(*) INTO v_field_exists 
    FROM ADD_FORM_TABLE 
    WHERE FIELD_NAME = p_FIELD_NAME AND TAB_ID = p_TAB_ID;

    IF v_field_exists > 0 THEN
        SET v_err_msg = CONCAT('FIELD_NAME "', p_FIELD_NAME, '" already exists for this TAB_ID.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    -- ===================================================
    -- 3. Validate Foreign Keys (if not null)
    -- ===================================================
    IF p_FIELD_SOURCE_ID NOT IN (SELECT LOV_DET_ID FROM LIST_OF_VALUES_DETAILS) THEN
        SET v_err_msg = 'Invalid FIELD_SOURCE_ID reference.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    IF p_FIELD_SIZE_ID NOT IN (SELECT LOV_DET_ID FROM LIST_OF_VALUES_DETAILS) THEN
        SET v_err_msg = 'Invalid FIELD_SIZE_ID reference.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    IF p_FIELD_ICON_ID NOT IN (SELECT LOV_DET_ID FROM LIST_OF_VALUES_DETAILS) THEN
        SET v_err_msg = 'Invalid FIELD_ICON_ID reference.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    IF p_FIELD_ORDER_ID NOT IN (SELECT LOV_DET_ID FROM LIST_OF_VALUES_DETAILS) THEN
        SET v_err_msg = 'Invalid FIELD_ORDER_ID reference.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    -- ===================================================
    -- 4. Logical and JSON Validations
    -- ===================================================
    IF p_SP_NAME IS NOT NULL AND TRIM(p_SP_NAME) != '' AND (p_SP_PARAM IS NULL OR TRIM(p_SP_PARAM) = '') THEN
        SET v_err_msg = 'If SP_NAME is provided, SP_PARAM must also be specified.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    IF p_TABLE_NAME IS NOT NULL AND TRIM(p_TABLE_NAME) != '' AND (p_TABLE_COLUMNS IS NULL OR TRIM(p_TABLE_COLUMNS) = '') THEN
        SET v_err_msg = 'If TABLE_NAME is provided, TABLE_COLUMNS must also be specified.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    IF p_VALIDATION_IDS IS NOT NULL AND JSON_VALID(p_VALIDATION_IDS) = 0 THEN
        SET v_err_msg = 'Invalid JSON format in VALIDATION_IDS.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_err_msg;
    END IF;

    -- ===================================================
    -- 5. Insert into ADD_FORM_TABLE
    -- ===================================================
    INSERT INTO ADD_FORM_TABLE (
        TAB_ID,
        FIELD_SOURCE_LOV_DET_ID,
        FIELD_TYPE_ID,
        SP_NAME,
        SP_PARAM,
        TABLE_NAME,
        TABLE_COLUMNS,
        CUSTOM_NAME,
        FIELD_NAME,
        FIELD_SIZE_LOV_DET_ID,
        FIELD_ICON_LOV_DET_ID,
        PLACEHOLDER,
        FIELD_ORDER_LOV_DET_ID,
        STORING_SP,
        EVENT_HANDLER,
        STATUS,
        C2C_CUSER,
        C2C_CDATE
    )
    VALUES (
        p_TAB_ID,
        p_FIELD_SOURCE_ID,
        p_FIELD_TYPE_ID,
        p_SP_NAME,
        p_SP_PARAM,
        p_TABLE_NAME,
        p_TABLE_COLUMNS,
        p_CUSTOM_NAME,
        p_FIELD_NAME,
        p_FIELD_SIZE_ID,
        p_FIELD_ICON_ID,
        p_PLACEHOLDER,
        p_FIELD_ORDER_ID,
        p_STORED_PROCEDURE,
        p_EVENT_HANDLER,
        'active',
        p_CUSER,
        NOW()
    );

    SET v_FORM_FIELD_ID = LAST_INSERT_ID();

    -- ===================================================
    -- 6. Insert into FORM_VALIDATION_TABLE
    -- ===================================================
    IF p_VALIDATION_IDS IS NOT NULL AND JSON_LENGTH(p_VALIDATION_IDS) > 0 THEN
        INSERT INTO FORM_VALIDATION_TABLE (
            FORM_FIELD_ID,
            JS_SCRIPT_ID,
            C2C_CUSER,
            C2C_CDATE
        )
        SELECT 
            v_FORM_FIELD_ID,
            JSON_UNQUOTE(js.id),
            p_CUSER,
            NOW()
        FROM JSON_TABLE(
            p_VALIDATION_IDS,
            '$[*]' COLUMNS (id VARCHAR(10) PATH '$')
        ) AS js;
    END IF;

    COMMIT;

    -- ===================================================
    -- Success Message
    -- ===================================================
    SELECT TRUE AS success,
           CONCAT('Field "', p_FIELD_NAME, '" successfully added to TAB_ID ', p_TAB_ID, '.') AS message,
           v_FORM_FIELD_ID AS inserted_id;
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_FORM_FIELD_BY_TAB_ID`(
    IN p_TAB_ID INT
)
BEGIN
    DECLARE v_tab_exists INT DEFAULT 0;

    -- ========================================
    -- 1. Input Validation
    -- ========================================
    IF p_TAB_ID IS NULL OR p_TAB_ID = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid Tab ID provided.';
    END IF;

    SELECT COUNT(*) INTO v_tab_exists FROM tab_table WHERE TAB_ID = p_TAB_ID;
    IF v_tab_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Tab ID does not exist.';
    END IF;

    -- ========================================
    -- 2. Fetch All Fields with Lookups
    -- ========================================
    SELECT 
        aft.ADD_FORM_ID,
        aft.TAB_ID,
        aft.FIELD_NAME,
        aft.CUSTOM_NAME,
        aft.PLACEHOLDER,
        aft.SP_NAME,
        aft.SP_PARAM,
        aft.TABLE_NAME,
        aft.TABLE_COLUMNS,
        aft.STORING_SP,
        aft.STATUS,
        aft.C2C_CDATE,
        aft.C2C_CUSER,

        -- =======================
        -- FIELD TYPE
        -- =======================
        ft.FIELD_NAME AS FIELD_TYPE_NAME,

        -- =======================
        -- LOOKUPS (LOV DETAILS)
        -- =======================
        src.LOV_DET_NAME AS FIELD_SOURCE_NAME,
        size.LOV_DET_NAME AS FIELD_SIZE_NAME,
        icon.LOV_DET_NAME AS FIELD_ICON_NAME,
        ord.LOV_DET_NAME AS FIELD_ORDER_NAME,

        -- =======================
        -- EVENT HANDLER
        -- =======================
        feh.FORM_EVENT_HANDLER_ID,
        feh.EVENT_NAME AS EVENT_HANDLER_NAME,
        feh.DESCRIPTION AS EVENT_HANDLER_DESCRIPTION,
        feh.STATUS AS EVENT_HANDLER_STATUS,

        -- =======================
        -- FRONTEND HINTS
        -- =======================
        CASE 
            WHEN ft.FIELD_NAME IN ('Textbox','Textarea') THEN 'input'
            WHEN ft.FIELD_NAME = 'Dropdown' THEN 'select'
            WHEN ft.FIELD_NAME = 'Checkbox' THEN 'checkbox'
            WHEN ft.FIELD_NAME = 'Radio' THEN 'radio'
            ELSE 'custom'
        END AS RENDER_TYPE,

        -- =======================
        -- STATUS COLOR MAPPING
        -- =======================
        CASE 
            WHEN aft.STATUS = 'active' THEN 'green'
            WHEN aft.STATUS = 'inactive' THEN 'red'
            ELSE 'gray'
        END AS STATUS_COLOR,

        -- =======================
        -- VALIDATIONS (AS JSON)
        -- =======================
        (
            SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'validation_id', fv.FORM_FIELD_VALIDATION_ID,
                        'rule', fv.VALIDATION_RULE,
                        'js_id', fv.JS_SCRIPT_ID,
                        'js_name', js.js_name,
                        'js_script', js.js_script,
                        'status', fv.STATUS
                    )
                )
            FROM form_validation_table fv
            LEFT JOIN js_script_library js ON js.js_id = fv.JS_SCRIPT_ID
            WHERE fv.FORM_FIELD_ID = aft.ADD_FORM_ID
              AND fv.STATUS = 'active'
        ) AS VALIDATIONS_JSON

    FROM add_form_table aft
    LEFT JOIN field_type ft ON ft.FIELD_TYPE_ID = aft.FIELD_TYPE_ID
    LEFT JOIN list_of_values_details src ON src.LOV_DET_ID = aft.FIELD_SOURCE_LOV_DET_ID
    LEFT JOIN list_of_values_details size ON size.LOV_DET_ID = aft.FIELD_SIZE_LOV_DET_ID
    LEFT JOIN list_of_values_details icon ON icon.LOV_DET_ID = aft.FIELD_ICON_LOV_DET_ID
    LEFT JOIN list_of_values_details ord ON ord.LOV_DET_ID = aft.FIELD_ORDER_LOV_DET_ID
    LEFT JOIN form_event_handler_master feh ON feh.FORM_EVENT_HANDLER_ID = aft.EVENT_HANDLER_ID

    WHERE aft.TAB_ID = p_TAB_ID
      AND aft.STATUS = 'active'

    ORDER BY CAST(ord.LOV_DET_NAME AS UNSIGNED), aft.ADD_FORM_ID;
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `LT_DCS_SP_SAVE_FORM_GENERATION_DETAILS`(
    IN p_Project_ID INT,
    IN p_Product_ID INT,
    IN p_Layout_ID INT,
    IN p_Module_ID INT,
    IN p_PageName VARCHAR(200),
    IN p_Purpose VARCHAR(500),
    IN p_TabStructure JSON,   -- Nested JSON for Tabs -> Sections -> Fields
    IN p_EBMS_User VARCHAR(100),
    IN p_EBMS_Status ENUM('active','inactive'),
    IN p_EBMS_Inactive_Reason VARCHAR(250)
)
BEGIN
    DECLARE v_Form_ID INT;
    DECLARE i INT DEFAULT 0;
    DECLARE tab_count INT;
    DECLARE v_TabName VARCHAR(150);
    DECLARE v_TabImageID INT;
    DECLARE v_TabID INT;
    DECLARE section_count INT;
    DECLARE j INT DEFAULT 0;
    DECLARE v_SectionOrder INT;
    DECLARE v_SectionDesc VARCHAR(255);
    DECLARE v_SectionID INT;
    DECLARE field_count INT;
    DECLARE k INT DEFAULT 0;
    DECLARE v_ColumnName VARCHAR(255);
    DECLARE v_LabelName VARCHAR(100);
    DECLARE v_FieldType INT;
    DECLARE v_FieldID INT;
    DECLARE eh_count INT;
    DECLARE l INT DEFAULT 0;
    DECLARE v_EH_ID INT;
    DECLARE v_TriggerCond VARCHAR(255);
    DECLARE val_count INT;
    DECLARE m INT DEFAULT 0;
    DECLARE v_JS_ID INT;
    DECLARE v_ValidationRule VARCHAR(255);

    -- Insert form generation details
    INSERT INTO m_form_generation_details
    (Project_ID, Module_ID, Layout_ID, Product_ID, page_name, Purpose, C2C_CDATE, C2C_CUSER, C2C_STATUS, C2C_INACTIVE_REASON)
    VALUES
    (p_Project_ID, p_Module_ID, p_Layout_ID, p_Product_ID, p_PageName, p_Purpose, NOW(), p_EBMS_User, p_EBMS_Status, p_EBMS_Inactive_Reason);

    SET v_Form_ID = LAST_INSERT_ID();

    SET tab_count = JSON_LENGTH(p_TabStructure);

    WHILE i < tab_count DO
        SET v_TabName   = JSON_UNQUOTE(JSON_EXTRACT(p_TabStructure, CONCAT('$[', i, '].TabName')));
        SET v_TabImageID = JSON_UNQUOTE(JSON_EXTRACT(p_TabStructure, CONCAT('$[', i, '].Icon')));

        -- Insert Tab
        INSERT INTO tab_table
        (Form_Gen_Details_Id, PROJECT_ID, TAB_NAME, TAB_IMAGE_ID, STATUS, INACTIVE_REASON, C2C_CDATE, C2C_CUSER)
        VALUES
        (v_Form_ID, p_Project_ID, v_TabName, v_TabImageID, p_EBMS_Status, p_EBMS_Inactive_Reason, NOW(), p_EBMS_User);

        SET v_TabID = LAST_INSERT_ID();

        -- Loop through Sections
        SET section_count = JSON_LENGTH(JSON_EXTRACT(p_TabStructure, CONCAT('$[', i, '].Sections')));
        SET j = 0;

        WHILE j < section_count DO
            SET v_SectionOrder = JSON_UNQUOTE(JSON_EXTRACT(p_TabStructure, CONCAT('$[', i, '].Sections[', j, '].SectionIndex')));
            SET v_SectionDesc  = JSON_UNQUOTE(JSON_EXTRACT(p_TabStructure, CONCAT('$[', i, '].Sections[', j, '].SectionType')));

            -- Insert Section
            INSERT INTO m_section
            (TAB_ID, Section_Order, Section_Description, Status, Inactive_Reason, C2C_CDATE, C2C_CUSER)
            VALUES
            (v_TabID, v_SectionOrder, v_SectionDesc, p_EBMS_Status, p_EBMS_Inactive_Reason, NOW(), p_EBMS_User);

            SET v_SectionID = LAST_INSERT_ID();

            -- Loop through Fields
            SET field_count = JSON_LENGTH(JSON_EXTRACT(p_TabStructure, CONCAT('$[', i, '].Sections[', j, '].Fields')));
            SET k = 0;

            WHILE k < field_count DO
                SET v_ColumnName = JSON_UNQUOTE(JSON_EXTRACT(p_TabStructure, CONCAT('$[', i, '].Sections[', j, '].Fields[', k, '].ColumnName')));
                SET v_LabelName  = JSON_UNQUOTE(JSON_EXTRACT(p_TabStructure, CONCAT('$[', i, '].Sections[', j, '].Fields[', k, '].LabelName')));
                SET v_FieldType  = JSON_UNQUOTE(JSON_EXTRACT(p_TabStructure, CONCAT('$[', i, '].Sections[', j, '].Fields[', k, '].FieldType')));

                -- Insert Field
                INSERT INTO m_form_field_details
                (SECTION_ID, FIELD_TYPE_ID, CUSTOM_NAME, LABEL_NAME, STATUS, INACTIVE_REASON, C2C_CDATE, C2C_CUSER)
                VALUES
                (v_SectionID, v_FieldType, v_ColumnName, v_LabelName, p_EBMS_Status, p_EBMS_Inactive_Reason, NOW(), p_EBMS_User);

                SET v_FieldID = LAST_INSERT_ID();

                -- Insert Event Handlers if exist
                SET eh_count = JSON_LENGTH(JSON_EXTRACT(p_TabStructure, CONCAT('$[', i, '].Sections[', j, '].Fields[', k, '].EventHandlers')));
                SET l = 0;
                WHILE l < eh_count DO
                    SET v_EH_ID = JSON_UNQUOTE(JSON_EXTRACT(p_TabStructure, CONCAT('$[', i, '].Sections[', j, '].Fields[', k, '].EventHandlers[', l, '].HandlerID')));
                    SET v_TriggerCond = JSON_UNQUOTE(JSON_EXTRACT(p_TabStructure, CONCAT('$[', i, '].Sections[', j, '].Fields[', k, '].EventHandlers[', l, '].TriggerCondition')));

                    INSERT INTO l_form_event_handler_field_details
                    (FORM_EVENT_HANDLER_ID, FORM_GEN_FIELD_DETAILS_ID, TRIGGER_CONDITION, STATUS, C2C_CDATE, C2C_CUSER)
                    VALUES
                    (v_EH_ID, v_FieldID, v_TriggerCond, p_EBMS_Status, NOW(), p_EBMS_User);

                    SET l = l + 1;
                END WHILE;

                -- Insert Validations if exist
                SET val_count = JSON_LENGTH(JSON_EXTRACT(p_TabStructure, CONCAT('$[', i, '].Sections[', j, '].Fields[', k, '].Validations')));
                SET m = 0;
                WHILE m < val_count DO
                    SET v_JS_ID = JSON_UNQUOTE(JSON_EXTRACT(p_TabStructure, CONCAT('$[', i, '].Sections[', j, '].Fields[', k, '].Validations[', m, '].JsID')));
                    SET v_ValidationRule = JSON_UNQUOTE(JSON_EXTRACT(p_TabStructure, CONCAT('$[', i, '].Sections[', j, '].Fields[', k, '].Validations[', m, '].ValidationRule')));

                    INSERT INTO form_validation_table
                    (FORM_FIELD_ID, JS_SCRIPT_ID, VALIDATION_RULE, STATUS, C2C_CDATE, C2C_CUSER)
                    VALUES
                    (v_FieldID, v_JS_ID, v_ValidationRule, p_EBMS_Status, NOW(), p_EBMS_User);

                    SET m = m + 1;
                END WHILE;

                SET k = k + 1;
            END WHILE;

            SET j = j + 1;
        END WHILE;

        SET i = i + 1;
    END WHILE;

END

CALL LT_DCS_SP_SAVE_FORM_GENERATION_DETAILS(
    1,                  -- p_Project_ID
    2,                  -- p_Product_ID
    3,                  -- p_Layout_ID
    4,                  -- p_Module_ID
    'Employee Form',    -- p_PageName
    'Form to capture employee data', -- p_Purpose
    '[
        {
            "TabIndex": 1,
            "TabName": "General Info",
            "Icon": 1,
            "Sections": [
                {
                    "SectionIndex": 1,
                    "SectionType": "Grid",
                    "Fields": [
                        {"ColumnName": "FirstName", "LabelName": "First Name", "FieldType": 1},
                        {"ColumnName": "LastName", "LabelName": "Last Name", "FieldType": 1},
                        {"ColumnName": "Email", "LabelName": "Email ID", "FieldType": 2}
                    ]
                },
                {
                    "SectionIndex": 2,
                    "SectionType": "Static",
                    "Fields": [
                        {"ColumnName": "DOB", "LabelName": "Date of Birth", "FieldType": 3}
                    ]
                }
            ]
        },
        {
            "TabIndex": 2,
            "TabName": "Job Details",
            "Icon": 1,
            "Sections": [
                {
                    "SectionIndex": 1,
                    "SectionType": "Grid",
                    "Fields": [
                        {"ColumnName": "Department", "LabelName": "Department", "FieldType": 4},
                        {"ColumnName": "Role", "LabelName": "Role", "FieldType": 5}
                    ]
                }
            ]
        }
    ]',                  -- p_TabStructure: JSON string
    101,                 -- p_EBMS_User
    1,                   -- p_EBMS_Status (1 = active)
    'Initial Creation'   -- p_EBMS_Inactive_Reason
);