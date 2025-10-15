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

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Unexpected Error: Please contact administrator.' AS message;
    END;

    -- ✅ Basic Validations
    IF p_PROJECT_ID IS NULL OR p_PAGE_ID IS NULL OR p_TAB_NAME IS NULL OR p_TAB_NAME = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Project ID, Page ID, and Tab Name are required.';
    END IF;

    -- ✅ Check if Project Exists
    SELECT COUNT(*) INTO v_project_exists FROM PROJECT_TABLE WHERE PROJECT_ID = p_PROJECT_ID;
    IF v_project_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid PROJECT_ID — project not found.';
    END IF;

    -- ✅ Check if Page Exists
    SELECT COUNT(*) INTO v_page_exists FROM PAGE_TABLE WHERE PAGE_ID = p_PAGE_ID;
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

    -- ✅ Check Duplicate Tab Name within same PAGE for INSERT & UPDATE
    SELECT COUNT(*) INTO v_exists
    FROM TAB_TABLE
    WHERE PAGE_ID = p_PAGE_ID AND TAB_NAME = p_TAB_NAME
        AND (p_TAB_ID IS NULL OR TAB_ID <> p_TAB_ID); -- Exclude self on update

    IF v_exists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A tab with this name already exists on this page.';
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