DELIMITER $$

CREATE PROCEDURE GetAllProjects()
BEGIN
    SELECT 
        p.project_code,
        p.name AS project_name,
        l.name AS language_name,
        p.status,
        p.inactive_reason,
        COUNT(m.id) AS module_count
    FROM projects p
    JOIN languages l ON p.language_id = l.id
    LEFT JOIN modules m ON p.id = m.project_id
    GROUP BY p.id, p.project_code, p.name, l.name, p.status, p.inactive_reason
    ORDER BY p.project_code;
END$$

DELIMITER ;


CALL GetAllProjects();


DELIMITER $$

CREATE PROCEDURE GetProjectDetails(IN p_code VARCHAR(30))
BEGIN
    -- First return project details
    SELECT 
        p.project_code,
        p.name AS project_name,
        l.name AS language_name,
        p.status,
        p.inactive_reason
    FROM projects p
    JOIN languages l ON p.language_id = l.id
    WHERE p.project_code = p_code;

    -- Then return all modules for that project
    SELECT 
        m.id AS module_id,
        m.name AS module_name,
        m.module_desc,
        m.status,
        m.inactive_reason
    FROM modules m
    JOIN projects p ON m.project_id = p.id
    WHERE p.project_code = p_code
    ORDER BY m.name;
END$$

DELIMITER ;


CALL GetProjectDetails('ERP001');


DELIMITER $$

CREATE PROCEDURE InsertProject(
    IN p_code VARCHAR(30),
    IN p_name VARCHAR(150),
    IN p_language_id INT,
    IN p_status ENUM('active','inactive'),
    IN p_inactive_reason VARCHAR(255)
)
BEGIN
    -- Check if project code already exists
    IF EXISTS (SELECT 1 FROM projects WHERE project_code = p_code) THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Project code already exists';
    END IF;

    -- Check if project name already exists
    IF EXISTS (SELECT 1 FROM projects WHERE name = p_name) THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Project name already exists';
    END IF;

    -- Insert new project
    INSERT INTO projects (project_code, name, language_id, status, inactive_reason)
    VALUES (p_code, p_name, p_language_id, p_status, p_inactive_reason);
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE InsertModule(
    IN p_project_code VARCHAR(30),
    IN m_name VARCHAR(150),
    IN m_desc varchar(255),
    IN m_status ENUM('active','inactive'),
    IN m_inactive_reason VARCHAR(255)
)
BEGIN
    DECLARE proj_id INT;

    -- Find the project id from project code
    SELECT id INTO proj_id 
    FROM projects 
    WHERE project_code = p_project_code;

    IF proj_id IS NULL THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Project code does not exist';
    END IF;

    -- Check if module already exists in the project
    IF EXISTS (SELECT 1 FROM modules WHERE project_id = proj_id AND name = m_name) THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Module already exists in this project';
    END IF;

    -- Insert new module
    INSERT INTO modules (project_id, name,module_desc, status, inactive_reason)
    VALUES (proj_id, m_name, m_desc, m_status, m_inactive_reason);
END$$

DELIMITER ;


CALL InsertProject('ERP002', 'ERP Analytics', 1, 'active', NULL);


CALL InsertModule('ERP002', 'Reporting',null, 'active', NULL);


DELIMITER $$

CREATE PROCEDURE InsertLanguage( 
IN l_name varchar(30),
IN l_status ENUM('active','inactive'),
IN l_inactive_reason VARCHAR(255)
)
BEGIN 
	INSERT INTO languages(name,status,inactive_reason) VALUES(l_name,l_status,l_inactive_reason);
END$$

DELIMITER ;


call InsertLanguage("html","active",null);

DELIMITER $$

CREATE PROCEDURE GetLanguage()
BEGIN
	SELECT * FROM languages;
END$$

DELIMITER ;


CALL GetLanguage();


DELIMITER $$

CREATE PROCEDURE InsertFieldType(
    IN p_field_name VARCHAR(30)
)
BEGIN
        INSERT INTO FIELD_TYPE (FIELD_NAME)
        VALUES (p_field_name);
END$$

DELIMITER ;

call insertfieldtype("drop");


DELIMITER $$

CREATE PROCEDURE InsertSnippet(
    IN p_field_type_id INT,
    IN p_language_id INT,
    IN p_snippet_name VARCHAR(100),
    IN p_snippet TEXT
)
BEGIN
    DECLARE v_snippet_id INT;

    -- Check if a snippet already exists for this field + language
    SELECT s.Snippet_ID INTO v_snippet_id
    FROM CODE_SNIPPET s
    JOIN FIELD_SNIPPET_MAP m 
      ON s.Snippet_ID = m.SNIPPET_ID
    WHERE m.FIELD_TYPE_ID = p_field_type_id
      AND m.LANGUAGE_ID = p_language_id;

    IF v_snippet_id IS NULL THEN
        -- Insert new snippet
        INSERT INTO CODE_SNIPPET (Snippet_Name, Snippet, status)
        VALUES (p_snippet_name, p_snippet, 'active');

        SET v_snippet_id = LAST_INSERT_ID();

        -- Map to field type + language
        INSERT INTO FIELD_SNIPPET_MAP (FIELD_TYPE_ID, SNIPPET_ID, LANGUAGE_ID, status)
        VALUES (p_field_type_id, v_snippet_id, p_language_id, 'active');
    ELSE
        -- Update existing snippet
        UPDATE CODE_SNIPPET
        SET Snippet = p_snippet,
            Snippet_Name = p_snippet_name,
            status = 'active',
            inactive_reason = NULL
        WHERE Snippet_ID = v_snippet_id;
    END IF;
END$$

DELIMITER ;


DELIMITER $$

create procedure GetFieldTypes()
BEGIN
select * FROM FIELD_TYPE;
END $$

DELIMITER ;

CALL GetFieldTypes();

DELIMITER $$

CREATE PROCEDURE SP_INSERT_LIST_OF_VALUES (
    IN p_LOV_NAME VARCHAR(200),
    IN p_LOV_DESCRIPTION TEXT,
    IN p_LOV_STATUS ENUM('active','inactive'),
    IN p_INACTIVE_REASON VARCHAR(255),
    IN p_CUSER VARCHAR(100),
    OUT p_RESULT_MSG VARCHAR(255),
    OUT p_NEW_ID INT
)
proc_exit: BEGIN
    DECLARE v_error_message TEXT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            v_error_message = MESSAGE_TEXT;

        IF v_error_message LIKE '%Duplicate entry%' THEN
            -- Extract duplicate value from MySQL error text
            SET p_RESULT_MSG = CONCAT(
                'Error: Duplicate entry ',
                SUBSTRING_INDEX(SUBSTRING_INDEX(v_error_message, "'", 2), "'", -1),
                ' already exists.'
            );
        ELSE
            SET p_RESULT_MSG = CONCAT('SQL Error: ', v_error_message);
        END IF;

        SET p_NEW_ID = NULL;
        ROLLBACK;
    END;

    START TRANSACTION;

    INSERT INTO list_of_values (
        lov_name,
        lov_description,
        lov_status,
        inactive_reason,
        cDate,
        cUser
    )
    VALUES (
        p_LOV_NAME,
        p_LOV_DESCRIPTION,
        COALESCE(p_LOV_STATUS, 'active'),
        p_INACTIVE_REASON,
        NOW(),
        p_CUSER
    );

    SET p_NEW_ID = LAST_INSERT_ID();
    COMMIT;

    SET p_RESULT_MSG = CONCAT('LOV inserted successfully with ID: ', p_NEW_ID);
END$$

DELIMITER ;


SET @msg = '';
SET @new_id = 0;

CALL SP_INSERT_LIST_OF_VALUES(
    'Planets',                      -- p_LOV_NAME
    'List of planet options',      -- p_LOV_DESCRIPTION
    'active',                      -- p_LOV_STATUS
    NULL,                          -- p_INACTIVE_REASON
    'admin',                  -- p_CUSER
    @msg,                          -- OUT p_RESULT_MSG
    @new_id                        -- OUT p_NEW_ID
);

-- View result
SELECT @msg AS ResultMessage, @new_id AS NewLOVID;

DELIMITER $$

CREATE PROCEDURE SP_UPDATE_LIST_OF_VALUES (
    IN p_LOV_ID INT,
    IN p_LOV_NAME VARCHAR(200),
    IN p_LOV_DESCRIPTION VARCHAR(255),
    IN p_LOV_STATUS ENUM('active','inactive'),
    IN p_INACTIVE_REASON VARCHAR(255),
    IN p_UUSER VARCHAR(100),
    OUT p_RESULT_MSG VARCHAR(255)
)
proc_exit: BEGIN
    DECLARE v_error_message TEXT;

    -- ✅ Exception Handler
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        IF v_error_message LIKE '%Duplicate entry%' THEN
            SET p_RESULT_MSG = CONCAT(
                'Error: Duplicate entry ',
                SUBSTRING_INDEX(SUBSTRING_INDEX(v_error_message, "'", 2), "'", -1),
                ' already exists.'
            );
        ELSE
            SET p_RESULT_MSG = CONCAT('SQL Error: ', v_error_message);
        END IF;
        ROLLBACK;
    END;

    START TRANSACTION;

    -- ✅ Check if record exists
    IF NOT EXISTS (SELECT 1 FROM LIST_OF_VALUES WHERE LOV_ID = p_LOV_ID) THEN
        SET p_RESULT_MSG = CONCAT('Error: LOV ID ', p_LOV_ID, ' not found.');
        ROLLBACK;
        LEAVE proc_exit;
    END IF;

    -- ✅ Perform Update
    UPDATE LIST_OF_VALUES
    SET 
        LOV_NAME = p_LOV_NAME,
        LOV_DESCRIPTION = p_LOV_DESCRIPTION,
        LOV_STATUS = COALESCE(p_LOV_STATUS, 'active'),
        INACTIVE_REASON = p_INACTIVE_REASON,
        uDate = NOW(),
        uUser = p_UUSER
    WHERE LOV_ID = p_LOV_ID;

    COMMIT;
    SET p_RESULT_MSG = CONCAT('LOV with ID ', p_LOV_ID, ' updated successfully.');
END$$

DELIMITER ;

CALL SP_UPDATE_LIST_OF_VALUES(
  5,
  'Gender',
  'Updated description',
  'active',
  NULL,
  'admin',
  @msg
);

SELECT @msg;

DELIMITER $$

CREATE PROCEDURE SP_DELETE_LIST_OF_VALUES (
    IN p_LOV_ID INT,
    -- IN p_UUSER VARCHAR(100),
    OUT p_RESULT_MSG VARCHAR(255)
)
proc_exit: BEGIN
    DECLARE v_error_message TEXT;

    -- ✅ Exception Handler
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        SET p_RESULT_MSG = CONCAT('SQL Error: ', v_error_message);
        ROLLBACK;
    END;

    START TRANSACTION;

    -- ✅ Check if record exists
    IF NOT EXISTS (SELECT 1 FROM LIST_OF_VALUES WHERE LOV_ID = p_LOV_ID) THEN
        SET p_RESULT_MSG = CONCAT('Error: LOV ID ', p_LOV_ID, ' not found.');
        ROLLBACK;
        LEAVE proc_exit;
    END IF;

    -- ✅ Option 1: Hard Delete (completely remove)
    DELETE FROM LIST_OF_VALUES WHERE LOV_ID = p_LOV_ID;

    -- ✅ Option 2: Soft Delete (mark inactive instead)
    -- UPDATE LIST_OF_VALUES 
    -- SET LOV_STATUS = 'inactive', INACTIVE_REASON = 'Deleted by user', uUser = p_UUSER, uDate = NOW()
    -- WHERE LOV_ID = p_LOV_ID;

    COMMIT;
    SET p_RESULT_MSG = CONCAT('LOV with ID ', p_LOV_ID, ' deleted successfully.');
END$$

DELIMITER ;

CALL SP_DELETE_LIST_OF_VALUES(5, @msg);
SELECT @msg;


DELIMITER $$

CREATE PROCEDURE SP_GET_LIST_OF_VALUES_DETAILS (
    IN p_LOV_ID INT
)
BEGIN
    IF p_LOV_ID IS NULL THEN
        SELECT * FROM LIST_OF_VALUES_DETAILS;
    ELSE
        SELECT * FROM LIST_OF_VALUES_DETAILS WHERE LOV_ID = p_LOV_ID;
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE SP_INSERT_LIST_OF_VALUES_DETAILS (
    IN p_LOV_ID INT,
    IN p_LOV_DET_NAME VARCHAR(200),
    IN p_LOV_DET_DESCP VARCHAR(255),
    IN p_LOV_DET_STATUS ENUM('active','inactive'),
    IN p_INACTIVE_REASON VARCHAR(255),
    IN p_CUSER VARCHAR(100),
    OUT p_RESULT_MSG VARCHAR(255),
    OUT p_NEW_ID INT
)
proc_exit: BEGIN
    DECLARE v_error_message TEXT;

    -- ✅ Exception handler
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;

        IF v_error_message LIKE '%Duplicate entry%' THEN
            SET p_RESULT_MSG = CONCAT(
                'Error: Duplicate entry ',
                SUBSTRING_INDEX(SUBSTRING_INDEX(v_error_message, "'", 2), "'", -1),
                ' already exists.'
            );
        ELSEIF v_error_message LIKE '%foreign key%' THEN
            SET p_RESULT_MSG = 'Error: Invalid LOV_ID (foreign key constraint failed)';
        ELSE
            SET p_RESULT_MSG = CONCAT('SQL Error: ', v_error_message);
        END IF;

        SET p_NEW_ID = NULL;
        ROLLBACK;
    END;

    START TRANSACTION;

    INSERT INTO LIST_OF_VALUES_DETAILS (
        LOV_ID,
        LOV_DET_NAME,
        LOV_DET_DESCP,
        LOV_DET_STATUS,
        INACTIVE_REASON,
        cDate,
        cUser
    )
    VALUES (
        p_LOV_ID,
        p_LOV_DET_NAME,
        p_LOV_DET_DESCP,
        COALESCE(p_LOV_DET_STATUS, 'active'),
        p_INACTIVE_REASON,
        NOW(),
        p_CUSER
    );

    SET p_NEW_ID = LAST_INSERT_ID();
    COMMIT;
    SET p_RESULT_MSG = CONCAT('LOV Detail inserted successfully with ID: ', p_NEW_ID);
END$$

DELIMITER ;

CALL SP_INSERT_LIST_OF_VALUES_DETAILS(
  1,
  'Male',
  'Represents male gender',
  'active',
  NULL,
  'admin',
  @msg,
  @new_id
);
SELECT @msg, @new_id;

DELIMITER $$

CREATE PROCEDURE SP_UPDATE_LIST_OF_VALUES_DETAILS (
    IN p_LOV_DET_ID INT,
    IN p_LOV_ID INT,
    IN p_LOV_DET_NAME VARCHAR(200),
    IN p_LOV_DET_DESCP VARCHAR(255),
    IN p_LOV_DET_STATUS ENUM('active','inactive'),
    IN p_INACTIVE_REASON VARCHAR(255),
    IN p_UUSER VARCHAR(100),
    OUT p_RESULT_MSG VARCHAR(255)
)
proc_exit: BEGIN
    DECLARE v_error_message TEXT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        IF v_error_message LIKE '%Duplicate entry%' THEN
            SET p_RESULT_MSG = CONCAT(
                'Error: Duplicate entry ',
                SUBSTRING_INDEX(SUBSTRING_INDEX(v_error_message, "'", 2), "'", -1),
                ' already exists.'
            );
        ELSE
            SET p_RESULT_MSG = CONCAT('SQL Error: ', v_error_message);
        END IF;
        ROLLBACK;
    END;

    START TRANSACTION;

    -- ✅ Check if record exists
    IF NOT EXISTS (SELECT 1 FROM LIST_OF_VALUES_DETAILS WHERE LOV_DET_ID = p_LOV_DET_ID) THEN
        SET p_RESULT_MSG = CONCAT('Error: LOV Detail ID ', p_LOV_DET_ID, ' not found.');
        ROLLBACK;
        LEAVE proc_exit;
    END IF;

    -- ✅ Update
    UPDATE LIST_OF_VALUES_DETAILS
    SET 
        LOV_ID = p_LOV_ID,
        LOV_DET_NAME = p_LOV_DET_NAME,
        LOV_DET_DESCP = p_LOV_DET_DESCP,
        LOV_DET_STATUS = COALESCE(p_LOV_DET_STATUS, 'active'),
        INACTIVE_REASON = p_INACTIVE_REASON,
        uDate = NOW(),
        uUser = p_UUSER
    WHERE LOV_DET_ID = p_LOV_DET_ID;

    COMMIT;
    SET p_RESULT_MSG = CONCAT('LOV Detail with ID ', p_LOV_DET_ID, ' updated successfully.');
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE SP_DELETE_LIST_OF_VALUES_DETAILS (
    IN p_LOV_DET_ID INT,
    IN p_UUSER VARCHAR(100),
    OUT p_RESULT_MSG VARCHAR(255)
)
proc_exit: BEGIN
    DECLARE v_error_message TEXT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        SET p_RESULT_MSG = CONCAT('SQL Error: ', v_error_message);
        ROLLBACK;
    END;

    START TRANSACTION;

    IF NOT EXISTS (SELECT 1 FROM LIST_OF_VALUES_DETAILS WHERE LOV_DET_ID = p_LOV_DET_ID) THEN
        SET p_RESULT_MSG = CONCAT('Error: LOV Detail ID ', p_LOV_DET_ID, ' not found.');
        ROLLBACK;
        LEAVE proc_exit;
    END IF;

    DELETE FROM LIST_OF_VALUES_DETAILS WHERE LOV_DET_ID = p_LOV_DET_ID;

    COMMIT;
    SET p_RESULT_MSG = CONCAT('LOV Detail with ID ', p_LOV_DET_ID, ' deleted successfully.');
END$$

DELIMITER ;
