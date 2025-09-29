DELIMITER //
CREATE TRIGGER generate_project_code
BEFORE INSERT ON projects
FOR EACH ROW
BEGIN
    DECLARE next_num INT;
    DECLARE prefix VARCHAR(2);

    -- Take the first 2 letters of the name as prefix (uppercase)
    SET prefix = UPPER(SUBSTRING(NEW.name, 1, 2));

    -- Find max number for this prefix
    SELECT COALESCE(MAX(SUBSTRING(project_code, 3) + 0), 0) + 1
    INTO next_num
    FROM projects
    WHERE project_code LIKE CONCAT(prefix, '%');

    -- Build the new project_code
    SET NEW.project_code = CONCAT(prefix, LPAD(next_num, 4, '0'));
END;
//
DELIMITER ;